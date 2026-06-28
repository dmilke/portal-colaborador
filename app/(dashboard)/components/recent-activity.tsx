import { createClient } from '@/lib/supabase/server'
import { createDashboardRepository } from '@/src/features/dashboard/repositories/dashboard-repository'
import { createDashboardService } from '@/src/features/dashboard/services/dashboard-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { History, User } from 'lucide-react'

export async function RecentActivity() {
  const supabase = await createClient()
  const repository = createDashboardRepository(supabase)
  const service = createDashboardService(repository)
  const { recentActivities } = await service.getDashboardData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.acao.replace(/_/g, ' ')}
                    </Badge>
                    {item.entidadeTipo && (
                      <span className="text-xs text-muted-foreground">
                        {item.entidadeTipo}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">
                    {item.descricao ?? 'Sem descrição'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.colaboradorNome ?? 'Sistema'}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatRelativeTime(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ptBR })
  } catch {
    return 'Data inválida'
  }
}
