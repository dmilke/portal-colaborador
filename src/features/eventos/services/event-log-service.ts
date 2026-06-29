import { EventLogRepository } from '../repositories/event-log-repository'
import type { EventLogListResult, EventStats } from '../types'

export interface EventLogService {
  list(params: { eventType?: string; status?: string; page?: number; pageSize?: number }): Promise<EventLogListResult>
  getStats(): Promise<EventStats>
}

const repo = new EventLogRepository()

export const eventLogService: EventLogService = {
  async list(params) {
    return repo.list(params)
  },
  async getStats() {
    return repo.getStats()
  },
}
