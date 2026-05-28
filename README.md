# Orelli Bombay - Frontend Web Application

This is the frontend web application for Orelli Bombay, a premium luxury textiles and interiors brand. The site is an enquiry-based portfolio (no e-commerce checkout) built to showcase collections and drive client contact.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (Customized for bespoke design)
- **Fonts:** Next.js Font Optimization (Google Fonts: Cormorant Garamond & DM Sans)
- **Icons:** Inline SVGs (No heavy icon libraries to maintain performance)

---

## Folder Structure & Where to Find Things

To make changes for the client, here is where you need to look:

### 1. Global Styles & Theming
- **`tailwind.config.ts`**: This is your design system's source of truth. If the client wants to change the main brand colors (`bg`, `foreground`, `accent` gold), you change them here under `theme.extend.colors`.
- **`app/globals.css`**: Global CSS overrides and reusable Tailwind `@apply` classes. Button styles (`.btn-filled`, `.btn-outline`), animation utilities, and custom underline effects are defined here.
- **`app/layout.tsx`**: The main wrapper for every page. If you need to change the global `<title>`, description for SEO, or swap out Google Fonts, do it here.

### 2. Page Content & Layouts
- **`app/page.tsx`**: The Homepage. It simply imports and stacks sections.
- **`app/categories/`**: Contains the categories listing and individual product pages.
- **`components/home/`**: This folder contains all the individual sections of the homepage.
  - `Hero.tsx`: Change the hero images, tagline text, or timing of the crossfade.
  - `CollectionsStrip.tsx`: Update the four featured collections in the grid.
  - `BrandStatement.tsx`: Update the large center quote.
  - `FeaturedProject.tsx`: Update the full-width side-by-side featured project blocks.
  - `BlogsTeaser.tsx`: Update the blog previews.
  - `EnquiryCTA.tsx`: The bottom contact banner.
- **`components/layout/`**: Contains the `Navbar.tsx` and `Footer.tsx`. Update the links, logo text, or social media links here.

### 3. Images and Assets
- Currently, the site uses placeholder images from `picsum.photos`. 
- **To add real client images:**
  1. Drop the image files into the `public/` directory (you can create a `public/images` folder to keep it organized).
  2. Go into the respective component (e.g., `Hero.tsx`) and change the image URL from `https://picsum.photos/...` to `/images/your-file-name.jpg`.

---

## How to Make Common Changes

**1. "Can we change the text in the Hero section?"**
Open `components/home/Hero.tsx` and look for the `<h1>` tag around line 43. Change the text inside.

**2. "Can we change the main gold accent color?"**
Open `tailwind.config.ts`, find `accent: "#C9A96E"`, and replace the hex code. The entire site will instantly update.

**3. "Can we speed up the scrolling fade animation?"**
Open `components/ui/FadeUp.tsx` and `app/globals.css`. Look for the `0.7s` duration in the `.fade-up-animate` class and lower it.

**4. "How do I add a new link to the Navbar?"**
Open `components/layout/Navbar.tsx`. Look for the `const links = [...]` array at the top of the component and add a new object to the list.

---

## Development & CMS Setup

To set up the project locally, including the database and CMS, follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root of your project and configure the required settings:
```env
# Database (SQLite by default)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials for CMS
ADMIN_EMAIL="admin@orelli.com"
ADMIN_PASSWORD_HASH=""
```

### 3. Generate Admin Password
You need a securely hashed password for the CMS administrator. Run the included script with your desired password:
```bash
npx ts-node scripts/hash-password.ts your_password_here
```
Copy the generated `ADMIN_PASSWORD_HASH` from the output and paste it into your `.env.local` file.

### 4. Database Setup
The site uses Prisma with SQLite. Run the following commands to sync the schema and generate starter data:
```bash
# Push the schema to the database
npm run db:push

# Seed the database with initial data (optional)
npm run db:seed
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
```

- **Main site:** [http://localhost:3000](http://localhost:3000)
- **CMS Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin) (Log in using the email and password you configured).

### 6. Prisma Studio (Optional Data Viewer)
To explore and modify records directly in the database via a GUI, you can open Prisma Studio:
```bash
npm run db:studio
```
