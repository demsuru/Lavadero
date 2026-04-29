import { Users } from 'lucide-react'
import type { EmployeeStats } from '../../types/reports'

interface EmployeeStatsTableProps {
  data: EmployeeStats[]
  isLoading: boolean
}

export default function EmployeeStatsTable({ data, isLoading }: EmployeeStatsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-navy-800 border border-blue-primary/20 rounded-xl p-6 flex items-center justify-center h-64 shadow-[0_0_20px_rgba(37,99,235,0.12)]">
        <div className="w-8 h-8 rounded-full border-2 border-navy-600 border-t-blue-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-navy-800 border border-blue-primary/20 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.12)] overflow-hidden animate-fade-in">
      <div className="bg-navy-700/50 border-b border-blue-primary/20 px-6 py-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-primary/10">
          <Users size={20} className="text-blue-glow" />
        </div>
        <h3 className="text-lg font-semibold text-navy-50">Reporte de Empleados</h3>
      </div>
      <div className="p-6">

        {data.length === 0 ? (
          <div className="p-6 text-center text-navy-400">
            No hay datos disponibles para el período seleccionado
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-navy-700/50 border-b border-blue-primary/20">
                <th className="px-6 py-3 text-left text-sm font-semibold text-navy-100">
                  Empleado
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-navy-100">
                  Autos Lavados
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-navy-100">
                  Ingresos Generados
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((stat, idx) => (
                <tr
                  key={stat.employee_id}
                  className={`border-b border-blue-primary/10 hover:bg-navy-700/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-navy-800' : 'bg-navy-700/20'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-navy-50">
                    {stat.employee_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-navy-200">
                    {stat.total_cars}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-status-green">
                    ${stat.total_revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  )
}
