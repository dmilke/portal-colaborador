import type { SupabaseClient } from '@supabase/supabase-js'
import type { SolicitacaoRepository } from '../repositories/solicitacao-repository'
import type { Solicitacao, CreateSolicitacaoInput, UpdateSolicitacaoInput, SolicitacaoListParams, SolicitacaoListResult, TipoFolga, Turno, DataBloqueada } from '../types'
import { isValidTransition } from '../validators'
import { dispatch, emit, initializeEventHandlers } from '@/src/features/eventos'

initializeEventHandlers()

export interface SolicitacaoService {
  list(params?: SolicitacaoListParams): Promise<SolicitacaoListResult>
  listAll(): Promise<Solicitacao[]>
  getById(id: string): Promise<Solicitacao | null>
  create(input: CreateSolicitacaoInput, createdBy: string, colsUuid: string): Promise<Solicitacao>
  update(id: string, input: UpdateSolicitacaoInput, updatedBy: string): Promise<Solicitacao>
  approve(id: string, approvedBy: string, colsUuid: string): Promise<void>
  reject(id: string, rejectedBy: string, motivo: string, colsUuid: string): Promise<void>
  cancel(id: string, cancelledBy: string, motivo: string | null, colsUuid: string): Promise<void>
  softDelete(id: string, updatedBy: string): Promise<void>
  listTiposFolga(): Promise<TipoFolga[]>
  listTurnos(departamentoId?: string): Promise<Turno[]>
  listDatasBloqueadas(dataInicio?: string, dataFim?: string): Promise<DataBloqueada[]>
  verificarDisponibilidadeVaga(dataFolga: string): Promise<boolean>
  verificarLimiteSimultaneas(colaboradorId: string): Promise<boolean>
}

async function createAuditRecord(
  supabaseAdmin: SupabaseClient,
  colaboradorId: string,
  acao: string,
  entidadeTipo: string,
  entidadeId: string,
  descricao: string,
  valorAnterior?: Record<string, unknown> | null,
  valorNovo?: Record<string, unknown> | null,
): Promise<void> {
  await supabaseAdmin.from('auditoria').insert({
    colaborador_id: colaboradorId,
    acao,
    entidade_tipo: entidadeTipo,
    entidade_id: entidadeId,
    descricao,
    valor_anterior: valorAnterior ?? null,
    valor_novo: valorNovo ?? null,
  })
}

async function createNotification(
  supabaseAdmin: SupabaseClient,
  colaboradorId: string,
  solicitacaoId: string,
  titulo: string,
  mensagem: string,
  tipo?: string,
): Promise<void> {
  await supabaseAdmin.from('notificacoes').insert({
    colaborador_id: colaboradorId,
    solicitacao_id: solicitacaoId,
    titulo,
    mensagem,
    tipo: tipo ?? 'solicitacao',
  })
}

