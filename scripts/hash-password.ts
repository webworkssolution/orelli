import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.log("Usage: npx ts-node scripts/hash-password.ts <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log(`\nPassword: ${password}`);
console.log(`Hash: ${hash}`);
console.log(`\nAdd this to your .env.local:`);
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
