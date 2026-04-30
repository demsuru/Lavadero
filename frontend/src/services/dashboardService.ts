import api from './api'

interface DashboardTodayStats {
  completed_count: number
  revenue_today: number
}

export const dashboardService = {
  getTodayStats: () =>
    api.get<DashboardTodayStats>('/dashboard/today').then(r => r.data),
}
