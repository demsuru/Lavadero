import { useState } from 'react'
import { Search, Download } from 'lucide-react'
import { useVehicleSearch } from '../../hooks/useReports'
import { reportsService } from '../../services/reportsService'
import Button from '../common/Button'
import type { VehicleSearchResult } from '../../types/reports'

export default function VehicleSearchPanel() {
  const [mode, setMode] = useState<'plate' | 'date'>('plate')
  const [plate, setPlate] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [searchParams, setSearchParams] = useState<{
    plate?: string
    dateFrom?: string
    dateTo?: string
  } | null>(null)

  const handleDownloadInvoice = async (vehicleId: string, vehiclePlate: string) => {
    try {
      const blob = await reportsService.downloadInvoice(vehicleId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `factura-${vehiclePlate}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading invoice:', err)
    }
  }

  const { data, isLoading } = useVehicleSearch(
    searchParams?.plate,
    searchParams?.dateFrom,
    searchParams?.dateTo
  )

  const handleSearchByPlate = () => {
    if (plate.trim()) {
      setSearchParams({ plate: plate.trim() })
    }
  }

  const handleSearchByDate = () => {
    if (dateFrom && dateTo) {
      setSearchParams({ dateFrom, dateTo })
    }
  }

  return (
    <div className="bg-navy-800 border border-blue-primary/20 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.12)] overflow-hidden animate-fade-in">
      <div className="bg-navy-700/50 border-b border-blue-primary/20 px-6 py-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-primary/10">
          <Search size={20} className="text-blue-glow" />
        </div>
        <h3 className="text-lg font-semibold text-navy-50">Búsqueda de Vehículos</h3>
      </div>
      <div className="p-6">

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-blue-primary/20">
        <button
          onClick={() => {
            setMode('plate')
            setSearchParams(null)
          }}
          className={`pb-3 font-medium transition-colors ${
            mode === 'plate'
              ? 'text-blue-primary border-b-2 border-blue-primary'
              : 'text-navy-300 hover:text-navy-100'
          }`}
        >
          Por Placa
        </button>
        <button
          onClick={() => {
            setMode('date')
            setSearchParams(null)
          }}
          className={`pb-3 font-medium transition-colors ${
            mode === 'date'
              ? 'text-blue-primary border-b-2 border-blue-primary'
              : 'text-navy-300 hover:text-navy-100'
          }`}
        >
          Por Fecha
        </button>
      </div>

      {/* Search Inputs */}
      <div className="mb-6">
        {mode === 'plate' ? (
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ingrese placa (ej: ABC-123)"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="flex-1 px-4 py-2 border border-blue-primary/20 rounded-lg bg-navy-700 text-navy-50 placeholder-navy-400 focus:outline-none focus:border-blue-primary"
            />
            <button
              onClick={handleSearchByPlate}
              className="px-6 py-2 bg-blue-primary text-white rounded-lg font-medium hover:bg-blue-hover transition-colors"
            >
              Buscar
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-navy-100 mb-2">
                Desde
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-blue-primary/20 rounded-lg bg-navy-700 text-navy-50 focus:outline-none focus:border-blue-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-navy-100 mb-2">
                Hasta
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-blue-primary/20 rounded-lg bg-navy-700 text-navy-50 focus:outline-none focus:border-blue-primary"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearchByDate}
                className="px-6 py-2 bg-blue-primary text-white rounded-lg font-medium hover:bg-blue-hover transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 rounded-full border-2 border-navy-600 border-t-blue-primary animate-spin" />
        </div>
      )}

      {!isLoading && searchParams && (
        <>
          {data.length === 0 ? (
            <div className="text-center py-8 text-navy-400">
              No se encontraron vehículos con los criterios especificados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-700/50 border-b border-blue-primary/20">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-navy-100">
                      Placa
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-navy-100">
                      Marca
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-navy-100">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-navy-100">
                      Entrada
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-navy-100">
                      Salida
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-navy-100">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-navy-100">
                      Factura
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((vehicle, idx) => (
                    <tr
                      key={vehicle.id}
                      className={`border-b border-blue-primary/10 hover:bg-navy-700/30 transition-colors ${
                        idx % 2 === 0 ? 'bg-navy-800' : 'bg-navy-700/20'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-navy-50">
                        {vehicle.plate}
                      </td>
                      <td className="px-4 py-3 text-sm text-navy-200">
                        {vehicle.brand}
                      </td>
                      <td className="px-4 py-3 text-sm text-navy-200">
                        {vehicle.customer_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-navy-300">
                        {new Date(vehicle.entry_timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-navy-300">
                        {vehicle.exit_timestamp
                          ? new Date(vehicle.exit_timestamp).toLocaleString()
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            vehicle.status === 'completed'
                              ? 'bg-status-green/20 text-status-green'
                              : 'bg-status-yellow/20 text-status-yellow'
                          }`}
                        >
                          {vehicle.status === 'completed' ? 'Completado' : 'En progreso'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Download size={13} />}
                          onClick={() => handleDownloadInvoice(vehicle.id, vehicle.plate)}
                          disabled={vehicle.status !== 'completed'}
                        >
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  )
}
