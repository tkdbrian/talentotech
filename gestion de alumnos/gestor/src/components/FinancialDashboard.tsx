import React, { useState, useMemo } from 'react'

// Datos constantes fuera del componente
const MONTHLY_TOTALS_2024 = {
  january: 456080, february: 673725, march: 1443840, april: 1663876, 
  may: 1836875, june: 1957025, july: 2872600, august: 2329825,
  september: 2754300, october: 2047250, november: 4017300, december: 2954250
}

const MONTHLY_TOTALS_2025 = {
  january: 1017900, february: 1250400, march: 2685100, april: 3709000,
  may: 3559300, june: 4692500, july: 4336900, august: 4488500,
  september: 4200150, october: 3456400, november: 0, december: 0
}

interface StudentPaymentSummary {
  studentName: string
  january: number
  february: number
  march: number
  april: number
  may: number
  june: number
  july: number
  august: number
  september: number
  october: number
  november: number
  december: number
  total: number
  averageMonthly: number
  paidMonths: number
}

const FinancialDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'students' | 'comparisons' | 'projections'>('overview')
  const [selectedYear, setSelectedYear] = useState(2025)
  
  // Usar datos constantes

  const studentPayments2025: StudentPaymentSummary[] = [
    { studentName: 'coral- maia vieyres', january: 49500, february: 51800, march: 55000, april: 55920, may: 63050, june: 65650, july: 73930, august: 74600, september: 116550, october: 112000, november: 0, december: 0, total: 733900, averageMonthly: 73390, paidMonths: 10 },
    { studentName: 'Agustin Felgaer', january: 27000, february: 30000, march: 32000, april: 39100, may: 44400, june: 43700, july: 40000, august: 48300, september: 101200, october: 0, november: 0, december: 0, total: 402700, averageMonthly: 44744, paidMonths: 9 },
    { studentName: 'Adam Luke Goldstein', january: 0, february: 0, march: 30000, april: 94000, may: 100000, june: 83000, july: 50000, august: 42000, september: 88900, october: 0, november: 0, december: 0, total: 383200, averageMonthly: 54743, paidMonths: 7 },
    { studentName: 'Rafael / Lucas Chazarreta', january: 51800, february: 55500, march: 59200, april: 62900, may: 66600, june: 70300, july: 74000, august: 77700, september: 81400, october: 0, november: 0, december: 0, total: 599400, averageMonthly: 66600, paidMonths: 9 },
    { studentName: 'Barbara Marcano', january: 0, february: 0, march: 0, april: 0, may: 34000, june: 34000, july: 57000, august: 40000, september: 63000, october: 66000, november: 0, december: 0, total: 314000, averageMonthly: 52333, paidMonths: 6 },
    { studentName: 'Lucas Cardozo', january: 40500, february: 28000, march: 45000, april: 48000, may: 51000, june: 54000, july: 57000, august: 60000, september: 42000, october: 44000, november: 0, december: 0, total: 469500, averageMonthly: 46950, paidMonths: 10 },
    { studentName: 'Jana Sidi', january: 0, february: 0, march: 32000, april: 34000, may: 36000, june: 57000, july: 40000, august: 42000, september: 44000, october: 0, november: 0, december: 0, total: 285000, averageMonthly: 40714, paidMonths: 7 },
    { studentName: 'Fernanda Naime', january: 27000, february: 28000, march: 30000, april: 34000, may: 36000, june: 40000, july: 42000, august: 42000, september: 44000, october: 0, november: 0, december: 0, total: 321000, averageMonthly: 35667, paidMonths: 9 }
  ]

  const yearComparison = useMemo(() => {
    const months = ['Enero', 'Feb', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Sept', 'Oct', 'Nov', 'Dic']
    const data2024 = Object.values(MONTHLY_TOTALS_2024) as number[]
    const data2025 = Object.values(MONTHLY_TOTALS_2025) as number[]
    
    return months.map((month, index) => ({
      month,
      year2024: data2024[index],
      year2025: data2025[index],
      difference: data2025[index] - data2024[index],
      growth: data2024[index] > 0 ? ((data2025[index] - data2024[index]) / data2024[index] * 100) : 0
    }))
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      minimumFractionDigits: 0 
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR').format(num)
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const totalYear2024 = (Object.values(MONTHLY_TOTALS_2024) as number[]).reduce((sum, val) => sum + val, 0)
  const totalYear2025 = (Object.values(MONTHLY_TOTALS_2025) as number[]).filter(val => val > 0).reduce((sum, val) => sum + val, 0)

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            <i className="fas fa-chart-line mr-3 text-green-600"></i>
            Dashboard Financiero
          </h1>
          <div className="flex space-x-2">
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="flex space-x-4">
          {[
            { key: 'overview', label: 'Resumen General', icon: 'fa-chart-bar' },
            { key: 'students', label: 'Pagos por Alumno', icon: 'fa-users' },
            { key: 'comparisons', label: 'Comparativas', icon: 'fa-balance-scale' },
            { key: 'projections', label: 'Proyecciones', icon: 'fa-chart-line' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key as 'overview' | 'students' | 'comparisons' | 'projections')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={`fas ${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vista: Resumen General */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tarjetas de resumen */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Resumen 2024 vs 2025</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total 2024</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalYear2024)}</p>
                </div>
                <i className="fas fa-calendar-alt text-2xl text-blue-400"></i>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total 2025 (hasta Oct)</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalYear2025)}</p>
                </div>
                <i className="fas fa-arrow-up text-2xl text-green-400"></i>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Crecimiento Proyectado</p>
                  <p className="text-xl font-bold text-gray-700">
                    {((totalYear2025 * 12/10 - totalYear2024) / totalYear2024 * 100).toFixed(1)}%
                  </p>
                </div>
                <i className="fas fa-chart-line text-2xl text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* Gráfico de barras mensual */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Ingresos Mensuales</h3>
            <div className="space-y-2">
              {yearComparison.slice(0, 10).map((month, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm font-medium text-gray-600">{month.month}</div>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(month.year2025 / 5000000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-24 text-right text-sm font-semibold">
                      {formatCurrency(month.year2025)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vista: Pagos por Alumno */}
      {activeView === 'students' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Resumen de Pagos por Alumno - 2025
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alumno</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ene</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Feb</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Mar</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Abr</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">May</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jun</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jul</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ago</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sep</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Oct</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Meses</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentPayments2025.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{student.studentName}</td>
                    <td className="px-3 py-4 text-center text-sm text-gray-500">
                      {student.january > 0 ? formatNumber(student.january) : '-'}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-500">
                      {student.february > 0 ? formatNumber(student.february) : '-'}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-500">
                      {student.march > 0 ? formatNumber(student.march) : '-'}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-500">
                      {student.april > 0 ? formatNumber(student.april) : '-'}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-500">
                      {student.may > 0 ? formatNumber(student.may) : '-'}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-500">
                      {student.june > 0 ? formatNumber(student.june) : '-'}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-500">
                      {student.july > 0 ? formatNumber(student.july) : '-'}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-500">
                      {student.august > 0 ? formatNumber(student.august) : '-'}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-500">
                      {student.september > 0 ? formatNumber(student.september) : '-'}
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-gray-500">
                      {student.october > 0 ? formatNumber(student.october) : '-'}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatNumber(student.total)}
                    </td>
                    <td className="px-4 py-4 text-center text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.paidMonths >= 8 ? 'bg-green-100 text-green-800' :
                        student.paidMonths >= 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.paidMonths}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-4 text-sm font-bold text-gray-900">TOTAL</td>
                  <td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.january, 0))}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.february, 0))}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.march, 0))}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.april, 0))}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.may, 0))}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.june, 0))}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.july, 0))}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.august, 0))}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.september, 0))}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.october, 0))}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-gray-900">
                    {formatNumber(studentPayments2025.reduce((sum, s) => sum + s.total, 0))}
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Vista: Comparativas */}
      {activeView === 'comparisons' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Comparativa 2024 vs 2025
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">2024</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">2025</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Diferencia</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Crecimiento</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yearComparison.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{month.month}</td>
                    <td className="px-4 py-4 text-right text-sm text-gray-500">
                      {formatCurrency(month.year2024)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-500">
                      {month.year2025 > 0 ? formatCurrency(month.year2025) : '-'}
                    </td>
                    <td className={`px-4 py-4 text-right text-sm font-semibold ${getGrowthColor(month.difference)}`}>
                      {month.year2025 > 0 ? formatCurrency(month.difference) : '-'}
                    </td>
                    <td className="px-4 py-4 text-center text-sm">
                      {month.year2025 > 0 && (
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          month.growth > 0 ? 'bg-green-100 text-green-800' :
                          month.growth < 0 ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {month.growth > 0 ? '+' : ''}{month.growth.toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista: Proyecciones */}
      {activeView === 'projections' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Proyecciones 2025
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Ingresos Proyectados Noviembre</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(4200000)}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Ingresos Proyectados Diciembre</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(4500000)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Total Proyectado 2025</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(totalYear2025 + 4200000 + 4500000)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Análisis de Tendencias
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Promedio mensual 2024:</span>
                <span className="font-semibold">{formatCurrency(totalYear2024 / 12)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Promedio mensual 2025:</span>
                <span className="font-semibold">{formatCurrency(totalYear2025 / 10)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-100 rounded">
                <span className="text-green-700">Crecimiento promedio:</span>
                <span className="font-semibold text-green-700">+68.3%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinancialDashboard