import { useState } from 'react'
import { Plus, Trash2, Calendar } from 'lucide-react'
import { useShifts } from '../hooks/useShifts'
import { useEmployees } from '../hooks/useEmployees'
import Modal from '../components/common/Modal'
import { FormSelect, FormInput } from '../components/common/FormInput'
import Button from '../components/common/Button'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { DAY_LABELS, DAYS_ORDER, formatTime } from '../utils/formatters'
import type { DayOfWeek, Shift } from '../types'
import clsx from 'clsx'

export default function ShiftsPage() {
  const { shifts, isLoading, createShift, deleteShift } = useShifts()
  const { employees } = useEmployees()

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Shift | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [form, setForm] = useState({ employee_id: '', day_of_week: 'monday' as DayOfWeek, start_time: '08:00', end_time: '16:00' })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const activeEmployees = employees.filter(e => e.status === 'active')

  const getShiftsForCell = (employeeId: string, day: DayOfWeek) =>
    shifts.filter(s => s.employee_id === employeeId && s.day_of_week === day)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.employee_id) { setFormError('Seleccioná un empleado'); return }
    setFormError('')
    setFormLoading(true)
    try {
      await createShift(form)
      setModalOpen(false)
      setForm({ employee_id: '', day_of_week: 'monday', start_time: '08:00', end_time: '16:00' })
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteShift(deleteTarget.id)
    } finally {
      setDeleteLoading(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-50">Turnos semanales</h1>
          <p className="text-sm text-navy-400 mt-0.5">Horarios recurrentes por semana</p>
        </div>
        <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>
          Asignar turno
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-14 rounded-xl" />
          ))}
        </div>
      ) : activeEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Calendar size={32} className="text-navy-600 mb-4" />
          <p className="text-navy-300 font-medium">No hay empleados activos</p>
          <p className="text-navy-500 text-sm mt-1">Primero agregá empleados activos para asignarles turnos</p>
        </div>
      ) : (
        /* Weekly grid */
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            {/* Day headers */}
            <div className="grid gap-px mb-px" style={{ gridTemplateColumns: '160px repeat(7, 1fr)' }}>
              <div className="px-3 py-2 text-xs font-medium text-navy-400 uppercase tracking-wide">
                Empleado
              </div>
              {DAYS_ORDER.map(day => (
                <div
                  key={day}
                  className="px-2 py-2 text-xs font-medium text-center text-navy-400 uppercase tracking-wide bg-navy-800 first:rounded-tl-lg last:rounded-tr-lg"
                >
                  {DAY_LABELS[day].slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Employee rows */}
            <div className="space-y-0.5">
              {activeEmployees.map((emp, rowIdx) => (
                <div
                  key={emp.id}
                  className="grid gap-px"
                  style={{ gridTemplateColumns: '160px repeat(7, 1fr)' }}
                >
                  {/* Employee name */}
                  <div className={clsx(
                    'flex items-center gap-2.5 px-3 py-3 bg-navy-800',
                    rowIdx === 0 && 'rounded-tl-none',
                    rowIdx === activeEmployees.length - 1 && 'rounded-bl-xl'
                  )}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-primary/30 to-blue-glow/10 border border-blue-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-glow">
                        {emp.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-navy-200 truncate">{emp.name}</span>
                  </div>

                  {/* Day cells */}
                  {DAYS_ORDER.map(day => {
                    const cellShifts = getShiftsForCell(emp.id, day)
                    return (
                      <div
                        key={day}
                        className={clsx(
                          'min-h-[56px] px-2 py-2 bg-navy-800 border border-navy-700/0',
                          'hover:bg-navy-750 transition-colors group',
                          rowIdx === activeEmployees.length - 1 && day === 'sunday' && 'rounded-br-xl'
                        )}
                      >
                        {cellShifts.length > 0 ? (
                          <div className="space-y-1">
                            {cellShifts.map(shift => (
                              <div
                                key={shift.id}
                                className="relative flex items-center justify-between bg-blue-primary/10 border border-blue-primary/20 rounded-md px-2 py-1 group/chip"
                              >
                                <span className="text-xs text-blue-glow font-medium">
                                  {formatTime(shift.start_time)}–{formatTime(shift.end_time)}
                                </span>
                                <button
                                  onClick={() => setDeleteTarget(shift)}
                                  className="opacity-0 group-hover/chip:opacity-100 p-0.5 rounded text-navy-400 hover:text-status-red transition-all"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setForm(f => ({ ...f, employee_id: emp.id, day_of_week: day }))
                              setModalOpen(true)
                            }}
                            className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Plus size={13} className="text-navy-500 hover:text-blue-glow transition-colors" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create shift modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Asignar turno" size="sm">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormSelect
            label="Empleado"
            value={form.employee_id}
            onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))}
          >
            <option value="">— Seleccioná un empleado —</option>
            {activeEmployees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </FormSelect>

          <FormSelect
            label="Día de la semana"
            value={form.day_of_week}
            onChange={e => setForm(f => ({ ...f, day_of_week: e.target.value as DayOfWeek }))}
          >
            {DAYS_ORDER.map(d => (
              <option key={d} value={d}>{DAY_LABELS[d]}</option>
            ))}
          </FormSelect>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Entrada"
              type="time"
              value={form.start_time}
              onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
            />
            <FormInput
              label="Salida"
              type="time"
              value={form.end_time}
              onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
            />
          </div>

          {formError && (
            <p className="text-xs text-status-red bg-status-red/10 border border-status-red/20 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center" loading={formLoading}>
              Asignar
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar turno"
        description={`¿Eliminás este turno? El empleado dejará de aparecer disponible ese día.`}
        confirmLabel="Eliminar"
        loading={deleteLoading}
      />
    </div>
  )
}
