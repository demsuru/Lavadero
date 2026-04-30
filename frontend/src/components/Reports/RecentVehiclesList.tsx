import { Clock, Car } from 'lucide-react'
import type { VehicleSearchResult } from '../../types/reports'

interface Props {
  data: VehicleSearchResult[]
  isLoading: boolean
}

export default function RecentVehiclesList({ data, isLoading }: Props) {
  const calculateDuration = (entry: string, exit?: string) => {
    if (!exit) return 'En progreso'
    const entryDate = new Date(entry)
    const exitDate = new Date(exit)
    const minutes = Math.round((exitDate.getTime() - entryDate.getTime()) / 60000)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const avgDuration = data.length > 0
    ? Math.round(
        data.reduce((sum, v) => {
          if (!v.exit_timestamp) return sum
          const mins = (new Date(v.exit_timestamp).getTime() - new Date(v.entry_timestamp).getTime()) / 60000
          return sum + mins
        }, 0) / data.filter(v => v.exit_timestamp).length
      )
    : 0

  const avgHours = Math.floor(avgDuration / 60)
  const avgMins = avgDuration % 60

  return (
    <div className="bg-navy-800 border border-blue-primary/20 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.12)] overflow-hidden animate-fade-in flex flex-col">
      {/* Header */}
      <div className="bg-navy-700/50 border-b border-blue-primary/20 px-6 py-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-primary/10">
          <Clock size={18} className="text-blue-glow" />
        </div>
        <h3 className="text-lg font-semibold text-navy-50">Últimos 5 Vehículos</h3>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-navy-600 border-t-blue-primary animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Car size={24} className="text-navy-600 mb-2" />
            <p className="text-navy-400 text-sm">Sin vehículos en este período</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-navy-700/40 rounded-lg p-3 border border-blue-primary/10 hover:border-blue-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy-50 text-sm">
                      {vehicle.plate.toUpperCase()}
                    </p>
                    <p className="text-xs text-navy-400 truncate">
                      {vehicle.brand} • {vehicle.customer_name}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${
                      vehicle.status === 'completed'
                        ? 'bg-status-green/20 text-status-green'
                        : 'bg-status-yellow/20 text-status-yellow'
                    }`}
                  >
                    {vehicle.status === 'completed' ? 'OK' : 'En prog'}
                  </span>
                </div>
                <p className="text-xs text-navy-300 mt-1.5">
                  {calculateDuration(vehicle.entry_timestamp, vehicle.exit_timestamp)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {data.length > 0 && (
        <div className="border-t border-blue-primary/20 px-6 py-3 bg-navy-700/20">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-navy-400 uppercase tracking-wide">Promedio</p>
              <p className="text-sm font-semibold text-navy-50">
                {avgHours > 0 ? `${avgHours}h ${avgMins}m` : `${avgMins}m`}
              </p>
            </div>
            <div>
              <p className="text-xs text-navy-400 uppercase tracking-wide">Total</p>
              <p className="text-sm font-semibold text-navy-50">{data.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
