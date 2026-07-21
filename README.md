<div align="center">

# 🛍️ VendorNest — Multi-Vendor E-Commerce SaaS Frontend

  <p><b>Modern, Multi-Tenant E-Commerce SaaS Client & Vendor Ecosystem built with Next.js 16 & TypeScript</b></p>

  [![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State_Management-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 📌 Project Overview

**VendorNest Client** is a state-of-the-art Multi-Vendor E-Commerce SaaS frontend application. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, it provides an intuitive shopping experience for customers, a feature-rich store management dashboard for vendors/sellers, and an administrative control panel for platform managers.

---

## 🌟 Key Features & Portals

### 🛒 Multi-Portal Ecosystem
- **Customer Storefront (`/shop`, `/cart`, `/checkout`)**: High-performance catalog browsing, multi-attribute filtering, dynamic cart management, wishlist, and multi-vendor checkout.
- **Vendor / Seller Portal (`/seller`)**: Dedicated vendor dashboard for product creation, catalog management, inventory tracking, order fulfillment, sales analytics, and payout management.
- **Super Admin Control Center (`/admin`)**: Platform-wide monitoring, seller approvals, user management, category administration, fee configuration, and financial analytics.
- **Dynamic Multi-Tenant Storefronts (`/sites/[siteId]`)**: Custom storefront routes supporting isolated vendor microsites.

### ⚡ Technical Highlights
- **Next.js 16 App Router**: Optimized React Server Components (RSC), Client Components, and Server-Side Rendering (SSR).
- **Redux Toolkit**: Centralized global state management for cart state, user session state, and cached API data.
- **Axios HTTP Client & Auth Interceptor**: Automated JWT token retrieval, refresh rotation, and uniform request authorization headers.
- **Google OAuth 2.0 Integration**: One-click social authentication via `@react-oauth/google`.
- **PDF Export Suite**: Invoice generation and sales reporting powered by `jspdf` and `jspdf-autotable`.
- **Alerts & UI Notifications**: Interactive alerts and feedback toasts using `sweetalert2`.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **UI Engine** | React 19 |
| **Language** | TypeScript 5+ |
| **Styling** | Tailwind CSS v4 + PostCSS |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`) |
| **HTTP Client** | Axios |
| **Document Export** | jsPDF & AutoTable |
| **Notifications** | SweetAlert2 |
| **Deployment** | Vercel / Netlify |

---

## 📂 Directory Architecture

```gfm
vendor-nest/
├── public/                # Static assets, logos & branding graphics
├── src/
│   ├── app/               # Next.js App Router Structure
│   │   ├── (auth)/        # Authentication routes (Login, Register, Google OAuth)
│   │   ├── (shop)/        # Customer Storefront & Marketplace routes
│   │   ├── seller/        # Vendor / Seller Dashboard & Product Management
│   │   ├── admin/         # Super Admin Platform Management Portal
│   │   ├── sites/         # Dynamic Multi-Tenant Vendor Storefronts
│   │   ├── layout.tsx     # Root App Layout & Context Providers
│   │   ├── loading.tsx    # Global UI Skeleton Loading States
│   │   └── error.tsx      # Global Error Boundary Component
│   ├── components/        # Reusable UI Components, Modals & Buttons
│   ├── store/             # Redux Store, Reducers & Slices
│   ├── lib/               # Axios Instance (`api.ts`), Auth Helpers & Cookies
│   ├── constants/         # Static configuration & API Endpoint Maps
│   └── types/             # TypeScript Type Definitions & Interfaces
├── next.config.ts         # Next.js Configuration
├── postcss.config.mjs     # PostCSS Configuration
├── package.json           # Frontend Dependencies & Scripts
├── tsconfig.json          # TypeScript Compiler Rules
└── README.md              # Project Documentation
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm** / **yarn** / **pnpm**

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/vendor-nest.git
cd vendor-nest
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` or `.env.local` file in the project root:

```env
# Django Backend API Base URL
NEXT_PUBLIC_BACKEND_HOST=http://127.0.0.1:8000

# Google OAuth Client ID (For Social Login)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Deployment

### Build Command
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### 🚀 Deploying to Vercel
1. Push your repository to GitHub.
2. Connect your repository to **Vercel**.
3. Set Environment Variables:
   - `NEXT_PUBLIC_BACKEND_HOST` -> Your deployed Render/Backend URL (e.g. `https://vendor-nest-server.onrender.com/`)
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` -> Your Google OAuth Client ID
4. Click **Deploy**.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <sub>Built with ❤️ for the <b>VendorNest</b> Multi-Vendor SaaS Ecosystem</sub>
</div>