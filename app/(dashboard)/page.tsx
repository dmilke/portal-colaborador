import { Suspense } from 'react'
import { StatsCards } from './components/stats-cards'
import { StatsCardsSkeleton } from './components/stats-cards-skeleton'
import { RecentActivity } from './components/recent-activity'
import { RecentActivitySkeleton } from './components/recent-activity-skeleton'
import { QuickActions } from './components/quick-actions'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral do sistema
        </p>
      </div>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      <Suspense fallback={<RecentActivitySkeleton />}>
        <RecentActivity />
      </Suspense>

      <QuickActions />
    </div>
  )
}
