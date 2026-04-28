import { useState } from 'react'
import { Car, CheckCircle, DollarSign, Users, RefreshCw } from 'lucide-react'
import { useVehiclesInProgress } from '../hooks/useVehicles'
import { useEmployees } from '../hooks/useEmployees'
import { useWashTypes } from '../hooks/useWashTypes'
import StatCard from '../components/Dashboard/StatCard'
import VehicleProgressCard from '../components/Dashboard/VehicleProgressCard'
import VehicleEditModal from '../components/Vehicles/VehicleEditModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import SkeletonCard from '../components/common/SkeletonCard'
import Button from '../components/common/Button'
import { formatCurrency } from '../utils/formatters'
import type { Vehicle } from '../types'

export default function Dashboard() {
  const { vehicles, isLoading, exitVehicle, updateVehicle, refresh } = useVehiclesInProgress()
  const { employees } = useEmployees()
  const { washTypes } = useWashTypes()

  const [exitTarget, setExitTarget] = useState<string | null>(null)
  const [exitLoading, setExitLoading] = useState(false)
  const [exitError, setExitError] = useState<string | null>(null)

  const [editTarget, setEditTarget] = useState<Vehicle | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const completedToday = 0
  const revenueToday = vehicles.reduce((acc, v) => {
    const wt = washTypes.find(w => w.id === v.wash_type_id)
    return acc + (wt?.price ?? 0)
  }, 0)

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

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditTarget(vehicle)
    setEditModalOpen(true)
  }

  const handleUpdateVehicle = async (vehicleId: string, data: { assigned_employee_id?: string; entry_timestamp?: string }) => {
    await updateVehicle(vehicleId, data)
  }

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-50">{greeting} 👋</h1>
          <p className="text-sm text-navy-400 mt-0.5">
            {now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<RefreshCw size={14} />}
          onClick={() => refresh()}
        >
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="En progreso ahora"
          value={vehicles.length}
          icon={<Car size={20} />}
          color="blue"
          subtitle="vehículos activos"
        />
        <StatCard
          label="Completados hoy"
          value={completedToday}
          icon={<CheckCircle size={20} />}
          color="green"
          subtitle="lavados terminados"
        />
        <StatCard
          label="Facturado hoy"
          value={formatCurrency(revenueToday)}
          icon={<DollarSign size={20} />}
          color="yellow"
          subtitle="en progreso"
        />
        <StatCard
          label="Empleados activos"
          value={employees.filter(e => e.status === 'active').length}
          icon={<Users size={20} />}
          color="purple"
          subtitle="registrados"
        />
      </div>

      {/* Live Board */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-glow opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-glow" />
          </div>
          <h2 className="text-sm font-semibold text-navy-200">Tablero en vivo</h2>
          <span className="text-xs text-navy-500">— actualiza cada 30 seg</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center mb-4">
              <Car size={28} className="text-navy-500" />
            </div>
            <p className="text-navy-300 font-medium">Sin vehículos en progreso</p>
            <p className="text-navy-500 text-sm mt-1">Registrá la entrada de un vehículo para verlo aquí</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {vehicles.map(vehicle => (
              <VehicleProgressCard
                key={vehicle._id}
                vehicle={vehicle}
                employee={employees.find(e => e.id === vehicle.assigned_employee_id)}
                washType={washTypes.find(w => w.id === vehicle.wash_type_id)}
                onExit={setExitTarget}
                onEdit={handleEditVehicle}
                exitLoading={exitLoading && exitTarget === vehicle._id}
              />
            ))}
          </div>
        )}
      </div>

      <VehicleEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdateVehicle}
        vehicle={editTarget}
        employees={employees}
      />

      <ConfirmDialog
        open={!!exitTarget}
        onClose={() => { setExitTarget(null); setExitError(null) }}
        onConfirm={handleConfirmExit}
        title="Registrar salida"
        description={exitError ? exitError : "¿Confirmás la salida de este vehículo? Se generará la transacción automáticamente."}
        confirmLabel="Sí, registrar salida"
        loading={exitLoading}
        variant={exitError ? "danger" : "warning"}
      />
    </div>
  )
}
