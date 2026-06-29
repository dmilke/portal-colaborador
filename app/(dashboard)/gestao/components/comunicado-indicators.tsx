import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Megaphone, Mail, TrendingUp } from 'lucide-react'
import type { ComunicadoStats } from '@/src/features/gestao/types'

export function ComunicadoIndicators({ data }: { data: ComunicadoStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-rose-500" />
          Comunicados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row icon={Megaphone} label="Publicados" value={data.published} color="text-rose-600" />
        <Row icon={Mail} label="Não lidos" value={data.unread} color="text-amber-600" />
        <div className="flex items-center justify-between pt-1 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            Taxa de leitura
          </div>
          <span className="text-sm font-semibold">{data.readRate}%</span>
        </div>
        {data.topViewed.length > 0 && (
          <div className="pt-1 border-t space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Mais vistos</p>
            {data.topViewed.slice(0, 3).map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="truncate max-w-[150px]">{c.titulo}</span>
                <span className="text-muted-foreground">{c.leitores}</span>
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