export function createSolicitacaoService(
  repository: SolicitacaoRepository,
  supabaseAdmin: SupabaseClient,
): SolicitacaoService {
  return {
    async list(params) {
      return repository.list(params)
    },

    async listAll() {
      return repository.listAll()
    },

    async getById(id) {
      return repository.getById(id)
    },

    async create(input, createdBy, colsUuid) {
      const workflowDef = await repository.getWorkflowDefinition('solicitacao')
      let workflowStepId: string | null = null

      if (workflowDef) {
        const pendenteStep = await repository.getWorkflowStepByNome(workflowDef.id, 'pendente')
        if (pendenteStep) {
          workflowStepId = pendenteStep.id
        }
      }

      const solicitacao = await repository.create(
        {
          ...input,
          workflowDefinitionId: workflowDef?.id ?? null,
          workflowStepId,
        },
        colsUuid,
      )

      await createNotification(
        supabaseAdmin,
        input.colaboradorId,
        solicitacao.id,
        'Solicitação enviada',
        'Sua solicitação de folga foi enviada com sucesso e aguarda aprovação.',
        'solicitacao_criada',
      )

      await createAuditRecord(
        supabaseAdmin,
        colsUuid,
        'solicitacao',
        'solicitacao',
        solicitacao.id,
        `Solicitação de folga criada`,
      )

      await dispatch(emit('solicitacao.created', 'solicitacoes', {
        id: solicitacao.id,
        colaboradorId: input.colaboradorId,
        status: 'pendente',
        dataFolga: input.dataFolga,
      }, colsUuid))

      return solicitacao
    },

    async update(id, input, updatedBy) {
      const existing = await repository.getById(id)
      if (!existing) throw new Error('Solicitação não encontrada')

      if (existing.status !== 'pendente') {
        throw new Error('Apenas solicitações pendentes podem ser editadas')
      }

      return repository.update(id, input, updatedBy)
    },

    async approve(id, approvedBy, colsUuid) {
      const solicitacao = await repository.getById(id)
      if (!solicitacao) throw new Error('Solicitação não encontrada')

      if (!isValidTransition(solicitacao.status, 'aprovada')) {
        throw new Error(`Não é possível aprovar uma solicitação com status "${solicitacao.status}"`)
      }

      await repository.updateStatus(id, 'aprovada', approvedBy, colsUuid)

      await createNotification(
        supabaseAdmin,
        solicitacao.colaboradorId,
        id,
        'Solicitação aprovada',
        `Sua solicitação de folga para ${solicitacao.dataFolga} foi aprovada.`,
        'solicitacao_aprovada',
      )

      await createAuditRecord(
        supabaseAdmin,
        colsUuid,
        'aprovacao',
        'solicitacao',
        id,
        `Solicitação de folga aprovada`,
        { status: solicitacao.status } as Record<string, unknown>,
        { status: 'aprovada' } as Record<string, unknown>,
      )

      await dispatch(emit('solicitacao.approved', 'solicitacoes', {
        id,
        colaboradorId: solicitacao.colaboradorId,
        status: 'aprovada',
        dataFolga: solicitacao.dataFolga,
      }, colsUuid))
    },

    async reject(id, rejectedBy, motivo, colsUuid) {
      const solicitacao = await repository.getById(id)
      if (!solicitacao) throw new Error('Solicitação não encontrada')

      if (!isValidTransition(solicitacao.status, 'reprovada')) {
        throw new Error(`Não é possível reprovar uma solicitação com status "${solicitacao.status}"`)
      }

      await repository.updateStatus(id, 'reprovada', rejectedBy, colsUuid)

      await createNotification(
        supabaseAdmin,
        solicitacao.colaboradorId,
        id,
        'Solicitação reprovada',
        `Sua solicitação de folga para ${solicitacao.dataFolga} foi reprovada.${motivo ? ` Motivo: ${motivo}` : ''}`,
        'solicitacao_reprovada',
      )

      await createAuditRecord(
        supabaseAdmin,
        colsUuid,
        'reprovacao',
        'solicitacao',
        id,
        `Solicitação de folga reprovada: ${motivo}`,
        { status: solicitacao.status } as Record<string, unknown>,
        { status: 'reprovada', motivo } as Record<string, unknown>,
      )

      await dispatch(emit('solicitacao.rejected', 'solicitacoes', {
        id,
        colaboradorId: solicitacao.colaboradorId,
        status: 'reprovada',
        dataFolga: solicitacao.dataFolga,
      }, colsUuid))
    },

    async cancel(id, cancelledBy, motivo, colsUuid) {
      const solicitacao = await repository.getById(id)
      if (!solicitacao) throw new Error('Solicitação não encontrada')

      if (!isValidTransition(solicitacao.status, 'cancelada')) {
        throw new Error(`Não é possível cancelar uma solicitação com status "${solicitacao.status}"`)
      }

      await repository.updateStatus(id, 'cancelada', undefined, colsUuid)

      await createNotification(
        supabaseAdmin,
        solicitacao.colaboradorId,
        id,
        'Solicitação cancelada',
        `Sua solicitação de folga para ${solicitacao.dataFolga} foi cancelada.${motivo ? ` Motivo: ${motivo}` : ''}`,
        'solicitacao_cancelada',
      )

      await createAuditRecord(
        supabaseAdmin,
        colsUuid,
        'cancelamento',
        'solicitacao',
        id,
        `Solicitação de folga cancelada${motivo ? `: ${motivo}` : ''}`,
        { status: solicitacao.status } as Record<string, unknown>,
        { status: 'cancelada', motivo } as Record<string, unknown>,
      )

      await dispatch(emit('solicitacao.cancelled', 'solicitacoes', {
        id,
        colaboradorId: solicitacao.colaboradorId,
        status: 'cancelada',
        dataFolga: solicitacao.dataFolga,
      }, colsUuid))
    },

    async softDelete(id, updatedBy) {
      await repository.softDelete(id, updatedBy)
    },

    async listTiposFolga() {
      return repository.listTiposFolga()
    },

    async listTurnos(departamentoId) {
      return repository.listTurnos(departamentoId)
    },

    async listDatasBloqueadas(dataInicio, dataFim) {
      return repository.listDatasBloqueadas(dataInicio, dataFim)
    },

    async verificarDisponibilidadeVaga(dataFolga: string) {
      const solicitacaoRepo = repository as SolicitacaoRepository & { countByData: (status: string, data: string) => Promise<number> }
      const count = await solicitacaoRepo.countByData('aprovada', dataFolga) +
        await solicitacaoRepo.countByData('pendente', dataFolga)
      return count === 0
    },

    async verificarLimiteSimultaneas(colaboradorId) {
      const { data } = await (supabaseAdmin
        .from('solicitacoes')
        .select('id', { count: 'exact', head: true }) as unknown as Promise<{ count: number | null }>)
        .then(() => repository.list({ colaboradorId, status: 'pendente', pageSize: 100 }))

      return data.length < 3
    },
  }
}
