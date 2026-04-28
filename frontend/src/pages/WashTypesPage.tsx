import { useState } from 'react'
import { Plus, Pencil, PowerOff, Power, Droplets, DollarSign } from 'lucide-react'
import { useWashTypes } from '../hooks/useWashTypes'
import Modal from '../components/common/Modal'
import { FormInput, FormTextarea } from '../components/common/FormInput'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import ConfirmDialog from '../components/common/ConfirmDialog'
import type { WashType } from '../types'
import clsx from 'clsx'

interface FormState { name: string; description: string; price: string }
const emptyForm: FormState = { name: '', description: '', price: '' }

export default function WashTypesPage() {
  const { washTypes, isLoading, createWashType, updateWashType, deactivateWashType } = useWashTypes()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<WashType | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formErrors, setFormErrors] = useState<Partial<FormState>>({})
  const [formLoading, setFormLoading] = useState(false)
  const [toggleTarget, setToggleTarget] = useState<WashType | null>(null)
  const [toggleLoading, setToggleLoading] = useState(false)

  const openCreate = () => {
    setEditTarget(null)
    setForm(emptyForm)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (wt: WashType) => {
    setEditTarget(wt)
    setForm({ name: wt.name, description: wt.description ?? '', price: String(wt.price) })
    setFormErrors({})
    setModalOpen(true)
  }

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setFormErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Requerido'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Ingresá un precio válido'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setFormLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
      }
      if (editTarget) {
        await updateWashType(editTarget.id, payload)
      } else {
        await createWashType(payload)
      }
      setModalOpen(false)
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggle = async () => {
    if (!toggleTarget) return
    setToggleLoading(true)
    try {
      if (toggleTarget.status === 'active') {
        await deactivateWashType(toggleTarget.id)
      } else {
        await updateWashType(toggleTarget.id, { status: 'active' })
      }
    } finally {
      setToggleLoading(false)
      setToggleTarget(null)
    }
  }

  const active = washTypes.filter(w => w.status === 'active')
  const inactive = washTypes.filter(w => w.status === 'inactive')

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-50">Tipos de Lavado</h1>
          <p className="text-sm text-navy-400 mt-0.5">
            {active.length} activo{active.length !== 1 ? 's' : ''}
            {inactive.length > 0 && ` · ${inactive.length} inactivo${inactive.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button icon={<Plus size={15} />} onClick={openCreate}>
          Nuevo tipo
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)}
        </div>
      ) : washTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center mb-5">
            <Droplets size={32} className="text-navy-500" />
          </div>
          <p className="text-navy-200 font-medium text-lg">Sin tipos de lavado</p>
          <p className="text-navy-500 text-sm mt-2 mb-6">Crea los tipos de lavado que ofrecés (básico, completo, etc.)</p>
          <Button icon={<Plus size={15} />} onClick={openCreate}>Crear tipo de lavado</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {washTypes.map(wt => (
            <div
              key={wt.id}
              className={clsx(
                'bg-navy-800 rounded-xl border p-5 space-y-4 transition-all duration-300',
                wt.status === 'active'
                  ? 'border-navy-700 hover:border-blue-primary/30 hover:shadow-[0_4px_24px_rgba(37,99,235,0.1)]'
                  : 'border-navy-700 opacity-60'
              )}
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'p-2.5 rounded-xl',
                    wt.status === 'active' ? 'bg-blue-primary/10' : 'bg-navy-700'
                  )}>
                    <Droplets size={18} className={wt.status === 'active' ? 'text-blue-glow' : 'text-navy-500'} />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-50 text-sm">{wt.name}</p>
                  </div>
                </div>
                <Badge variant={wt.status === 'active' ? 'green' : 'gray'}>
                  {wt.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>

              {/* Description */}
              {wt.description ? (
                <p className="text-xs text-navy-400 leading-relaxed">{wt.description}</p>
              ) : (
                <p className="text-xs text-navy-600 italic">Sin descripción</p>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-navy-900/60 border border-navy-700">
                <DollarSign size={14} className="text-status-yellow" />
                <span className="text-lg font-bold text-navy-50">
                  ${wt.price.toLocaleString('es-AR')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Pencil size={13} />}
                  className="flex-1 justify-center"
                  onClick={() => openEdit(wt)}
                >
                  Editar
                </Button>
                <Button
                  variant={wt.status === 'active' ? 'danger' : 'ghost'}
                  size="sm"
                  icon={wt.status === 'active' ? <PowerOff size={13} /> : <Power size={13} />}
                  className="flex-1 justify-center"
                  onClick={() => setToggleTarget(wt)}
                >
                  {wt.status === 'active' ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Editar tipo de lavado' : 'Nuevo tipo de lavado'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Nombre"
            placeholder="Ej: Lavado básico"
            value={form.name}
            onChange={set('name')}
            error={formErrors.name}
            autoFocus
          />
          <FormTextarea
            label="Descripción (opcional)"
            placeholder="Descripción del servicio..."
            value={form.description}
            onChange={set('description')}
          />
          <FormInput
            label="Precio (ARS)"
            placeholder="1500"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={set('price')}
            error={formErrors.price}
          />
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center" loading={formLoading}>
              {editTarget ? 'Guardar cambios' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggle}
        title={toggleTarget?.status === 'active' ? 'Desactivar tipo de lavado' : 'Activar tipo de lavado'}
        description={
          toggleTarget?.status === 'active'
            ? `¿Desactivás "${toggleTarget?.name}"? No podrá asignarse a nuevos vehículos.`
            : `¿Activás "${toggleTarget?.name}"? Volverá a estar disponible para asignar.`
        }
        confirmLabel={toggleTarget?.status === 'active' ? 'Desactivar' : 'Activar'}
        loading={toggleLoading}
        variant={toggleTarget?.status === 'active' ? 'danger' : 'warning'}
      />
    </div>
  )
}
