import { DocumentoService } from '@/src/features/documentos/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const documentoService = new DocumentoService()

export async function RecentlyPublishedDocumentsWidget() {
  const { data } = await documentoService.list({
    status: 'publicado',
    pageSize: 5,
    sortBy: 'publicacao_em',
    sortOrder: 'desc',
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-teal-500" />
          Documentos Recentes
        </CardTitle>
        <Link
          href="/documentos"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver todos
        </Link>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum documento publicado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((d) => (
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
                <Badge
                  variant="outline"
                  className={`text-xs shrink-0 ml-2 ${d.lido ? 'border-emerald-500/50 text-emerald-600 dark:text-emerald-400' : ''}`}
                >
                  {d.lido ? 'Lido' : 'Novo'}
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
