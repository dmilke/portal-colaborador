import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, BellOff, BellRing, Tag } from 'lucide-react'
import type { NotificacaoStats } from '@/src/features/gestao/types'

export function NotificacaoIndicators({ data }: { data: NotificacaoStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-4 w-4 text-violet-500" />
          Notificações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row icon={BellOff} label="Não lidas" value={data.unread} color="text-amber-600" />
        <Row icon={BellRing} label="Lidas" value={data.read} color="text-emerald-600" />
        {data.byType.length > 0 && (
          <div className="pt-1 border-t space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Por tipo</p>
            {data.byType.slice(0, 4).map((t, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  <span>{t.tipo}</span>
                </div>
                <span className="text-muted-foreground">{t.count}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Row({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        {label}
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}
