import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faUser, faEnvelope, faPhone, faBirthdayCake } from '@fortawesome/free-solid-svg-icons'
import type { Student } from '../store/slices/studentsSlice'

interface StudentCardProps {
  student: Student
  onEdit: (student: Student) => void
  onDelete: (id: string) => void
}

export default function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
  const getBeltColor = (belt: string) => {
    const colors: Record<string, string> = {
      'Blanco': 'bg-gray-100 text-gray-800',
      'Amarillo': 'bg-yellow-100 text-yellow-800',
      'Naranja': 'bg-orange-100 text-orange-800',
      'Verde': 'bg-green-100 text-green-800',
      'Azul': 'bg-blue-100 text-blue-800',
      'Marrón': 'bg-amber-100 text-amber-800',
      'Negro 1º Dan': 'bg-gray-800 text-white',
      'Negro 2º Dan': 'bg-gray-800 text-white',
      'Negro 3º Dan': 'bg-gray-800 text-white',
    }
    return colors[belt] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'suspended': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'suspended': 'Suspendido',
    }
    return texts[status] || status
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
            <div className="flex gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBeltColor(student.belt)}`}>
                {student.belt}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                {getStatusText(student.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(student)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
          {student.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FontAwesomeIcon icon={faPhone} className="w-4 h-4 mr-2" />
          {student.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FontAwesomeIcon icon={faBirthdayCake} className="w-4 h-4 mr-2" />
          {new Date(student.birthDate).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Cuota mensual:</span>
          <span className="font-medium text-green-600">${student.monthlyFee}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-500">Ingreso:</span>
          <span className="text-gray-700">{new Date(student.joinDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}