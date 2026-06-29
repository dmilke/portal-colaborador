import { on } from '../event-engine'
import { logEventToDatabase } from '../event-logger'
import { createNotificationHandler } from './notification-handler'
import { createAuditHandler } from './audit-handler'
import type { EventType } from '../../types'

let initialized = false

export function initializeEventHandlers(): void {
  if (initialized) return
  initialized = true

  const observableEvents: EventType[] = [
    'user.created', 'user.activated', 'user.deactivated', 'user.updated',
    'login', 'logout',
    'solicitacao.created', 'solicitacao.approved', 'solicitacao.rejected', 'solicitacao.cancelled',
    'comunicado.published', 'comunicado.read', 'comunicado.archived',
    'documento.published', 'documento.read', 'documento.downloaded', 'documento.archived',
    'notification.created', 'notification.read',
  ]

  for (const eventType of observableEvents) {
    on(eventType, async (event) => {
      const start = Date.now()
      try {
        await logEventToDatabase(event, 'processing')
        const executionMs = Date.now() - start
        await logEventToDatabase(event, 'processed', executionMs)
      } catch (err) {
        const executionMs = Date.now() - start
        const message = err instanceof Error ? err.message : 'Unknown error'
        await logEventToDatabase(event, 'failed', executionMs, message)
      }
    })
  }

  on('solicitacao.approved', createNotificationHandler)
  on('solicitacao.rejected', createNotificationHandler)
  on('solicitacao.cancelled', createNotificationHandler)
  on('comunicado.published', createNotificationHandler)
  on('documento.published', createNotificationHandler)

  for (const eventType of observableEvents) {
    on(eventType, createAuditHandler)
  }
}
