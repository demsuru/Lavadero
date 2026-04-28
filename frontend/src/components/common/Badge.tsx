import clsx from 'clsx'

type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  pulse?: boolean
}

const styles: Record<BadgeVariant, string> = {
  blue:   'bg-blue-primary/15 text-blue-glow border-blue-primary/30',
  green:  'bg-status-green/15 text-status-green border-status-green/30',
  yellow: 'bg-status-yellow/15 text-status-yellow border-status-yellow/30',
  red:    'bg-status-red/15 text-status-red border-status-red/30',
  gray:   'bg-navy-700 text-navy-300 border-navy-600',
}

export default function Badge({ variant, children, pulse }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles[variant]
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={clsx(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            variant === 'blue' ? 'bg-blue-glow' : variant === 'green' ? 'bg-status-green' : 'bg-status-yellow'
          )} />
          <span className={clsx(
            'relative inline-flex rounded-full h-2 w-2',
            variant === 'blue' ? 'bg-blue-glow' : variant === 'green' ? 'bg-status-green' : 'bg-status-yellow'
          )} />
        </span>
      )}
      {children}
    </span>
  )
}
