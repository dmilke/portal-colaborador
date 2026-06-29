import { redirect } from 'next/navigation'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { initializeEventHandlers } from '@/src/features/eventos'
import { eventLogService } from '@/src/features/eventos'
import { EventLogTable } from '../components/event-log-table'
import { EventLogFilters } from '../components/event-log-filters'
import { EventLogPagination } from '../components/event-log-pagination'
import { ScrollText } from 'lucide-react'

initializeEventHandlers()

interface EventLogPageProps {
  searchParams: Promise<{
    tipo?: string
    status?: string
    page?: string
  }>
}

export default async function EventLogPage({ searchParams }: EventLogPageProps) {
  const colaborador = await getCurrentColaborador()
  if (!colaborador || !colaborador.permissions.includes('eventos.read')) {
    redirect('/')
  }

  const params = await searchParams
  const page = Number(params.page) || 1

  const result = await eventLogService.list({
    eventType: params.tipo,
    status: params.status,
    page,
    pageSize: 20,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ScrollText className="h-6 w-6" />
          Log de Eventos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Histórico completo de eventos do sistema
        </p>
      </div>

      <EventLogFilters currentTipo={params.tipo} currentStatus={params.status} />

      <EventLogTable events={result.data} />

      {result.totalPages > 1 && (
        <EventLogPagination currentPage={result.page} totalPages={result.totalPages} />
      )}
    </div>
  )
}
