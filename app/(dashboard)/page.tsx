import { Suspense } from 'react'
import { ProfileSummaryWidget } from './components/profile-summary-widget'
import { ProfileWidgetSkeleton } from './components/profile-widget-skeleton'
import { PendingLeaveRequestsWidget } from './components/pending-leave-requests-widget'
import { UnreadCommunicationsWidget } from './components/unread-communications-widget'
import { DocumentsPendingReadingWidget } from './components/documents-pending-reading-widget'
import { RecentlyPublishedDocumentsWidget } from './components/recently-published-documents-widget'
import { RecentNotificationsWidget } from './components/recent-notifications-widget'
import { RecentActivityWidget } from './components/recent-activity-widget'
import { QuickActionsWidget } from './components/quick-actions-widget'
import { QuickActionsSkeleton } from './components/quick-actions-skeleton'
import { WidgetSkeleton } from './components/widget-skeleton'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meu Workspace</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bem-vindo ao seu painel personalizado
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Suspense fallback={<ProfileWidgetSkeleton />}>
            <ProfileSummaryWidget />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<QuickActionsSkeleton />}>
            <QuickActionsWidget />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<WidgetSkeleton />}>
          <PendingLeaveRequestsWidget />
        </Suspense>
        <Suspense fallback={<WidgetSkeleton />}>
          <UnreadCommunicationsWidget />
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<WidgetSkeleton />}>
          <DocumentsPendingReadingWidget />
        </Suspense>
        <Suspense fallback={<WidgetSkeleton />}>
          <RecentlyPublishedDocumentsWidget />
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<WidgetSkeleton />}>
          <RecentNotificationsWidget />
        </Suspense>
        <Suspense fallback={<WidgetSkeleton />}>
          <RecentActivityWidget />
        </Suspense>
      </div>
    </div>
  )
}
