import { Skeleton } from '@/components/ui/skeleton'

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-6">
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
          <Skeleton className="h-8 w-16 mt-2" />
        </div>
      ))}
    </div>
  )
}
