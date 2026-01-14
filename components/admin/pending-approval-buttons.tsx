"use client"

import { Button } from "@/components/ui/button"
import { CheckIcon, XIcon } from "lucide-react"
import { approveProductAction, rejectProductAction } from "@/lib/admin-actions"
import { useTranslations } from "next-intl"

export default function PendingApprovalButtons({
  status,
  productId,
}: {
  status: string
  productId: number
}) {
  const t = useTranslations("AdminPage")
  if (status?.toLowerCase() !== "pending") {
    return null
  }

  const handleApproveAction = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation()
    e.preventDefault()
    await approveProductAction(productId)
  }
  const handleRejectAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    await rejectProductAction(productId)
  }
  return (
    <div className="flex flex-row gap-2">
      <Button
        variant="default"
        size="sm"
        className="hover:cursor-pointer hover:bg-green-500 hover:text-white"
        onClick={handleApproveAction}
      >
        <CheckIcon className="w-4 h-4" />
        {t("approveButton")}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="hover:cursor-pointer"
        onClick={handleRejectAction}
      >
        <XIcon className="w-4 h-4" />
        {t("rejectButton")}
      </Button>
    </div>
  )
}
