import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX, LogIn, UserMinus } from 'lucide-react'
import type { CollaboratorStats } from '@/src/features/gestao/types'

export function CollaboratorIndicators({ data }: { data: CollaboratorStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          Colaboradores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <IndicatorRow icon={Users} label="Total" value={data.total} color="text-blue-600" />
        <IndicatorRow icon={UserCheck} label="Ativos" value={data.active} color="text-emerald-600" />
        <IndicatorRow icon={UserX} label="Inativos" value={data.inactive} color="text-red-600" />
        <IndicatorRow icon={LogIn} label="Último login (24h)" value={data.lastLogin} color="text-violet-600" />
        <IndicatorRow icon={UserMinus} label="Nunca logaram" value={data.neverLogged} color="text-amber-600" />
      </CardContent>
    </Card>
  )
}

function IndicatorRow({ icon: Icon, label, value, color }: {
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
