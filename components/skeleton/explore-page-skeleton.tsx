import { Skeleton } from "../ui/skeleton"
import SectionHeader from "../common/section-header"
import { CompassIcon } from "lucide-react"

export default function ExplorePageSkeleton() {
  return (
    <section className="bg-slate-100 flex-1 flex flex-col">
      <div className="container py-10 space-y-4">
        {/* Section Header */}
        <SectionHeader
          icon={CompassIcon}
          title="Explore All Products"
          description="Browse all products from the community"
          headingLevel="h1"
        />

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-2 my-8">
          <div className="flex-1 relative">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-row gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Product Count */}
        <Skeleton className="h-5 w-48 mb-2" />

        {/* Product Grid */}
        <div className="grid-wrapper mt-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 space-y-4 min-h-[300px]"
            >
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="flex items-center justify-end">
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
