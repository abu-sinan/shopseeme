# DEPLOYMENT.md — ShopSeeMe Deployment Guide

## Vercel Deployment (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial ShopSeeMe production build"
git remote add origin https://github.com/your-org/shopseeme.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Root Directory: `/` (default)

### Step 3: Environment Variables

Add these in Vercel dashboard → Settings → Environment Variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | All |
| `NEXT_PUBLIC_SITE_URL` | `https://shopseeme.com` | Production |

### Step 4: Deploy

Click **Deploy** — Vercel will build and deploy automatically.

Every `git push` to `main` triggers a new deployment.

---

## Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com/dashboard)
2. New Project → Choose region closest to Bangladesh (Singapore)
3. Note your Project URL and API keys

### 2. Run Database Migrations

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Run the SQL

### 3. Create Storage Buckets

In Supabase Dashboard → Storage → New Bucket:

| Bucket Name | Public | Description |
|-------------|--------|-------------|
| `product-images` | ✅ Yes | Product photos |
| `banner-images` | ✅ Yes | Homepage banners |
| `avatars` | ✅ Yes | User profile images |

### 4. Set Storage Policies

For each public bucket, add this policy:

```sql
-- Allow public read
CREATE POLICY "Public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow admin uploads
CREATE POLICY "Admin upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );
```

### 5. Configure Auth Settings

In Supabase → Authentication → Settings:

- **Site URL**: `https://shopseeme.com`
- **Redirect URLs**: `https://shopseeme.com/**`
- Enable **Email confirmations** (recommended for production)
- Configure **SMTP** with your email provider (SendGrid, Resend, etc.)

---

## Custom Domain Setup

### Vercel Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add `shopseeme.com`
3. Follow DNS instructions (usually add CNAME/A records)

### Cloudflare (Recommended)

1. Add site to Cloudflare
2. Update nameservers at your registrar
3. In Cloudflare → DNS:
   - `A shopseeme.com → 76.76.21.21` (Vercel IP)
   - `CNAME www → cname.vercel-dns.com`
4. Enable **Cloudflare Proxy** (orange cloud) for DDoS protection
5. Enable **Always Use HTTPS**
6. SSL/TLS Mode: **Full (strict)**

---

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migration run successfully
- [ ] Storage buckets created with correct policies
- [ ] Admin user created and role set to `admin`
- [ ] Custom domain configured with SSL
- [ ] Supabase Auth URLs configured
- [ ] SMTP email configured for auth emails
- [ ] Test full purchase flow (COD)
- [ ] Test bKash payment flow
- [ ] Test admin panel access
- [ ] Verify all pages load without errors
- [ ] Check mobile responsiveness
- [ ] Verify sitemap.xml accessible
- [ ] Verify robots.txt accessible
- [ ] Set up error monitoring (Sentry optional)

---

## Environment-Specific Notes

### Preview Deployments (Vercel)

Every PR gets a preview URL like `shopseeme-git-feature-xyz.vercel.app`.

Add preview URL to Supabase Auth → Redirect URLs:
```
https://shopseeme-*.vercel.app/**
```

### Performance Monitoring

Enable Vercel Analytics:
```bash
npm install @vercel/analytics
```

Add to `layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'
// ...
<Analytics />
```
