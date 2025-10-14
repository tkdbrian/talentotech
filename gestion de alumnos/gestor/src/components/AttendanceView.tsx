import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUserCheck, 
  faUserTimes, 
  faClock, 
  faExclamationTriangle,
  faMapMarkerAlt,
  faUsers,
  faPlay,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  addAttendanceRecord,
  updateAttendanceRecord,
  updateClassSession,
  type AttendanceRecord,
  type ClassSession
} from '../store/slices/classesSlice'

export default function AttendanceView() {
  const dispatch = useAppDispatch()
  const { schedules, sessions, attendance, selectedDate } = useAppSelector(state => state.classes)
  const { students } = useAppSelector(state => state.students)
  
  const [selectedSessionId, setSelectedSessionId] = useState<string>('')

  // Obtener sesiones del día seleccionado
  const sessionsForDate = useMemo(() => {
    return sessions
      .filter(session => session.date === selectedDate)
      .sort((a, b) => {
        const scheduleA = schedules.find(s => s.id === a.scheduleId)
        const scheduleB = schedules.find(s => s.id === b.scheduleId)
        return (scheduleA?.time || '').localeCompare(scheduleB?.time || '')
      })
  }, [sessions, selectedDate, schedules])

  // Obtener sesión seleccionada
  const selectedSession = sessions.find(s => s.id === selectedSessionId)
  const selectedSchedule = selectedSession 
    ? schedules.find(s => s.id === selectedSession.scheduleId)
    : null

  // Obtener estudiantes que pueden asistir a esta clase (misma sede y turno compatible)
  const eligibleStudents = useMemo(() => {
    if (!selectedSchedule) return []
    
    return students.filter(student => {
      // Filtrar por sede
      if (student.practiceLocation !== selectedSchedule.location) return false
      
      // Filtrar por grupo de edad (lógica básica)
      const studentAge = new Date().getFullYear() - new Date(student.birthDate).getFullYear()
      
      if (selectedSchedule.ageGroup === 'infantiles' && studentAge > 12) return false
      if (selectedSchedule.ageGroup === 'juveniles' && (studentAge < 13 || studentAge > 17)) return false
      if (selectedSchedule.ageGroup === 'adultos' && studentAge < 18) return false
      // juveniles-adultos acepta desde 13 años
      if (selectedSchedule.ageGroup === 'juveniles-adultos' && studentAge < 13) return false
      
      return student.status === 'active'
    })
  }, [students, selectedSchedule])

  // Obtener registros de asistencia para la sesión seleccionada
  const sessionAttendance = attendance.filter(record => record.sessionId === selectedSessionId)

  const handleSessionStart = (session: ClassSession) => {
    dispatch(updateClassSession({
      ...session,
      status: 'in-progress'
    }))
  }

  const handleSessionComplete = (session: ClassSession) => {
    dispatch(updateClassSession({
      ...session,
      status: 'completed'
    }))
  }

  const handleAttendanceChange = (studentId: string, status: AttendanceRecord['status']) => {
    const existingRecord = sessionAttendance.find(record => record.studentId === studentId)
    
    const attendanceData: AttendanceRecord = {
      id: existingRecord?.id || `attendance-${Date.now()}-${studentId}`,
      sessionId: selectedSessionId,
      studentId,
      status,
      arrivalTime: status === 'present' || status === 'late' ? new Date().toLocaleTimeString('es-ES', { hour12: false }).slice(0, 5) : undefined,
      createdDate: existingRecord?.createdDate || new Date().toISOString()
    }

    if (existingRecord) {
      dispatch(updateAttendanceRecord(attendanceData))
    } else {
      dispatch(addAttendanceRecord(attendanceData))
    }
  }

  const getAttendanceStatus = (studentId: string) => {
    const record = sessionAttendance.find(r => r.studentId === studentId)
    return record?.status || null
  }

  const getStatusColor = (status: AttendanceRecord['status']) => {
    const colors = {
      'present': 'bg-green-100 text-green-800 border-green-200',
      'absent': 'bg-red-100 text-red-800 border-red-200',
      'late': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'excused': 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    const icons = {
      'present': faUserCheck,
      'absent': faUserTimes,
      'late': faClock,
      'excused': faExclamationTriangle
    }
    return icons[status]
  }

  const getStatusText = (status: AttendanceRecord['status']) => {
    const texts = {
      'present': 'Presente',
      'absent': 'Ausente', 
      'late': 'Tardanza',
      'excused': 'Justificado'
    }
    return texts[status]
  }

  const getSessionStatusColor = (status: ClassSession['status']) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status]
  }

  const attendanceStats = useMemo(() => {
    const present = sessionAttendance.filter(r => r.status === 'present').length
    const late = sessionAttendance.filter(r => r.status === 'late').length
    const absent = sessionAttendance.filter(r => r.status === 'absent').length
    const excused = sessionAttendance.filter(r => r.status === 'excused').length
    
    return { present, late, absent, excused, total: present + late + absent + excused }
  }, [sessionAttendance])

  return (
    <div className="space-y-6">
      {/* Selección de sesión */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Clases del {new Date(selectedDate).toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>
        
        {sessionsForDate.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionsForDate.map(session => {
              const schedule = schedules.find(s => s.id === session.scheduleId)
              if (!schedule) return null

              return (
                <div 
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSessionId === session.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {schedule.location}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSessionStatusColor(session.status)}`}>
                      {session.status === 'scheduled' ? 'Programada' :
                       session.status === 'in-progress' ? 'En Progreso' :
                       session.status === 'completed' ? 'Completada' :
                       'Cancelada'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2" />
                      {schedule.time}
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
                      {schedule.ageGroup === 'infantiles' ? 'Infantiles' :
                       schedule.ageGroup === 'juveniles' ? 'Juveniles' :
                       schedule.ageGroup === 'adultos' ? 'Adultos' :
                       'Juveniles y Adultos'}
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-2" />
                      {session.instructor}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <span className="text-gray-500">Asistencia: </span>
                    <span className="font-medium text-blue-600">{session.attendanceCount}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <FontAwesomeIcon icon={faUsers} className="text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">No hay clases programadas para este día</p>
          </div>
        )}
      </div>

      {/* Panel de control de asistencia */}
      {selectedSession && selectedSchedule && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información de la sesión y controles */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Control de Clase</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSessionStatusColor(selectedSession.status)}`}>
                {selectedSession.status === 'scheduled' ? 'Programada' :
                 selectedSession.status === 'in-progress' ? 'En Progreso' :
                 selectedSession.status === 'completed' ? 'Completada' :
                 'Cancelada'}
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-sm text-gray-600">Sede: </span>
                <span className="font-medium">{selectedSchedule.location}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Horario: </span>
                <span className="font-medium">{selectedSchedule.time}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Instructor: </span>
                <span className="font-medium">{selectedSession.instructor}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Estudiantes elegibles: </span>
                <span className="font-medium">{eligibleStudents.length}</span>
              </div>
            </div>

            {/* Controles de sesión */}
            <div className="space-y-2">
              {selectedSession.status === 'scheduled' && (
                <button
                  onClick={() => handleSessionStart(selectedSession)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faPlay} />
                  Iniciar Clase
                </button>
              )}
              
              {selectedSession.status === 'in-progress' && (
                <button
                  onClick={() => handleSessionComplete(selectedSession)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Completar Clase
                </button>
              )}
            </div>

            {/* Estadísticas de asistencia */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Resumen de Asistencia</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-green-700">{attendanceStats.present}</div>
                  <div className="text-xs text-green-600">Presentes</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-yellow-700">{attendanceStats.late}</div>
                  <div className="text-xs text-yellow-600">Tardanzas</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-red-700">{attendanceStats.absent}</div>
                  <div className="text-xs text-red-600">Ausentes</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-blue-700">{attendanceStats.excused}</div>
                  <div className="text-xs text-blue-600">Justificados</div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de estudiantes para tomar asistencia */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lista de Estudiantes ({eligibleStudents.length})
            </h3>
            
            {eligibleStudents.length > 0 ? (
              <div className="space-y-3">
                {eligibleStudents.map(student => {
                  const currentStatus = getAttendanceStatus(student.id)
                  
                  return (
                    <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.belt}</p>
                        </div>
                        {currentStatus && (
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(currentStatus)}`}>
                            <FontAwesomeIcon icon={getStatusIcon(currentStatus)} className="mr-1" />
                            {getStatusText(currentStatus)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'present')}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentStatus === 'present'
                              ? 'bg-green-600 text-white'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          <FontAwesomeIcon icon={faUserCheck} className="mr-1" />
                          Presente
                        </button>
                        
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'late')}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentStatus === 'late'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          Tarde
                        </button>
                        
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'absent')}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentStatus === 'absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          <FontAwesomeIcon icon={faUserTimes} className="mr-1" />
                          Ausente
                        </button>
                        
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'excused')}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentStatus === 'excused'
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                          Justif.
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faUsers} className="text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500">No hay estudiantes elegibles para esta clase</p>
                <p className="text-sm text-gray-400 mt-2">
                  Verifica que tengan la sede correcta y estén activos
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}