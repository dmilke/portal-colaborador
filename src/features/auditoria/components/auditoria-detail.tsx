import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Auditoria } from '../types'

interface AuditoriaDetailProps {
  item: Auditoria
}

function acaoBadge(acao: string) {
  const colors: Record<string, string> = {
    login: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    cadastro: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    alteracao: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    solicitacao: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    aprovacao: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    reprovacao: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelamento: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    alteracao_equipe: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    alteracao_configuracoes: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  }
  return colors[acao] ?? 'bg-gray-100 text-gray-800'
}

function JsonDisplay({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined) return null
  const formatted = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
  return (
    <div className="space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all">
        {formatted}
      </pre>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? '---'}</span>
    </div>
  )
}

export function AuditoriaDetail({ item }: AuditoriaDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Auditoria</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoRow
            label="Data/Hora"
            value={new Date(item.createdAt).toLocaleString('pt-BR')}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Acao</span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit ${acaoBadge(item.acao)}`}>
              {item.acao.replace(/_/g, ' ')}
            </span>
          </div>
          <InfoRow label="Colaborador" value={item.colaboradorNome ?? 'Sistema'} />
          <InfoRow label="Tipo de Entidade" value={item.entidadeTipo} />
          <InfoRow label="ID da Entidade" value={item.entidadeId} />
          <InfoRow label="Descricao" value={item.descricao} />
          <InfoRow label="IP" value={item.ipAddress} />
          <InfoRow label="User Agent" value={item.userAgent} />
        </CardContent>
      </Card>

      {(item.valorAnterior !== null || item.valorNovo !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>Valores</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <JsonDisplay label="Valor Anterior" value={item.valorAnterior} />
            <JsonDisplay label="Valor Novo" value={item.valorNovo} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
