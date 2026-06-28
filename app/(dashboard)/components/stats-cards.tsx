import { createClient } from '@/lib/supabase/server'
import { createDashboardRepository } from '@/src/features/dashboard/repositories/dashboard-repository'
import { createDashboardService } from '@/src/features/dashboard/services/dashboard-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, Briefcase, MapPin, Clock, AlertCircle, Megaphone, FileText } from 'lucide-react'

const cards = [
  { key: 'totalColaboradores', label: 'Colaboradores', icon: Users, color: 'text-blue-600' },
  { key: 'totalDepartamentos', label: 'Departamentos', icon: Building2, color: 'text-emerald-600' },
  { key: 'totalCargos', label: 'Cargos', icon: Briefcase, color: 'text-purple-600' },
  { key: 'totalUnidades', label: 'Unidades', icon: MapPin, color: 'text-orange-600' },
  { key: 'totalTurnos', label: 'Turnos', icon: Clock, color: 'text-cyan-600' },
  { key: 'solicitacoesPendentes', label: 'Solicitações Pendentes', icon: AlertCircle, color: 'text-amber-600' },
  { key: 'comunicadosAtivos', label: 'Comunicados Ativos', icon: Megaphone, color: 'text-rose-600' },
  { key: 'documentosAtivos', label: 'Documentos Ativos', icon: FileText, color: 'text-indigo-600' },
]

export async function StatsCards() {
  const supabase = await createClient()
  const repository = createDashboardRepository(supabase)
  const service = createDashboardService(repository)
  const { stats } = await service.getDashboardData()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color }) => {
        const value = stats[key as keyof typeof stats]
        return (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
