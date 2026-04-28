import clsx from 'clsx'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  children: React.ReactNode
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

const inputBase = 'w-full bg-navy-900 border border-navy-600 rounded-lg px-3 py-2 text-sm text-navy-50 placeholder-navy-400 focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors'

export function FormInput({ label, error, hint, className, ...props }: FormInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-navy-300 uppercase tracking-wide">{label}</label>
      <input className={clsx(inputBase, error && 'border-status-red', className)} {...props} />
      {hint && <p className="text-xs text-navy-400">{hint}</p>}
      {error && <p className="text-xs text-status-red">{error}</p>}
    </div>
  )
}

export function FormSelect({ label, error, children, className, ...props }: FormSelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-navy-300 uppercase tracking-wide">{label}</label>
      <select
        className={clsx(inputBase, 'cursor-pointer', error && 'border-status-red', className)}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-status-red">{error}</p>}
    </div>
  )
}

export function FormTextarea({ label, error, className, ...props }: FormTextareaProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-navy-300 uppercase tracking-wide">{label}</label>
      <textarea
        rows={3}
        className={clsx(inputBase, 'resize-none', error && 'border-status-red', className)}
        {...props}
      />
      {error && <p className="text-xs text-status-red">{error}</p>}
    </div>
  )
}
