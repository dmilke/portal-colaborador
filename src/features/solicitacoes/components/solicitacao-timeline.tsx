'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, CheckCircle2, XCircle, Slash, AlertTriangle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SolicitacaoStatus } from '../types'
import { statusLabels } from '../validators'

export interface TimelineItem {
  id: string
  acao: string
  descricao: string | null
  colaboradorNome: string | null
  createdAt: string
}

interface SolicitacaoTimelineProps {
  items: TimelineItem[]
  status: SolicitacaoStatus
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  solicitacao: Clock,
  aprovacao: CheckCircle2,
  reprovacao: XCircle,
  cancelamento: Slash,
}

function DefaultIcon() {
  return <AlertTriangle className="h-4 w-4" />
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export function SolicitacaoTimeline({ items, status }: SolicitacaoTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Histórico
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum registro de atividade
          </p>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="space-y-0">
              {items.map((item, index) => {
                const Icon = iconMap[item.acao] ?? DefaultIcon
                const isLast = index === items.length - 1

                return (
                  <div key={item.id} className="relative flex gap-4 pb-6">
                    {!isLast && (
                      <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
                    )}
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        item.acao === 'aprovacao' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
                        item.acao === 'reprovacao' && 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
                        item.acao === 'cancelamento' && 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400',
                        item.acao === 'solicitacao' && 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                        !['aprovacao', 'reprovacao', 'cancelamento', 'solicitacao'].includes(item.acao) &&
                          'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-medium">{item.descricao ?? item.acao}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        {item.colaboradorNome && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.colaboradorNome}
                          </span>
                        )}
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status atual:</span>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                status === 'pendente' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                status === 'aprovada' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                status === 'reprovada' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                status === 'cancelada' && 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
                status === 'expirada' && 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
              )}
            >
              {statusLabels[status]}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
