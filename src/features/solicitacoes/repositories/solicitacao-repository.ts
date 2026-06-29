import type { SupabaseClient } from '@supabase/supabase-js'
import type { Solicitacao, CreateSolicitacaoInput, UpdateSolicitacaoInput, SolicitacaoListParams, SolicitacaoListResult, TipoFolga, Turno, DataBloqueada, WorkflowStep, WorkflowDefinition } from '../types'

type RawSolicitacao = {
  id: string
  colaborador_id: string
  tipo_folga_id: string
  workflow_definition_id: string | null
  workflow_step_id: string | null
  data_folga: string
  turno_id: string
  status: string
  justificativa: string | null
  observacao_rh: string | null
  solicitado_em: string
  aprovado_em: string | null
  aprovado_por: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  colaboradores?: { nome: string }[] | { nome: string } | null
  tipos_folga?: { nome: string; requer_aprovacao: boolean }[] | { nome: string; requer_aprovacao: boolean } | null
  turnos?: { nome: string }[] | { nome: string } | null
  aprovador?: { nome: string }[] | { nome: string } | null
}

function extractVal<T>(val: T[] | T | null): T | null {
  if (!val) return null
  if (Array.isArray(val)) return val[0] ?? null
  return val
}

function mapRow(raw: RawSolicitacao): Solicitacao {
  const colab = extractVal(raw.colaboradores)
  const tipo = extractVal(raw.tipos_folga)
  const turno = extractVal(raw.turnos)
  const aprov = extractVal(raw.aprovador)
  return {
    id: raw.id,
    colaboradorId: raw.colaborador_id,
    colaboradorNome: colab?.nome ?? null,
    tipoFolgaId: raw.tipo_folga_id,
    tipoFolgaNome: tipo?.nome ?? null,
    tipoFolgaRequerAprovacao: tipo?.requer_aprovacao ?? true,
    workflowDefinitionId: raw.workflow_definition_id,
    workflowStepId: raw.workflow_step_id,
    dataFolga: raw.data_folga,
    turnoId: raw.turno_id,
    turnoNome: turno?.nome ?? null,
    status: raw.status as Solicitacao['status'],
    justificativa: raw.justificativa,
    observacaoRh: raw.observacao_rh,
    solicitadoEm: raw.solicitado_em,
    aprovadoEm: raw.aprovado_em,
    aprovadoPor: raw.aprovado_por,
    aprovadoPorNome: aprov?.nome ?? null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    createdBy: raw.created_by,
    updatedBy: raw.updated_by,
    deletedAt: raw.deleted_at,
  }
}

const BASE_SELECT = `
  id,
  colaborador_id,
  tipo_folga_id,
  workflow_definition_id,
  workflow_step_id,
  data_folga,
  turno_id,
  status,
  justificativa,
  observacao_rh,
  solicitado_em,
  aprovado_em,
  aprovado_por,
  created_at,
  updated_at,
  created_by,
  updated_by,
  deleted_at,
  colaboradores!fk_solicitacoes_colaborador ( nome ),
  tipos_folga!fk_solicitacoes_tipo_folga ( nome, requer_aprovacao ),
  turnos ( nome ),
  aprovador:colaboradores!fk_solicitacoes_aprovado_por ( nome )
`

export interface SolicitacaoRepository {
  list(params?: SolicitacaoListParams): Promise<SolicitacaoListResult>
  listAll(): Promise<Solicitacao[]>
  getById(id: string): Promise<Solicitacao | null>
  create(input: CreateSolicitacaoInput, createdBy: string): Promise<Solicitacao>
  update(id: string, input: UpdateSolicitacaoInput, updatedBy: string): Promise<Solicitacao>
  updateStatus(id: string, status: string, aprovadoPor?: string, updatedBy?: string): Promise<void>
  softDelete(id: string, updatedBy: string): Promise<void>
  listTiposFolga(): Promise<TipoFolga[]>
  listTurnos(departamentoId?: string): Promise<Turno[]>
  listDatasBloqueadas(dataInicio?: string, dataFim?: string): Promise<DataBloqueada[]>
  getWorkflowDefinition(entidadeTipo: string): Promise<WorkflowDefinition | null>
  getWorkflowSteps(workflowDefinitionId: string): Promise<WorkflowStep[]>
  getWorkflowStepByNome(workflowDefinitionId: string, nome: string): Promise<WorkflowStep | null>
  countByData(status: string, data: string): Promise<number>
}

