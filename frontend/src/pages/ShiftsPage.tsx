import { useState } from 'react'
import { Plus, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useShifts } from '../hooks/useShifts'
import { useEmployees } from '../hooks/useEmployees'
import Modal from '../components/common/Modal'
import { FormSelect, FormInput } from '../components/common/FormInput'
import Button from '../components/common/Button'
import ConfirmDialog from '../components/common/ConfirmDialog'
import ShiftTimelineView from '../components/Shifts/ShiftTimelineView'
import { formatTime } from '../utils/formatters'
import {
  getWeekStart,
  getWeekDays,
  getWeekEnd,
  formatDateToISO,
  formatDateShort,
  getDayName,
  isDateInThePast,
  isDateToday,
} from '../utils/dateUtils'
import type { Shift, ShiftCreate } from '../types'
import clsx from 'clsx'

export default function ShiftsPage() {
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))
  const { shifts, isLoading, createShift, deleteShift } = useShifts(weekStart)
  const { employees } = useEmployees()

  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid')
  const [selectedDay, setSelectedDay] = useState<string>(() => formatDateToISO(new Date()))

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Shift | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [form, setForm] = useState<ShiftCreate>({
    employee_id: '',
    shift_date: formatDateToISO(new Date()),
    start_time: '08:00',
    end_time: '16:00',
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const activeEmployees = employees.filter(e => e.status === 'active')
  const weekDays = getWeekDays(weekStart)
  const weekEnd = getWeekEnd(weekStart)
  const isHistoricalWeek = weekEnd < new Date()

  const goToPreviousWeek = () => {
    const prev = new Date(weekStart)
    prev.setDate(prev.getDate() - 7)
    setWeekStart(prev)
  }

  const goToNextWeek = () => {
    const next = new Date(weekStart)
    next.setDate(next.getDate() + 7)
    setWeekStart(next)
  }

  const goToToday = () => {
    setWeekStart(getWeekStart(new Date()))
  }

  const getShiftsForCell = (employeeId: string, shiftDate: string): Shift[] => {
    return shifts.filter(s => s.employee_id === employeeId && s.shift_date === shiftDate)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.employee_id) {
      setFormError('Seleccioná un empleado')
      return
    }
    setFormError('')
    setFormLoading(true)
    try {
      await createShift(form)
      setModalOpen(false)
      setForm({
        employee_id: '',
        shift_date: formatDateToISO(new Date()),
        start_time: '08:00',
        end_time: '16:00',
      })
    } catch (err: any) {
      setFormError(err.message || 'Error al crear el turno')
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

  const openShiftModal = (employeeId: string, shiftDate: string) => {
    if (isDateInThePast(new Date(shiftDate))) return // Don't allow creating shifts in past
    setForm(f => ({ ...f, employee_id: employeeId, shift_date: shiftDate }))
    setModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-50">Turnos semanales</h1>
          <p className="text-sm text-navy-400 mt-0.5">
            {weekStart.toLocaleDateString('es-AR')} - {weekEnd.toLocaleDateString('es-AR')}
            {isHistoricalWeek && <span className="ml-2 text-yellow-500 text-xs">(Histórico - Solo lectura)</span>}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded hover:bg-navy-800 text-navy-300 hover:text-navy-100 transition-colors"
              title="Semana anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 rounded bg-blue-primary/10 text-blue-glow text-sm font-medium hover:bg-blue-primary/20 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 rounded hover:bg-navy-800 text-navy-300 hover:text-navy-100 transition-colors"
              title="Próxima semana"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-navy-800 border border-navy-700 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                viewMode === 'grid'
                  ? 'bg-blue-primary text-white shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                  : 'text-navy-400 hover:text-navy-100'
              )}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={clsx(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                viewMode === 'timeline'
                  ? 'bg-blue-primary text-white shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                  : 'text-navy-400 hover:text-navy-100'
              )}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Day tabs - only in timeline mode */}
      {viewMode === 'timeline' && (
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weekDays.map(day => {
            const dateStr = formatDateToISO(day)
            const isPast = isDateInThePast(day)
            const isToday = isDateToday(day)
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDay(dateStr)}
                className={clsx(
                  'flex flex-col items-center px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex-shrink-0',
                  selectedDay === dateStr
                    ? 'bg-blue-primary text-white shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                    : isToday
                      ? 'bg-blue-primary/15 text-blue-glow border border-blue-primary/20 hover:bg-blue-primary/25'
                      : isPast
                        ? 'text-navy-500 opacity-50 cursor-not-allowed'
                        : 'text-navy-400 hover:text-navy-100 hover:bg-navy-800'
                )}
              >
                <span className="uppercase tracking-wide">{getDayName(day).slice(0, 3)}</span>
                <span className="text-base font-bold mt-0.5">{day.getDate()}</span>
              </button>
            )
          })}
        </div>
      )}

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
      ) : viewMode === 'grid' ? (
        /* Weekly grid */
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            {/* Day headers with dates */}
            <div className="grid gap-px mb-px" style={{ gridTemplateColumns: '160px repeat(7, 1fr)' }}>
              <div className="px-3 py-2 text-xs font-medium text-navy-400 uppercase tracking-wide">Empleado</div>
              {weekDays.map(day => {
                const dateStr = formatDateToISO(day)
                const isPast = isDateInThePast(day)
                return (
                  <div
                    key={dateStr}
                    className={clsx(
                      'px-2 py-2 text-center bg-navy-800',
                      isPast && 'opacity-50'
                    )}
                  >
                    <div className="text-xs font-medium text-navy-400 uppercase">{getDayName(day).slice(0, 3)}</div>
                    <div className="text-sm font-semibold text-navy-200">{formatDateShort(day)}</div>
                  </div>
                )
              })}
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
                  <div
                    className={clsx(
                      'flex items-center gap-2.5 px-3 py-3 bg-navy-800',
                      rowIdx === 0 && 'rounded-tl-none',
                      rowIdx === activeEmployees.length - 1 && 'rounded-bl-xl'
                    )}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-primary/30 to-blue-glow/10 border border-blue-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-glow">{emp.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm text-navy-200 truncate">{emp.name}</span>
                  </div>

                  {/* Day cells */}
                  {weekDays.map(day => {
                    const dateStr = formatDateToISO(day)
                    const cellShifts = getShiftsForCell(emp.id, dateStr)
                    const isPast = isDateInThePast(day)
                    const isToday = isDateToday(day)

                    return (
                      <div
                        key={dateStr}
                        className={clsx(
                          'min-h-[56px] px-2 py-2 bg-navy-800 border border-navy-700/0 transition-colors',
                          !isPast && 'hover:bg-navy-750 group',
                          isPast && 'opacity-50',
                          isToday && 'ring-2 ring-blue-glow/50',
                          rowIdx === activeEmployees.length - 1 && 'rounded-br-xl'
                        )}
                      >
                        {cellShifts.length > 0 ? (
                          <div className="space-y-1">
                            {cellShifts.map(shift => (
                              <div
                                key={shift.id}
                                className={clsx(
                                  'relative flex items-center justify-between bg-blue-primary/10 border border-blue-primary/20 rounded-md px-2 py-1 group/chip',
                                  isPast && 'opacity-75'
                                )}
                              >
                                <span className="text-xs text-blue-glow font-medium">
                                  {formatTime(shift.start_time)}–{formatTime(shift.end_time)}
                                </span>

                                {/* Only show delete button if not in the past */}
                                {!isPast && (
                                  <button
                                    onClick={() => setDeleteTarget(shift)}
                                    className="opacity-0 group-hover/chip:opacity-100 p-0.5 rounded text-navy-400 hover:text-status-red transition-all"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                )}

                                {/* Lock icon for past shifts */}
                                {isPast && <span className="text-xs">🔒</span>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => openShiftModal(emp.id, dateStr)}
                            disabled={isPast}
                            className={clsx(
                              'w-full h-full flex items-center justify-center transition-opacity',
                              !isPast && 'opacity-0 group-hover:opacity-100'
                            )}
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
      ) : (
        /* Timeline view */
        <ShiftTimelineView
          shifts={shifts}
          employees={activeEmployees}
          selectedDate={selectedDay}
          onAddShift={openShiftModal}
          onDeleteShift={setDeleteTarget}
          isHistorical={isDateInThePast(new Date(selectedDay))}
        />
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
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            label="Fecha"
            value={form.shift_date}
            onChange={e => setForm(f => ({ ...f, shift_date: e.target.value }))}
          >
            <option value="">— Seleccioná una fecha —</option>
            {weekDays.map(day => {
              const dateStr = formatDateToISO(day)
              const dayName = getDayName(day)
              return (
                <option key={dateStr} value={dateStr}>
                  {dayName.charAt(0).toUpperCase() + dayName.slice(1)} {formatDateShort(day)}
                </option>
              )
            })}
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

          {formError && <p className="text-xs text-status-red bg-status-red/10 border border-status-red/20 rounded-lg px-3 py-2">{formError}</p>}

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
        description="¿Eliminás este turno?"
        confirmLabel="Eliminar"
        loading={deleteLoading}
      />
    </div>
  )
}
