# Orelli Bombay - Premium Luxury Textiles Platform

This repository contains the complete full-stack web application for **Orelli Bombay**, a premium luxury textiles, wallpaper, and interiors brand. The platform serves as an elegant, high-end digital portfolio designed to drive bespoke client enquiries, talent recruitment, and showcase collections, seamlessly powered by a custom-built, fully authenticated Content Management System (CMS).

---

## 🚀 Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Fully customized bespoke aesthetic: dark/light modes, micro-animations, glassmorphism)
- **Typography**: `next/font` using Google Fonts: *Cormorant Garamond* (Headings) & *DM Sans* (Body)
- **Database**: PostgreSQL (Hosted on Neon)
- **ORM**: Prisma Client
- **Authentication**: NextAuth.js (Session-based, restricted to Admin Dashboard)
- **Email Delivery**: Nodemailer (SMTP routing for Enquiry and Careers forms)
- **Storage/File Uploads**: Custom API file-handling architecture storing directly into `/public/uploads` (can be adapted for S3).
- **Icons**: Lucide React

---

## 🎨 Design Philosophy & UX
The frontend design is strictly governed by luxury design principles:
- **Rich Aesthetics**: A cohesive warm palette (`#F7F4F0` backgrounds, `#E7DED3` footers, `#1A1A1A` deep typography, and `#C9A96E` elegant gold accents).
- **Subtle Micro-Animations**: Elements gently fade up on scroll. Hover states expand underlines, dim backgrounds, and slide sub-menus to make the interface feel alive and responsive.
- **Dynamic Headers**: The Navbar intelligently switches text colors based on scroll position and active page themes, providing a flawless dropdown sub-menu explicitly populated by the live database.

---

## 🛠 Features & Capabilities

### 1. The Public Facing Website
- **Home**: Dynamic Hero Slider (CMS controllable), Collections Strip, Brand Statement, Featured Projects, Blog Teasers, and a bottom Enquiry CTA.
- **About Us**: A deeply personalized page divided into a dynamic Hero section, "Our Story", and a 3-part "Values Strip" (Craft, Heritage, Intention). All text and imagery are pulled straight from the CMS.
- **Categories & Projects**: 
  - Dynamic dropdown sub-menus injected into the global Navbar.
  - Category detail pages featuring automated thumbnail gallery sliders (intelligently combining the main cover image + additional gallery assets).
  - Attached individual projects with modal popups for deep diving.
- **Journal (Blogs)**: Read times, publishing dates, author attributions ("BY ORELLI BOMBAY"), dynamic Drop-Cap typography on the first paragraph, and sleek layouts.
- **Contact / Careers**: 
  - Dual-layout Contact page cleanly organizing official studio information.
  - Fully integrated **Careers Application Form Modal** taking text inputs, dropdown selections, and PDF Resume uploads.
- **FAQ Page**: Accordion-style layout managed directly via the CMS.

### 2. The Internal Email Engine
Both major forms are securely handled by internal APIs and passed through Nodemailer to directly ping `orellibombay@orelli.co.in`.
- **Enquiry Form (`/api/contact`)**: Captures names, numbers, email, architect details, large multi-file uploads (Project Photos up to 25MB, Color Palettes up to 25MB).
- **Careers Form (`/api/careers`)**: Captures applicant data and strictly handles PDF Resume uploads (up to 5MB).
- **Protection**: Both endpoints feature in-memory IP rate-limiting (max 1 submission per 5 minutes) to prevent spam.

### 3. The Custom CMS Dashboard (`/admin`)
Hidden behind NextAuth authentication, the custom CMS allows the owner to change the website instantly without touching code.
- **Hero Slider**: Upload, order, and remove the massive sliding homepage images.
- **About Page**: Fully edit the Hero text, Our Story paragraphs, and Values descriptions.
- **Categories & Projects**: Create new collections, generate clean URLs (slugs), order their appearance, upload cover images, and upload infinite gallery arrays.
- **Blogs Manager**: A robust text and content manager to publish or hide journal entries.
- **FAQ Manager**: Add, edit, or delete Question & Answer pairings.

---

## 📁 Repository Structure

```
orelli/
├── app/
│   ├── about/            # Public About page
│   ├── admin/            # Secure CMS Dashboard pages (Requires Login)
│   ├── api/              # Secure backend Next.js API Routes (Auth, Contact, Careers, CMS)
│   ├── blogs/            # Public Journal/Blog rendering
│   ├── categories/       # Dynamic collections & gallery logic
│   ├── contact/          # Public Contact & Careers page
│   ├── faq/              # Public FAQ rendering
│   ├── globals.css       # Core Tailwind injections and CSS Variables
│   └── layout.tsx        # Root layout, fetches Categories for Navbar
├── components/
│   ├── admin/            # Reusable UI for the CMS (Toasts, Image Uploaders)
│   ├── categories/       # Category Galleries, Project Modals
│   ├── contact/          # Enquiry and Careers Modals
│   ├── home/             # Segmented Homepage blocks
│   ├── layout/           # Global Navbar, Footer, Sticky Nav
│   └── ui/               # Base UI components (FadeUp animations, Buttons)
├── lib/
│   ├── prisma.ts         # Prisma DB Client Singleton
│   └── auth.ts           # NextAuth configurations
├── prisma/
│   └── schema.prisma     # The complete database architecture and models
├── public/
│   ├── uploads/          # Live directory for CMS uploaded images/PDFs
│   └── ...               # Static SVGs, logos, fonts
└── tailwind.config.ts    # The absolute design system source of truth
```

---

## ⚙️ Development Setup & Deployment

### 1. Installation
Clone the repository and install all Node dependencies:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory. You will need:
```env
# Database (PostgreSQL / Neon)
DATABASE_URL="postgresql://user:password@host/dbname"
DIRECT_URL="postgresql://user:password@host/dbname"

# Authentication (NextAuth)
NEXTAUTH_SECRET="generate-a-secure-random-string-here"
NEXTAUTH_URL="http://localhost:3000"

# CMS Login Credentials
ADMIN_EMAIL="orellibombay@orelli.co.in"
ADMIN_PASSWORD_HASH="generate-this-via-bcrypt"

# Email Server (Nodemailer Configuration)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-sending-email@gmail.com"
SMTP_PASS="your-app-password"
OWNER_EMAIL="orellibombay@orelli.co.in"
```

### 3. Generate the Admin Password Hash
To create the `ADMIN_PASSWORD_HASH` for your `.env` file, run:
```bash
npx ts-node scripts/hash-password.ts your_secure_password
```

### 4. Sync the Database
Push the Prisma schema to your PostgreSQL database.
```bash
npx prisma generate
npx prisma db push
```

### 5. Start the Application
Run the local development server:
```bash
npm run dev
```
- **Live Site**: `http://localhost:3000`
- **CMS Login**: `http://localhost:3000/admin/login`

---

## 🛠 Maintaining Global Styles
- **Colors**: The base background (`#F7F4F0`) and footer (`#E7DED3`) are hardcoded as CSS Variables inside `app/globals.css`. The primary Accent gold is located in `tailwind.config.ts`.
- **Fonts**: All text layers utilize Tailwind's specific pixel tracking. To safely bump global font sizes up or down, utilize a Regex script over the codebase rather than altering root em sizes, as clamping is actively used for responsive Desktop/Mobile hero headings.