export function createSolicitacaoRepository(supabase: SupabaseClient): SolicitacaoRepository {
  return {
    async list(params = {}): Promise<SolicitacaoListResult> {
      const {
        search,
        status,
        dataInicio,
        dataFim,
        colaboradorId,
        tipoFolgaId,
        page = 1,
        pageSize = 10,
        sortBy = 'solicitado_em',
        sortOrder = 'desc',
      } = params

      let query = supabase.from('solicitacoes').select(BASE_SELECT, { count: 'exact' }).is('deleted_at', null)

      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(`colaboradores.nome.ilike.%${search}%,tipos_folga.nome.ilike.%${search}%`)
      }

      if (dataInicio) {
        query = query.gte('data_folga', dataInicio)
      }

      if (dataFim) {
        query = query.lte('data_folga', dataFim)
      }

      if (colaboradorId) {
        query = query.eq('colaborador_id', colaboradorId)
      }

      if (tipoFolgaId) {
        query = query.eq('tipo_folga_id', tipoFolgaId)
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to)

      const { data, count } = await query

      return {
        data: ((data ?? []) as unknown as RawSolicitacao[]).map(mapRow),
        total: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      }
    },

    async listAll() {
      const { data } = await supabase
        .from('solicitacoes')
        .select(BASE_SELECT)
        .is('deleted_at', null)
        .order('solicitado_em', { ascending: false })

      return ((data ?? []) as unknown as RawSolicitacao[]).map(mapRow)
    },

    async getById(id: string) {
      const { data } = await supabase
        .from('solicitacoes')
        .select(BASE_SELECT)
        .eq('id', id)
        .single()

      if (!data) return null
      return mapRow(data as unknown as RawSolicitacao)
    },

    async create(input: CreateSolicitacaoInput, createdBy: string) {
      const { data, error } = await supabase
        .from('solicitacoes')
        .insert({
          colaborador_id: input.colaboradorId,
          tipo_folga_id: input.tipoFolgaId,
          data_folga: input.dataFolga,
          turno_id: input.turnoId,
          justificativa: input.justificativa || null,
          workflow_definition_id: input.workflowDefinitionId || null,
          workflow_step_id: input.workflowStepId || null,
          solicitado_em: new Date().toISOString(),
          created_by: createdBy,
          updated_by: createdBy,
        })
        .select(BASE_SELECT)
        .single()

      if (error) throw new Error(error.message)
      if (!data) throw new Error('Erro ao criar solicitação')
      return mapRow(data as unknown as RawSolicitacao)
    },

    async update(id: string, input: UpdateSolicitacaoInput, updatedBy: string) {
      const updateData: Record<string, unknown> = {
        updated_by: updatedBy,
      }

      if (input.tipoFolgaId !== undefined) updateData.tipo_folga_id = input.tipoFolgaId
      if (input.dataFolga !== undefined) updateData.data_folga = input.dataFolga
      if (input.turnoId !== undefined) updateData.turno_id = input.turnoId
      if (input.justificativa !== undefined) updateData.justificativa = input.justificativa || null
      if (input.observacaoRh !== undefined) updateData.observacao_rh = input.observacaoRh || null

      const { data } = await supabase
        .from('solicitacoes')
        .update(updateData)
        .eq('id', id)
        .select(BASE_SELECT)
        .single()

      if (!data) throw new Error('Erro ao atualizar solicitação')
      return mapRow(data as unknown as RawSolicitacao)
    },

    async updateStatus(id: string, status: string, aprovadoPor?: string, updatedBy?: string) {
      const updateData: Record<string, unknown> = {
        status,
        updated_by: updatedBy ?? aprovadoPor,
      }

      if (status === 'aprovada' || status === 'reprovada') {
        updateData.aprovado_em = new Date().toISOString()
        updateData.aprovado_por = aprovadoPor
      }

      const { error } = await supabase
        .from('solicitacoes')
        .update(updateData)
        .eq('id', id)

      if (error) throw new Error(error.message)
    },

    async softDelete(id: string, updatedBy: string) {
      const { error } = await supabase
        .from('solicitacoes')
        .update({
          deleted_at: new Date().toISOString(),
          updated_by: updatedBy,
        })
        .eq('id', id)

      if (error) throw new Error('Erro ao excluir solicitação')
    },

    async listTiposFolga() {
      const { data } = await supabase
        .from('tipos_folga')
        .select('id, nome, descricao, requer_aprovacao, is_active')
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('nome')

      return ((data ?? []) as {
        id: string
        nome: string
        descricao: string | null
        requer_aprovacao: boolean
        is_active: boolean
      }[]).map((r) => ({
        id: r.id,
        nome: r.nome,
        descricao: r.descricao,
        requerAprovacao: r.requer_aprovacao,
        isActive: r.is_active,
      }))
    },

    async listTurnos(departamentoId?: string) {
      let query = supabase
        .from('turnos')
        .select('id, nome, departamento_id, departamentos!fk_turnos_departamento ( nome )')
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('nome')

      if (departamentoId) {
        query = query.eq('departamento_id', departamentoId)
      }

      const { data } = await query

      return ((data ?? []) as unknown as {
        id: string
        nome: string
        departamento_id: string
        departamentos: { nome: string }[] | { nome: string } | null
      }[]).map((r) => ({
        id: r.id,
        nome: r.nome,
        departamentoId: r.departamento_id,
        departamentoNome: extractVal(r.departamentos)?.nome ?? null,
      }))
    },

    async listDatasBloqueadas(dataInicio?: string, dataFim?: string) {
      let query = supabase
        .from('datas_bloqueadas')
        .select('id, data, motivo, departamento_id, unidade_id')
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('data')

      if (dataInicio) query = query.gte('data', dataInicio)
      if (dataFim) query = query.lte('data', dataFim)

      const { data } = await query
      return ((data ?? []) as {
        id: string
        data: string
        motivo: string | null
        departamento_id: string | null
        unidade_id: string | null
      }[]).map((r) => ({
        id: r.id,
        data: r.data,
        motivo: r.motivo,
        departamentoId: r.departamento_id,
        unidadeId: r.unidade_id,
      }))
    },

    async getWorkflowDefinition(entidadeTipo: string) {
      const { data } = await supabase
        .from('workflow_definitions')
        .select('id, nome, descricao, entidade_tipo, is_active')
        .eq('entidade_tipo', entidadeTipo)
        .eq('is_active', true)
        .is('deleted_at', null)
        .single()

      if (!data) return null
      return {
        id: data.id,
        nome: data.nome,
        descricao: data.descricao,
        entidadeTipo: data.entidade_tipo,
        isActive: data.is_active,
      }
    },

    async getWorkflowSteps(workflowDefinitionId: string) {
      const { data } = await supabase
        .from('workflow_steps')
        .select('id, workflow_definition_id, nome, ordem, is_terminal')
        .eq('workflow_definition_id', workflowDefinitionId)
        .is('deleted_at', null)
        .order('ordem')

      return (data ?? []).map((r) => ({
        id: r.id,
        workflowDefinitionId: r.workflow_definition_id,
        nome: r.nome,
        ordem: r.ordem,
        isTerminal: r.is_terminal,
      }))
    },

    async getWorkflowStepByNome(workflowDefinitionId: string, nome: string) {
      const { data } = await supabase
        .from('workflow_steps')
        .select('id, workflow_definition_id, nome, ordem, is_terminal')
        .eq('workflow_definition_id', workflowDefinitionId)
        .eq('nome', nome)
        .is('deleted_at', null)
        .single()

      if (!data) return null
      return {
        id: data.id,
        workflowDefinitionId: data.workflow_definition_id,
        nome: data.nome,
        ordem: data.ordem,
        isTerminal: data.is_terminal,
      }
    },

    async countByData(status: string, data: string) {
      const { count } = await supabase
        .from('solicitacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', status)
        .gte('created_at', `${data}T00:00:00Z`)
        .lte('created_at', `${data}T23:59:59Z`)

      return count ?? 0
    },
  }
}
