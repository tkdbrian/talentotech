import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Tipos para el sistema de clases y horarios
export type DayOfWeek = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado' | 'domingo'
export type AgeGroup = 'infantiles' | 'juveniles' | 'adultos' | 'juveniles-adultos'

export interface ClassSchedule {
  id: string
  location: string // 'Scholem', 'Concept Club', 'Siglo XX'
  days: DayOfWeek[] // ['lunes', 'miércoles']
  time: string // '18:30', '19:30', etc.
  ageGroup: AgeGroup
  instructor: string
  maxCapacity?: number
  isActive: boolean
  createdDate: string
}

export interface ClassSession {
  id: string
  scheduleId: string
  date: string // '2024-10-14'
  actualTime?: string // Hora real si cambió
  instructor: string // Instructor real (puede cambiar del programado)
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress'
  notes?: string
  attendanceCount: number
  createdDate: string
}

export interface AttendanceRecord {
  id: string
  sessionId: string
  studentId: string
  status: 'present' | 'absent' | 'late' | 'excused'
  arrivalTime?: string
  notes?: string
  createdDate: string
}

interface ClassesState {
  schedules: ClassSchedule[]
  sessions: ClassSession[]
  attendance: AttendanceRecord[]
  selectedDate: string
  selectedLocation: string
  selectedAgeGroup: string
}

