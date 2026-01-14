import { Suspense, type ReactNode } from "react"
import AdminPageSkeleton from "@/components/skeleton/admin-page-skeleton"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <AdminPageSkeleton />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  )
}
