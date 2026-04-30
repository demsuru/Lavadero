import useSWR from 'swr'
import { shiftService } from '../services/shiftService'
import { useInvalidateAvailableEmployees } from './useEmployees'
import { formatDateToISO } from '../utils/dateUtils'
import type { ShiftCreate } from '../types'

export function useShifts(weekStart?: Date) {
  const weekKey = weekStart ? formatDateToISO(weekStart) : undefined
  const swrKey = weekKey ? `shifts:week:${weekKey}` : 'shifts'

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => weekStart ? shiftService.getByWeek(weekStart) : shiftService.getAll()
  )
  const invalidateAvailableEmployees = useInvalidateAvailableEmployees()

  const createShift = async (data: ShiftCreate) => {
    const created = await shiftService.create(data)
    await mutate()
    await invalidateAvailableEmployees()
    return created
  }

  const updateShift = async (id: string, data: Partial<ShiftCreate>) => {
    const updated = await shiftService.update(id, data)
    await mutate()
    await invalidateAvailableEmployees()
    return updated
  }

  const deleteShift = async (id: string) => {
    await shiftService.delete(id)
    await mutate()
    await invalidateAvailableEmployees()
  }

  return {
    shifts: data ?? [],
    isLoading,
    error,
    createShift,
    updateShift,
    deleteShift,
    refresh: mutate,
  }
}
