import HeroSection from "@/components/landing-page/hero-section"
import FeaturedProducts from "@/components/landing-page/featured-products"
import RecentlyLaunchedProducts from "@/components/landing-page/recently-launched-products"
import { Suspense } from "react"
import RecentlyLaunchedSkeleton from "@/components/skeleton/recently-launched-skeleton"

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Suspense fallback={<RecentlyLaunchedSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<RecentlyLaunchedSkeleton />}>
        <RecentlyLaunchedProducts />
      </Suspense>
    </div>
  )
}
