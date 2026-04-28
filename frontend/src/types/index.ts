export type EmployeeRole = 'employee' | 'manager' | 'admin' | 'superadmin'
export type EmployeeStatus = 'active' | 'inactive'
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type VehicleStatus = 'in_progress' | 'completed'
export type WashTypeStatus = 'active' | 'inactive'

export interface Employee {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: EmployeeRole
  status: EmployeeStatus
  created_at: string
  updated_at: string
}

export interface EmployeeCreate {
  name: string
  email?: string | null
  phone?: string | null
  role: EmployeeRole
}

export interface EmployeeUpdate {
  name?: string
  email?: string | null
  phone?: string | null
  role?: EmployeeRole
  status?: EmployeeStatus
}

export interface Shift {
  id: string
  employee_id: string
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
}

export interface ShiftCreate {
  employee_id: string
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
}

export interface WashType {
  id: string
  name: string
  description: string | null
  price: number
  status: WashTypeStatus
  created_at: string
  updated_at: string
}

export interface WashTypeCreate {
  name: string
  description?: string | null
  price: number
}

export interface WashTypeUpdate {
  name?: string
  description?: string | null
  price?: number
  status?: WashTypeStatus
}

export interface Vehicle {
  _id: string
  plate: string
  brand: string
  customer_name: string
  customer_phone: string | null
  assigned_employee_id: string
  wash_type_id: string
  entry_timestamp: string
  exit_timestamp: string | null
  status: VehicleStatus
  notes: string | null
  created_at: string
}

export interface VehicleCreate {
  plate: string
  brand: string
  customer_name: string
  customer_phone?: string | null
  assigned_employee_id: string
  wash_type_id: string
  notes?: string | null
}

export interface Transaction {
  id: string
  vehicle_id: string
  wash_type_id: string
  employee_id: string
  amount: number
  transaction_date: string
  notes: string | null
}

export interface DailyStats {
  total_vehicles: number
  total_revenue: number
  vehicles_in_progress: number
  completed_today: number
}

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  role: EmployeeRole
}

export interface TokenResponse {
  access_token: string
  token_type: string
  user: AuthenticatedUser
}

export interface LoginCredentials {
  email: string
  password: string
}
