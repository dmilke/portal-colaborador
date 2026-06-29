'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Pin,
  Users,
  Eye,
  Calendar,
  Archive,
  Trash2,
  RotateCcw,
} from 'lucide-react'
import { ComunicadoPriorityBadge } from './comunicado-priority-badge'
import { AdminConfirmDialog } from '@/src/shared/components/admin'
import { toast } from 'sonner'
import type { Comunicado } from '../types'
import {
  archiveComunicado,
  restoreComunicado,
  deleteComunicado,
  markComunicadoAsRead,
} from '../actions'

interface Props {
  comunicado: Comunicado
  canUpdate: boolean
  canDelete: boolean
}

export function ComunicadoDetail({ comunicado, canUpdate, canDelete }: Props) {
  const router = useRouter()
  const [confirmAction, setConfirmAction] = useState<{ type: string } | null>(null)

  useEffect(() => {
    if (!comunicado.lido) {
      markComunicadoAsRead(comunicado.id).catch(() => {})
    }
  }, [comunicado.id, comunicado.lido])

  async function handleArchive() {
    const result = await archiveComunicado(comunicado.id)
    setConfirmAction(null)
    if (result?.success) {
      toast.success('Comunicado arquivado')
      router.refresh()
    } else {
      toast.error(result?.message ?? 'Erro ao arquivar')
    }
  }

  async function handleRestore() {
    const result = await restoreComunicado(comunicado.id)
    setConfirmAction(null)
    if (result?.success) {
      toast.success('Comunicado restaurado')
      router.refresh()
    } else {
      toast.error(result?.message ?? 'Erro ao restaurar')
    }
  }

  async function handleDelete() {
    const result = await deleteComunicado(comunicado.id)
    setConfirmAction(null)
    if (result?.success) {
      toast.success('Comunicado excluído')
      router.push('/comunicados')
    } else {
      toast.error(result?.message ?? 'Erro ao excluir')
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/comunicados')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {comunicado.isPinned && (
                  <Pin className="h-5 w-5 text-amber-500" />
                )}
                <CardTitle className="text-2xl">{comunicado.titulo}</CardTitle>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <ComunicadoPriorityBadge prioridade={comunicado.prioridade} />
                {comunicado.categoria && (
                  <Badge variant="outline">{comunicado.categoria}</Badge>
                )}
                {!comunicado.isActive && (
                  <Badge variant="secondary">Arquivado</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {canUpdate && (
                <>
                  {comunicado.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmAction({ type: 'archive' })}
                    >
                      <Archive className="mr-1 h-4 w-4" />
                      Arquivar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmAction({ type: 'restore' })}
                    >
                      <RotateCcw className="mr-1 h-4 w-4" />
                      Restaurar
                    </Button>
                  )}
                </>
              )}
              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmAction({ type: 'delete' })}
                >
                  <Trash2 className="mr-1 h-4 w-4 text-destructive" />
                  Excluir
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(comunicado.createdAt).toLocaleDateString('pt-BR')}
            </div>
            {comunicado.autorNome && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {comunicado.autorNome}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {comunicado.totalLeitores} leitores
            </div>
            {comunicado.lido && (
              <Badge variant="outline" className="text-green-600">
                Lido em {new Date(comunicado.lidoEm!).toLocaleString('pt-BR')}
              </Badge>
            )}
          </div>

          <Separator />

          <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
            {comunicado.conteudo}
          </div>

          {comunicado.audiencias.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                  Público-alvo ({comunicado.audiencias.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {comunicado.audiencias.map((a) => (
                    <Badge key={a.id} variant="secondary">
                      {a.tipo}: {a.alvoNome ?? a.alvoId.slice(0, 8)}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AdminConfirmDialog
        open={confirmAction?.type === 'archive'}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Arquivar comunicado"
        description="O comunicado não será mais exibido na lista ativa, mas poderá ser restaurado."
        confirmLabel="Arquivar"
        onConfirm={handleArchive}
      />

      <AdminConfirmDialog
        open={confirmAction?.type === 'restore'}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Restaurar comunicado"
        description="O comunicado voltará a ser exibido na lista ativa."
        confirmLabel="Restaurar"
        onConfirm={handleRestore}
      />

      <AdminConfirmDialog
        open={confirmAction?.type === 'delete'}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Excluir comunicado"
        description="Esta ação não pode ser desfeita. O comunicado será removido permanentemente."
        confirmLabel="Excluir"
        confirmVariant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
