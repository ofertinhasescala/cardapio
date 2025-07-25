import { Skeleton } from "@/components/ui/skeleton";

export function MenuSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo Skeleton */}
          <div className="flex items-center">
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Info section Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Cart Icon Skeleton */}
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      
      {/* Category Nav Skeleton */}
      <div className="sticky top-[81px] z-40 bg-background border-b border-border">
        <div className="flex overflow-x-auto px-4 py-3 gap-1 no-scrollbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-24 flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Featured Carousel Skeleton */}
      <div className="px-4 py-4 bg-background">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex gap-3 pb-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-[260px]">
              <Skeleton className="h-36 w-full mb-3" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Products Section Skeletons */}
      {[1, 2].map((section) => (
        <div key={section} className="px-4 py-4">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4 p-4 border rounded-md">
                <Skeleton className="w-20 h-20 flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 