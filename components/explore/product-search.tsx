"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ClockIcon, TrendingUpIcon } from "lucide-react"
import ProductCard from "@/components/products/product-card"
import { ProductWithTranslation } from "@/lib/types"
import { useTranslations } from "next-intl"

export default function ProductSearch({
  products,
}: {
  products: ProductWithTranslation[]
}) {
  const t = useTranslations("ExplorePage")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "trending">("recent")
  const productsCopy = [...products]
  // Filter products directly during render - no useEffect needed -
  const filteredProducts =
    search.length > 0
      ? productsCopy.filter(product =>
          product.name.toLowerCase().includes(search.toLowerCase())
        )
      : productsCopy

  // Only compute the sorting we need
  const sortedProducts =
    sortBy === "trending"
      ? [...filteredProducts]
          .filter(product => product.voteCount > 100)
          .sort((a, b) => b.voteCount - a.voteCount)
      : [...filteredProducts].sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        )

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 my-8">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-2">
          <Button
            variant={sortBy === "trending" ? "default" : "outline"}
            onClick={() => setSortBy("trending")}
          >
            <TrendingUpIcon className="w-4 h-4" /> {t("trending")}
          </Button>
          <Button
            variant={sortBy === "recent" ? "default" : "outline"}
            onClick={() => setSortBy("recent")}
          >
            <ClockIcon className="w-4 h-4" /> {t("recent")}
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        {sortedProducts.length == 0
          ? t("noProducts")
          : sortedProducts.length == 1
          ? t("showingOne")
          : t("showingMany", { count: sortedProducts.length })}
      </p>
      <div className="grid-wrapper mt-4">
        {sortedProducts.map(product => (
          <div key={product.id}>
            <ProductCard key={product.id} product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
