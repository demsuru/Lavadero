import { useState, useEffect } from 'react'
import { Clock, User } from 'lucide-react'
import Modal from '../common/Modal'
import { FormInput, FormSelect } from '../common/FormInput'
import Button from '../common/Button'
import Badge from '../common/Badge'
import type { Vehicle, Employee } from '../../types'
import { formatDate } from '../../utils/formatters'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: { assigned_employee_id?: string; entry_timestamp?: string }) => Promise<void>
  vehicle: Vehicle | null
  employees: Employee[]
}

export default function VehicleEditModal({ open, onClose, onSubmit, vehicle, employees }: Props) {
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('')
  const [entryTime, setEntryTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (vehicle) {
      setAssignedEmployeeId(vehicle.assigned_employee_id)
      const date = new Date(vehicle.entry_timestamp)
      setEntryTime(date.toISOString().slice(0, 16))
    }
    setError('')
  }, [vehicle, open])

  const activeEmployees = employees.filter(e => e.status === 'active')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onSubmit({
        assigned_employee_id: assignedEmployeeId,
        entry_timestamp: entryTime ? new Date(entryTime).toISOString() : undefined,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  if (!vehicle) return null

  return (
    <Modal open={open} onClose={onClose} title="Editar Vehículo" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Read-only section */}
        <div className="space-y-3 pb-4 border-b border-navy-700">
          <h3 className="text-xs font-semibold text-navy-400 uppercase">Información del vehículo</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-navy-900/50 rounded-lg p-3">
              <p className="text-xs text-navy-400 mb-1">Patente</p>
              <p className="text-sm font-semibold text-navy-50">{vehicle.plate}</p>
            </div>
            <div className="bg-navy-900/50 rounded-lg p-3">
              <p className="text-xs text-navy-400 mb-1">Marca</p>
              <p className="text-sm font-semibold text-navy-50">{vehicle.brand}</p>
            </div>
          </div>

          <div className="bg-navy-900/50 rounded-lg p-3">
            <p className="text-xs text-navy-400 mb-1">Cliente</p>
            <p className="text-sm font-semibold text-navy-50">{vehicle.customer_name}</p>
            {vehicle.customer_phone && (
              <p className="text-xs text-navy-400 mt-1">{vehicle.customer_phone}</p>
            )}
          </div>

          {vehicle.notes && (
            <div className="bg-navy-900/50 rounded-lg p-3">
              <p className="text-xs text-navy-400 mb-1">Notas</p>
              <p className="text-sm text-navy-300">{vehicle.notes}</p>
            </div>
          )}
        </div>

        {/* Editable section */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-navy-400 uppercase">Editar información</h3>

          <FormSelect
            label="Empleado asignado"
            value={assignedEmployeeId}
            onChange={e => setAssignedEmployeeId(e.target.value)}
          >
            <option value="">— Selecciona un empleado —</option>
            {activeEmployees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </FormSelect>

          <FormInput
            label="Hora de entrada"
            type="datetime-local"
            value={entryTime}
            onChange={e => setEntryTime(e.target.value)}
          />
        </div>

        {error && (
          <div className="px-3 py-2 rounded-lg text-sm text-status-red bg-status-red/10 border border-status-red/20">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="flex-1 justify-center" loading={loading}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  )
}
