import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { ComunicadoService } from '@/src/features/comunicados/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Megaphone, Mail, Pin } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const comunicadoService = new ComunicadoService()

export async function UnreadCommunicationsWidget() {
  const colaborador = await getCurrentColaborador()
  if (!colaborador) return null

  const { data } = await comunicadoService.list({
    status: 'active',
    pageSize: 5,
    sortBy: 'created_at',
    sortOrder: 'desc',
  })

  const unread = data.filter((c) => !c.lido)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-rose-500" />
          Comunicados Não Lidos
          {unread.length > 0 && (
            <Badge variant="secondary" className="text-xs ml-1">
              {unread.length}
            </Badge>
          )}
        </CardTitle>
        <Link
          href="/comunicados"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver todos
        </Link>
      </CardHeader>
      <CardContent>
        {unread.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Mail className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Todos os comunicados foram lidos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unread.map((c) => (
              <Link
                key={c.id}
                href={`/comunicados/${c.id}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {c.isPinned && <Pin className="h-3 w-3 text-amber-500 shrink-0" />}
                    <p className="text-sm font-medium truncate">{c.titulo}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {c.autorNome ?? 'Autor'} · {formatDate(c.publicacaoEm ?? c.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {c.prioridade !== 'normal' && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${getPriorityColor(c.prioridade)}`}
                    >
                      {c.prioridade}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    Não lido
                  </Badge>
                </div>
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

function getPriorityColor(prioridade: string): string {
  switch (prioridade) {
    case 'alta':
      return 'border-red-500/50 text-red-600 dark:text-red-400'
    case 'media':
      return 'border-orange-500/50 text-orange-600 dark:text-orange-400'
    case 'baixa':
      return 'border-blue-500/50 text-blue-600 dark:text-blue-400'
    default:
      return ''
  }
}
