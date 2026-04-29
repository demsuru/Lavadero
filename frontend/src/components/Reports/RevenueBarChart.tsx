import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { TrendingUp } from 'lucide-react'
import type { DailyRevenue } from '../../types/reports'

interface RevenueBarChartProps {
  data: DailyRevenue[]
  isLoading: boolean
}

export default function RevenueBarChart({ data, isLoading }: RevenueBarChartProps) {
  if (isLoading) {
    return (
      <div className="bg-navy-800 border border-blue-primary/20 rounded-xl p-6 h-80 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.12)]">
        <div className="w-8 h-8 rounded-full border-2 border-navy-600 border-t-blue-primary animate-spin" />
      </div>
    )
  }

  const chartData = data.map(item => ({
    ...item,
    displayDay: format(parseISO(item.day), 'dd/MM'),
  }))

  return (
    <div className="bg-navy-800 border border-blue-primary/20 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.12)] overflow-hidden animate-fade-in">
      <div className="bg-navy-700/50 border-b border-blue-primary/20 px-6 py-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-primary/10">
          <TrendingUp size={20} className="text-blue-glow" />
        </div>
        <h3 className="text-lg font-semibold text-navy-50">Ingresos por Día</h3>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={315}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey="displayDay"
            stroke="rgba(148,163,184,0.3)"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="rgba(148,163,184,0.3)"
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value: number) => `$${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(37,99,235,0.3)',
              borderRadius: '6px',
              color: '#f1f5f9',
              padding: '8px 12px',
            }}
            cursor={{ fill: 'rgba(37,99,235,0.05)' }}
          />
          <Bar
            dataKey="revenue"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
