import api from './api'
import type { Vehicle, VehicleCreate } from '../types'

export const vehicleService = {
  getAll: () => api.get<Vehicle[]>('/vehicles').then(r => r.data),
  getInProgress: () => api.get<Vehicle[]>('/vehicles/in-progress').then(r => r.data),
  create: (data: VehicleCreate) => api.post<Vehicle>('/vehicles', data).then(r => r.data),
  registerExit: (id: string) =>
    api.put<{ vehicle: Vehicle; transaction_id: string }>(`/vehicles/${id}/exit`)
      .then(r => r.data.vehicle),
}
