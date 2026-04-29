import useSWR from 'swr'
import { shiftService } from '../services/shiftService'
import { useInvalidateAvailableEmployees } from './useEmployees'
import type { ShiftCreate } from '../types'

export function useShifts() {
  const { data, error, isLoading, mutate } = useSWR('shifts', shiftService.getAll)
  const invalidateAvailableEmployees = useInvalidateAvailableEmployees()

  const createShift = async (data: ShiftCreate) => {
    const created = await shiftService.create(data)
    mutate()
    invalidateAvailableEmployees()
    return created
  }

  const deleteShift = async (id: string) => {
    await shiftService.delete(id)
    mutate()
    invalidateAvailableEmployees()
  }

  return {
    shifts: data ?? [],
    isLoading,
    error,
    createShift,
    deleteShift,
    refresh: mutate,
  }
}
