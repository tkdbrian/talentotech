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
    loadSampleData: (state) => {
      // Crear algunos estudiantes básicos de ejemplo
      const basicStudents = [
        {
          id: Date.now().toString() + '1',
          dni: '12345678',
          name: 'María García López',
          email: 'maria.garcia@email.com',
          belt: 'Verde (6)',
          birthDate: '2008-03-15',
          phone: '+1234567890',
          emergencyContact: 'Ana López (madre) - +1234567891',
          joinDate: '2023-01-15',
          monthlyFee: 120,
          status: 'active' as const,
          practiceLocation: 'Scholem',
          shift: 'Tarde',
          instructor: 'Instructor Principal',
          isCompleteForDiploma: true,
          observations: 'Excelente técnica, lista para próximo examen'
        },
        {
          id: Date.now().toString() + '2',
          dni: '23456789',
          name: 'Carlos Rodríguez Mendez',
          email: 'carlos.rodriguez@email.com',
          belt: 'Azul (4)',
          birthDate: '2010-07-22',
          phone: '+2345678901',
          emergencyContact: 'Luis Rodríguez (padre) - +2345678902',
          joinDate: '2023-05-10',
          monthlyFee: 100,
          status: 'active' as const,
          practiceLocation: 'Concept Club',
          shift: 'Mañana',
          instructor: 'Instructor Asistente 1',
          isCompleteForDiploma: false,
          observations: 'Necesita mejorar poomsae básicos'
        },
        {
          id: Date.now().toString() + '3',
          dni: '34567890',
          name: 'Ana Sofía Martínez',
          email: 'sofia.martinez@email.com',
          belt: 'Rojo (2)',
          birthDate: '2005-11-08',
          phone: '+3456789012',
          emergencyContact: 'Carmen Martínez (madre) - +3456789013',
          joinDate: '2022-03-20',
          monthlyFee: 150,
          status: 'active' as const,
          practiceLocation: 'Scholem',
          shift: 'Noche',
          instructor: 'Instructor Principal',
          isCompleteForDiploma: true,
          observations: 'Candidata a cinta negra, excelente liderazgo'
        },
        {
          id: Date.now().toString() + '4',
          dni: '45678901',
          name: 'Diego Fernández Silva',
          email: 'diego.fernandez@email.com',
          belt: 'Amarillo (8)',
          birthDate: '2012-01-30',
          phone: '+4567890123',
          emergencyContact: 'María Silva (madre) - +4567890124',
          joinDate: '2024-08-01',
          monthlyFee: 80,
          status: 'active' as const,
          practiceLocation: 'Siglo XX',
          shift: 'Tarde',
          instructor: 'Instructor Asistente 2',
          isCompleteForDiploma: false,
          observations: 'Principiante con mucho entusiasmo'
        },
        {
          id: Date.now().toString() + '5',
          dni: '56789012',
          name: 'Valentina Torres Ruiz',
          email: 'valentina.torres@email.com',
          belt: 'Verde Punta Azul (5)',
          birthDate: '2009-06-14',
          phone: '+5678901234',
          emergencyContact: 'Roberto Torres (padre) - +5678901235',
          joinDate: '2023-09-12',
          monthlyFee: 110,
          status: 'active' as const,
          practiceLocation: 'Concept Club',
          shift: 'Mañana',
          instructor: 'Instructor Asistente 1',
          isCompleteForDiploma: true,
          observations: 'Muy constante en entrenamientos'
        }
      ]
      state.students = basicStudents
      state.filteredStudents = basicStudents
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
  loadSampleData,
} = studentsSlice.actions

export default studentsSlice.reducer