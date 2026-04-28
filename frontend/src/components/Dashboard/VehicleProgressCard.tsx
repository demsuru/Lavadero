import { Clock, User, Car, LogOut } from 'lucide-react'
import { formatTimeAgo } from '../../utils/formatters'
import Badge from '../common/Badge'
import Button from '../common/Button'
import type { Vehicle, Employee, WashType } from '../../types'
import clsx from 'clsx'

interface Props {
  vehicle: Vehicle
  employee?: Employee
  washType?: WashType
  onExit: (id: string) => void
  onEdit?: (vehicle: Vehicle) => void
  exitLoading?: boolean
}

export default function VehicleProgressCard({ vehicle, employee, washType, onExit, onEdit, exitLoading }: Props) {
  return (
    <div className={clsx(
      'glass-card gradient-border rounded-xl p-5 space-y-4 animate-fade-in',
      'hover:border-blue-primary/30 transition-all duration-300',
      'hover:shadow-[0_4px_32px_rgba(37,99,235,0.12)]'
    )}>
      {/* Header - clickeable */}
      <button
        onClick={() => onEdit?.(vehicle)}
        className="w-full flex items-start justify-between hover:opacity-75 transition-opacity text-left"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2.5 rounded-xl bg-blue-primary/10">
            <Car size={18} className="text-blue-glow" />
          </div>
          <div>
            <p className="font-semibold text-navy-50 text-sm">{vehicle.plate}</p>
            <p className="text-xs text-navy-400">{vehicle.brand}</p>
          </div>
        </div>
        <Badge variant="blue" pulse>En progreso</Badge>
      </button>

      {/* Customer */}
      <div className="space-y-1.5">
        <p className="text-sm text-navy-200">{vehicle.customer_name}</p>
        {vehicle.customer_phone && (
          <p className="text-xs text-navy-400">{vehicle.customer_phone}</p>
        )}
      </div>

      {/* Info row */}
      <div className="flex items-center gap-4 text-xs text-navy-400">
        <span className="flex items-center gap-1.5">
          <User size={12} />
          {employee?.name ?? '—'}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} />
          {formatTimeAgo(vehicle.entry_timestamp)}
        </span>
      </div>

      {/* Wash type + price */}
      {washType && (
        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-navy-900/60 border border-navy-700">
          <span className="text-xs text-navy-300">{washType.name}</span>
          <span className="text-sm font-semibold text-navy-50">
            ${washType.price.toLocaleString('es-AR')}
          </span>
        </div>
      )}

      {/* Exit button */}
      <Button
        variant="secondary"
        size="sm"
        className="w-full justify-center hover:bg-status-green/10 hover:border-status-green/30 hover:text-status-green"
        icon={<LogOut size={14} />}
        loading={exitLoading}
        onClick={() => onExit(vehicle._id)}
      >
        Registrar salida
      </Button>
    </div>
  )
}
