import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch } from '../store/hooks'
import { 
  addClassSchedule, 
  updateClassSchedule, 
  deleteClassSchedule,
  type ClassSchedule, 
  type DayOfWeek, 
  type AgeGroup 
} from '../store/slices/classesSlice'

interface ScheduleFormProps {
  schedule?: ClassSchedule | null
  onCancel: () => void
}

export default function ScheduleForm({ schedule, onCancel }: ScheduleFormProps) {
  const dispatch = useAppDispatch()
  
  const [formData, setFormData] = useState({
    location: '',
    days: [] as DayOfWeek[],
    time: '',
    ageGroup: 'infantiles' as AgeGroup,
    instructor: '',
    maxCapacity: 15,
    isActive: true,
  })

  const locations = ['Scholem', 'Concept Club', 'Siglo XX']
  const instructors = ['Instructor Principal', 'Instructor Asistente 1', 'Instructor Asistente 2']
  const allDays: DayOfWeek[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
  const ageGroups: AgeGroup[] = ['infantiles', 'juveniles', 'adultos', 'juveniles-adultos']

  useEffect(() => {
    if (schedule) {
      setFormData({
        location: schedule.location,
        days: schedule.days,
        time: schedule.time,
        ageGroup: schedule.ageGroup,
        instructor: schedule.instructor,
        maxCapacity: schedule.maxCapacity || 15,
        isActive: schedule.isActive,
      })
    }
  }, [schedule])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const scheduleData: ClassSchedule = {
      id: schedule?.id || `schedule-${Date.now()}`,
      ...formData,
      createdDate: schedule?.createdDate || new Date().toISOString(),
    }

    if (schedule) {
      dispatch(updateClassSchedule(scheduleData))
    } else {
      dispatch(addClassSchedule(scheduleData))
    }
    
    onCancel()
  }

  const handleDelete = () => {
    if (schedule && window.confirm('¿Estás seguro de que deseas eliminar este horario? Se eliminarán también todas las sesiones asociadas.')) {
      dispatch(deleteClassSchedule(schedule.id))
      onCancel()
    }
  }

  const handleDayToggle = (day: DayOfWeek) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }))
  }

  const getAgeGroupDisplayName = (ageGroup: AgeGroup) => {
    const names = {
      'infantiles': 'Infantiles',
      'juveniles': 'Juveniles', 
      'adultos': 'Adultos',
      'juveniles-adultos': 'Juveniles y Adultos'
    }
    return names[ageGroup]
  }

  const getDayDisplayName = (day: DayOfWeek) => {
    const names = {
      'lunes': 'Lunes',
      'martes': 'Martes',
      'miércoles': 'Miércoles',
      'jueves': 'Jueves',
      'viernes': 'Viernes',
      'sábado': 'Sábado',
      'domingo': 'Domingo'
    }
    return names[day]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {schedule ? 'Editar Horario' : 'Nuevo Horario de Clase'}
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
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Información Básica</h3>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Sede *
                </label>
                <select
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar sede</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo de edad *
                </label>
                <select
                  id="ageGroup"
                  value={formData.ageGroup}
                  onChange={(e) => setFormData(prev => ({ ...prev, ageGroup: e.target.value as AgeGroup }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {ageGroups.map(group => (
                    <option key={group} value={group}>
                      {getAgeGroupDisplayName(group)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Horario *
                </label>
                <input
                  type="time"
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor *
                </label>
                <select
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor} value={instructor}>{instructor}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Configuración avanzada */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Configuración</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Días de la semana *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allDays.map(day => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.days.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {getDayDisplayName(day)}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.days.length === 0 && (
                  <p className="text-red-500 text-xs mt-1">Selecciona al menos un día</p>
                )}
              </div>

              <div>
                <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad máxima
                </label>
                <input
                  type="number"
                  id="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Horario activo
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Los horarios inactivos no generarán nuevas sesiones automáticamente
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {schedule && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-2 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                >
                  Eliminar Horario
                </button>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={formData.days.length === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faSave} />
                {schedule ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}