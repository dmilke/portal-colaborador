import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, CheckCircle2, XCircle, Clock, Timer } from 'lucide-react'
import type { SolicitacaoStats } from '@/src/features/gestao/types'

export function SolicitacaoIndicators({ data }: { data: SolicitacaoStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-amber-500" />
          Solicitações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row icon={Clock} label="Pendentes" value={data.pending} color="text-amber-600" />
        <Row icon={CheckCircle2} label="Aprovadas" value={data.approved} color="text-emerald-600" />
        <Row icon={XCircle} label="Reprovadas" value={data.rejected} color="text-red-600" />
        <Row icon={Clock} label="Canceladas" value={data.cancelled} color="text-muted-foreground" />
        <div className="flex items-center justify-between pt-1 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="h-3.5 w-3.5 text-blue-600" />
            Tempo médio aprovação
          </div>
          <span className="text-sm font-semibold">
            {data.avgApprovalHours !== null ? `${data.avgApprovalHours}h` : '—'}
          </span>
        </div>
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
