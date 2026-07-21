/**
 *
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
└── README.md 
 */