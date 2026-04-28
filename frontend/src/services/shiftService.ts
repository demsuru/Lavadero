import api from './api'
import type { Shift, ShiftCreate } from '../types'

export const shiftService = {
  getAll: () => api.get<Shift[]>('/shifts').then(r => r.data),
  getByEmployee: (employeeId: string) => api.get<Shift[]>(`/shifts/employee/${employeeId}`).then(r => r.data),
  create: (data: ShiftCreate) => api.post<Shift>('/shifts', data).then(r => r.data),
  delete: (id: string) => api.delete(`/shifts/${id}`).then(r => r.data),
}
