import { StarIcon } from "lucide-react"
import SectionHeader from "../common/section-header"
import { Button } from "../ui/button"
import { Link } from "@/i18n/navigation"
import ProductCard from "../products/product-card"
import { getFeaturedProducts } from "@/lib/db-queries"
import { getTranslations, getLocale } from "next-intl/server"

export default async function FeaturedProducts() {
  const t = await getTranslations("FeaturedProducts")
  const locale = await getLocale()
  const featuredProducts = await getFeaturedProducts(locale)
  return (
    <section className="bg-slate-100 py-10">
      <div className="container">
        <div className="flex flex-row items-center justify-between">
          <SectionHeader
            icon={StarIcon}
            title={t("title")}
            description={t("description")}
          />
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/products">{t("viewAllButton")}</Link>
          </Button>
        </div>

        <div className="grid-wrapper mt-10">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
