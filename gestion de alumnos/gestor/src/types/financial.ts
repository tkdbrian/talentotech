// Tipos para el sistema financiero avanzado
export interface FinancialCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

export interface FinancialTransaction {
  id: string
  date: string
  category: 'cuotas' | 'examenes' | 'torneos' | 'equipamiento' | 'seminarios' | 'otros'
  subcategory?: string
  amount: number
  currency: 'ARS' | 'USD'
  description: string
  studentId?: string
  studentName?: string
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque' | 'mercadopago'
  receiptNumber?: string
  notes?: string
  isRecurring: boolean
  tags?: string[]
  status: 'confirmed' | 'pending' | 'cancelled'
}

export interface MonthlyReport {
  year: number
  month: number
  totalIncome: number
  categoryBreakdown: {
    cuotas: number
    examenes: number
    torneos: number
    equipamiento: number
    seminarios: number
    otros: number
  }
  transactionCount: number
  averageTransaction: number
  topStudents: Array<{
    studentId: string
    studentName: string
    totalPaid: number
  }>
  growthRate?: number
}

export interface YearlyReport {
  year: number
  totalIncome: number
  monthlyData: MonthlyReport[]
  bestMonth: { month: number, income: number }
  worstMonth: { month: number, income: number }
  categoryTotals: MonthlyReport['categoryBreakdown']
  averageMonthlyIncome: number
  growthRateVsPreviousYear?: number
}

export interface FinancialGoals {
  id: string
  type: 'monthly' | 'yearly' | 'category'
  category?: string
  targetAmount: number
  currentAmount: number
  deadline: string
  description: string
  isActive: boolean
}

export interface ExpenseCategory {
  id: string
  name: string
  monthlyBudget: number
  description: string
  color: string
}

export interface Expense {
  id: string
  date: string
  category: string
  amount: number
  description: string
  paymentMethod: string
  receiptNumber?: string
  isRecurring: boolean
  notes?: string
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  monthlyGrowth: number
  yearlyGrowth: number
  topCategories: Array<{
    category: string
    amount: number
    percentage: number
  }>
}