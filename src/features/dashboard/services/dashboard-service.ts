import type { DashboardRepository } from '../repositories/dashboard-repository'
import type { DashboardStats, RecentActivityItem } from '../types'

export interface DashboardData {
  stats: DashboardStats
  recentActivities: RecentActivityItem[]
}

export interface DashboardService {
  getDashboardData(): Promise<DashboardData>
}

export function createDashboardService(repository: DashboardRepository): DashboardService {
  return {
    async getDashboardData() {
      const [stats, recentActivities] = await Promise.all([
        repository.getStats(),
        repository.getRecentActivities(),
      ])

      return { stats, recentActivities }
    },
  }
}
