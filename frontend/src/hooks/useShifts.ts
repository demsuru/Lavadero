import useSWR from 'swr'
import { shiftService } from '../services/shiftService'
import type { ShiftCreate } from '../types'

export function useShifts() {
  const { data, error, isLoading, mutate } = useSWR('shifts', shiftService.getAll)

  const createShift = async (data: ShiftCreate) => {
    const created = await shiftService.create(data)
    mutate()
    return created
  }

  const deleteShift = async (id: string) => {
    await shiftService.delete(id)
    mutate()
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
