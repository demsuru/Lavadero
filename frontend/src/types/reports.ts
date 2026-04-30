import { VehicleStatus } from './index'

export interface PeriodSummary {
  total_revenue: number
  total_vehicles: number
  avg_per_vehicle: number
  start_date: string
  end_date: string
}

export interface DailyRevenue {
  day: string
  revenue: number
  count: number
}

export interface EmployeeStats {
  employee_id: string
  employee_name: string
  total_cars: number
  total_revenue: number
}

export interface VehicleSearchResult {
  id: string
  plate: string
  brand: string
  customer_name: string
  customer_phone: string | null
  entry_timestamp: string
  exit_timestamp: string | null
  status: VehicleStatus
  wash_type_id: string
}
