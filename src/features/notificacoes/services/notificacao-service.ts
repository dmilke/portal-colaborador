import { NotificacaoRepository } from '../repositories/notificacao-repository'
import type { Notificacao, NotificacaoListResult } from '../types'
import { getCurrentColaborador } from '@/src/shared/lib/auth'

export interface NotificacaoService {
  getUnreadCount(): Promise<number>
  list(params: {
    lida?: boolean
    tipo?: string
    page?: number
    pageSize?: number
  }): Promise<NotificacaoListResult>
  getRecent(limit?: number): Promise<Notificacao[]>
  markAsRead(id: string): Promise<void>
  markAllAsRead(): Promise<void>
}

const repo = new NotificacaoRepository()

export const notificacaoService: NotificacaoService = {
  async getUnreadCount() {
    const user = await getCurrentColaborador()
    if (!user) return 0
    return repo.countUnread(user.id)
  },

  async list(params) {
    const user = await getCurrentColaborador()
    if (!user) return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 }
    return repo.findAll({ ...params, colaboradorId: user.id })
  },

  async getRecent(limit = 5) {
    const user = await getCurrentColaborador()
    if (!user) return []
    return repo.findRecent(user.id, limit)
  },

  async markAsRead(id: string) {
    const user = await getCurrentColaborador()
    if (!user) throw new Error('Usuário não autenticado')
    await repo.markAsRead(id, user.id)
  },

  async markAllAsRead() {
    const user = await getCurrentColaborador()
    if (!user) throw new Error('Usuário não autenticado')
    await repo.markAllAsRead(user.id)
  },
}
