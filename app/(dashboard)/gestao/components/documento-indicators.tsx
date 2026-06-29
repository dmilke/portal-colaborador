import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, BookOpen, Download, TrendingUp } from 'lucide-react'
import type { DocumentoStats } from '@/src/features/gestao/types'

export function DocumentoIndicators({ data }: { data: DocumentoStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-500" />
          Documentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row icon={FileText} label="Publicados" value={data.published} color="text-indigo-600" />
        <Row icon={BookOpen} label="Pendentes leitura" value={data.pendingReading} color="text-amber-600" />
        <Row icon={Download} label="Downloads" value={data.downloads} color="text-emerald-600" />
        <div className="flex items-center justify-between pt-1 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            Taxa de leitura
          </div>
          <span className="text-sm font-semibold">{data.readRate}%</span>
        </div>
        {data.mostAccessed.length > 0 && (
          <div className="pt-1 border-t space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Mais acessados</p>
            {data.mostAccessed.slice(0, 3).map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="truncate max-w-[150px]">{d.titulo}</span>
                <span className="text-muted-foreground">{d.leitores}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Row({ icon: Icon, label, value, color }: {
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
