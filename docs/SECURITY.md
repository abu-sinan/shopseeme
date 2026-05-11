# SECURITY.md — ShopSeeMe Security Architecture

## Overview

ShopSeeMe implements enterprise-level security across all layers of the application.

---

## 1. Authentication (Supabase Auth)

- **JWT-based** session management via Supabase Auth
- Sessions stored in **httpOnly cookies** (via `@supabase/ssr`)
- Automatic token refresh handled by middleware
- Password requirements enforced via Zod: min 8 chars, 1 uppercase, 1 number
- No raw passwords stored — Supabase handles bcrypt hashing

---

## 2. Row Level Security (RLS)

All database tables have RLS enabled. Key policies:

### Users
```sql
-- Users can only read/update their own profile
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);
```

### Products
```sql
-- Public can read active products only
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (status = 'active');

-- Admins manage all products
CREATE POLICY "admins_manage_products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
```

### Orders
```sql
-- Users see only their own orders
CREATE POLICY "users_select_own_orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());
```

---

## 3. Middleware Protection

`src/middleware.ts` runs on every request and:

1. **Refreshes Supabase sessions** (prevents expired token issues)
2. **Blocks `/admin/*`** for non-admin users → redirects to login
3. **Blocks `/profile`, `/orders`, `/checkout`** for unauthenticated users
4. **Redirects logged-in users** away from `/login` and `/register`

Admin check queries the `users` table role column — cannot be spoofed by client-side role claims.

---

## 4. Input Validation

All user inputs validated with **Zod** before processing:

- `loginSchema` — email format, password length
- `registerSchema` — name pattern, BD phone regex, password strength
- `checkoutSchema` — BD phone regex, district enum, bKash conditional validation
- `productSchema` — price > discount_price check, slug format
- `contactSchema` — message length, email format

Server-side validation in API routes (`/api/products`, `/api/orders`) re-validates all inputs even if client-side passes.

---

## 5. HTTP Security Headers

Configured in `next.config.ts`:

```
X-Frame-Options: DENY                    (clickjacking prevention)
X-Content-Type-Options: nosniff         (MIME sniffing prevention)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
Cache-Control: no-store (on /api/* routes)
```

---

## 6. Admin Access Control

Three-layer protection for admin routes:

1. **Middleware** — checks session exists
2. **Middleware** — queries `users.role` in database
3. **Layout Server Component** — re-validates role (defense in depth)

Even if middleware is bypassed, the layout component independently checks role. No client-side trust.

---

## 7. Environment Variables

- `SUPABASE_SERVICE_ROLE_KEY` — never exposed to client (server-only)
- `NEXT_PUBLIC_*` — only non-sensitive public config
- `.env.local` — gitignored, never committed
- Secrets managed via Vercel dashboard in production

---

## 8. SQL Injection Prevention

- All database queries use **Supabase's parameterized query builder**
- No raw SQL strings with user input
- RLS enforced at the database level regardless of application logic

---

## 9. Rate Limiting (Architecture)

Current: Not implemented at app layer (Vercel Edge handles DDoS).

Production recommendation: Add rate limiting middleware using:
- Upstash Redis + `@upstash/ratelimit`
- Apply to `/api/orders` (max 5/min per IP)
- Apply to `/login` (max 10/min per IP)

---

## 10. File Upload Security

Image uploads: Currently URL-based (no file uploads to server).

When implementing Supabase Storage uploads:
- Validate file type (JPEG/PNG/WebP only)
- Validate file size (max 5MB)
- Never trust client-provided MIME type — check magic bytes
- Store in public bucket with random UUID filenames (prevent enumeration)

---

## 11. Order Security

- Order totals recalculated server-side in `/api/orders`
- Never trust client-sent total
- Cart items validated against database prices (TODO: implement price verification)
- Max cart items limited to 50
- bKash transaction IDs stored for manual verification

---

## Security Checklist for Production

- [ ] Set strong Supabase JWT secret
- [ ] Enable Supabase email confirmation
- [ ] Configure SMTP for Supabase Auth emails
- [ ] Add Cloudflare WAF in front of Vercel
- [ ] Enable Vercel DDoS protection
- [ ] Set up Upstash rate limiting
- [ ] Configure Supabase database backups
- [ ] Enable 2FA on Supabase dashboard
- [ ] Review and test all RLS policies
- [ ] Set up error monitoring (Sentry)
