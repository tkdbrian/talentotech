import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Student {
  id: string
  dni: string
  name: string
  email: string
  belt: string // Mantenemos compatible por ahora
  birthDate: string
  phone: string
  emergencyContact: string
  joinDate: string
  monthlyFee: number
  status: 'active' | 'inactive' | 'suspended'
  
  // Nuevos campos del sistema avanzado
  practiceLocation?: string
  shift?: string
  instructor?: string
  isCompleteForDiploma?: boolean
  observations?: string
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
        filtered = filtered.filter(student => student.belt === state.selectedBelt)
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