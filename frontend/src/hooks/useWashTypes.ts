import useSWR from 'swr'
import { washTypeService } from '../services/washTypeService'
import type { WashTypeCreate, WashTypeUpdate } from '../types'

export function useWashTypes() {
  const { data, error, isLoading, mutate } = useSWR('wash-types', washTypeService.getAll)

  const createWashType = async (data: WashTypeCreate) => {
    const created = await washTypeService.create(data)
    mutate()
    return created
  }

  const updateWashType = async (id: string, data: WashTypeUpdate) => {
    const updated = await washTypeService.update(id, data)
    mutate()
    return updated
  }

  const deactivateWashType = async (id: string) => {
    await washTypeService.deactivate(id)
    mutate()
  }

  return {
    washTypes: data ?? [],
    isLoading,
    error,
    createWashType,
    updateWashType,
    deactivateWashType,
    refresh: mutate,
  }
}
