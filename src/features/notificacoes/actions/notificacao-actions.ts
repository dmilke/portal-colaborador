'use server'

import { notificacaoService } from '../services/notificacao-service'

export async function markNotificacaoAsReadAction(id: string) {
  await notificacaoService.markAsRead(id)
}

export async function markAllNotificacoesAsReadAction() {
  await notificacaoService.markAllAsRead()
}
