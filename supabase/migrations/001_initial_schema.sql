-- ============================================================
-- ShopSeeMe Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---- Enums ----
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
CREATE TYPE gender_type AS ENUM ('men', 'women', 'kids', 'unisex');
CREATE TYPE product_status AS ENUM ('active', 'draft', 'archived');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('cod', 'bkash', 'nagad', 'sslcommerz');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- ---- Users Table ----
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---- Categories Table ----
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  gender gender_type NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---- Products Table ----
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  gender gender_type NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  discount_price DECIMAL(10,2) CHECK (discount_price IS NULL OR discount_price < price),
  sku TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_new_arrival BOOLEAN NOT NULL DEFAULT TRUE,
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  status product_status NOT NULL DEFAULT 'active',
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---- Product Images Table ----
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---- Product Variants Table ----
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  color_hex TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  price_modifier DECIMAL(10,2) NOT NULL DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---- Orders Table ----
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'pending',
  payment_method payment_method NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  shipping_address JSONB NOT NULL,
  notes TEXT,
  bkash_number TEXT,
  bkash_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---- Order Items Table ----
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  size TEXT,
  color TEXT,
  image_url TEXT,
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0)
);

-- ---- Banners Table ----
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT,
  cta_url TEXT,
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_products_gender ON public.products(gender);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_new_arrival ON public.products(is_new_arrival) WHERE is_new_arrival = TRUE;
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_product_images_product ON public.product_images(product_id);
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- ---- Users RLS ----
-- Users can read/update their own profile
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "admins_select_all_users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ---- Categories RLS ----
-- Anyone can read active categories
CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (is_active = TRUE);

-- Admins can manage categories
CREATE POLICY "admins_manage_categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ---- Products RLS ----
-- Anyone can read active products
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (status = 'active');

-- Admins can manage all products
CREATE POLICY "admins_manage_products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ---- Product Images RLS ----
CREATE POLICY "product_images_public_read" ON public.product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_images.product_id AND status = 'active'
    )
  );

CREATE POLICY "admins_manage_product_images" ON public.product_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ---- Product Variants RLS ----
CREATE POLICY "product_variants_public_read" ON public.product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_variants.product_id AND status = 'active'
    )
  );

CREATE POLICY "admins_manage_variants" ON public.product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ---- Orders RLS ----
-- Users can read their own orders
CREATE POLICY "users_select_own_orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

-- Anyone (including guests) can create orders
CREATE POLICY "anyone_insert_orders" ON public.orders
  FOR INSERT WITH CHECK (TRUE);

-- Admins can read/update all orders
CREATE POLICY "admins_manage_orders" ON public.orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ---- Order Items RLS ----
CREATE POLICY "users_select_own_order_items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_items.order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "anyone_insert_order_items" ON public.order_items
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "admins_manage_order_items" ON public.order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ---- Banners RLS ----
CREATE POLICY "banners_public_read" ON public.banners
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "admins_manage_banners" ON public.banners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ============================================================
-- TRIGGERS — auto-create user profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEED DATA — Admin user (set your email here)
-- ============================================================
-- After running the migration, create a user via Supabase Auth,
-- then promote them to admin:
--
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@shopseeme.com';

-- ---- Seed Categories ----
INSERT INTO public.categories (name, slug, gender, is_active, sort_order) VALUES
  ('T-Shirts', 't-shirts', 'men', TRUE, 1),
  ('Shirts', 'shirts', 'men', TRUE, 2),
  ('Pants & Jeans', 'pants-jeans', 'men', TRUE, 3),
  ('Jackets & Hoodies', 'jackets-hoodies', 'men', TRUE, 4),
  ('Dresses', 'dresses', 'women', TRUE, 1),
  ('Tops & Blouses', 'tops-blouses', 'women', TRUE, 2),
  ('Ethnic Wear', 'ethnic-wear', 'women', TRUE, 3),
  ('Boys Clothing', 'boys-clothing', 'kids', TRUE, 1),
  ('Girls Clothing', 'girls-clothing', 'kids', TRUE, 2);

-- ============================================================
-- STORAGE BUCKETS (Run separately in Supabase Storage)
-- ============================================================
-- Create these buckets in Supabase Storage:
-- 1. "product-images" — public bucket
-- 2. "banner-images"  — public bucket
-- 3. "avatars"        — public bucket
