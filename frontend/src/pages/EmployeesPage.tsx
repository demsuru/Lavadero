import { useState } from 'react'
import { Plus, Pencil, UserX, User, Mail, Phone, Search } from 'lucide-react'
import { useEmployees } from '../hooks/useEmployees'
import EmployeeModal from '../components/Employees/EmployeeModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import { SkeletonRow } from '../components/common/SkeletonCard'
import { ROLE_LABELS } from '../utils/formatters'
import type { Employee } from '../types'
import clsx from 'clsx'

export default function EmployeesPage() {
  const { employees, isLoading, createEmployee, updateEmployee, deactivateEmployee } = useEmployees()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Employee | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Employee | null>(null)
  const [deactivateLoading, setDeactivateLoading] = useState(false)

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (e: Employee) => { setEditTarget(e); setModalOpen(true) }

  const handleSubmit = async (data: any) => {
    if (editTarget) {
      await updateEmployee(editTarget.id, data)
    } else {
      await createEmployee(data)
    }
  }

  const handleDeactivate = async () => {
    if (!deactivateTarget) return
    setDeactivateLoading(true)
    try {
      await deactivateEmployee(deactivateTarget.id)
    } finally {
      setDeactivateLoading(false)
      setDeactivateTarget(null)
    }
  }

  const activeCount = employees.filter(e => e.status === 'active').length

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-50">Empleados</h1>
          <p className="text-sm text-navy-400 mt-0.5">
            {activeCount} activo{activeCount !== 1 ? 's' : ''} de {employees.length} total
          </p>
        </div>
        <Button icon={<Plus size={15} />} onClick={openCreate}>
          Nuevo empleado
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm bg-navy-800 border border-navy-700 rounded-lg pl-9 pr-3 py-2 text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 border-b border-navy-700 text-xs font-medium text-navy-400 uppercase tracking-wide">
          <span>Empleado</span>
          <span className="w-24 text-center">Rol</span>
          <span className="w-20 text-center">Estado</span>
          <span className="w-20 text-center">Acciones</span>
        </div>

        {isLoading ? (
          <div>{[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <User size={28} className="mx-auto text-navy-600 mb-3" />
            <p className="text-navy-400 text-sm">
              {search ? 'Sin resultados para tu búsqueda' : 'No hay empleados registrados'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-navy-700">
            {filtered.map(emp => (
              <div
                key={emp.id}
                className={clsx(
                  'grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3.5',
                  'hover:bg-navy-750 transition-colors',
                  emp.status === 'inactive' && 'opacity-60'
                )}
              >
                {/* Employee info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-primary/30 to-blue-glow/10 border border-blue-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-glow">
                      {emp.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-100 truncate">{emp.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {emp.email && (
                        <span className="flex items-center gap-1 text-xs text-navy-400 truncate">
                          <Mail size={10} /> {emp.email}
                        </span>
                      )}
                      {emp.phone && (
                        <span className="flex items-center gap-1 text-xs text-navy-400">
                          <Phone size={10} /> {emp.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div className="w-24 text-center">
                  <Badge variant={emp.role === 'admin' ? 'yellow' : emp.role === 'manager' ? 'blue' : 'gray'}>
                    {ROLE_LABELS[emp.role]}
                  </Badge>
                </div>

                {/* Status */}
                <div className="w-20 text-center">
                  <Badge variant={emp.status === 'active' ? 'green' : 'gray'}>
                    {emp.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="w-20 flex items-center justify-center gap-1">
                  <button
                    onClick={() => openEdit(emp)}
                    className="p-1.5 rounded-lg text-navy-400 hover:text-blue-glow hover:bg-blue-primary/10 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  {emp.status === 'active' && (
                    <button
                      onClick={() => setDeactivateTarget(emp)}
                      className="p-1.5 rounded-lg text-navy-400 hover:text-status-red hover:bg-status-red/10 transition-colors"
                      title="Desactivar"
                    >
                      <UserX size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        employee={editTarget}
      />

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title="Desactivar empleado"
        description={`¿Desactivás a ${deactivateTarget?.name}? El empleado no podrá ser asignado a vehículos pero sus registros históricos se conservan.`}
        confirmLabel="Desactivar"
        loading={deactivateLoading}
      />
    </div>
  )
}
