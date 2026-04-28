import { useEffect } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={clsx(
        'relative w-full glass-card gradient-border rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.6)]',
        'animate-fade-in',
        sizes[size]
      )}>
        <div className="flex items-center justify-between p-5 border-b border-navy-700">
          <h2 className="text-base font-semibold text-navy-50">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-navy-400 hover:text-navy-100 hover:bg-navy-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
