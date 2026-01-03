import SectionHeader from "@/components/common/section-header"
import { CompassIcon } from "lucide-react"
import { getAllApprovedProducts } from "@/lib/db-queries"
import ProductSearch from "@/components/explore/product-search"
import FeaturedProducts from "@/components/landing-page/featured-products"
import { Suspense } from "react"
import RecentlyLaunchedSkeleton from "@/components/skeleton/recently-launched-skeleton"

export default async function ExplorePage() {
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
        <Suspense fallback={<RecentlyLaunchedSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </section>
  )
}
