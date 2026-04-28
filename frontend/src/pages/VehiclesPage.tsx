import { useState } from 'react'
import { Plus, Car, LogOut, Clock, User } from 'lucide-react'
import { useVehiclesInProgress } from '../hooks/useVehicles'
import { useEmployees } from '../hooks/useEmployees'
import { useWashTypes } from '../hooks/useWashTypes'
import VehicleEntryDrawer from '../components/Vehicles/VehicleEntryDrawer'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import SkeletonCard from '../components/common/SkeletonCard'
import { formatTimeAgo } from '../utils/formatters'
import clsx from 'clsx'

export default function VehiclesPage() {
  const { vehicles, isLoading, enterVehicle, exitVehicle } = useVehiclesInProgress()
  const { employees } = useEmployees()
  const { washTypes } = useWashTypes()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [exitTarget, setExitTarget] = useState<string | null>(null)
  const [exitLoading, setExitLoading] = useState(false)
  const [exitError, setExitError] = useState<string | null>(null)

  const handleConfirmExit = async () => {
    if (!exitTarget) return
    setExitLoading(true)
    setExitError(null)
    try {
      await exitVehicle(exitTarget)
      setExitTarget(null)
    } catch (err) {
      console.error('Exit vehicle error:', err)
      setExitError(err instanceof Error ? err.message : 'Error al registrar salida')
    } finally {
      setExitLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-50">Vehículos</h1>
          <p className="text-sm text-navy-400 mt-0.5">
            {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''} en progreso
          </p>
        </div>
        <Button icon={<Plus size={15} />} onClick={() => setDrawerOpen(true)}>
          Nueva entrada
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center mb-5">
            <Car size={32} className="text-navy-500" />
          </div>
          <p className="text-navy-200 font-medium text-lg">Sin vehículos en progreso</p>
          <p className="text-navy-500 text-sm mt-2 mb-6">Registrá la entrada de un vehículo para comenzar</p>
          <Button icon={<Plus size={15} />} onClick={() => setDrawerOpen(true)}>
            Registrar entrada
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {vehicles.map(vehicle => {
            const employee = employees.find(e => e.id === vehicle.assigned_employee_id)
            const washType = washTypes.find(w => w.id === vehicle.wash_type_id)
            return (
              <div
                key={vehicle._id}
                className={clsx(
                  'glass-card gradient-border rounded-xl p-5 space-y-4',
                  'hover:shadow-[0_4px_32px_rgba(37,99,235,0.12)] transition-all duration-300'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-primary/10">
                      <Car size={18} className="text-blue-glow" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-50">{vehicle.plate}</p>
                      <p className="text-xs text-navy-400">{vehicle.brand}</p>
                    </div>
                  </div>
                  <Badge variant="blue" pulse>En progreso</Badge>
                </div>

                <div>
                  <p className="text-sm text-navy-200 font-medium">{vehicle.customer_name}</p>
                  {vehicle.customer_phone && (
                    <p className="text-xs text-navy-400 mt-0.5">{vehicle.customer_phone}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-navy-400">
                  <span className="flex items-center gap-1.5">
                    <User size={12} /> {employee?.name ?? '—'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> {formatTimeAgo(vehicle.entry_timestamp)}
                  </span>
                </div>

                {washType && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-navy-900/60 border border-navy-700">
                    <span className="text-xs text-navy-300">{washType.name}</span>
                    <span className="text-sm font-semibold text-navy-50">
                      ${washType.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                )}

                {vehicle.notes && (
                  <p className="text-xs text-navy-400 italic bg-navy-900/40 px-3 py-2 rounded-lg">
                    {vehicle.notes}
                  </p>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center hover:bg-status-green/10 hover:border-status-green/30 hover:text-status-green"
                  icon={<LogOut size={14} />}
                  onClick={() => setExitTarget(vehicle._id)}
                >
                  Registrar salida
                </Button>
              </div>
            )
          })}
        </div>
      )}

      <VehicleEntryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={async (data) => { await enterVehicle(data) }}
        employees={employees}
        washTypes={washTypes}
      />

      <ConfirmDialog
        open={!!exitTarget}
        onClose={() => { setExitTarget(null); setExitError(null) }}
        onConfirm={handleConfirmExit}
        title="Registrar salida"
        description={exitError ? exitError : "¿Confirmás la salida de este vehículo? Se generará la transacción automáticamente y no podrá revertirse."}
        confirmLabel="Confirmar salida"
        loading={exitLoading}
        variant={exitError ? "danger" : "warning"}
      />
    </div>
  )
}
