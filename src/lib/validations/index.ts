import { z } from 'zod'

// ---- Auth Schemas ----
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email too long'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password too long'),
})

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name too long')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .max(255, 'Email too long'),
    phone: z
      .string()
      .regex(/^(\+88)?01[3-9]\d{8}$/, 'Enter a valid Bangladeshi phone number')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password too long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

// ---- Checkout Schema ----
export const checkoutSchema = z
  .object({
    full_name: z
      .string()
      .min(2, 'Full name is required')
      .max(100, 'Name too long'),
    phone: z
      .string()
      .regex(/^(\+88)?01[3-9]\d{8}$/, 'Enter a valid Bangladeshi phone number'),
    email: z
      .string()
      .email('Invalid email address')
      .max(255)
      .optional()
      .or(z.literal('')),
    address_line1: z
      .string()
      .min(5, 'Please enter your full address')
      .max(255, 'Address too long'),
    address_line2: z.string().max(255).optional().or(z.literal('')),
    city: z.string().min(2, 'City is required').max(100),
    district: z.string().min(2, 'District is required'),
    postal_code: z.string().max(10).optional().or(z.literal('')),
    payment_method: z.enum(['cod', 'bkash', 'nagad', 'sslcommerz'], {
      required_error: 'Please select a payment method',
    }),
    bkash_number: z
      .string()
      .regex(/^01[3-9]\d{8}$/, 'Invalid bKash number')
      .optional()
      .or(z.literal('')),
    bkash_transaction_id: z
      .string()
      .max(50)
      .optional()
      .or(z.literal('')),
    notes: z.string().max(500).optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.payment_method === 'bkash') {
        return !!data.bkash_number && !!data.bkash_transaction_id
      }
      return true
    },
    {
      message: 'bKash number and transaction ID are required for bKash payment',
      path: ['bkash_transaction_id'],
    }
  )

// ---- Contact Schema ----
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email').max(255),
  phone: z
    .string()
    .regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  subject: z.string().min(5, 'Subject is required').max(200),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
})

// ---- Newsletter Schema ----
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
})

// ---- Product Schema (Admin) ----
export const productSchema = z.object({
  title: z.string().min(2, 'Title is required').max(200),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(5000).optional().or(z.literal('')),
  short_description: z.string().max(500).optional().or(z.literal('')),
  category_id: z.string().uuid('Invalid category').optional().or(z.literal('')),
  gender: z.enum(['men', 'women', 'kids', 'unisex']),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(1, 'Price must be at least 1')
    .max(999999, 'Price too high'),
  discount_price: z
    .number({ invalid_type_error: 'Discount price must be a number' })
    .min(0)
    .max(999999)
    .nullable()
    .optional(),
  sku: z.string().max(100).optional().or(z.literal('')),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  is_featured: z.boolean().default(false),
  is_new_arrival: z.boolean().default(true),
  is_best_seller: z.boolean().default(false),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
  meta_title: z.string().max(70).optional().or(z.literal('')),
  meta_description: z.string().max(160).optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
})
.refine(
  (data) => {
    if (data.discount_price !== null && data.discount_price !== undefined) {
      return data.discount_price < data.price
    }
    return true
  },
  {
    message: 'Discount price must be less than regular price',
    path: ['discount_price'],
  }
)

// ---- Banner Schema (Admin) ----
export const bannerSchema = z.object({
  title: z.string().min(2, 'Title is required').max(200),
  subtitle: z.string().max(300).optional().or(z.literal('')),
  cta_text: z.string().max(50).optional().or(z.literal('')),
  cta_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  image_url: z.string().url('Invalid image URL'),
  mobile_image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
  starts_at: z.string().datetime().optional().nullable(),
  ends_at: z.string().datetime().optional().nullable(),
})

// ---- Profile Update Schema ----
export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Name is required').max(100),
  phone: z
    .string()
    .regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number')
    .optional()
    .or(z.literal('')),
})

// ---- Order Status Update Schema (Admin) ----
export const orderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ]),
})

// ---- Type Exports ----
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
export type ProductInput = z.infer<typeof productSchema>
export type BannerInput = z.infer<typeof bannerSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type OrderStatusInput = z.infer<typeof orderStatusSchema>
