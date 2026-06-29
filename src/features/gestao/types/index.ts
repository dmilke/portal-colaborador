export interface GestaoFilters {
  departamentoId?: string
  unidadeId?: string
  cargoId?: string
  dateFrom?: string
  dateTo?: string
}

export interface CollaboratorStats {
  total: number
  active: number
  inactive: number
  lastLogin: number
  neverLogged: number
}

export interface SolicitacaoStats {
  pending: number
  approved: number
  rejected: number
  cancelled: number
  avgApprovalHours: number | null
  byDepartment: { name: string; count: number }[]
  byUnit: { name: string; count: number }[]
  monthly: { month: string; count: number }[]
}

export interface ComunicadoStats {
  published: number
  unread: number
  readRate: number
  topViewed: { titulo: string; leitores: number }[]
  leastViewed: { titulo: string; leitores: number }[]
  monthly: { month: string; count: number }[]
}

export interface DocumentoStats {
  published: number
  pendingReading: number
  readRate: number
  downloads: number
  mostAccessed: { titulo: string; leitores: number }[]
  leastAccessed: { titulo: string; leitores: number }[]
  monthly: { month: string; count: number }[]
}

export interface NotificacaoStats {
  unread: number
  read: number
  byType: { tipo: string; count: number }[]
  last30Days: { date: string; count: number }[]
}

export interface OperationalIndicators {
  usersOnline: number
  pendingActions: number
  expiredDocuments: number
  expiredCommunications: number
  requestsAwaitingApproval: number
}

export interface GestaoData {
  collaborators: CollaboratorStats
  solicitacoes: SolicitacaoStats
  comunicados: ComunicadoStats
  documentos: DocumentoStats
  notificacoes: NotificacaoStats
  operational: OperationalIndicators
}
