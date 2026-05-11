import type { Metadata } from 'next'
import { CategoryPage } from '@/components/products/CategoryPage'

export const metadata: Metadata = {
  title: "Kids' Fashion – Comfortable & Stylish Children's Clothing",
  description:
    "Shop ShopSeeMe's kids' collection. Fun, comfortable, and stylish clothing for boys and girls. Fast delivery across Bangladesh.",
  openGraph: {
    title: "Kids' Collection | ShopSeeMe",
    description: "Fun & stylish clothing for kids.",
    url: 'https://shopseeme.com/kids',
  },
}

export default function KidsPage() {
  return <CategoryPage gender="kids" title="Kids' Collection" />
}
