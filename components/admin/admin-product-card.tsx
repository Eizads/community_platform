"use client"
import { ProductType } from "@/lib/types"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { Link } from "@/i18n/navigation"
// import ProductVoting from "../products/product-voting"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { ExternalLinkIcon, Trash2Icon } from "lucide-react"
import PendingApprovalButtons from "@/components/admin/pending-approval-buttons"
import { deleteProductAction } from "@/lib/admin-actions"
import { useTranslations } from "next-intl"

export default function AdminProductCard({
  product,
}: {
  product: ProductType
}) {
  const t = useTranslations("AdminPage")
  const tStatus = useTranslations("ProductStatus")
  const tDetails = useTranslations("ProductDetails")
  
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    await deleteProductAction(product.id as number)
  }
  return (
    <Card className="flex flex-col justify-between card-hover group hover:shadow-lg hover:scale-105 transition-all duration-300 min-h-[240px] xl:min-h-[300px]">
      <CardHeader className="flex-1">
        <div className="flex flex-row items-start ">
          <div className="flex-1 space-y-4">
            <div className="flex flex-row items-start justify-between gap-2 mb-2">
              <CardTitle className="flex-1 text-lg font-bold group-hover:text-sky-700 transition-all duration-300">
                {product.name}
              </CardTitle>
              {/* Show featured badge if vote count is greater than 100 */}

              <Badge
                className={cn(
                  product.status?.toLowerCase() === "approved"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : product.status?.toLowerCase() === "rejected"
                    ? "bg-red-100 text-red-800 border-red-200"
                    : product.status?.toLowerCase() === "pending"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
                )}
                variant="outline"
              >
                {product.status}
              </Badge>
            </div>
            <CardDescription>{product.description}</CardDescription>
            {/* tags */}
            <div className="flex flex-row gap-2 flex-wrap">
              {product.tags?.map(tag => (
                <Badge key={tag} className="text-sm " variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            {/* submitted by */}
            <div className="flex flex-row gap-2 flex-wrap items-center">
              <p className="text-sm text-gray-500">
                {tDetails("by")}: <span className="font-bold">{product.submittedBy}</span>
              </p>
              <p className="text-sm text-gray-500">
                {product.createdAt
                  ? new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(product.createdAt))
                  : ""}
              </p>
              <Link
                href={product.websiteUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500"
              >
                <Button variant="ghost" size="sm">
                  <ExternalLinkIcon className="w-4 h-4" />
                  {t("visitWebsite")}
                </Button>
              </Link>
            </div>
          </div>
          {/* Voting Section */}
          {/* <ProductVoting product={product} /> */}
        </div>
      </CardHeader>
      <CardContent>
        <CardFooter className="px-0 gap-2 flex-wrap">
          <div className="flex flex-row gap-2">
            {product.status && (
              <PendingApprovalButtons
                status={product.status as string}
                productId={product.id as number}
              />
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2Icon className="w-4 h-4" />
            {t("deleteButton")}
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
