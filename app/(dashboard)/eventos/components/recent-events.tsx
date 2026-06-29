import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { EventLogEntry } from '@/src/features/eventos/types'

export function RecentEvents({ events }: { events: EventLogEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Últimos Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum evento registrado</p>
        ) : (
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{e.eventType}</Badge>
                    <Badge variant={e.status === 'processed' ? 'default' : 'destructive'} className="text-xs">
                      {e.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{e.origin}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {formatRelative(e.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatRelative(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ptBR })
  } catch {
    return dateStr
  }
}
