import { useState } from 'react'
import { X, Car, Plus } from 'lucide-react'
import { FormInput, FormSelect, FormTextarea } from '../common/FormInput'
import Button from '../common/Button'
import type { VehicleCreate, Employee, WashType } from '../../types'
import clsx from 'clsx'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: VehicleCreate) => Promise<void>
  employees: Employee[]
  washTypes: WashType[]
}

const empty: VehicleCreate = {
  plate: '', brand: '', customer_name: '', customer_phone: '',
  assigned_employee_id: '', wash_type_id: '', notes: '',
}

export default function VehicleEntryDrawer({ open, onClose, onSubmit, employees, washTypes }: Props) {
  const [form, setForm] = useState<VehicleCreate>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleCreate, string>>>({})
  const [loading, setLoading] = useState(false)

  const set = (field: keyof VehicleCreate) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!form.plate.trim())          e.plate = 'Requerido'
    if (!form.brand.trim())          e.brand = 'Requerido'
    if (!form.customer_name.trim())  e.customer_name = 'Requerido'
    if (!form.assigned_employee_id)  e.assigned_employee_id = 'Seleccioná un empleado'
    if (!form.wash_type_id)          e.wash_type_id = 'Seleccioná un tipo de lavado'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({
        ...form,
        plate: form.plate.toUpperCase().trim(),
        customer_phone: form.customer_phone || null,
        notes: form.notes || null,
      })
      setForm(empty)
      onClose()
    } catch (err) {
      console.error('Vehicle entry error:', err)
      setErrors({ plate: err instanceof Error ? err.message : 'Error registrando entrada' })
    } finally {
      setLoading(false)
    }
  }

  const activeEmployees = employees.filter(e => e.status === 'active')
  const activeWashTypes = washTypes.filter(w => w.status === 'active')

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={clsx(
        'fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-navy-950 border-l border-navy-800',
        'flex flex-col shadow-[−24px_0_64px_rgba(0,0,0,0.5)]',
        'transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]',
        open ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-primary/10">
              <Car size={16} className="text-blue-glow" />
            </div>
            <h2 className="text-sm font-semibold text-navy-50">Nueva entrada</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-navy-400 hover:text-navy-100 hover:bg-navy-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Patente"
              placeholder="ABC123"
              value={form.plate}
              onChange={set('plate')}
              error={errors.plate}
              className="uppercase"
            />
            <FormInput
              label="Marca"
              placeholder="Toyota"
              value={form.brand}
              onChange={set('brand')}
              error={errors.brand}
            />
          </div>

          <FormInput
            label="Nombre del cliente"
            placeholder="Juan Pérez"
            value={form.customer_name}
            onChange={set('customer_name')}
            error={errors.customer_name}
          />

          <FormInput
            label="Teléfono (opcional)"
            placeholder="+54 9 11 1234-5678"
            value={form.customer_phone ?? ''}
            onChange={set('customer_phone')}
            type="tel"
          />

          <FormSelect
            label="Empleado asignado"
            value={form.assigned_employee_id}
            onChange={set('assigned_employee_id')}
            error={errors.assigned_employee_id}
          >
            <option value="">— Seleccioná un empleado —</option>
            {activeEmployees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </FormSelect>

          <FormSelect
            label="Tipo de lavado"
            value={form.wash_type_id}
            onChange={set('wash_type_id')}
            error={errors.wash_type_id}
          >
            <option value="">— Seleccioná el tipo —</option>
            {activeWashTypes.map(w => (
              <option key={w.id} value={w.id}>{w.name} — ${w.price.toLocaleString('es-AR')}</option>
            ))}
          </FormSelect>

          <FormTextarea
            label="Notas (opcional)"
            placeholder="Observaciones sobre el vehículo..."
            value={form.notes ?? ''}
            onChange={set('notes')}
          />
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-navy-800 flex gap-2">
          <Button variant="secondary" className="flex-1 justify-center" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1 justify-center"
            icon={<Plus size={15} />}
            loading={loading}
          >
            Registrar entrada
          </Button>
        </div>
      </div>
    </>
  )
}
