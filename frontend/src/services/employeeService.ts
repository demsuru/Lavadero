import api from './api'
import type { Employee, EmployeeCreate, EmployeeUpdate } from '../types'

export const employeeService = {
  getAll: () => api.get<Employee[]>('/employees').then(r => r.data),
  getAvailable: () => api.get<Employee[]>('/employees/available').then(r => r.data),
  getById: (id: string) => api.get<Employee>(`/employees/${id}`).then(r => r.data),
  create: (data: EmployeeCreate) => api.post<Employee>('/employees', data).then(r => r.data),
  update: (id: string, data: EmployeeUpdate) => api.put<Employee>(`/employees/${id}`, data).then(r => r.data),
  deactivate: (id: string) => api.delete<Employee>(`/employees/${id}`).then(r => r.data),
}
