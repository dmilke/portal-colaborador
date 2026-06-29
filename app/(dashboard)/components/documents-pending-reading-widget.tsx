import { getCurrentColaborador } from '@/src/shared/lib/auth'
import { DocumentoService } from '@/src/features/documentos/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileWarning } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const documentoService = new DocumentoService()

export async function DocumentsPendingReadingWidget() {
  const colaborador = await getCurrentColaborador()
  if (!colaborador) return null

  const { data } = await documentoService.list({
    status: 'publicado',
    pageSize: 10,
    sortBy: 'publicacao_em',
    sortOrder: 'desc',
  })

  const pendingDocs = data.filter((d) => !d.lido)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <FileWarning className="h-4 w-4 text-indigo-500" />
          Documentos Pendentes
          {pendingDocs.length > 0 && (
            <Badge variant="secondary" className="text-xs ml-1">
              {pendingDocs.length}
            </Badge>
          )}
        </CardTitle>
        <Link
          href="/documentos"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver todos
        </Link>
      </CardHeader>
      <CardContent>
        {pendingDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Todos os documentos foram lidos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingDocs.slice(0, 5).map((d) => (
              <Link
                key={d.id}
                href={`/documentos/${d.id}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{d.titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.tipo} · {formatDate(d.publicacaoEm ?? d.createdAt)}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                  Não lido
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
