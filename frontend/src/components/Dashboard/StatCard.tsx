import clsx from 'clsx'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'yellow' | 'purple'
  subtitle?: string
}

const colors = {
  blue:   { bg: 'bg-blue-primary/10', icon: 'text-blue-glow', border: 'border-blue-primary/20', glow: 'shadow-[0_0_20px_rgba(37,99,235,0.12)]' },
  green:  { bg: 'bg-status-green/10', icon: 'text-status-green', border: 'border-status-green/20', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.12)]' },
  yellow: { bg: 'bg-status-yellow/10', icon: 'text-status-yellow', border: 'border-status-yellow/20', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.12)]' },
  purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', border: 'border-purple-500/20', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.12)]' },
}

export default function StatCard({ label, value, icon, color, subtitle }: StatCardProps) {
  const c = colors[color]
  return (
    <div className={clsx(
      'bg-navy-800 rounded-xl p-5 border flex items-center gap-4 animate-fade-in',
      c.border, c.glow
    )}>
      <div className={clsx('p-3 rounded-xl flex-shrink-0', c.bg)}>
        <span className={c.icon}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-navy-50 leading-none animate-count-up">{value}</p>
        <p className="text-xs text-navy-400 mt-1">{label}</p>
        {subtitle && <p className="text-xs text-navy-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}
