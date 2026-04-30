import { Plus, Trash2 } from 'lucide-react'
import { formatTime } from '../../utils/formatters'
import { timeToMinutes } from '../../utils/dateUtils'
import type { Shift, Employee } from '../../types'
import clsx from 'clsx'

interface Props {
  shifts: Shift[]
  employees: Employee[]
  selectedDate: string
  onAddShift: (employeeId: string, date: string) => void
  onDeleteShift: (shift: Shift) => void
  isHistorical: boolean
}

const START_HOUR = 6
const END_HOUR = 22
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60

const EMPLOYEE_COLORS = [
  { bg: 'bg-blue-primary/20', border: 'border-blue-primary/40', text: 'text-blue-glow' },
  { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400' },
  { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-300' },
  { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' },
  { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-400' },
]

export default function ShiftTimelineView({
  shifts,
  employees,
  selectedDate,
  onAddShift,
  onDeleteShift,
  isHistorical,
}: Props) {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i)

  const getColorFor = (employeeIndex: number) => {
    return EMPLOYEE_COLORS[employeeIndex % EMPLOYEE_COLORS.length]
  }

  const getShiftsForEmployee = (employeeId: string) => {
    return shifts.filter(s => s.employee_id === employeeId && s.shift_date === selectedDate)
  }

  const calculateShiftPosition = (shift: Shift) => {
    const startMin = timeToMinutes(shift.start_time)
    const endMin = timeToMinutes(shift.end_time)
    const leftPct = ((startMin - START_HOUR * 60) / TOTAL_MINUTES) * 100
    const widthPct = ((endMin - startMin) / TOTAL_MINUTES) * 100
    return { leftPct, widthPct }
  }

  return (
    <div className="space-y-1">
      {/* Hour ruler */}
      <div className="flex ml-40 border-b border-navy-700 mb-2">
        {hours.map(hour => (
          <div
            key={hour}
            className="flex-1 text-center text-xs font-medium text-navy-400 py-2 border-r border-navy-700/30"
            style={{ flex: `1 1 ${100 / hours.length}%` }}
          >
            {String(hour).padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Employee rows */}
      {employees.map((emp, empIdx) => {
        const empShifts = getShiftsForEmployee(emp.id)
        const color = getColorFor(empIdx)

        return (
          <div key={emp.id} className="flex items-center gap-2 group/row">
            {/* Employee name column */}
            <div className="w-36 flex-shrink-0 flex items-center gap-2 px-3 py-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-primary/30 to-blue-glow/10 border border-blue-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-blue-glow">
                  {emp.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-navy-200 truncate">{emp.name}</span>
            </div>

            {/* Timeline track */}
            <div
              className={clsx(
                'flex-1 h-11 rounded-lg relative overflow-hidden',
                'border border-navy-700 bg-navy-800/60',
                !isHistorical && 'cursor-pointer hover:bg-navy-800/80 transition-colors',
                'group/track'
              )}
              onClick={() => !isHistorical && onAddShift(emp.id, selectedDate)}
            >
              {/* Hour guide lines */}
              {hours.map((hour, idx) => (
                <div
                  key={hour}
                  className="absolute top-0 bottom-0 w-px bg-navy-700/30"
                  style={{
                    left: `${(idx / hours.length) * 100}%`,
                  }}
                />
              ))}

              {/* Shift blocks */}
              {empShifts.length > 0 && (
                <div className="absolute inset-0">
                  {empShifts.map(shift => {
                    const { leftPct, widthPct } = calculateShiftPosition(shift)
                    return (
                      <div
                        key={shift.id}
                        className={clsx(
                          'absolute inset-y-1 rounded-md border flex items-center px-2 gap-1',
                          'group/shift hover:shadow-lg transition-shadow',
                          color.bg,
                          color.border
                        )}
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <span className={clsx('text-xs font-medium truncate', color.text)}>
                          {formatTime(shift.start_time)}–{formatTime(shift.end_time)}
                        </span>

                        {!isHistorical && (
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              onDeleteShift(shift)
                            }}
                            className={clsx(
                              'ml-auto flex-shrink-0 p-0.5 rounded',
                              'opacity-0 group-shift/shift:opacity-100 transition-opacity',
                              'text-navy-400 hover:text-status-red hover:bg-status-red/10'
                            )}
                            title="Eliminar turno"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Empty state - click to add */}
              {empShifts.length === 0 && !isHistorical && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-opacity pointer-events-none">
                  <Plus size={14} className="text-navy-500 mr-1" />
                  <span className="text-xs text-navy-500">Agregar turno</span>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Historical note */}
      {isHistorical && (
        <div className="text-xs text-navy-400 text-center py-3 opacity-50">
          📌 Esta fecha es histórica — los cambios no se pueden realizar
        </div>
      )}
    </div>
  )
}
