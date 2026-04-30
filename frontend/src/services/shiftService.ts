import api from './api'
import type { Shift, ShiftCreate } from '../types'
import { formatDateToISO } from '../utils/dateUtils'

export const shiftService = {
  getAll: () => api.get<Shift[]>('/shifts').then(r => r.data),
  getByWeek: (weekStart?: Date) => {
    const params = weekStart ? `?week_of=${formatDateToISO(weekStart)}` : ''
    return api.get<Shift[]>(`/shifts${params}`).then(r => r.data)
  },
  getByEmployee: (employeeId: string) => api.get<Shift[]>(`/shifts/employee/${employeeId}`).then(r => r.data),
  create: (data: ShiftCreate) => api.post<Shift>('/shifts', data).then(r => r.data),
  update: (id: string, data: Partial<ShiftCreate>) => api.put<Shift>(`/shifts/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/shifts/${id}`).then(r => r.data),
}
