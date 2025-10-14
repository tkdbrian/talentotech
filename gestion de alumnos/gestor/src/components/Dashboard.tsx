import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserCheck, faUserTimes, faUserClock, faDollarSign, faChartLine, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { loadSampleData } from '../store/slices/studentsSlice'

export default function Dashboard() {
  const { students } = useAppSelector(state => state.students)
  const dispatch = useAppDispatch()

  const handleLoadSampleData = () => {
    dispatch(loadSampleData())
  }

  const activeStudents = students.filter(s => s.status === 'active').length
  const inactiveStudents = students.filter(s => s.status === 'inactive').length
  const suspendedStudents = students.filter(s => s.status === 'suspended').length
  const totalRevenue = students.filter(s => s.status === 'active').reduce((sum, s) => sum + s.monthlyFee, 0)

  // Estadísticas por cintas
  const beltStats = students.reduce((acc, student) => {
    acc[student.belt] = (acc[student.belt] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Nota: Las estadísticas por sede y turno se mostrarán en el módulo de clases

  const statCards = [
    {
      title: 'Total Estudiantes',
      value: students.length,
      icon: faUsers,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Estudiantes Activos',
      value: activeStudents,
      icon: faUserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Estudiantes Inactivos',
      value: inactiveStudents,
      icon: faUserTimes,
      color: 'bg-gray-500',
      textColor: 'text-gray-600'
    },
    {
      title: 'Estudiantes Suspendidos',
      value: suspendedStudents,
      icon: faUserClock,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Ingresos Mensuales',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: faDollarSign,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <FontAwesomeIcon icon={stat.icon} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón para cargar datos de ejemplo - Solo mostrar si no hay estudiantes */}
      {students.length === 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="ml-3 flex-1">
              <p className="text-sm text-blue-700">
                ¡Bienvenido! No hay estudiantes en el sistema aún.
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Puedes comenzar agregando estudiantes manualmente o cargando datos de ejemplo para probar el sistema.
              </p>
            </div>
            <div className="ml-4">
              <button
                onClick={handleLoadSampleData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="text-sm" />
                Cargar Datos de Ejemplo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Distribución por cintas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <FontAwesomeIcon icon={faChartLine} className="text-blue-600 text-xl mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Distribución por Grados de Cinta</h2>
        </div>
        
        {Object.keys(beltStats).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(beltStats).map(([belt, count]) => (
              <div key={belt} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{belt}</span>
                <span className="text-lg font-bold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay datos de cintas para mostrar</p>
          </div>
        )}
      </div>

      {/* Estudiantes recientes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Estudiantes Recientes</h2>
        
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cinta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Ingreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuota
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.slice(0, 5).map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-sm" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {student.belt}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === 'active' ? 'bg-green-100 text-green-800' :
                        student.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.status === 'active' ? 'Activo' : 
                         student.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(student.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${student.monthlyFee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FontAwesomeIcon icon={faUsers} className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500">No hay estudiantes registrados</p>
            <p className="text-sm text-gray-400 mt-2">Agrega tu primer estudiante para ver las estadísticas</p>
          </div>
        )}
      </div>
    </div>
  )
}