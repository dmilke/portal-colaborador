import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { History, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ActivityRow {
  id: string
  acao: string
  entidade_tipo: string
  descricao: string | null
  created_at: string
  colaborador: { nome: string }[] | { nome: string } | null
}

export async function RecentActivityWidget() {
  const colaborador = await getCurrentColaborador()
  if (!colaborador) return null

  const supabase = await createClient()

  const { data } = await supabase
    .from('auditoria')
    .select(`
      id,
      acao,
      entidade_tipo,
      descricao,
      created_at,
      colaborador:colaboradores!auditoria_colaborador_id_fkey ( nome )
    `)
    .order('created_at', { ascending: false })
    .limit(8)

  const activities = (data ?? []) as unknown as ActivityRow[]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <History className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((item) => {
              const nome = Array.isArray(item.colaborador)
                ? item.colaborador[0]?.nome ?? null
                : (item.colaborador as { nome: string } | null)?.nome ?? null

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.acao.replace(/_/g, ' ')}
                      </Badge>
                      {item.entidade_tipo && (
                        <span className="text-xs text-muted-foreground">
                          {item.entidade_tipo}
                        </span>
                      )}
                    </div>
                    <p className="text-sm truncate">
                      {item.descricao ?? 'Sem descrição'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{nome ?? 'Sistema'}</span>
                      <span>·</span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatDate(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ptBR })
  } catch {
    return 'Data inválida'
  }
}
