import { Suspense, type ReactNode } from "react"
import ExplorePageSkeleton from "@/components/skeleton/explore-page-skeleton"
export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <ExplorePageSkeleton />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  )
}
