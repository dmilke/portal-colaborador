export type AcaoTipo =
  | 'login'
  | 'cadastro'
  | 'alteracao'
  | 'solicitacao'
  | 'aprovacao'
  | 'reprovacao'
  | 'cancelamento'
  | 'alteracao_equipe'
  | 'alteracao_configuracoes'

export interface Auditoria {
  id: string
  colaboradorId: string | null
  acao: AcaoTipo
  entidadeTipo: string
  entidadeId: string | null
  descricao: string | null
  valorAnterior: unknown
  valorNovo: unknown
  requestId: string | null
  userAgent: string | null
  ipAddress: string | null
  createdAt: string
}

export interface AuditoriaFiltros {
  dataInicio?: string
  dataFim?: string
  colaboradorId?: string
  acao?: string
  entidadeTipo?: string
}
