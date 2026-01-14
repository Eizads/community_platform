import HeroSection from "@/components/landing-page/hero-section"
import FeaturedProducts from "@/components/landing-page/featured-products"
import RecentlyLaunchedProducts from "@/components/landing-page/recently-launched-products"
import { Suspense } from "react"
import RecentlyLaunchedSkeleton from "@/components/skeleton/recently-launched-skeleton"
import { setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params

  // Enable static rendering
  setRequestLocale(locale)

  return (
    <div>
      <HeroSection />
      <FeaturedProducts />

      <Suspense fallback={<RecentlyLaunchedSkeleton />}>
        <RecentlyLaunchedProducts />
      </Suspense>
    </div>
  )
}
