import { getFeaturedProducts } from "@/lib/db-queries"
import { getProductBySlug } from "@/lib/db-queries"
import { notFound } from "next/navigation"
import SectionHeader from "@/components/common/section-header"
import { ExternalLinkIcon, StarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ProductVoting from "@/components/products/product-voting"
import { setRequestLocale, getTranslations } from "next-intl/server"

export async function generateStaticParams() {
  const products = await getFeaturedProducts()
  return products.flatMap(product =>
    ["en", "es"].map(locale => ({ locale, slug: product.slug }))
  )
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations("ProductDetails")
  const product = await getProductBySlug(slug)
  if (!product) {
    notFound()
  }

  const {
    name,
    tagline,
    description,
    websiteUrl,
    tags,

    createdAt,
    submittedBy,
  } = product

  return (
    <div className="py-10 bg-gray-100">
      <div className="container">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-8">
          <div className="lg:col-span-2 space-y-4">
            <SectionHeader
              icon={product.voteCount > 100 ? StarIcon : undefined}
              title={name || ""}
              description={tagline || ""}
              headingLevel="h1"
            />
            <div>
              <div className="flex flex-row gap-2 flex-wrap my-8">
                {tags?.map(tag => (
                  <Badge
                    key={tag}
                    className="text-sm bg-sky-500 "
                    variant="default"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="prose prose-neutral dark:prose-invert">
                <h2 className="font-bold text-lg my-4">{t("about")}</h2>
                <p>{description}</p>
              </div>
            </div>
            <div className="border rounded-md border-gray-300 bg-white p-4 space-y-2 ">
              <h2 className="font-bold text-lg ">{t("productDetails")}</h2>
              <p className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> {t("launched")}:{" "}
                {createdAt?.toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> {t("submittedBy")}: {submittedBy}
              </p>
            </div>
          </div>

          {/* Support this product */}
          <div className="lg:col-span-1 space-y-4">
            <div className="sticky top-24  gap-2 border rounded-md border-gray-300 bg-white p-4 justify-start items-center ">
              <div
                className={cn(
                  product.voteCount > 100 &&
                    "border-b-0 border-b border-gray-300  w-full mb-3"
                )}
              >
                <p className="font-bold text-lg text-center ">
                  {t("supportProduct")}
                </p>
                <ProductVoting product={product} />
              </div>
              {product.voteCount > 100 && (
                <Badge
                  variant="default"
                  className="bg-sky-500 text-white w-full text-center"
                >
                  <StarIcon className="w-4 h-4" />
                  {t("featuredProduct")}
                </Badge>
              )}
            </div>
            <Button variant="default" className="w-full " asChild>
              <a
                href={websiteUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("visitWebsite")}
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
