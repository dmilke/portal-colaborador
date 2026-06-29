import { createAdminClient } from '@/lib/supabase/admin'
import type { DomainEvent } from '../../types'

const ACTION_MAP: Record<string, string> = {
  'user.created': 'cadastro',
  'user.activated': 'alteracao',
  'user.deactivated': 'alteracao',
  'user.updated': 'alteracao',
  'login': 'login',
  'logout': 'logout',
  'solicitacao.created': 'solicitacao',
  'solicitacao.approved': 'aprovacao',
  'solicitacao.rejected': 'reprovacao',
  'solicitacao.cancelled': 'cancelamento',
  'comunicado.published': 'cadastro',
  'documento.published': 'cadastro',
}

const ENTITY_MAP: Record<string, string> = {
  'user.created': 'colaborador',
  'user.activated': 'colaborador',
  'user.deactivated': 'colaborador',
  'user.updated': 'colaborador',
  'solicitacao.created': 'solicitacao',
  'solicitacao.approved': 'solicitacao',
  'solicitacao.rejected': 'solicitacao',
  'solicitacao.cancelled': 'solicitacao',
  'comunicado.published': 'comunicado',
  'comunicado.read': 'comunicado',
  'documento.published': 'documento',
  'documento.read': 'documento',
}

export async function createAuditHandler(event: DomainEvent): Promise<void> {
  const admin = await createAdminClient()
  const payload = event.payload as Record<string, unknown> | undefined

  const acao = ACTION_MAP[event.type] ?? 'alteracao'
  const entidadeTipo = ENTITY_MAP[event.type] ?? event.origin
  const entidadeId = payload?.id as string ?? payload?.[`${event.origin}Id`] as string ?? null

  const descricao = buildDescription(event.type, payload)

  await admin.from('auditoria').insert({
    colaborador_id: event.colaboradorId ?? null,
    acao,
    entidade_tipo: entidadeTipo,
    entidade_id: entidadeId,
    descricao,
  })
}

function buildDescription(type: string, payload?: Record<string, unknown>): string {
  const nome = payload?.nome as string ?? ''
  const titulo = payload?.titulo as string ?? ''

  switch (type) {
    case 'user.created': return `Colaborador criado: ${nome}`
    case 'user.activated': return `Colaborador ativado: ${nome}`
    case 'user.deactivated': return `Colaborador desativado: ${nome}`
    case 'user.updated': return `Colaborador atualizado: ${nome}`
    case 'login': return 'Login realizado'
    case 'logout': return 'Logout realizado'
    case 'solicitacao.created': return 'Solicitação de folga criada'
    case 'solicitacao.approved': return 'Solicitação de folga aprovada'
    case 'solicitacao.rejected': return 'Solicitação de folga reprovada'
    case 'solicitacao.cancelled': return 'Solicitação de folga cancelada'
    case 'comunicado.published': return `Comunicado publicado: ${titulo}`
    case 'comunicado.read': return `Comunicado lido: ${titulo}`
    case 'documento.published': return `Documento publicado: ${titulo}`
    case 'documento.read': return `Documento lido: ${titulo}`
    default: return `Evento: ${type}`
  }
}
