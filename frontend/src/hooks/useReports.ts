import useSWR from 'swr'
import { reportsService } from '../services/reportsService'
import type { PeriodSummary, DailyRevenue, EmployeeStats, VehicleSearchResult } from '../types/reports'

export function useReportSummary(startDate: string, endDate: string) {
  const { data, error, isLoading } = useSWR(
    startDate && endDate ? ['reports/summary', startDate, endDate] : null,
    ([_, start, end]) => reportsService.getSummary(start, end)
  )

  return {
    data: data,
    isLoading,
    error,
  }
}

export function useRevenueChart(startDate: string, endDate: string) {
  const { data, error, isLoading } = useSWR(
    startDate && endDate ? ['reports/revenue-chart', startDate, endDate] : null,
    ([_, start, end]) => reportsService.getRevenueChart(start, end)
  )

  return {
    data: data || [],
    isLoading,
    error,
  }
}

export function useEmployeeStats(startDate: string, endDate: string) {
  const { data, error, isLoading } = useSWR(
    startDate && endDate ? ['reports/employee-stats', startDate, endDate] : null,
    ([_, start, end]) => reportsService.getEmployeeStats(start, end)
  )

  return {
    data: data || [],
    isLoading,
    error,
  }
}

export function useRecentVehicles(startDate: string, endDate: string) {
  const { data, error, isLoading } = useSWR(
    startDate && endDate ? ['reports/vehicles/recent', startDate, endDate] : null,
    ([_, start, end]) => reportsService.searchVehicles(undefined, start, end).then(vehicles => vehicles.slice(0, 5))
  )

  return {
    data: data || [],
    isLoading,
    error,
  }
}

export function useVehicleSearch(plate?: string, dateFrom?: string, dateTo?: string) {
  const shouldFetch = Boolean(plate || dateFrom || dateTo)

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ['reports/vehicles/search', plate, dateFrom, dateTo] : null,
    ([_, p, f, t]) => reportsService.searchVehicles(p, f, t)
  )

  return {
    data: data || [],
    isLoading,
    error,
    mutate,
  }
}
