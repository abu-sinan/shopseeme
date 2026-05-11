import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind CSS classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price in BDT (Bangladeshi Taka) */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/** Format price as plain number with comma */
export function formatPriceSimple(price: number): string {
  return `৳${price.toLocaleString('en-BD')}`
}

/** Calculate discount percentage */
export function getDiscountPercent(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100)
}

/** Generate URL-friendly slug from string */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Truncate text to specified length */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/** Format date for display */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

/** Format date with time */
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

/** Get order status color class */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    confirmed: 'text-blue-400 bg-blue-400/10',
    processing: 'text-orange-400 bg-orange-400/10',
    shipped: 'text-purple-400 bg-purple-400/10',
    delivered: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
    refunded: 'text-gray-400 bg-gray-400/10',
  }
  return colors[status] || 'text-gray-400 bg-gray-400/10'
}

/** Get payment status color class */
export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'text-yellow-400',
    paid: 'text-green-400',
    failed: 'text-red-400',
    refunded: 'text-gray-400',
  }
  return colors[status] || 'text-gray-400'
}

/** Generate a random order number */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SSM-${timestamp}-${random}`
}

/** Check if image URL is valid */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/** Get gender display label */
export function getGenderLabel(gender: string): string {
  const labels: Record<string, string> = {
    men: "Men's",
    women: "Women's",
    kids: "Kids'",
    unisex: 'Unisex',
  }
  return labels[gender] || gender
}

/** Calculate shipping cost */
export function calculateShipping(subtotal: number): number {
  // Free shipping over ৳2000, else ৳80
  return subtotal >= 2000 ? 0 : 80
}

/** Debounce utility */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/** Get Supabase storage public URL */
export function getStorageUrl(bucket: string, path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`
}

/** Validate file type for image uploads */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' }
  }

  return { valid: true }
}
