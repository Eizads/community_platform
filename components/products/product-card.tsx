"use client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { StarIcon } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { InferSelectModel } from "drizzle-orm"
import { products } from "@/db/schema"

import ProductVoting from "./product-voting"
import { useTranslations } from "next-intl"

type Product = InferSelectModel<typeof products>

function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("FeaturedProducts")
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="flex flex-col justify-between card-hover group hover:shadow-lg hover:scale-105 transition-all duration-300 min-h-[240px] sm:min-h-[350px] xl:min-h-[275px]">
        <CardHeader className="flex-1">
          <div className="flex flex-row items-start justify-between">
            <div>
              <div className="flex flex-row items-center justify-between gap-2 mb-2">
                <CardTitle className="text-lg font-bold group-hover:text-sky-700 transition-all duration-300">
                  {product.name}
                </CardTitle>
                {/* Show featured badge if vote count is greater than 100 */}
                {product.voteCount > 100 && (
                  <Badge className="bg-sky-500 text-white" variant="default">
                    <StarIcon className="w-4 h-4 fill-current" /> {t("featuredBadge")}
                  </Badge>
                )}
              </div>
              <CardDescription>{product.description}</CardDescription>
            </div>
            {/* Voting Section */}
            <ProductVoting product={product} />
          </div>
        </CardHeader>
        <CardContent>
          <CardFooter className="px-0 gap-2 flex-wrap">
            {product.tags?.map(tag => (
              <Badge key={tag} className="text-sm" variant="secondary">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ProductCard
