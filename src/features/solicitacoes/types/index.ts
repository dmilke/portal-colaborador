export interface Solicitacao {
  id: string
  colaboradorId: string
  colaboradorNome: string | null
  tipoFolgaId: string
  tipoFolgaNome: string | null
  tipoFolgaRequerAprovacao: boolean
  workflowDefinitionId: string | null
  workflowStepId: string | null
  dataFolga: string
  turnoId: string
  turnoNome: string | null
  status: SolicitacaoStatus
  justificativa: string | null
  observacaoRh: string | null
  solicitadoEm: string
  aprovadoEm: string | null
  aprovadoPor: string | null
  aprovadoPorNome: string | null
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export type SolicitacaoStatus = 'pendente' | 'aprovada' | 'reprovada' | 'cancelada' | 'expirada'

export interface CreateSolicitacaoInput {
  colaboradorId: string
  tipoFolgaId: string
  dataFolga: string
  turnoId: string
  justificativa?: string
  workflowDefinitionId?: string | null
  workflowStepId?: string | null
}

export interface UpdateSolicitacaoInput {
  tipoFolgaId?: string
  dataFolga?: string
  turnoId?: string
  justificativa?: string
  observacaoRh?: string
}

export interface SolicitacaoListParams {
  search?: string
  status?: SolicitacaoStatus | 'all'
  dataInicio?: string
  dataFim?: string
  colaboradorId?: string
  tipoFolgaId?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SolicitacaoListResult {
  data: Solicitacao[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface TipoFolga {
  id: string
  nome: string
  descricao: string | null
  requerAprovacao: boolean
  isActive: boolean
}

export interface Turno {
  id: string
  nome: string
  departamentoId: string
  departamentoNome: string | null
}

export interface DataBloqueada {
  id: string
  data: string
  motivo: string | null
  departamentoId: string | null
  unidadeId: string | null
}

export interface WorkflowStep {
  id: string
  workflowDefinitionId: string
  nome: string
  ordem: number
  isTerminal: boolean
}

export interface WorkflowDefinition {
  id: string
  nome: string
  descricao: string | null
  entidadeTipo: string
  isActive: boolean
}

export type AcaoTipo = 'login' | 'cadastro' | 'alteracao' | 'solicitacao' | 'aprovacao' | 'reprovacao' | 'cancelamento' | 'alteracao_equipe' | 'alteracao_configuracoes'

export interface AuditRecord {
  id: string
  colaboradorId: string | null
  acao: AcaoTipo
  entidadeTipo: string
  entidadeId: string | null
  descricao: string | null
  valorAnterior: Record<string, unknown> | null
  valorNovo: Record<string, unknown> | null
  createdAt: string
}

export type SolicitacaoActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | null
