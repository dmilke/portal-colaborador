import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { EventLogEntry } from '@/src/features/eventos/types'

export function EventLogTable({ events }: { events: EventLogEntry[] }) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">Nenhum evento encontrado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-muted-foreground">Evento</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Origem</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Tempo</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3">
                    <Badge variant="secondary" className="text-xs">{e.eventType}</Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{e.origin}</td>
                  <td className="p-3">
                    <Badge variant={e.status === 'processed' ? 'default' : 'destructive'} className="text-xs">
                      {e.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {e.executionMs !== null ? `${e.executionMs}ms` : '—'}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {formatRelative(e.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
