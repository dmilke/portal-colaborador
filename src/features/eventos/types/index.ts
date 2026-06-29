export type EventType =
  | 'user.created'
  | 'user.activated'
  | 'user.deactivated'
  | 'user.updated'
  | 'login'
  | 'logout'
  | 'solicitacao.created'
  | 'solicitacao.approved'
  | 'solicitacao.rejected'
  | 'solicitacao.cancelled'
  | 'comunicado.published'
  | 'comunicado.read'
  | 'comunicado.archived'
  | 'documento.published'
  | 'documento.read'
  | 'documento.downloaded'
  | 'documento.archived'
  | 'notification.created'
  | 'notification.read'

export interface DomainEvent<T = unknown> {
  type: EventType
  origin: string
  payload: T
  colaboradorId?: string
  timestamp: Date
}

export interface EventLogEntry {
  id: string
  eventType: string
  origin: string
  payload: Record<string, unknown> | null
  colaboradorId: string | null
  colaboradorNome: string | null
  status: string
  executionMs: number | null
  errorMessage: string | null
  createdAt: string
}

export interface EventLogListResult {
  data: EventLogEntry[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface EventStats {
  totalProcessed: number
  totalFailed: number
  last24h: number
  byType: { type: string; count: number }[]
  recent: EventLogEntry[]
}

// Payload types
export interface UserEventPayload {
  userId: string
  nome?: string
  email?: string
}

export interface AuthEventPayload {
  userId: string
  email?: string
  colaboradorId?: string
}

export interface SolicitacaoEventPayload {
  solicitacaoId: string
  colaboradorId: string
  status: string
  dataFolga?: string
}

export interface ComunicadoEventPayload {
  comunicadoId: string
  titulo: string
  autorId?: string
}

export interface DocumentoEventPayload {
  documentoId: string
  titulo: string
  autorId?: string
}

export interface NotificationEventPayload {
  notificacaoId: string
  destinatarioId: string
  titulo: string
}
