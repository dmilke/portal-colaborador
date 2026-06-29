import { redirect } from 'next/navigation'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { initializeEventHandlers } from '@/src/features/eventos'
import { eventLogService } from '@/src/features/eventos'
import { StatsOverview } from './components/stats-overview'
import { RecentEvents } from './components/recent-events'
import { EventTypeBreakdown } from './components/event-type-breakdown'
import { EventLogLink } from './components/event-log-link'

initializeEventHandlers()

export default async function EventosPage() {
  const colaborador = await getCurrentColaborador()
  if (!colaborador || !colaborador.permissions.includes('eventos.read')) {
    redirect('/')
  }

  const stats = await eventLogService.getStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Painel de Eventos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Motor de automação e observabilidade do sistema
          </p>
        </div>
        <EventLogLink />
      </div>

      <StatsOverview stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <EventTypeBreakdown byType={stats.byType} />
        <RecentEvents events={stats.recent} />
      </div>
    </div>
  )
}
