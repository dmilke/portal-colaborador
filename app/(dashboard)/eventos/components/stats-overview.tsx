import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'

interface StatsOverviewProps {
  stats: {
    totalProcessed: number
    totalFailed: number
    last24h: number
  }
}

const cards = [
  { key: 'totalProcessed' as const, label: 'Eventos processados', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { key: 'totalFailed' as const, label: 'Eventos com falha', icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
  { key: 'last24h' as const, label: 'Últimas 24h', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-500/10' },
]

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, color, bg }) => (
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
            <div className="text-2xl font-bold">{stats[key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
