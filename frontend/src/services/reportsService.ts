import api from './api'
import type { PeriodSummary, DailyRevenue, EmployeeStats, VehicleSearchResult } from '../types/reports'

export const reportsService = {
  getSummary: (startDate: string, endDate: string): Promise<PeriodSummary> =>
    api.get('/reports/summary', { params: { start_date: startDate, end_date: endDate } }).then(r => r.data),

  getRevenueChart: (startDate: string, endDate: string): Promise<DailyRevenue[]> =>
    api.get('/reports/revenue-chart', { params: { start_date: startDate, end_date: endDate } }).then(r => r.data),

  getEmployeeStats: (startDate: string, endDate: string): Promise<EmployeeStats[]> =>
    api.get('/reports/employee-stats', { params: { start_date: startDate, end_date: endDate } }).then(r => r.data),

  searchVehicles: (plate?: string, dateFrom?: string, dateTo?: string): Promise<VehicleSearchResult[]> =>
    api.get('/reports/vehicles/search', {
      params: {
        ...(plate && { plate }),
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
      },
    }).then(r => r.data),
}
