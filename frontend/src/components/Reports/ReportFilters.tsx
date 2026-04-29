import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { addDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns'

interface ReportFiltersProps {
  onDateChange: (startDate: string, endDate: string) => void
}

export default function ReportFilters({ onDateChange }: ReportFiltersProps) {
  const [mode, setMode] = useState<'today' | 'week' | 'month' | 'custom'>('week')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const handlePresetClick = (preset: 'today' | 'week' | 'month') => {
    setMode(preset)
    const today = new Date()

    let start, end
    if (preset === 'today') {
      start = startOfDay(today)
      end = endOfDay(today)
    } else if (preset === 'week') {
      start = startOfDay(startOfWeek(today, { weekStartsOn: 1 }))
      end = endOfDay(endOfWeek(today, { weekStartsOn: 1 }))
    } else {
      start = startOfDay(startOfMonth(today))
      end = endOfDay(endOfMonth(today))
    }

    onDateChange(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'))
  }

  const handleCustomChange = () => {
    if (customFrom && customTo) {
      onDateChange(customFrom, customTo)
      setMode('custom')
    }
  }

  return (
    <div className="bg-navy-800 border border-blue-primary/20 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.12)] overflow-hidden animate-fade-in">
      <div className="bg-navy-700/50 border-b border-blue-primary/20 px-6 py-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-primary/10">
          <Calendar size={20} className="text-blue-glow" />
        </div>
        <h3 className="font-semibold text-navy-50">Período de Reporte</h3>
      </div>
      <div className="p-6">

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handlePresetClick('today')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'today'
              ? 'bg-blue-primary text-white'
              : 'bg-navy-700 text-navy-200 hover:bg-navy-600'
          }`}
        >
          Hoy
        </button>
        <button
          onClick={() => handlePresetClick('week')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'week'
              ? 'bg-blue-primary text-white'
              : 'bg-navy-700 text-navy-200 hover:bg-navy-600'
          }`}
        >
          Esta semana
        </button>
        <button
          onClick={() => handlePresetClick('month')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'month'
              ? 'bg-blue-primary text-white'
              : 'bg-navy-700 text-navy-200 hover:bg-navy-600'
          }`}
        >
          Este mes
        </button>
        <button
          onClick={() => setMode('custom')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'custom'
              ? 'bg-blue-primary text-white'
              : 'bg-navy-700 text-navy-200 hover:bg-navy-600'
          }`}
        >
          Personalizado
        </button>
      </div>

      {mode === 'custom' && (
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-100 mb-2">
              Desde
            </label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-3 py-2 border border-blue-primary/20 rounded-lg bg-navy-700 text-navy-50 focus:outline-none focus:border-blue-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-100 mb-2">
              Hasta
            </label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-3 py-2 border border-blue-primary/20 rounded-lg bg-navy-700 text-navy-50 focus:outline-none focus:border-blue-primary"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCustomChange}
              className="px-4 py-2 bg-blue-primary text-white rounded-lg font-medium hover:bg-blue-hover transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
