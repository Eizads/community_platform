import { Suspense, type ReactNode } from "react"
import RecentlyLaunchedSkeleton from "@/components/skeleton/recently-launched-skeleton"

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <RecentlyLaunchedSkeleton />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  )
}
