import useSWR from 'swr'
import { dashboardService } from '../services/dashboardService'

export function useDashboardTodayStats() {
  const { data, error, isLoading, mutate } = useSWR(
    'dashboard/today',
    dashboardService.getTodayStats,
    { refreshInterval: 30_000 }  // Refresh every 30 seconds
  )

  return {
    completedCount: data?.completed_count ?? 0,
    revenueToday: data?.revenue_today ?? 0,
    isLoading,
    error,
    refresh: mutate,
  }
}
