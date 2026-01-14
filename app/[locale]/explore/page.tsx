import SectionHeader from "@/components/common/section-header"
import { CompassIcon } from "lucide-react"
import { getAllApprovedProducts } from "@/lib/db-queries"
import ProductSearch from "@/components/explore/product-search"
import { setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ExplorePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  
  const products = await getAllApprovedProducts()
  return (
    <section className="bg-slate-100 flex-1 flex flex-col">
      <div className="container py-10 space-y-4">
        <SectionHeader
          icon={CompassIcon}
          title="Explore All Products"
          description="Browse all products from the community"
          headingLevel="h1"
        />
        {/* search and display products */}
        <ProductSearch products={products} />
      </div>
    </section>
  )
}
