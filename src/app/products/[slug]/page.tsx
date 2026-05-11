import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getAllProductSlugs, getRelatedProducts } from '@/services/productService'
import { ProductDetail } from '@/components/products/ProductDetail'
import { ProductCard } from '@/components/products/ProductCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  const primaryImage = product.images?.find((img) => img.is_primary)?.url || product.images?.[0]?.url

  return {
    title: product.meta_title || `${product.title} | ShopSeeMe`,
    description:
      product.meta_description ||
      product.short_description ||
      `Shop ${product.title} at ShopSeeMe. Premium fashion delivered across Bangladesh.`,
    openGraph: {
      title: product.title,
      description: product.short_description || `Shop ${product.title} at ShopSeeMe.`,
      url: `https://shopseeme.com/products/${product.slug}`,
      images: primaryImage ? [{ url: primaryImage, alt: product.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      images: primaryImage ? [primaryImage] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = await getRelatedProducts(
    product.id,
    product.gender,
    product.category_id || undefined,
    4
  )

  // JSON-LD structured data
  const primaryImage = product.images?.find((img) => img.is_primary)?.url
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.short_description,
    image: primaryImage,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.discount_price || product.price,
      priceCurrency: 'BDT',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `https://shopseeme.com/products/${product.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-black pt-16 md:pt-20">
        <ProductDetail product={product} />

        {/* Related Products */}
        {related.length > 0 && (
          <section className="py-16 border-t border-white/5" aria-labelledby="related-heading">
            <div className="container-main">
              <h2 id="related-heading" className="section-heading mb-8">
                You May Also <span className="text-brand-pink">Like</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
