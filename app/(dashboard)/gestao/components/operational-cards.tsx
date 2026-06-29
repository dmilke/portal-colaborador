import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock, FileWarning, Megaphone, ClipboardList } from 'lucide-react'
import type { OperationalIndicators } from '@/src/features/gestao/types'

const indicators = [
  { key: 'usersOnline' as const, label: 'Usuários online (24h)', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { key: 'pendingActions' as const, label: 'Ações pendentes', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  { key: 'expiredDocuments' as const, label: 'Documentos expirados', icon: FileWarning, color: 'text-red-600', bg: 'bg-red-500/10' },
  { key: 'expiredCommunications' as const, label: 'Comunicados expirados', icon: Megaphone, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  { key: 'requestsAwaitingApproval' as const, label: 'Solicitações aguardando', icon: ClipboardList, color: 'text-violet-600', bg: 'bg-violet-500/10' },
]

export function OperationalCards({ data }: { data: OperationalIndicators }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {indicators.map(({ key, label, icon: Icon, color, bg }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <div className={`rounded-lg p-1.5 ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data[key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
