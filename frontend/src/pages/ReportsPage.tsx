import { useState } from 'react'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import ReportFilters from '../components/Reports/ReportFilters'
import RevenueBarChart from '../components/Reports/RevenueBarChart'
import EmployeeStatsTable from '../components/Reports/EmployeeStatsTable'
import RecentVehiclesList from '../components/Reports/RecentVehiclesList'
import VehicleSearchPanel from '../components/Reports/VehicleSearchPanel'
import StatCard from '../components/Reports/StatCard'
import { useReportSummary, useRevenueChart, useEmployeeStats, useRecentVehicles } from '../hooks/useReports'
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react'

export default function ReportsPage() {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

  const [startDate, setStartDate] = useState(format(weekStart, 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(weekEnd, 'yyyy-MM-dd'))

  const { data: summary, isLoading: summaryLoading } = useReportSummary(startDate, endDate)
  const { data: revenueData, isLoading: revenueLoading } = useRevenueChart(startDate, endDate)
  const { data: employeeData, isLoading: employeeLoading } = useEmployeeStats(startDate, endDate)
  const { data: recentVehicles, isLoading: recentLoading } = useRecentVehicles(startDate, endDate)

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <div className="p-6 space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-primary/10 rounded-xl border border-blue-primary/20">
          <BarChart3 className="w-6 h-6 text-blue-glow" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-navy-50">Reportes</h1>
          <p className="text-navy-400 mt-1">Análisis detallado de operaciones y finanzas</p>
        </div>
      </div>

      {/* Filters */}
      <ReportFilters onDateChange={handleDateChange} />

      {/* Summary Cards + Revenue Chart Layout */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Summary Cards */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-navy-800 border border-status-green/20 rounded-xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.12)] animate-fade-in hover:border-status-green/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-status-green/10">
                  <DollarSign size={24} className="text-status-green" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-navy-400 uppercase tracking-wide mb-1">Total de Ingresos</p>
                  <p className="text-3xl font-bold text-navy-50">${summary.total_revenue.toFixed(2)}</p>
                  <p className="text-xs mt-3 text-status-green font-medium">
                    ↑ ${summary.total_revenue.toFixed(2)} en el período
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-navy-800 border border-blue-primary/20 rounded-xl p-6 shadow-[0_0_20px_rgba(37,99,235,0.12)] animate-fade-in hover:border-blue-primary/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-primary/10">
                  <TrendingUp size={24} className="text-blue-glow" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-navy-400 uppercase tracking-wide mb-1">Total de Vehículos</p>
                  <p className="text-3xl font-bold text-navy-50">{summary.total_vehicles}</p>
                  <p className="text-xs mt-3 text-blue-primary font-medium">
                    ↑ {summary.total_vehicles} vehículos procesados
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-navy-800 border border-status-yellow/20 rounded-xl p-6 shadow-[0_0_20px_rgba(234,179,8,0.12)] animate-fade-in hover:border-status-yellow/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-status-yellow/10">
                  <BarChart3 size={24} className="text-status-yellow" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-navy-400 uppercase tracking-wide mb-1">Promedio por Vehículo</p>
                  <p className="text-3xl font-bold text-navy-50">${summary.avg_per_vehicle.toFixed(2)}</p>
                  <p className="text-xs mt-3 text-status-yellow font-medium">
                    ↑ ${summary.avg_per_vehicle.toFixed(2)} por lavado
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Revenue Chart */}
          <div className="lg:col-span-2">
            <RevenueBarChart data={revenueData} isLoading={revenueLoading} />
          </div>
        </div>
      )}

      {/* Employee Stats + Recent Vehicles Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Employee Stats */}
        <EmployeeStatsTable data={employeeData} isLoading={employeeLoading} />

        {/* Right: Recent Vehicles */}
        <RecentVehiclesList data={recentVehicles} isLoading={recentLoading} />
      </div>

      {/* Vehicle Search */}
      <VehicleSearchPanel />
    </div>
  )
}
