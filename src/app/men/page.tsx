import type { Metadata } from 'next'
import { CategoryPage } from '@/components/products/CategoryPage'

export const metadata: Metadata = {
  title: "Men's Fashion – Shirts, Pants, Jackets & More",
  description:
    "Shop the latest men's fashion at ShopSeeMe. Premium shirts, pants, jackets, and more for the modern man. Fast delivery across Bangladesh.",
  openGraph: {
    title: "Men's Collection | ShopSeeMe",
    description: "Premium men's fashion — shirts, pants, jackets and more.",
    url: 'https://shopseeme.com/men',
  },
}

export default function MenPage() {
  return <CategoryPage gender="men" title="Men's Collection" />
}
