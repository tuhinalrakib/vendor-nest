/**
 * frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   └── favicon.ico
│
├── src/
│
│   ├── app/
│   │
│   │   ├── (auth)/
│   │   │      ├── login/
│   │   │      ├── register/
│   │   │      ├── forgot-password/
│   │   │      └── reset-password/
│   │   │
│   │   ├── (shop)/
│   │   │      ├── products/
│   │   │      ├── product/
│   │   │      ├── categories/
│   │   │      ├── cart/
│   │   │      ├── wishlist/
│   │   │      ├── checkout/
│   │   │      ├── orders/
│   │   │      ├── order-tracking/
│   │   │      └── profile/
│   │   │
│   │   ├── seller/
│   │   │      ├── dashboard/
│   │   │      ├── products/
│   │   │      ├── add-product/
│   │   │      ├── orders/
│   │   │      ├── inventory/
│   │   │      ├── coupons/
│   │   │      ├── analytics/
│   │   │      └── settings/
│   │   │
│   │   ├── admin/
│   │   │      ├── dashboard/
│   │   │      ├── users/
│   │   │      ├── sellers/
│   │   │      ├── products/
│   │   │      ├── categories/
│   │   │      ├── coupons/
│   │   │      ├── orders/
│   │   │      ├── reports/
│   │   │      └── settings/
│   │   │
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│
│   ├── components/
│   │
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── cards/
│   │   ├── buttons/
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── sidebar/
│   │   ├── charts/
│   │   ├── tables/
│   │   ├── modals/
│   │   ├── skeleton/
│   │   ├── pagination/
│   │   └── common/
│
│   ├── features/
│   │
│   │   ├── auth/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── checkout/
│   │   ├── payment/
│   │   ├── seller/
│   │   ├── admin/
│   │   ├── review/
│   │   ├── coupon/
│   │   ├── analytics/
│   │   └── ai/
│
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── stripe.ts
│   │   ├── cloudinary.ts
│   │   └── utils.ts
│
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   ├── order.service.ts
│   │   ├── review.service.ts
│   │   └── payment.service.ts
│
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── cartSlice.ts
│   │   ├── wishlistSlice.ts
│   │   └── productSlice.ts
│
│   ├── proxy.ts
│   │
│   ├── providers/
│   │
│   ├── types/
│   │
│   ├── constants/
│   │
│   ├── validations/
│   │
│   └── styles/
│
├── .env.local
├── package.json
└── next.config.ts
 */