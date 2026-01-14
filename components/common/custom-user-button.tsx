"use client"

import { UserButton } from "@clerk/nextjs"
import { Building2Icon } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "@/i18n/navigation"

export default function CustomUserButton() {
  return (
    <UserButton>
      <UserButton.UserProfilePage
        label="Admin"
        labelIcon={<Building2Icon className="w-4 h-4" />}
        url="/admin"
      >
        <div className="flex flex-col items-start justify-start gap-4">
          <h2 className="text-lg font-medium">Admin Panel</h2>
          <Link href="/admin" className="flex flex-row items-center gap-2">
            <Button variant="outline" size="sm">
              <Building2Icon className="w-4 h-4" />
              Go to Admin Panel
            </Button>
          </Link>
        </div>
      </UserButton.UserProfilePage>
    </UserButton>
  )
}
