# ShopSeeMe — Premium Fashion E-Commerce

![ShopSeeMe](https://via.placeholder.com/1200x400/000000/FF4FA3?text=ShopSeeMe+-+Premium+Fashion)

A production-ready, single-brand fashion e-commerce platform built for Bangladesh, featuring a dark luxury aesthetic and full-stack capabilities.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn/UI |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| State | Zustand |
| Validation | Zod + React Hook Form |
| Animations | Framer Motion |
| Icons | Lucide React |
| Hosting | Vercel |

---

## 📦 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-repo/shopseeme.git
cd shopseeme
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in Supabase SQL Editor:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Create storage buckets: `product-images`, `banner-images`, `avatars`

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://shopseeme.com
```

### 4. Create Admin User

```bash
# 1. Register via /register on the site
# 2. Run in Supabase SQL Editor:
UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
```

### 5. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### 6. Build for Production

```bash
npm run build
npm start
```

---

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── men/                # Men's category
│   ├── women/              # Women's category
│   ├── kids/               # Kids' category
│   ├── products/[slug]/    # Product detail
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout
│   ├── login/              # Authentication
│   ├── register/           # Registration
│   ├── profile/            # User profile
│   ├── orders/             # Order history
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── admin/              # Admin panel (protected)
│   │   ├── page.tsx        # Dashboard
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   └── banners/        # Banner management
│   └── api/                # API routes
│       ├── products/       # Products API
│       └── orders/         # Orders API
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── home/               # Homepage sections
│   ├── products/           # Product components
│   ├── cart/               # Cart drawer
│   ├── admin/              # Admin components
│   └── profile/            # Profile components
├── lib/
│   ├── supabase/           # Supabase clients
│   └── validations/        # Zod schemas
├── services/               # Data fetching services
├── store/                  # Zustand stores
├── types/                  # TypeScript types
└── utils/                  # Utility functions
```

---

## 🌐 Pages & Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage | No |
| `/men` | Men's collection | No |
| `/women` | Women's collection | No |
| `/kids` | Kids' collection | No |
| `/products/[slug]` | Product detail | No |
| `/cart` | Shopping cart | No |
| `/checkout` | Checkout | No (guest allowed) |
| `/login` | Login | No |
| `/register` | Register | No |
| `/profile` | User profile | ✅ Yes |
| `/orders` | Order history | ✅ Yes |
| `/about` | About us | No |
| `/contact` | Contact form | No |
| `/admin` | Admin dashboard | ✅ Admin only |
| `/admin/products` | Product management | ✅ Admin only |
| `/admin/orders` | Order management | ✅ Admin only |
| `/admin/banners` | Banner management | ✅ Admin only |

---

## 🎨 Brand Design System

```
Colors:
  Black:      #000000  (background)
  White:      #FFFFFF  (text)
  Pink:       #FF4FA3  (accent/CTA)
  Pink Light: #FF79BE  (hover)
  Pink Dark:  #D93F87  (active)
  Gray:       #A0A0A0  (secondary text)

Typography:
  Display: Playfair Display (headings)
  Body:    DM Sans (UI text)

Spacing: 4px base unit (Tailwind default)
Radius:  rounded-sm (2px) for cards/inputs
         rounded (4px) for buttons
```

---

## 💳 Payment Methods

| Method | Status | Notes |
|--------|--------|-------|
| Cash on Delivery | ✅ Live | Default payment |
| bKash (manual) | ✅ Live | TrxID verification |
| SSLCommerz | 🔄 Planned | See FUTURE_UPGRADES.md |
| bKash API | 🔄 Planned | See FUTURE_UPGRADES.md |
| Nagad | 🔄 Planned | See FUTURE_UPGRADES.md |

---

## 🔐 Security Features

- Supabase Row Level Security (RLS) on all tables
- Middleware-based admin route protection
- Role-based access control (customer/admin/super_admin)
- Zod validation on all forms and API routes
- HTTP security headers (X-Frame-Options, CSP, etc.)
- HTTPS-only assumption
- Secure session handling via Supabase SSR

---

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly cart drawer
- Swipeable mobile navigation
- Optimized images (next/image with AVIF/WebP)
- Minimal JavaScript bundle
- Sticky mobile navigation
- Safe area insets for notched devices

---

## 🚀 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for full Vercel deployment guide.

Quick deploy:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all environment variables in Vercel dashboard.

---

## 📚 Documentation

| File | Description |
|------|-------------|
| [README.md](README.md) | This file |
| [docs/SECURITY.md](docs/SECURITY.md) | Security architecture |
| [docs/DATABASE.md](docs/DATABASE.md) | Database schema & RLS |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment guide |
| [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) | Admin panel usage |
| [docs/SEO.md](docs/SEO.md) | SEO strategy |
| [docs/FUTURE_UPGRADES.md](docs/FUTURE_UPGRADES.md) | Roadmap |

---

## 📄 License

Private — ShopSeeMe © 2025. All rights reserved.
