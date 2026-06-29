'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ChevronLeft, User, Calendar, Clock, FileText, MessageSquare, CheckCircle2, XCircle, Slash } from 'lucide-react'
import { AdminConfirmDialog } from '@/src/shared/components/admin'
import { SolicitacaoStatusBadge } from '@/src/features/solicitacoes/components/solicitacao-status-badge'
import { SolicitacaoTimeline, type TimelineItem } from '@/src/features/solicitacoes/components/solicitacao-timeline'
import { approveSolicitacaoAction, rejectSolicitacaoAction, cancelSolicitacaoAction } from '@/src/features/solicitacoes/actions/solicitacao-actions'
import { canApprove, canReject, canCancel } from '@/src/features/solicitacoes/validators'
import type { Solicitacao } from '@/src/features/solicitacoes/types'

interface SolicitacaoDetailProps {
  solicitacao: Solicitacao
  timelineItems: TimelineItem[]
  permissions: string[]
  currentColaboradorId: string
}

export function SolicitacaoDetail({ solicitacao, timelineItems, permissions }: SolicitacaoDetailProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'approve' | 'cancel' | null>(null)
  const [rejectMotivo, setRejectMotivo] = useState('')

  const canApprovePerm = permissions.includes('solicitacoes.approve')
  const canRejectPerm = permissions.includes('solicitacoes.reject')
  const canCancelPerm = permissions.includes('solicitacoes.cancel')

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  function formatDateTime(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
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

  async function handleApprove() {
    setLoading(true)
    const result = await approveSolicitacaoAction(solicitacao.id)
    setLoading(false)
    setConfirmAction(null)
    if (result.success) {
      toast.success('Solicitação aprovada com sucesso')
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao aprovar')
    }
  }

  async function handleCancel() {
    setLoading(true)
    const result = await cancelSolicitacaoAction(solicitacao.id)
    setLoading(false)
    setConfirmAction(null)
    if (result.success) {
      toast.success('Solicitação cancelada')
      router.refresh()
    } else {
      toast.error(result.message ?? 'Erro ao cancelar')
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.push('/solicitacoes')}>
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">{solicitacao.tipoFolgaNome ?? 'Solicitação'}</CardTitle>
              <CardDescription>
                Solicitada em {formatDateTime(solicitacao.solicitadoEm)}
              </CardDescription>
            </div>
            <SolicitacaoStatusBadge status={solicitacao.status} />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Colaborador</p>
                    <p className="text-sm font-medium">{solicitacao.colaboradorNome ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data da Folga</p>
                    <p className="text-sm font-medium">{formatDate(solicitacao.dataFolga)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Turno</p>
                    <p className="text-sm font-medium">{solicitacao.turnoNome ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="text-sm font-medium">{solicitacao.tipoFolgaNome ?? '—'}</p>
                  </div>
                </div>
              </div>

              {solicitacao.justificativa && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      Justificativa
                    </p>
                    <p className="text-sm">{solicitacao.justificativa}</p>
                  </div>
                </>
              )}

              {solicitacao.observacaoRh && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      Observação RH
                    </p>
                    <p className="text-sm">{solicitacao.observacaoRh}</p>
                  </div>
                </>
              )}

              {solicitacao.aprovadoEm && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>
                      {solicitacao.status === 'aprovada' ? 'Aprovado' : 'Processado'} em {formatDateTime(solicitacao.aprovadoEm)}
                      {solicitacao.aprovadoPorNome ? ` por ${solicitacao.aprovadoPorNome}` : ''}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {(canApprovePerm && canApprove(solicitacao.status)) && (
            <Button
              className="w-full"
              onClick={() => setConfirmAction('approve')}
              disabled={loading}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Aprovar Solicitação
            </Button>
          )}

          {(canRejectPerm && canReject(solicitacao.status)) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Reprovar Solicitação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  placeholder="Motivo da reprovação..."
                  value={rejectMotivo}
                  onChange={(e) => setRejectMotivo(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-y"
                />
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={loading || !rejectMotivo.trim()}
                  onClick={async () => {
                    setLoading(true)
                    const result = await rejectSolicitacaoAction(solicitacao.id, rejectMotivo)
                    setLoading(false)
                    if (result.success) {
                      toast.success('Solicitação reprovada')
                      router.refresh()
                    } else {
                      toast.error(result.message ?? 'Erro ao reprovar')
                    }
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reprovar
                </Button>
              </CardContent>
            </Card>
          )}

          {(canCancelPerm && canCancel(solicitacao.status)) && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setConfirmAction('cancel')}
              disabled={loading}
            >
              <Slash className="h-4 w-4 mr-2" />
              Cancelar Solicitação
            </Button>
          )}
        </div>
      </div>

      <SolicitacaoTimeline items={timelineItems} status={solicitacao.status} />

      <AdminConfirmDialog
        open={confirmAction === 'approve'}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Aprovar solicitação"
        description={`Confirmar aprovação da solicitação de ${solicitacao.tipoFolgaNome ?? 'folga'} para ${solicitacao.colaboradorNome} em ${formatDate(solicitacao.dataFolga)}?`}
        confirmLabel="Aprovar"
        onConfirm={handleApprove}
      />

      <AdminConfirmDialog
        open={confirmAction === 'cancel'}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Cancelar solicitação"
        description="Tem certeza que deseja cancelar esta solicitação?"
        confirmLabel="Cancelar"
        confirmVariant="destructive"
        onConfirm={handleCancel}
      />
    </div>
  )
}
