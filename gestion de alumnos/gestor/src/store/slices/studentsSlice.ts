import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Tipos para las reglas de negocio
export type GUP = 
  | 'BLANCO_10' 
  | 'PUNTA_AMARILLA_9' 
  | 'AMARILLO_8' 
  | 'AMARILLO_PUNTA_VERDE_7' 
  | 'VERDE_6' 
  | 'VERDE_PUNTA_AZUL_5' 
  | 'AZUL_4' 
  | 'AZUL_PUNTA_ROJA_3' 
  | 'ROJO_2' 
  | 'ROJO_PUNTA_NEGRA_1'

export interface Attendance {
  id: string
  studentId: string
  date: string
  shift: string
  present: boolean
  observations?: string
}

export interface Exam {
  id: string
  studentId: string
  date: string
  previousGUP: GUP
  newGUP: GUP
  passed: boolean
  observations?: string
  nextExamSuggestedDate?: string
}

export interface Payment {
  id: string
  studentId: string
  month: number
  year: number
  location: string
  shift: string
  amount: number
  discount: number
  isFirstMonth: boolean
  paymentDate: string
  observations?: string
}

export interface Student {
  id: string
  dni: string // DNI único
  name: string
  email: string
  phone: string
  emergencyContact: string
  birthDate: string
  joinDate: string
  
  // Datos académicos
  currentGUP: GUP
  practiceLocation: string
  shift: string
  instructor: string
  isCompleteForDiploma: boolean
  observations?: string
  
  // Estado
  status: 'active' | 'inactive' | 'suspended'
  
  // Relaciones
  attendances: Attendance[]
  exams: Exam[]
  payments: Payment[]
  
  // Fechas calculadas
  nextExamSuggestedDate?: string
}

interface StudentsState {
  students: Student[]
  filteredStudents: Student[]
  searchTerm: string
  selectedBelt: string
  selectedStatus: string
}

const initialState: StudentsState = {
  students: [],
  filteredStudents: [],
  searchTerm: '',
  selectedBelt: '',
  selectedStatus: '',
}

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload)
      state.filteredStudents = state.students
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex(student => student.id === action.payload.id)
      if (index !== -1) {
        state.students[index] = action.payload
        state.filteredStudents = state.students
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(student => student.id !== action.payload)
      state.filteredStudents = state.students
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      studentsSlice.caseReducers.filterStudents(state)
    },
    setBeltFilter: (state, action: PayloadAction<string>) => {
      state.selectedBelt = action.payload
      studentsSlice.caseReducers.filterStudents(state)
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.selectedStatus = action.payload
      studentsSlice.caseReducers.filterStudents(state)
    },
    filterStudents: (state) => {
      let filtered = state.students

      if (state.searchTerm) {
        filtered = filtered.filter(student =>
          student.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(state.searchTerm.toLowerCase())
        )
      }

      if (state.selectedBelt) {
        filtered = filtered.filter(student => student.currentGUP === state.selectedBelt)
      }

      if (state.selectedStatus) {
        filtered = filtered.filter(student => student.status === state.selectedStatus)
      }

      state.filteredStudents = filtered
    },
  },
})

export const {
  addStudent,
  updateStudent,
  deleteStudent,
  setSearchTerm,
  setBeltFilter,
  setStatusFilter,
} = studentsSlice.actions

export default studentsSlice.reducer