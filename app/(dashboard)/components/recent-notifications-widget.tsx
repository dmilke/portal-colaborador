import { notificacaoService } from '@/src/features/notificacoes/services/notificacao-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MarkAllAsReadButton } from './mark-all-as-read-button'

export async function RecentNotificationsWidget() {
  const [notifications, unreadCount] = await Promise.all([
    notificacaoService.getRecent(5),
    notificacaoService.getUnreadCount(),
  ])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-4 w-4 text-violet-500" />
          Notificações Recentes
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs ml-1">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && <MarkAllAsReadButton />}
          <Link
            href="/notificacoes"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todas
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${!n.lida ? 'bg-muted/30' : ''}`}
              >
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${!n.lida ? 'bg-violet-500' : 'bg-transparent'}`} />
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{n.titulo}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.mensagem}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(n.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatDate(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ptBR })
  } catch {
    return dateStr
  }
}
