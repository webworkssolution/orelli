import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
}

/**
 * Loads all configured admin accounts from environment variables.
 * Supports:
 *  - Primary admin: ADMIN_EMAIL & ADMIN_PASSWORD_HASH
 *  - Additional numbered admins: ADMIN_EMAIL_2 & ADMIN_PASSWORD_HASH_2, up to 10
 *  - JSON array in ADMIN_USERS: '[{"email":"...","passwordHash":"...","name":"..."},...]'
 */
export function getAdminUsers(): AdminUser[] {
  const admins: AdminUser[] = [];

  // 1. JSON array in ADMIN_USERS
  if (process.env.ADMIN_USERS) {
    try {
      const parsed = JSON.parse(process.env.ADMIN_USERS);
      if (Array.isArray(parsed)) {
        for (let i = 0; i < parsed.length; i++) {
          const item = parsed[i];
          const email = (item.email || "").trim().toLowerCase();
          const secret = (item.passwordHash || item.hash || item.password || "").trim();
          if (email && secret) {
            admins.push({
              id: item.id || `admin-${admins.length + 1}`,
              email,
              passwordHash: secret,
              name: item.name || email.split("@")[0],
            });
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse ADMIN_USERS environment variable as JSON", e);
    }
  }

  // 2. Primary admin (supports ADMIN_PASSWORD_HASH or plain ADMIN_PASSWORD)
  const primaryEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const primarySecret = (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD)?.trim();
  if (primaryEmail && primarySecret) {
    if (!admins.some((a) => a.email === primaryEmail)) {
      admins.push({
        id: "admin-1",
        email: primaryEmail,
        passwordHash: primarySecret,
        name: "Admin",
      });
    }
  }

  // 3. Numbered admins: dynamic scan with NO upper limit (ADMIN_EMAIL_2, ADMIN_EMAIL_3, ...)
  // Supports both hashed and plain text (ADMIN_PASSWORD_HASH_X or ADMIN_PASSWORD_X)
  for (const key of Object.keys(process.env)) {
    const match = key.match(/^ADMIN_EMAIL_(\d+)$/i) || key.match(/^ADMIN_(\d+)_EMAIL$/i);
    if (match) {
      const slot = match[1];
      const email = process.env[key]?.trim().toLowerCase();
      const secret = (
        process.env[`ADMIN_PASSWORD_HASH_${slot}`] ||
        process.env[`ADMIN_${slot}_PASSWORD_HASH`] ||
        process.env[`ADMIN_PASSWORD_${slot}`] ||
        process.env[`ADMIN_${slot}_PASSWORD`]
      )?.trim();

      if (email && secret && !admins.some((a) => a.email === email)) {
        admins.push({
          id: `admin-${slot}`,
          email,
          passwordHash: secret,
          name: email.split("@")[0],
        });
      }
    }
  }

  return admins;
}

/**
 * Normalizes email address for consistent comparison.
 */
export function normalizeEmail(email: string): string {
  return (email || "").trim().toLowerCase();
}

/**
 * Dynamically verifies input password against stored secret.
 * Supports bcrypt hashes ($2a$, $2b$, $2y$) as well as plain-text secrets.
 */
export async function verifyPassword(input: string, storedSecret: string): Promise<boolean> {
  if (!input || !storedSecret) return false;

  const isBcrypt =
    storedSecret.startsWith("$2a$") ||
    storedSecret.startsWith("$2b$") ||
    storedSecret.startsWith("$2y$");

  if (isBcrypt) {
    return bcrypt.compare(input, storedSecret);
  }

  return input === storedSecret;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = normalizeEmail(credentials.email);
        const admins = getAdminUsers();

        if (admins.length === 0) {
          console.error("Admin credentials not configured in environment variables (no valid admins found)");
          return null;
        }

        const admin = admins.find((a) => a.email === normalizedEmail);
        if (!admin) {
          console.error(`Login failed: No admin found for email "${normalizedEmail}"`);
          return null;
        }

        const isValid = await verifyPassword(credentials.password, admin.passwordHash);
        if (!isValid) {
          console.error(`Login failed: Invalid password for admin "${normalizedEmail}"`);
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name || "Admin",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days absolute max length on server side
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days persistent cookie for mobile & desktop
      },
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; email?: string; name?: string }).id = token.id as string;
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
