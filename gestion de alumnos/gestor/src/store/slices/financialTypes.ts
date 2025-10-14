// Tipos para el sistema financiero avanzado
export interface FinancialRecord {
  id: string
  date: string
  type: 'cuota' | 'examen' | 'torneo' | 'inscripcion' | 'equipamiento' | 'otro'
  amount: number
  studentId?: string
  description: string
  location: 'Scholem' | 'Concept Club' | 'Siglo XX' | 'Rindieron' | 'Alquiler'
  month: number
  year: number
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta'
  category: string
}

export interface MonthlyFinancials {
  month: number
  year: number
  cuotas: {
    amount: number
    students: number
    scholem: number
    conceptClub: number
    sigloXX: number
  }
  examenes: {
    amount: number
    students: number
    rindieron: number
    percentage: number
  }
  torneos: {
    amount: number
    participants: number
  }
  inscripciones: {
    amount: number
    newStudents: number
  }
  alquiler: {
    amount: number
  }
  total: number
  neto: number
}

export interface YearlyComparison {
  year: number
  months: MonthlyFinancials[]
  totalIncome: number
  totalStudents: number
  averageMonthly: number
  growth: number
}

export interface FinancialProjection {
  month: number
  year: number
  projected: number
  actual?: number
  difference?: number
}

export interface LocationStats {
  location: string
  monthlyAverage: number
  studentCount: number
  revenue: number
  growth: number
}

// Estado del slice financiero
export interface FinancialState {
  records: FinancialRecord[]
  monthlyData: MonthlyFinancials[]
  yearlyComparisons: YearlyComparison[]
  projections: FinancialProjection[]
  locationStats: LocationStats[]
  currentYear: number
  comparisonYear: number
  selectedLocation: string | null
  loading: boolean
  error: string | null
}

// Datos iniciales basados en tu Excel
export const sampleFinancialData: FinancialRecord[] = [
  // Enero 2025
  { id: '1', date: '2025-01-15', type: 'cuota', amount: 1017900, studentId: '1', description: 'Cuotas Enero', location: 'Scholem', month: 1, year: 2025, paymentMethod: 'transferencia', category: 'Cuotas mensuales' },
  
  // Febrero 2025  
  { id: '2', date: '2025-02-15', type: 'cuota', amount: 1250400, studentId: '2', description: 'Cuotas Febrero', location: 'Scholem', month: 2, year: 2025, paymentMethod: 'efectivo', category: 'Cuotas mensuales' },
  
  // Marzo 2025
  { id: '3', date: '2025-03-15', type: 'cuota', amount: 2685100, studentId: '3', description: 'Cuotas Marzo', location: 'Scholem', month: 3, year: 2025, paymentMethod: 'transferencia', category: 'Cuotas mensuales' },
  { id: '4', date: '2025-03-20', type: 'examen', amount: 239400, studentId: '4', description: 'Exámenes Marzo', location: 'Rindieron', month: 3, year: 2025, paymentMethod: 'efectivo', category: 'Exámenes' },
  
  // Abril 2025
  { id: '5', date: '2025-04-15', type: 'cuota', amount: 3709000, studentId: '5', description: 'Cuotas Abril', location: 'Scholem', month: 4, year: 2025, paymentMethod: 'transferencia', category: 'Cuotas mensuales' },
  { id: '6', date: '2025-04-25', type: 'examen', amount: 824500, studentId: '6', description: 'Exámenes Abril', location: 'Rindieron', month: 4, year: 2025, paymentMethod: 'tarjeta', category: 'Exámenes' },
  
  // Mayo 2025
  { id: '7', date: '2025-05-15', type: 'cuota', amount: 3559300, studentId: '7', description: 'Cuotas Mayo', location: 'Scholem', month: 5, year: 2025, paymentMethod: 'transferencia', category: 'Cuotas mensuales' },
  { id: '8', date: '2025-05-20', type: 'examen', amount: 564200, studentId: '8', description: 'Exámenes Mayo', location: 'Rindieron', month: 5, year: 2025, paymentMethod: 'efectivo', category: 'Exámenes' },
  { id: '9', date: '2025-05-25', type: 'torneo', amount: 396000, studentId: '9', description: 'Torneo Mayo', location: 'Alquiler', month: 5, year: 2025, paymentMethod: 'efectivo', category: 'Torneos' },
]