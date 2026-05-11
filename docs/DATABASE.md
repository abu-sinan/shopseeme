# DATABASE.md — ShopSeeMe Database Schema

## Overview

ShopSeeMe uses **PostgreSQL** via **Supabase** with Row Level Security (RLS) enabled on all tables.

---

## Entity Relationship Diagram

```
auth.users (Supabase Auth)
    │
    └── users (public profile)
            │
            └── orders ──── order_items ──── products
                                                │
                                         categories
                                                │
                                      product_images
                                      product_variants
banners (standalone)
```

---

## Tables

### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | References auth.users |
| email | TEXT | Unique email |
| full_name | TEXT | Display name |
| phone | TEXT | BD phone number |
| avatar_url | TEXT | Profile image URL |
| role | ENUM | customer / admin / super_admin |
| created_at | TIMESTAMPTZ | Account creation |
| updated_at | TIMESTAMPTZ | Last update |

### `categories`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| name | TEXT | Category name |
| slug | TEXT (UNIQUE) | URL-friendly name |
| description | TEXT | Optional description |
| image_url | TEXT | Category cover image |
| gender | ENUM | men / women / kids / unisex |
| is_active | BOOLEAN | Show in navigation |
| sort_order | INTEGER | Display order |

### `products`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| title | TEXT | Product name |
| slug | TEXT (UNIQUE) | URL slug |
| description | TEXT | Full description |
| short_description | TEXT | Card description |
| category_id | UUID (FK) | References categories |
| gender | ENUM | men / women / kids / unisex |
| price | DECIMAL(10,2) | Regular price in BDT |
| discount_price | DECIMAL(10,2) | Sale price (< price) |
| sku | TEXT | Stock keeping unit |
| stock | INTEGER | Available quantity |
| is_featured | BOOLEAN | Show on homepage |
| is_new_arrival | BOOLEAN | Show as new |
| is_best_seller | BOOLEAN | Show as bestseller |
| status | ENUM | active / draft / archived |
| meta_title | TEXT | SEO title (max 70) |
| meta_description | TEXT | SEO description (max 160) |
| tags | TEXT[] | Array of tags |

### `product_images`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| product_id | UUID (FK) | References products |
| url | TEXT | Image URL |
| alt_text | TEXT | Accessibility text |
| sort_order | INTEGER | Display order |
| is_primary | BOOLEAN | Main display image |

### `product_variants`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| product_id | UUID (FK) | References products |
| size | TEXT | Size label (S, M, L, etc.) |
| color | TEXT | Color name |
| color_hex | TEXT | Hex color code |
| stock | INTEGER | Variant-specific stock |
| price_modifier | DECIMAL | Price adjustment |
| sku | TEXT | Variant SKU |

### `orders`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| order_number | TEXT (UNIQUE) | SSM-XXXXX format |
| user_id | UUID (FK, nullable) | Null = guest order |
| status | ENUM | pending/confirmed/processing/shipped/delivered/cancelled/refunded |
| payment_method | ENUM | cod / bkash / nagad / sslcommerz |
| payment_status | ENUM | pending / paid / failed / refunded |
| subtotal | DECIMAL | Items total |
| shipping_cost | DECIMAL | Delivery fee |
| discount_amount | DECIMAL | Promo discount |
| total | DECIMAL | Final amount |
| shipping_address | JSONB | Full address object |
| notes | TEXT | Customer notes |
| bkash_number | TEXT | bKash sender number |
| bkash_transaction_id | TEXT | bKash TrxID |

### `order_items`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| order_id | UUID (FK) | References orders |
| product_id | UUID (FK) | References products |
| variant_id | UUID (FK, nullable) | References product_variants |
| title | TEXT | Snapshot of product title |
| price | DECIMAL | Price at time of order |
| quantity | INTEGER | Quantity ordered |
| size | TEXT | Selected size |
| color | TEXT | Selected color |
| image_url | TEXT | Product image snapshot |
| subtotal | DECIMAL | price × quantity |

### `banners`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| title | TEXT | Headline text |
| subtitle | TEXT | Supporting text |
| cta_text | TEXT | Button label |
| cta_url | TEXT | Button link |
| image_url | TEXT | Desktop image |
| mobile_image_url | TEXT | Mobile image |
| is_active | BOOLEAN | Show/hide |
| sort_order | INTEGER | Display order |
| starts_at | TIMESTAMPTZ | Schedule start |
| ends_at | TIMESTAMPTZ | Schedule end |

---

## Shipping Address JSON Structure

```json
{
  "full_name": "Rahman Ahmed",
  "phone": "01712345678",
  "email": "rahman@example.com",
  "address_line1": "House 12, Road 5, Block B",
  "address_line2": "Banani",
  "city": "Dhaka",
  "district": "Dhaka",
  "postal_code": "1213",
  "country": "Bangladesh"
}
```

---

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

---

## RLS Policy Summary

| Table | Public Read | User Own | Admin All |
|-------|------------|----------|-----------|
| users | ❌ | ✅ | ✅ |
| categories | ✅ (active) | ❌ | ✅ |
| products | ✅ (active) | ❌ | ✅ |
| product_images | ✅ (via active product) | ❌ | ✅ |
| product_variants | ✅ (via active product) | ❌ | ✅ |
| orders | ❌ | ✅ | ✅ |
| order_items | ❌ | ✅ (via order) | ✅ |
| banners | ✅ (active) | ❌ | ✅ |
