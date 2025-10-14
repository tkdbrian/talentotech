import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { 
  FinancialRecord, 
  MonthlyFinancials, 
  FinancialState,
  FinancialProjection 
} from './financialTypes'

// Datos reales basados en tus Excel
const realData2024: MonthlyFinancials[] = [
  { month: 1, year: 2024, cuotas: { amount: 456080, students: 37, scholem: 456080, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 0, students: 0, rindieron: 0, percentage: 0 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 456080, neto: 456080 },
  { month: 2, year: 2024, cuotas: { amount: 673725, students: 47, scholem: 673725, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 0, students: 0, rindieron: 0, percentage: 0 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 673725, neto: 673725 },
  { month: 3, year: 2024, cuotas: { amount: 1205140, students: 68, scholem: 1205140, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 238700, students: 11, rindieron: 100, percentage: 100 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 1443840, neto: 1443840 },
  { month: 4, year: 2024, cuotas: { amount: 1088476, students: 64, scholem: 1088476, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 575400, students: 23, rindieron: 95.7, percentage: 95.7 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 1663876, neto: 1663876 },
  { month: 5, year: 2024, cuotas: { amount: 1458875, students: 76, scholem: 1458875, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 378000, students: 15, rindieron: 100, percentage: 100 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 1836875, neto: 1836875 },
  { month: 6, year: 2024, cuotas: { amount: 1406825, students: 74, scholem: 1406825, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 550200, students: 22, rindieron: 95.5, percentage: 95.5 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 1957025, neto: 1957025 },
  { month: 7, year: 2024, cuotas: { amount: 1675600, students: 77, scholem: 1675600, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 1197000, students: 52, rindieron: 48.1, percentage: 48.1 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 2872600, neto: 2872600 },
  { month: 8, year: 2024, cuotas: { amount: 1781025, students: 83, scholem: 1781025, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 548800, students: 19, rindieron: 60.9, percentage: 60.9 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 2329825, neto: 2329825 },
  { month: 9, year: 2024, cuotas: { amount: 2057100, students: 90, scholem: 2057100, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 697200, students: 24, rindieron: 12.5, percentage: 12.5 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 2754300, neto: 2754300 },
  { month: 10, year: 2024, cuotas: { amount: 2047250, students: 83, scholem: 2047250, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 0, students: 0, rindieron: 0, percentage: 0 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 2047250, neto: 2047250 },
  { month: 11, year: 2024, cuotas: { amount: 2238600, students: 84, scholem: 2238600, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 1778700, students: 55, rindieron: 20, percentage: 20 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 4017300, neto: 4017300 },
  { month: 12, year: 2024, cuotas: { amount: 1893750, students: 72, scholem: 1893750, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 1060500, students: 5, rindieron: 100, percentage: 100 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 2954250, neto: 2954250 }
]

const realData2025: MonthlyFinancials[] = [
  { month: 1, year: 2025, cuotas: { amount: 1017900, students: 34, scholem: 1017900, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 0, students: 0, rindieron: 0, percentage: 0 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 1017900, neto: 1017900 },
  { month: 2, year: 2025, cuotas: { amount: 1250400, students: 40, scholem: 1250400, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 0, students: 0, rindieron: 0, percentage: 0 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 1250400, neto: 1250400 },
  { month: 3, year: 2025, cuotas: { amount: 2258500, students: 71, scholem: 187200, conceptClub: 2071300, sigloXX: 0 }, examenes: { amount: 239400, students: 6, rindieron: 100, percentage: 100 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 2685100, neto: 2685100 },
  { month: 4, year: 2025, cuotas: { amount: 2150000, students: 72, scholem: 374400, conceptClub: 1775600, sigloXX: 0 }, examenes: { amount: 824500, students: 19, rindieron: 100, percentage: 100 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 3709000, neto: 3709000 },
  { month: 5, year: 2025, cuotas: { amount: 2620700, students: 72, scholem: 374400, conceptClub: 2246300, sigloXX: 0 }, examenes: { amount: 564200, students: 13, rindieron: 100, percentage: 100 }, torneos: { amount: 396000, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 3559300, neto: 3163300 },
  { month: 6, year: 2025, cuotas: { amount: 2693400, students: 72, scholem: 374400, conceptClub: 2319000, sigloXX: 0 }, examenes: { amount: 1624700, students: 35, rindieron: 94.3, percentage: 94.3 }, torneos: { amount: 802000, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 4692500, neto: 3890500 },
  { month: 7, year: 2025, cuotas: { amount: 2909000, students: 73, scholem: 374400, conceptClub: 2534600, sigloXX: 0 }, examenes: { amount: 1053500, students: 23, rindieron: 87, percentage: 87 }, torneos: { amount: 890000, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 4336900, neto: 3446900 },
  { month: 8, year: 2025, cuotas: { amount: 3111000, students: 77, scholem: 374400, conceptClub: 2736600, sigloXX: 0 }, examenes: { amount: 1003100, students: 23, rindieron: 60.9, percentage: 60.9 }, torneos: { amount: 848000, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 4488500, neto: 3640500 },
  { month: 9, year: 2025, cuotas: { amount: 3169650, students: 72, scholem: 449200, conceptClub: 2720450, sigloXX: 0 }, examenes: { amount: 571300, students: 16, rindieron: 12.5, percentage: 12.5 }, torneos: { amount: 954000, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 4200150, neto: 3356150 },
  { month: 10, year: 2025, cuotas: { amount: 3007200, students: 64, scholem: 449200, conceptClub: 2558000, sigloXX: 0 }, examenes: { amount: 0, students: 0, rindieron: 0, percentage: 0 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 3456400, neto: 3456400 },
  { month: 11, year: 2025, cuotas: { amount: 0, students: 0, scholem: 0, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 0, students: 0, rindieron: 0, percentage: 0 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 0, neto: 0 },
  { month: 12, year: 2025, cuotas: { amount: 0, students: 0, scholem: 0, conceptClub: 0, sigloXX: 0 }, examenes: { amount: 0, students: 0, rindieron: 0, percentage: 0 }, torneos: { amount: 0, participants: 0 }, inscripciones: { amount: 0, newStudents: 0 }, alquiler: { amount: 0 }, total: 0, neto: 0 }
]

const initialState: FinancialState = {
  records: [],
  monthlyData: [...realData2024, ...realData2025],
  yearlyComparisons: [
    {
      year: 2024,
      months: realData2024,
      totalIncome: realData2024.reduce((sum, month) => sum + month.total, 0),
      totalStudents: 855,
      averageMonthly: realData2024.reduce((sum, month) => sum + month.total, 0) / 12,
      growth: 0
    },
    {
      year: 2025,
      months: realData2025,
      totalIncome: realData2025.filter(m => m.total > 0).reduce((sum, month) => sum + month.total, 0),
      totalStudents: 647,
      averageMonthly: realData2025.filter(m => m.total > 0).reduce((sum, month) => sum + month.total, 0) / 10,
      growth: 0
    }
  ],
  projections: [],
  locationStats: [
    {
      location: 'Scholem',
      monthlyAverage: 250000,
      studentCount: 45,
      revenue: 2957600,
      growth: 15.2
    },
    {
      location: 'Concept Club',
      monthlyAverage: 180000,
      studentCount: 35,
      revenue: 1800000,
      growth: 22.8
    },
    {
      location: 'Siglo XX',
      monthlyAverage: 120000,
      studentCount: 25,
      revenue: 1200000,
      growth: 8.5
    }
  ],
  currentYear: 2025,
  comparisonYear: 2024,
  selectedLocation: null,
  loading: false,
  error: null
}

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    addFinancialRecord: (state, action: PayloadAction<FinancialRecord>) => {
      state.records.push(action.payload)
    },
    
    updateFinancialRecord: (state, action: PayloadAction<FinancialRecord>) => {
      const index = state.records.findIndex(record => record.id === action.payload.id)
      if (index !== -1) {
        state.records[index] = action.payload
      }
    },
    
    deleteFinancialRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter(record => record.id !== action.payload)
    },
    
    setCurrentYear: (state, action: PayloadAction<number>) => {
      state.currentYear = action.payload
    },
    
    setComparisonYear: (state, action: PayloadAction<number>) => {
      state.comparisonYear = action.payload
    },
    
    setSelectedLocation: (state, action: PayloadAction<string | null>) => {
      state.selectedLocation = action.payload
    },
    
    calculateMonthlyData: (state) => {
      // Calcular datos mensuales basados en registros
      const monthlyMap = new Map<string, MonthlyFinancials>()
      
      state.records.forEach(record => {
        const key = `${record.year}-${record.month}`
        const existing = monthlyMap.get(key) || {
          month: record.month,
          year: record.year,
          cuotas: { amount: 0, students: 0, scholem: 0, conceptClub: 0, sigloXX: 0 },
          examenes: { amount: 0, students: 0, rindieron: 0, percentage: 0 },
          torneos: { amount: 0, participants: 0 },
          inscripciones: { amount: 0, newStudents: 0 },
          alquiler: { amount: 0 },
          total: 0,
          neto: 0
        }
        
        switch (record.type) {
          case 'cuota':
            existing.cuotas.amount += record.amount
            existing.cuotas.students += 1
            if (record.location === 'Scholem') existing.cuotas.scholem += record.amount
            if (record.location === 'Concept Club') existing.cuotas.conceptClub += record.amount
            if (record.location === 'Siglo XX') existing.cuotas.sigloXX += record.amount
            break
          case 'examen':
            existing.examenes.amount += record.amount
            existing.examenes.students += 1
            break
          case 'torneo':
            existing.torneos.amount += record.amount
            existing.torneos.participants += 1
            break
          case 'inscripcion':
            existing.inscripciones.amount += record.amount
            existing.inscripciones.newStudents += 1
            break
        }
        
        existing.total += record.amount
        existing.neto = existing.total // Simplificado
        
        monthlyMap.set(key, existing)
      })
      
      // Convertir Map a array y ordenar
      state.monthlyData = Array.from(monthlyMap.values())
        .sort((a, b) => (a.year * 12 + a.month) - (b.year * 12 + b.month))
    },
    
    generateProjections: (state) => {
      // Generar proyecciones basadas en tendencias históricas
      const currentYearData = state.monthlyData.filter(m => m.year === state.currentYear && m.total > 0)
      if (currentYearData.length < 2) return
      
      const lastThreeMonths = currentYearData.slice(-3)
      const averageGrowth = lastThreeMonths.reduce((sum, month, index) => {
        if (index === 0) return 0
        const prevMonth = lastThreeMonths[index - 1]
        return sum + ((month.total - prevMonth.total) / prevMonth.total)
      }, 0) / (lastThreeMonths.length - 1)
      
      const projections: FinancialProjection[] = []
      let lastAmount = currentYearData[currentYearData.length - 1].total
      
      // Proyectar próximos 3 meses
      for (let i = 1; i <= 3; i++) {
        const nextMonth = currentYearData[currentYearData.length - 1].month + i
        const nextYear = nextMonth > 12 ? state.currentYear + 1 : state.currentYear
        const adjustedMonth = nextMonth > 12 ? nextMonth - 12 : nextMonth
        
        lastAmount = lastAmount * (1 + averageGrowth)
        
        projections.push({
          month: adjustedMonth,
          year: nextYear,
          projected: Math.round(lastAmount)
        })
      }
      
      state.projections = projections
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const {
  addFinancialRecord,
  updateFinancialRecord,
  deleteFinancialRecord,
  setCurrentYear,
  setComparisonYear,
  setSelectedLocation,
  calculateMonthlyData,
  generateProjections,
  setLoading,
  setError
} = financialSlice.actions

export default financialSlice.reducer

// Selectores
export const selectFinancialRecords = (state: { financial: FinancialState }) => state.financial.records
export const selectMonthlyData = (state: { financial: FinancialState }) => state.financial.monthlyData
export const selectYearlyComparisons = (state: { financial: FinancialState }) => state.financial.yearlyComparisons
export const selectCurrentYearData = (state: { financial: FinancialState }) => 
  state.financial.monthlyData.filter(m => m.year === state.financial.currentYear)
export const selectComparisonYearData = (state: { financial: FinancialState }) => 
  state.financial.monthlyData.filter(m => m.year === state.financial.comparisonYear)
export const selectLocationStats = (state: { financial: FinancialState }) => state.financial.locationStats
export const selectProjections = (state: { financial: FinancialState }) => state.financial.projections