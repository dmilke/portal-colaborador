import { createClient } from '@/lib/supabase/server'
import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SolicitacaoRow {
  id: string
  data_folga: string
  status: string
  created_at: string
  tipo_folga: { nome: string } | null
  colaborador: { nome: string } | null
}

export async function PendingLeaveRequestsWidget() {
  const colaborador = await getCurrentColaborador()
  if (!colaborador) return null

  const supabase = await createClient()

  const { data } = await supabase
    .from('solicitacoes')
    .select(`
      id,
      data_folga,
      status,
      created_at,
      tipo_folga:tipos_folga!tipo_folga_id(nome),
      colaborador:colaboradores!colaborador_id(nome)
    `)
    .eq('status', 'pendente')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(5)

  const solicitacoes = (data ?? []) as unknown as SolicitacaoRow[]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          Solicitações Pendentes
        </CardTitle>
        <Link
          href="/solicitacoes"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver todas
        </Link>
      </CardHeader>
      <CardContent>
        {solicitacoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma solicitação pendente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {solicitacoes.map((s) => (
              <Link
                key={s.id}
                href={`/solicitacoes/${s.id}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {s.tipo_folga?.nome ?? 'Folga'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.colaborador?.nome ?? 'Colaborador'} · {formatDate(s.data_folga)}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0 ml-2 border-amber-500/50 text-amber-600 dark:text-amber-400">
                  Pendente
                </Badge>
              </Link>
            ))}
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
    return dateStr
  }
}
