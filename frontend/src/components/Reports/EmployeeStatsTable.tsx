import { Users } from 'lucide-react'
import type { EmployeeStats } from '../../types/reports'

interface EmployeeStatsTableProps {
  data: EmployeeStats[]
  isLoading: boolean
}

export default function EmployeeStatsTable({ data, isLoading }: EmployeeStatsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-navy-800 border border-blue-primary/20 rounded-xl p-4 flex items-center justify-center h-80 shadow-[0_0_20px_rgba(37,99,235,0.12)]">
        <div className="w-8 h-8 rounded-full border-2 border-navy-600 border-t-blue-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-navy-800 border border-blue-primary/20 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.12)] overflow-hidden animate-fade-in">
      <div className="bg-navy-700/50 border-b border-blue-primary/20 px-4 py-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-primary/10">
          <Users size={18} className="text-blue-glow" />
        </div>
        <h3 className="text-base font-semibold text-navy-50">Reporte de Empleados</h3>
      </div>
      <div className="p-4 overflow-y-auto max-h-80">

        {data.length === 0 ? (
          <div className="p-4 text-center text-navy-400 text-sm">
            No hay datos disponibles para el período seleccionado
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-navy-700/50 border-b border-blue-primary/20">
                <th className="px-3 py-2 text-left font-semibold text-navy-100">
                  Empleado
                </th>
                <th className="px-3 py-2 text-right font-semibold text-navy-100">
                  Autos
                </th>
                <th className="px-3 py-2 text-right font-semibold text-navy-100">
                  Ingresos
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
                  <td className="px-3 py-2 font-medium text-navy-50">
                    {stat.employee_name}
                  </td>
                  <td className="px-3 py-2 text-right text-navy-200">
                    {stat.total_cars}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-status-green">
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
