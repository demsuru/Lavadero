import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { FormInput, FormSelect } from '../common/FormInput'
import Button from '../common/Button'
import type { Employee, EmployeeCreate, EmployeeUpdate, EmployeeRole } from '../../types'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: EmployeeCreate | EmployeeUpdate) => Promise<void>
  employee?: Employee | null
}

export default function EmployeeModal({ open, onClose, onSubmit, employee }: Props) {
  const isEdit = !!employee
  const [form, setForm] = useState<{ name: string; email: string; phone: string; role: EmployeeRole }>({ name: '', email: '', phone: '', role: 'employee' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        email: employee.email ?? '',
        phone: employee.phone ?? '',
        role: employee.role,
      })
    } else {
      setForm({ name: '', email: '', phone: '', role: 'employee' })
    }
    setErrors({})
  }, [employee, open])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        role: form.role,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar empleado' : 'Nuevo empleado'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Nombre completo"
          placeholder="Juan Pérez"
          value={form.name}
          onChange={set('name')}
          error={errors.name}
          autoFocus
        />
        <FormInput
          label="Email (opcional)"
          placeholder="juan@ejemplo.com"
          type="email"
          value={form.email}
          onChange={set('email')}
        />
        <FormInput
          label="Teléfono (opcional)"
          placeholder="+54 9 11 1234-5678"
          type="tel"
          value={form.phone}
          onChange={set('phone')}
        />
        <FormSelect label="Rol" value={form.role} onChange={set('role')}>
          <option value="employee">Empleado</option>
          <option value="manager">Gerente</option>
          <option value="admin">Admin</option>
        </FormSelect>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="flex-1 justify-center" loading={loading}>
            {isEdit ? 'Guardar cambios' : 'Crear empleado'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
