import api from './api'
import type { WashType, WashTypeCreate, WashTypeUpdate } from '../types'

export const washTypeService = {
  getAll: () => api.get<WashType[]>('/wash-types').then(r => r.data),
  create: (data: WashTypeCreate) => api.post<WashType>('/wash-types', data).then(r => r.data),
  update: (id: string, data: WashTypeUpdate) => api.put<WashType>(`/wash-types/${id}`, data).then(r => r.data),
  deactivate: (id: string) => api.delete<WashType>(`/wash-types/${id}`).then(r => r.data),
}
