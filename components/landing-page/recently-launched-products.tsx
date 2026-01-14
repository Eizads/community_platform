import { RocketIcon, CalendarIcon } from "lucide-react"
import SectionHeader from "../common/section-header"
import ProductCard from "../products/product-card"
import EmptyState from "../common/empty-state"
import { getRecentlyLaunchedProducts } from "@/lib/db-queries"
import { getTranslations, getLocale } from "next-intl/server"

export default async function RecentlyLaunchedProducts() {
  const t = await getTranslations("RecentlyLaunched")
  const locale = await getLocale()
  const recentlyLaunchedProducts = await getRecentlyLaunchedProducts(locale)
  return (
    <section className="bg-white py-10">
      <div className="container space-y-8">
        <SectionHeader
          icon={RocketIcon}
          title={t("title")}
          description={t("description")}
        />
        {recentlyLaunchedProducts.length === 0 ? (
          <EmptyState icon={CalendarIcon} message={t("emptyMessage")} />
        ) : (
          <div className="grid-wrapper mt-10">
            {recentlyLaunchedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
