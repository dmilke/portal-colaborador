export interface Notificacao {
  id: string
  colaboradorId: string
  solicitacaoId: string | null
  titulo: string
  mensagem: string
  tipo: string | null
  payload: Record<string, unknown> | null
  lida: boolean
  lidaEm: string | null
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  deletedAt: string | null
}

export interface CreateNotificacaoInput {
  colaboradorId: string
  solicitacaoId?: string
  titulo: string
  mensagem: string
  tipo?: string
  payload?: Record<string, unknown>
}

export interface NotificacaoListResult {
  data: Notificacao[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
