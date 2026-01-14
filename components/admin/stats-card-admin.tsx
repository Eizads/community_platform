"use client"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export default function StatsCardAdmin({
  totalProducts,
  approvedProducts,
  rejectedProducts,
  pendingProducts,
}: {
  totalProducts: number
  approvedProducts: number
  rejectedProducts: number
  pendingProducts: number
}) {
  const t = useTranslations("AdminPage")

  const stats = [
    {
      label: t("statsTotal"),
      count: totalProducts,
      color: "bg-yellow-100",
    },
    {
      label: t("statsApproved"),
      count: approvedProducts,
      color: "bg-green-100",
    },
    {
      label: t("statsRejected"),
      count: rejectedProducts,
      color: "bg-red-100",
    },
    {
      label: t("statsPending"),
      count: pendingProducts,
      color: "bg-blue-100",
    },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map(stat => (
        <div
          key={stat.label}
          className={cn(stat.color, "border-1 border-gray-300 p-4 rounded-lg")}
        >
          <p>{stat.label}</p>
          <p>{stat.count}</p>
        </div>
      ))}
    </div>
  )
}
