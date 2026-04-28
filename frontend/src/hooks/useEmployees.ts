import useSWR from 'swr'
import { employeeService } from '../services/employeeService'
import type { EmployeeCreate, EmployeeUpdate } from '../types'

export function useEmployees() {
  const { data, error, isLoading, mutate } = useSWR('employees', employeeService.getAll)

  const createEmployee = async (data: EmployeeCreate) => {
    const created = await employeeService.create(data)
    mutate()
    return created
  }

  const updateEmployee = async (id: string, data: EmployeeUpdate) => {
    const updated = await employeeService.update(id, data)
    mutate()
    return updated
  }

  const deactivateEmployee = async (id: string) => {
    await employeeService.deactivate(id)
    mutate()
  }

  return {
    employees: data ?? [],
    isLoading,
    error,
    createEmployee,
    updateEmployee,
    deactivateEmployee,
    refresh: mutate,
  }
}

export function useAvailableEmployees() {
  const { data, error, isLoading } = useSWR('employees/available', employeeService.getAvailable, {
    refreshInterval: 60_000,
  })
  return { employees: data ?? [], isLoading, error }
}
