import clsx from 'clsx'
import type { FC } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: FC<{ size?: number; className?: string }>
  trend?: {
    value: string | number
    isPositive: boolean
  }
}

const colorStyles = {
  default: {
    bg: 'bg-blue-primary/10',
    icon: 'text-blue-primary',
    border: 'border-blue-primary/20',
    glow: 'shadow-[0_0_20px_rgba(37,99,235,0.12)]',
  },
}

export default function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  const styles = colorStyles.default

  return (
    <div
      className={clsx(
        'bg-navy-800 rounded-xl p-6 border flex items-start gap-4',
        styles.border,
        styles.glow,
      )}
    >
      <div className={clsx('p-3 rounded-xl flex-shrink-0', styles.bg)}>
        <Icon size={24} className={styles.icon} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-navy-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-navy-50">{value}</p>
        {trend && (
          <p className={clsx('text-xs mt-2', trend.isPositive ? 'text-status-green' : 'text-status-red')}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </div>
  )
}
