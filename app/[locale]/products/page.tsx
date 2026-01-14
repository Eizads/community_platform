import { getAllApprovedProducts } from "@/lib/db-queries"
import SectionHeader from "@/components/common/section-header"
import { StarIcon } from "lucide-react"
import ProductCard from "@/components/products/product-card"
import { setRequestLocale, getTranslations } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Products({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("ProductsPage")

  const products = await getAllApprovedProducts(locale)
  return (
    <section className="bg-slate-100 py-10">
      <div className="container">
        <div className="flex flex-row items-center justify-between">
          <SectionHeader
            icon={StarIcon}
            title={t("title")}
            description={t("description")}
          />
        </div>

        <div className="grid-wrapper mt-10">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
