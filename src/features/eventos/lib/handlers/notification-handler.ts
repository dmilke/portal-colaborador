import { createAdminClient } from '@/lib/supabase/admin'
import type { DomainEvent } from '../../types'

export async function createNotificationHandler(event: DomainEvent): Promise<void> {
  const payload = event.payload as Record<string, unknown> | undefined
  if (!payload) return

  const admin = await createAdminClient()

  if (event.type === 'solicitacao.approved' || event.type === 'solicitacao.rejected' || event.type === 'solicitacao.cancelled') {
    const colaboradorId = payload.colaboradorId as string
    const status = payload.status as string
    if (!colaboradorId) return

    await admin.from('notificacoes').insert({
      colaborador_id: colaboradorId,
      titulo: `Solicitação ${status}`,
      mensagem: `Sua solicitação de folga foi ${status}.`,
      tipo: 'solicitacao',
      payload: { solicitacao_id: payload.solicitacaoId },
    })
  }

  if (event.type === 'comunicado.published') {
    const titulo = payload.titulo as string
    const comunicadoId = payload.comunicadoId as string

    const { data: colabs } = await admin
      .from('colaboradores')
      .select('id')
      .is('deleted_at', null)

    if (colabs && colabs.length > 0) {
      const notifications = (colabs as { id: string }[]).map((c) => ({
        colaborador_id: c.id,
        titulo: 'Novo comunicado publicado',
        mensagem: `O comunicado "${titulo}" foi publicado.`,
        tipo: 'comunicado',
        payload: { comunicado_id: comunicadoId },
      }))
      await admin.from('notificacoes').insert(notifications)
    }
  }

  if (event.type === 'documento.published') {
    const titulo = payload.titulo as string
    const documentoId = payload.documentoId as string

    const { data: colabs } = await admin
      .from('colaboradores')
      .select('id')
      .is('deleted_at', null)

    if (colabs && colabs.length > 0) {
      const notifications = (colabs as { id: string }[]).map((c) => ({
        colaborador_id: c.id,
        titulo: 'Novo documento publicado',
        mensagem: `O documento "${titulo}" foi publicado.`,
        tipo: 'documento',
        payload: { documento_id: documentoId },
      }))
      await admin.from('notificacoes').insert(notifications)
    }
  }
}
