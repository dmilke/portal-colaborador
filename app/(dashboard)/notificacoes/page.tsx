import { notificacaoService } from '@/src/features/notificacoes/services/notificacao-service'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MarkAllAsReadButton } from '../components/mark-all-as-read-button'
import { MarkAsReadButton } from './components/mark-as-read-button'
import { NotificationFilters } from './components/notification-filters'
import { NotificationPagination } from './components/notification-pagination'
import type { Notificacao } from '@/src/features/notificacoes/types'

interface NotificacoesPageProps {
  searchParams: Promise<{
    lida?: string
    tipo?: string
    page?: string
  }>
}

export default async function NotificacoesPage({ searchParams }: NotificacoesPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const lida = params.lida === 'true' ? true : params.lida === 'false' ? false : undefined
  const tipo = params.tipo || undefined

  const [result, unreadCount] = await Promise.all([
    notificacaoService.list({ lida, tipo, page, pageSize: 10 }),
    notificacaoService.getUnreadCount(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Central de Notificações
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-sm ml-2">
                {unreadCount} não lidas
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie suas notificações
          </p>
        </div>
        {unreadCount > 0 && <MarkAllAsReadButton />}
      </div>

      <NotificationFilters currentLida={params.lida} currentTipo={params.tipo} />

      <Card>
        <CardContent className="p-0">
          {result.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="divide-y">
              {result.data.map((n: Notificacao) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-4 transition-colors ${!n.lida ? 'bg-muted/30' : ''}`}
                >
                  <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${!n.lida ? 'bg-violet-500' : 'bg-transparent'}`} />
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{n.titulo}</p>
                      {n.tipo && (
                        <Badge variant="outline" className="text-xs">
                          {n.tipo}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.mensagem}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(n.createdAt)}
                    </p>
                  </div>
                  {!n.lida && (
                    <MarkAsReadButton id={n.id} />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {result.totalPages > 1 && (
        <NotificationPagination
          currentPage={result.page}
          totalPages={result.totalPages}
        />
      )}
    </div>
  )
}

function formatDate(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ptBR })
  } catch {
    return dateStr
  }
}
