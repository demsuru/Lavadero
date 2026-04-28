import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:   'bg-blue-primary hover:bg-blue-hover text-white shadow-[0_0_12px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]',
  secondary: 'bg-navy-700 hover:bg-navy-600 text-navy-100 border border-navy-600',
  danger:    'bg-status-red/10 hover:bg-status-red/20 text-status-red border border-status-red/30',
  ghost:     'hover:bg-navy-700 text-navy-300 hover:text-navy-100',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-blue-primary/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  )
}
