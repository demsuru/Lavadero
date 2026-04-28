import Modal from './Modal'
import Button from './Button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  variant?: 'danger' | 'warning'
}

export default function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirmar', loading = false, variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className={`p-2 rounded-lg flex-shrink-0 ${variant === 'danger' ? 'bg-status-red/15' : 'bg-status-yellow/15'}`}>
            <AlertTriangle size={18} className={variant === 'danger' ? 'text-status-red' : 'text-status-yellow'} />
          </div>
          <p className="text-sm text-navy-300 leading-relaxed">{description}</p>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancelar</Button>
          <Button
            variant="danger"
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
