import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendarAlt, 
  faClock, 
  faUsers, 
  faPlus, 
  faUserCheck, 
  faChartBar,
  faCalendarDay,
  faFilter
} from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  loadSampleClassData, 
  generateSessions,
  setSelectedDate, 
  setSelectedLocation, 
  setSelectedAgeGroup,
  type ClassSchedule,
  type AgeGroup
} from '../store/slices/classesSlice'
import AttendanceView from './AttendanceView'
import ScheduleForm from './ScheduleForm'

type ViewMode = 'schedule' | 'attendance' | 'reports'

export default function ClassManagement() {
  const dispatch = useAppDispatch()
  const { 
    schedules, 
    sessions, 
    attendance, 
    selectedDate, 
    selectedLocation, 
    selectedAgeGroup 
  } = useAppSelector(state => state.classes)
  const { students } = useAppSelector(state => state.students)

  const [viewMode, setViewMode] = useState<ViewMode>('schedule')
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null)

  // Cargar datos de ejemplo si no hay horarios
  useEffect(() => {
    if (schedules.length === 0) {
      dispatch(loadSampleClassData())
    }
  }, [schedules.length, dispatch])

  // Generar sesiones para la próxima semana si no existen
  useEffect(() => {
    if (schedules.length > 0 && sessions.length === 0) {
      const today = new Date()
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)
      
      dispatch(generateSessions({
        startDate: today.toISOString().split('T')[0],
        endDate: nextWeek.toISOString().split('T')[0]
      }))
    }
  }, [schedules.length, sessions.length, dispatch])

  // Obtener sesiones del día seleccionado
  const sessionsForSelectedDate = sessions.filter(session => session.date === selectedDate)
  
  // Filtrar sesiones según filtros aplicados
  const filteredSessions = sessionsForSelectedDate.filter(session => {
    const schedule = schedules.find(s => s.id === session.scheduleId)
    if (!schedule) return false
    
    if (selectedLocation && schedule.location !== selectedLocation) return false
    if (selectedAgeGroup && schedule.ageGroup !== selectedAgeGroup) return false
    
    return true
  })

  // Obtener estadísticas
  const totalSchedules = schedules.filter(s => s.isActive).length
  const todaysSessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0])
  const totalAttendanceToday = attendance.filter(record => 
    todaysSessions.some(session => session.id === record.sessionId && record.status === 'present')
  ).length

  const locations = [...new Set(schedules.map(s => s.location))]
  const ageGroups: AgeGroup[] = ['infantiles', 'juveniles', 'adultos', 'juveniles-adultos']

  const handleAddSchedule = () => {
    setEditingSchedule(null)
    setShowScheduleForm(true)
  }

  const handleEditSchedule = (schedule: ClassSchedule) => {
    setEditingSchedule(schedule)
    setShowScheduleForm(true)
  }

  const handleGenerateWeekSessions = () => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    
    dispatch(generateSessions({
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0]
    }))
  }

  const getAgeGroupDisplayName = (ageGroup: AgeGroup) => {
    const names = {
      'infantiles': 'Infantiles',
      'juveniles': 'Juveniles',
      'adultos': 'Adultos',
      'juveniles-adultos': 'Juveniles y Adultos'
    }
    return names[ageGroup] || ageGroup
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Horarios Activos</p>
              <p className="text-2xl font-bold text-blue-600">{totalSchedules}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <FontAwesomeIcon icon={faCalendarDay} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clases Hoy</p>
              <p className="text-2xl font-bold text-green-600">{todaysSessions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <FontAwesomeIcon icon={faUserCheck} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Asistencia Hoy</p>
              <p className="text-2xl font-bold text-yellow-600">{totalAttendanceToday}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <FontAwesomeIcon icon={faUsers} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estudiantes</p>
              <p className="text-2xl font-bold text-purple-600">{students.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de vistas */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('schedule')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'schedule' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Horarios
            </button>
            <button
              onClick={() => setViewMode('attendance')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'attendance' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
              Asistencia
            </button>
            <button
              onClick={() => setViewMode('reports')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'reports' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className="mr-2" />
              Reportes
            </button>
          </div>

          <div className="flex gap-2">
            {viewMode === 'schedule' && (
              <>
                <button
                  onClick={handleGenerateWeekSessions}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Generar Semana
                </button>
                <button
                  onClick={handleAddSchedule}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Nuevo Horario
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fecha</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => dispatch(setSelectedDate(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Sede</label>
              <select
                value={selectedLocation}
                onChange={(e) => dispatch(setSelectedLocation(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las sedes</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Grupo</label>
              <select
                value={selectedAgeGroup}
                onChange={(e) => dispatch(setSelectedAgeGroup(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los grupos</option>
                {ageGroups.map(group => (
                  <option key={group} value={group}>
                    {getAgeGroupDisplayName(group)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal según vista seleccionada */}
      {viewMode === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de horarios */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Horarios Configurados
            </h2>
            
            {schedules.length > 0 ? (
              <div className="space-y-4">
                {schedules
                  .filter(schedule => schedule.isActive)
                  .filter(schedule => !selectedLocation || schedule.location === selectedLocation)
                  .filter(schedule => !selectedAgeGroup || schedule.ageGroup === selectedAgeGroup)
                  .map(schedule => (
                  <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{schedule.location}</h3>
                        <p className="text-sm text-gray-600">
                          {getAgeGroupDisplayName(schedule.ageGroup)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditSchedule(schedule)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2" />
                      {schedule.time} - {schedule.days.join(', ')}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
                      Instructor: {schedule.instructor}
                    </div>
                    
                    {schedule.maxCapacity && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
                        Capacidad máxima: {schedule.maxCapacity}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500">No hay horarios configurados</p>
              </div>
            )}
          </div>

          {/* Clases del día seleccionado */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Clases del {new Date(selectedDate).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            
            {filteredSessions.length > 0 ? (
              <div className="space-y-4">
                {filteredSessions
                  .sort((a, b) => {
                    const scheduleA = schedules.find(s => s.id === a.scheduleId)
                    const scheduleB = schedules.find(s => s.id === b.scheduleId)
                    return (scheduleA?.time || '').localeCompare(scheduleB?.time || '')
                  })
                  .map(session => {
                    const schedule = schedules.find(s => s.id === session.scheduleId)
                    if (!schedule) return null

                    return (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {schedule.location} - {getAgeGroupDisplayName(schedule.ageGroup)}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2" />
                              {schedule.time}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            session.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {session.status === 'completed' ? 'Completada' :
                             session.status === 'in-progress' ? 'En Progreso' :
                             session.status === 'cancelled' ? 'Cancelada' :
                             'Programada'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Instructor: {session.instructor}</span>
                          <span>Asistencia: {session.attendanceCount}</span>
                        </div>
                        
                        {session.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">{session.notes}</p>
                        )}
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faCalendarDay} className="text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500">No hay clases programadas para este día</p>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'attendance' && (
        <AttendanceView />
      )}

      {viewMode === 'reports' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Reportes de Asistencia
          </h2>
          <p className="text-gray-600">
            Funcionalidad de reportes en desarrollo...
          </p>
        </div>
      )}

      {/* Modal para formulario de horarios */}
      {showScheduleForm && (
        <ScheduleForm
          schedule={editingSchedule}
          onCancel={() => {
            setShowScheduleForm(false)
            setEditingSchedule(null)
          }}
        />
      )}
    </div>
  )
}