const initialState: ClassesState = {
  schedules: [],
  sessions: [],
  attendance: [],
  selectedDate: new Date().toISOString().split('T')[0],
  selectedLocation: '',
  selectedAgeGroup: '',
}

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    // CRUD para horarios de clases
    addClassSchedule: (state, action: PayloadAction<ClassSchedule>) => {
      state.schedules.push(action.payload)
    },
    updateClassSchedule: (state, action: PayloadAction<ClassSchedule>) => {
      const index = state.schedules.findIndex(schedule => schedule.id === action.payload.id)
      if (index !== -1) {
        state.schedules[index] = action.payload
      }
    },
    deleteClassSchedule: (state, action: PayloadAction<string>) => {
      state.schedules = state.schedules.filter(schedule => schedule.id !== action.payload)
      // También eliminar sesiones relacionadas
      state.sessions = state.sessions.filter(session => session.scheduleId !== action.payload)
    },

    // CRUD para sesiones de clase
    addClassSession: (state, action: PayloadAction<ClassSession>) => {
      state.sessions.push(action.payload)
    },
    updateClassSession: (state, action: PayloadAction<ClassSession>) => {
      const index = state.sessions.findIndex(session => session.id === action.payload.id)
      if (index !== -1) {
        state.sessions[index] = action.payload
      }
    },
    deleteClassSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(session => session.id !== action.payload)
      // También eliminar asistencias relacionadas
      state.attendance = state.attendance.filter(record => record.sessionId !== action.payload)
    },

    // CRUD para registros de asistencia
    addAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      // Eliminar registro existente si hay uno para el mismo estudiante y sesión
      state.attendance = state.attendance.filter(
        record => !(record.sessionId === action.payload.sessionId && record.studentId === action.payload.studentId)
      )
      state.attendance.push(action.payload)
      
      // Actualizar contador de asistencia en la sesión
      const session = state.sessions.find(s => s.id === action.payload.sessionId)
      if (session) {
        session.attendanceCount = state.attendance.filter(
          record => record.sessionId === action.payload.sessionId && record.status === 'present'
        ).length
      }
    },
    updateAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      const index = state.attendance.findIndex(record => record.id === action.payload.id)
      if (index !== -1) {
        state.attendance[index] = action.payload
        
        // Actualizar contador de asistencia en la sesión
        const session = state.sessions.find(s => s.id === action.payload.sessionId)
        if (session) {
          session.attendanceCount = state.attendance.filter(
            record => record.sessionId === action.payload.sessionId && record.status === 'present'
          ).length
        }
      }
    },
    deleteAttendanceRecord: (state, action: PayloadAction<string>) => {
      const record = state.attendance.find(r => r.id === action.payload)
      if (record) {
        state.attendance = state.attendance.filter(r => r.id !== action.payload)
        
        // Actualizar contador de asistencia en la sesión
        const session = state.sessions.find(s => s.id === record.sessionId)
        if (session) {
          session.attendanceCount = state.attendance.filter(
            r => r.sessionId === record.sessionId && r.status === 'present'
          ).length
        }
      }
    },

    // Filtros y búsqueda
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    },
    setSelectedLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocation = action.payload
    },
    setSelectedAgeGroup: (state, action: PayloadAction<string>) => {
      state.selectedAgeGroup = action.payload
    },

    // Cargar datos de ejemplo
    loadSampleClassData: (state) => {
      // Horarios de ejemplo basados en tu estructura real
      const sampleSchedules: ClassSchedule[] = [
        // Scholem - Lunes y Miércoles
        {
          id: 'sch-lm-inf',
          location: 'Scholem',
          days: ['lunes', 'miércoles'],
          time: '18:00',
          ageGroup: 'infantiles',
          instructor: 'Instructor Principal',
          maxCapacity: 15,
          isActive: true,
          createdDate: new Date().toISOString()
        },
        {
          id: 'sch-lm-juv',
          location: 'Scholem',
          days: ['lunes', 'miércoles'],
          time: '19:00',
          ageGroup: 'juveniles-adultos',
          instructor: 'Instructor Principal',
          maxCapacity: 20,
          isActive: true,
          createdDate: new Date().toISOString()
        },
        // Scholem - Martes y Jueves
        {
          id: 'sch-mj-inf',
          location: 'Scholem',
          days: ['martes', 'jueves'],
          time: '18:00',
          ageGroup: 'infantiles',
          instructor: 'Instructor Asistente 1',
          maxCapacity: 15,
          isActive: true,
          createdDate: new Date().toISOString()
        },
        {
          id: 'sch-mj-juv',
          location: 'Scholem',
          days: ['martes', 'jueves'],
          time: '19:00',
          ageGroup: 'juveniles-adultos',
          instructor: 'Instructor Asistente 1',
          maxCapacity: 20,
          isActive: true,
          createdDate: new Date().toISOString()
        },
        // Concept Club
        {
          id: 'cc-inf',
          location: 'Concept Club',
          days: ['lunes', 'miércoles', 'viernes'], // Asumiendo 3 veces por semana
          time: '18:00',
          ageGroup: 'infantiles',
          instructor: 'Instructor Asistente 2',
          maxCapacity: 12,
          isActive: true,
          createdDate: new Date().toISOString()
        },
        {
          id: 'cc-juv',
          location: 'Concept Club',
          days: ['lunes', 'miércoles', 'viernes'],
          time: '19:00',
          ageGroup: 'juveniles-adultos',
          instructor: 'Instructor Asistente 2',
          maxCapacity: 18,
          isActive: true,
          createdDate: new Date().toISOString()
        },
        {
          id: 'cc-adultos',
          location: 'Concept Club',
          days: ['lunes', 'miércoles', 'viernes'],
          time: '20:15',
          ageGroup: 'adultos',
          instructor: 'Instructor Asistente 2',
          maxCapacity: 15,
          isActive: true,
          createdDate: new Date().toISOString()
        },
        // Siglo XX - Lunes y Miércoles
        {
          id: 'sxx-lm-inf',
          location: 'Siglo XX',
          days: ['lunes', 'miércoles'],
          time: '18:30',
          ageGroup: 'infantiles',
          instructor: 'Instructor Principal',
          maxCapacity: 20,
          isActive: true,
          createdDate: new Date().toISOString()
        },
        {
          id: 'sxx-lm-juv',
          location: 'Siglo XX',
          days: ['lunes', 'miércoles'],
          time: '19:30',
          ageGroup: 'juveniles-adultos',
          instructor: 'Instructor Principal',
          maxCapacity: 25,
          isActive: true,
          createdDate: new Date().toISOString()
        }
      ]

      state.schedules = sampleSchedules

      // Crear algunas sesiones de ejemplo para la semana actual
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Lunes de esta semana

      const sampleSessions: ClassSession[] = []
      
      // Generar sesiones para los próximos 7 días
      for (let i = 0; i < 7; i++) {
        const sessionDate = new Date(startOfWeek)
        sessionDate.setDate(startOfWeek.getDate() + i)
        const dayName = sessionDate.toLocaleDateString('es', { weekday: 'long' }).toLowerCase()
        
        // Buscar horarios que correspondan a este día
        const schedulesForDay = sampleSchedules.filter(schedule => 
          schedule.days.includes(dayName as DayOfWeek)
        )

        schedulesForDay.forEach(schedule => {
          const sessionId = `session-${schedule.id}-${sessionDate.toISOString().split('T')[0]}`
          sampleSessions.push({
            id: sessionId,
            scheduleId: schedule.id,
            date: sessionDate.toISOString().split('T')[0],
            instructor: schedule.instructor,
            status: sessionDate < today ? 'completed' : 'scheduled',
            attendanceCount: sessionDate < today ? Math.floor(Math.random() * (schedule.maxCapacity || 10)) : 0,
            createdDate: new Date().toISOString()
          })
        })
      }

      state.sessions = sampleSessions
    },

    // Generar sesiones automáticamente para un rango de fechas
    generateSessions: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      const { startDate, endDate } = action.payload
      const start = new Date(startDate)
      const end = new Date(endDate)
      const newSessions: ClassSession[] = []

      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dayName = date.toLocaleDateString('es', { weekday: 'long' }).toLowerCase()
        
        const schedulesForDay = state.schedules.filter(schedule => 
          schedule.isActive && schedule.days.includes(dayName as DayOfWeek)
        )

        schedulesForDay.forEach(schedule => {
          const sessionId = `session-${schedule.id}-${date.toISOString().split('T')[0]}`
          
          // No crear si ya existe
          if (!state.sessions.find(s => s.id === sessionId)) {
            newSessions.push({
              id: sessionId,
              scheduleId: schedule.id,
              date: date.toISOString().split('T')[0],
              instructor: schedule.instructor,
              status: 'scheduled',
              attendanceCount: 0,
              createdDate: new Date().toISOString()
            })
          }
        })
      }

      state.sessions.push(...newSessions)
    }
  },
})

export const {
  addClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
  addClassSession,
  updateClassSession,
  deleteClassSession,
  addAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  setSelectedDate,
  setSelectedLocation,
  setSelectedAgeGroup,
  loadSampleClassData,
  generateSessions,
} = classesSlice.actions

export default classesSlice.reducer