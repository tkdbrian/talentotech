import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons'
import type { Student } from '../store/slices/studentsSlice'

interface StudentFormProps {
  student?: Student | null
  onSave: (student: Student) => void
  onCancel: () => void
}

export default function StudentForm({ student, onSave, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState<{
    dni: string
    name: string
    email: string
    belt: string
    birthDate: string
    phone: string
    emergencyContact: string
    joinDate: string
    monthlyFee: number
    status: 'active' | 'inactive' | 'suspended'
    practiceLocation: string
    shift: string
    instructor: string
    isCompleteForDiploma: boolean
    observations: string
  }>({
    dni: '',
    name: '',
    email: '',
    belt: '',
    birthDate: '',
    phone: '',
    emergencyContact: '',
    joinDate: new Date().toISOString().split('T')[0],
    monthlyFee: 0,
    status: 'active',
    practiceLocation: '',
    shift: '',
    instructor: '',
    isCompleteForDiploma: false,
    observations: '',
  })

  const belts = [
    'Blanco (10)',
    'Punta Amarilla (9)',
    'Amarillo (8)',
    'Amarillo Punta Verde (7)',
    'Verde (6)',
    'Verde Punta Azul (5)',
    'Azul (4)',
    'Azul Punta Roja (3)',
    'Rojo (2)',
    'Rojo Punta Negra (1)'
  ]

  const shifts = ['Mañana', 'Tarde', 'Noche']
  const locations = ['Scholem', 'Concept Club', 'Siglo XX']
  const instructors = ['Instructor Principal', 'Instructor Asistente 1', 'Instructor Asistente 2']

  useEffect(() => {
    if (student) {
      setFormData({
        dni: student.dni || '',
        name: student.name,
        email: student.email,
        belt: student.belt,
        birthDate: student.birthDate,
        phone: student.phone,
        emergencyContact: student.emergencyContact,
        joinDate: student.joinDate,
        monthlyFee: student.monthlyFee,
        status: student.status,
        practiceLocation: student.practiceLocation || '',
        shift: student.shift || '',
        instructor: student.instructor || '',
        isCompleteForDiploma: student.isCompleteForDiploma || false,
        observations: student.observations || '',
      })
    }
  }, [student])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (student) {
      onSave({ ...formData, id: student.id })
    } else {
      onSave({ ...formData, id: Date.now().toString() })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {student ? 'Editar Estudiante' : 'Agregar Estudiante'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Información Personal</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de nacimiento *
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: +1234567890"
                />
              </div>

              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contacto de emergencia *
                </label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre y teléfono"
                />
              </div>
            </div>

            {/* Información Académica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Información Académica</h3>
              
              <div>
                <label htmlFor="belt" className="block text-sm font-medium text-gray-700 mb-1">
                  Grado de cinta *
                </label>
                <select
                  id="belt"
                  name="belt"
                  value={formData.belt}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar grado</option>
                  {belts.map(belt => (
                    <option key={belt} value={belt}>{belt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de ingreso *
                </label>
                <input
                  type="date"
                  id="joinDate"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="monthlyFee" className="block text-sm font-medium text-gray-700 mb-1">
                  Cuota mensual *
                </label>
                <input
                  type="number"
                  id="monthlyFee"
                  name="monthlyFee"
                  value={formData.monthlyFee}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </div>

              <div>
                <label htmlFor="practiceLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Sede de práctica
                </label>
                <select
                  id="practiceLocation"
                  name="practiceLocation"
                  value={formData.practiceLocation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar sede</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="shift" className="block text-sm font-medium text-gray-700 mb-1">
                  Turno preferido
                </label>
                <select
                  id="shift"
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar turno</option>
                  {shifts.map(shift => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor asignado
                </label>
                <select
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor} value={instructor}>{instructor}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  id="observations"
                  name="observations"
                  value={formData.observations}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notas adicionales sobre el estudiante..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isCompleteForDiploma"
                  name="isCompleteForDiploma"
                  checked={formData.isCompleteForDiploma}
                  onChange={(e) => setFormData(prev => ({ ...prev, isCompleteForDiploma: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isCompleteForDiploma" className="ml-2 text-sm text-gray-700">
                  Completo para diploma
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} />
              {student ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}