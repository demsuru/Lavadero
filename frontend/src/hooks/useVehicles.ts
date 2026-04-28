import useSWR from 'swr'
import { vehicleService } from '../services/vehicleService'
import type { VehicleCreate } from '../types'

export function useVehiclesInProgress() {
  const { data, error, isLoading, mutate } = useSWR(
    'vehicles/in-progress',
    vehicleService.getInProgress,
    { refreshInterval: 30_000 }
  )

  const enterVehicle = async (data: VehicleCreate) => {
    const created = await vehicleService.create(data)
    mutate()
    return created
  }

  const exitVehicle = async (id: string) => {
    const updated = await vehicleService.registerExit(id)
    // Revalidate to fetch fresh list (will exclude completed vehicles)
    await mutate()
    return updated
  }

  const updateVehicle = async (id: string, updates: { assigned_employee_id?: string; entry_timestamp?: string }) => {
    const updated = await vehicleService.update(id, updates)
    await mutate()
    return updated
  }

  return {
    vehicles: data ?? [],
    isLoading,
    error,
    enterVehicle,
    exitVehicle,
    updateVehicle,
    refresh: mutate,
  }
}

export function useAllVehicles() {
  const { data, error, isLoading } = useSWR('vehicles', vehicleService.getAll)
  return { vehicles: data ?? [], isLoading, error }
}
