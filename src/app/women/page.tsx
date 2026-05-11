import type { Metadata } from 'next'
import { CategoryPage } from '@/components/products/CategoryPage'

export const metadata: Metadata = {
  title: "Women's Fashion – Dresses, Tops, Ethnic & More",
  description:
    "Explore ShopSeeMe's women's collection. Discover dresses, tops, ethnic wear, and more for the modern woman. Fast delivery across Bangladesh.",
  openGraph: {
    title: "Women's Collection | ShopSeeMe",
    description: "Premium women's fashion — dresses, tops, and more.",
    url: 'https://shopseeme.com/women',
  },
}

export default function WomenPage() {
  return <CategoryPage gender="women" title="Women's Collection" />
}
