# ADMIN_GUIDE.md — ShopSeeMe Admin Panel

## Accessing the Admin Panel

1. Navigate to `https://shopseeme.com/admin`
2. Login with your admin account
3. You must have `role = 'admin'` or `role = 'super_admin'` in the database

### Promoting a User to Admin
```sql
-- Run in Supabase SQL Editor
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@shopseeme.com';
```

---

## Dashboard

The dashboard shows real-time metrics:

| Metric | Description |
|--------|-------------|
| Total Revenue | Sum of all non-cancelled orders |
| Total Orders | Count of all orders |
| Pending Orders | Orders awaiting confirmation |
| Active Products | Products with status = 'active' |
| Customers | Registered customer accounts |
| Low Stock | Products with stock ≤ 5 |

---

## Product Management

### Adding a New Product

1. Click **Add Product** button
2. Fill in required fields:
   - **Title**: Product name (generates slug automatically)
   - **Gender**: Men / Women / Kids / Unisex
   - **Price**: Regular price in BDT (৳)
   - **Sale Price**: Optional discounted price (must be < regular price)
   - **Stock**: Available quantity
3. Add product images (paste image URLs)
4. Add variants if product has sizes/colors
5. Set status: **Active** (visible) / **Draft** (hidden) / **Archived**
6. Click **Create Product**

### Editing a Product

1. Go to Products list
2. Click the **Edit** (pencil) icon
3. Modify fields and click **Update Product**

### Deleting a Product

1. Click the **Delete** (trash) icon
2. Confirm deletion in the dialog
3. ⚠️ This permanently deletes the product and all its images/variants

### Product Status

| Status | Visible to customers |
|--------|---------------------|
| Active | ✅ Yes |
| Draft | ❌ No |
| Archived | ❌ No |

### Adding Product Images

- Enter one image URL per field
- First image = primary (shown in product cards)
- Click **+ Add Image** for more images
- Recommended: Use Supabase Storage for image hosting

### Adding Variants (Sizes & Colors)

For products with multiple sizes/colors:
1. Click **+ Add Variant**
2. Enter Size (e.g., "M", "L", "XL")
3. Enter Color name (e.g., "Black")
4. Pick color from the color picker
5. Enter stock for that specific variant

---

## Order Management

### Viewing Orders

Orders are listed newest first. You can filter by status:
- **Pending** — New orders awaiting confirmation
- **Confirmed** — Order acknowledged
- **Processing** — Being packed
- **Shipped** — Out for delivery
- **Delivered** — Successfully delivered
- **Cancelled** — Cancelled by customer or admin
- **Refunded** — Refund issued

### Updating Order Status

1. Find the order in the list
2. Use the dropdown in the **Action** column
3. Select new status
4. Status updates automatically (no save needed)

### Order Workflow

```
Pending → Confirmed → Processing → Shipped → Delivered
                                           ↘ Cancelled
```

### bKash Orders

For bKash payment orders:
1. Check the **bKash Transaction ID** in order details
2. Verify transaction in your bKash merchant dashboard
3. If verified, update status to **Confirmed**
4. If invalid, update to **Cancelled**

---

## Banner Management

### Creating a Banner

1. Go to **Banners** → **Add Banner**
2. Fill in:
   - **Title**: Banner headline
   - **Subtitle**: Supporting text
   - **Image URL**: Main banner image (recommended: 1400×560px)
   - **Mobile Image URL**: Optional mobile-optimized image
   - **CTA Text**: Button text (e.g., "Shop Now")
   - **CTA URL**: Link destination (e.g., `/women`)
   - **Sort Order**: Lower number = shows first
3. Toggle **Active** on/off
4. Click **Create Banner**

### Banner Image Recommendations

| Use Case | Dimensions | Format |
|----------|-----------|--------|
| Desktop hero | 1400 × 560px | WebP |
| Mobile hero | 800 × 600px | WebP |
| Promo strip | 1400 × 300px | WebP |

---

## Quick Tips

- **Low stock alert**: Products with ≤5 stock appear in orange in the products table
- **SEO fields**: Always fill in Meta Title and Meta Description for better search rankings
- **Slugs**: Auto-generated from title but can be manually edited — must be unique
- **Featured products**: Toggle `is_featured` to show product on homepage
- **New arrivals**: All new products default to `is_new_arrival = true`
