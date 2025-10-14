import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque' | 'otro'
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial' | 'cancelled'

export interface Payment {
  id: string
  studentId: string
  amount: number
  dueDate: string // Fecha de vencimiento
  paidDate?: string // Fecha de pago real
  method?: PaymentMethod
  status: PaymentStatus
  period: string // Ej: "2024-10" (año-mes)
  notes?: string
  discount?: number // Descuento aplicado
  penalty?: number // Recargo por atraso
  receiptNumber?: string
  createdDate: string
  paidBy?: string // Quién realizó el pago
}

export interface PaymentPlan {
  id: string
  studentId: string
  monthlyAmount: number
  dueDay: number // Día del mes para vencimiento (ej: 10)
  startDate: string
  endDate?: string
  isActive: boolean
  discount: number // Descuento permanente en %
  createdDate: string
  notes?: string
}

export interface PaymentReminder {
  id: string
  studentId: string
  paymentId: string
  type: 'pre-due' | 'overdue' | 'custom'
  message: string
  sentDate: string
  isRead: boolean
}

interface PaymentsState {
  payments: Payment[]
  paymentPlans: PaymentPlan[]
  reminders: PaymentReminder[]
  selectedMonth: string
  selectedStatus: PaymentStatus | ''
  selectedStudent: string
  showOverdueOnly: boolean
}

const initialState: PaymentsState = {
  payments: [],
  paymentPlans: [],
  reminders: [],
  selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
  selectedStatus: '',
  selectedStudent: '',
  showOverdueOnly: false,
}

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    // CRUD para pagos
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload)
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(payment => payment.id === action.payload.id)
      if (index !== -1) {
        state.payments[index] = action.payload
      }
    },
    deletePayment: (state, action: PayloadAction<string>) => {
      state.payments = state.payments.filter(payment => payment.id !== action.payload)
    },

    // Marcar pago como realizado
    markPaymentAsPaid: (state, action: PayloadAction<{
      paymentId: string
      paidDate: string
      method: PaymentMethod
      receiptNumber?: string
      paidBy?: string
      notes?: string
    }>) => {
      const payment = state.payments.find(p => p.id === action.payload.paymentId)
      if (payment) {
        payment.status = 'paid'
        payment.paidDate = action.payload.paidDate
        payment.method = action.payload.method
        payment.receiptNumber = action.payload.receiptNumber
        payment.paidBy = action.payload.paidBy
        if (action.payload.notes) {
          payment.notes = action.payload.notes
        }
      }
    },

    // CRUD para planes de pago
    addPaymentPlan: (state, action: PayloadAction<PaymentPlan>) => {
      state.paymentPlans.push(action.payload)
    },
    updatePaymentPlan: (state, action: PayloadAction<PaymentPlan>) => {
      const index = state.paymentPlans.findIndex(plan => plan.id === action.payload.id)
      if (index !== -1) {
        state.paymentPlans[index] = action.payload
      }
    },
    deletePaymentPlan: (state, action: PayloadAction<string>) => {
      state.paymentPlans = state.paymentPlans.filter(plan => plan.id !== action.payload)
    },

    // CRUD para recordatorios
    addReminder: (state, action: PayloadAction<PaymentReminder>) => {
      state.reminders.push(action.payload)
    },
    markReminderAsRead: (state, action: PayloadAction<string>) => {
      const reminder = state.reminders.find(r => r.id === action.payload)
      if (reminder) {
        reminder.isRead = true
      }
    },
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter(reminder => reminder.id !== action.payload)
    },

    // Filtros
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload
    },
    setSelectedStatus: (state, action: PayloadAction<PaymentStatus | ''>) => {
      state.selectedStatus = action.payload
    },
    setSelectedStudent: (state, action: PayloadAction<string>) => {
      state.selectedStudent = action.payload
    },
    setShowOverdueOnly: (state, action: PayloadAction<boolean>) => {
      state.showOverdueOnly = action.payload
    },

    // Generar pagos automáticamente para un mes
    generateMonthlyPayments: (state, action: PayloadAction<{ month: string }>) => {
      const { month } = action.payload
      
      // Para cada plan activo, crear un pago si no existe ya
      state.paymentPlans
        .filter(plan => plan.isActive)
        .forEach(plan => {
          // Verificar si ya existe un pago para este estudiante en este mes
          const existingPayment = state.payments.find(
            payment => payment.studentId === plan.studentId && payment.period === month
          )

          if (!existingPayment) {
            // Calcular fecha de vencimiento
            const [year, monthNum] = month.split('-')
            const dueDate = new Date(parseInt(year), parseInt(monthNum) - 1, plan.dueDay)
            
            // Calcular monto con descuento
            const discountAmount = (plan.monthlyAmount * plan.discount) / 100
            const finalAmount = plan.monthlyAmount - discountAmount

            const newPayment: Payment = {
              id: `payment-${Date.now()}-${plan.studentId}`,
              studentId: plan.studentId,
              amount: finalAmount,
              dueDate: dueDate.toISOString().split('T')[0],
              status: 'pending',
              period: month,
              discount: discountAmount,
              createdDate: new Date().toISOString(),
              notes: plan.notes
            }

            state.payments.push(newPayment)
          }
        })
    },

    // Actualizar estados de pagos (ejecutar periódicamente)
    updatePaymentStatuses: (state) => {
      const today = new Date().toISOString().split('T')[0]
      
      state.payments
        .filter(payment => payment.status === 'pending')
        .forEach(payment => {
          if (payment.dueDate < today) {
            payment.status = 'overdue'
            
            // Calcular penalidad por atraso (ejemplo: 5% después de 7 días)
            const daysOverdue = Math.floor(
              (new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24)
            )
            
            if (daysOverdue > 7) {
              payment.penalty = Math.floor(payment.amount * 0.05) // 5% de recargo
            }
          }
        })
    },

    // Cargar datos de ejemplo
    loadSamplePaymentData: (state) => {
      // Crear planes de pago de ejemplo usando IDs de timestamp como en studentsSlice
      const baseTimestamp = Date.now()
      const samplePlans: PaymentPlan[] = [
        {
          id: 'plan-1',
          studentId: baseTimestamp.toString() + '1', // María García López
          monthlyAmount: 120,
          dueDay: 10,
          startDate: '2024-01-01',
          isActive: true,
          discount: 0,
          createdDate: new Date().toISOString(),
          notes: 'Plan estándar'
        },
        {
          id: 'plan-2',
          studentId: baseTimestamp.toString() + '2', // Carlos Rodríguez Mendez
          monthlyAmount: 100,
          dueDay: 15,
          startDate: '2024-05-01',
          isActive: true,
          discount: 10, // 10% descuento
          createdDate: new Date().toISOString(),
          notes: 'Descuento familiar'
        },
        {
          id: 'plan-3',
          studentId: baseTimestamp.toString() + '3', // Ana Sofía Martínez
          monthlyAmount: 150,
          dueDay: 5,
          startDate: '2022-03-01',
          isActive: true,
          discount: 0,
          createdDate: new Date().toISOString(),
        },
        {
          id: 'plan-4',
          studentId: baseTimestamp.toString() + '4', // Diego Fernández Silva
          monthlyAmount: 80,
          dueDay: 20,
          startDate: '2024-08-01',
          isActive: true,
          discount: 5, // 5% descuento principiante
          createdDate: new Date().toISOString(),
          notes: 'Tarifa principiante'
        }
      ]

      // Crear pagos de ejemplo para los últimos 3 meses
      const samplePayments: Payment[] = []
      const currentDate = new Date()
      
      for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthOffset, 1)
        const monthStr = targetDate.toISOString().slice(0, 7)

        samplePlans.forEach((plan, index) => {
          const dueDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), plan.dueDay)
          const discountAmount = (plan.monthlyAmount * plan.discount) / 100
          const finalAmount = plan.monthlyAmount - discountAmount

          // Crear diferentes estados de pago para demostrar
          let status: PaymentStatus = 'pending'
          let paidDate: string | undefined
          let method: PaymentMethod | undefined

          if (monthOffset === 2) { // Hace 2 meses - todos pagos
            status = 'paid'
            paidDate = new Date(dueDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            method = ['efectivo', 'transferencia', 'tarjeta'][Math.floor(Math.random() * 3)] as PaymentMethod
          } else if (monthOffset === 1) { // Mes pasado - algunos pagos y atrasos
            if (index % 2 === 0) {
              status = 'paid'
              paidDate = new Date(dueDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              method = ['efectivo', 'transferencia'][Math.floor(Math.random() * 2)] as PaymentMethod
            } else {
              status = 'overdue'
            }
          } else { // Mes actual - pendientes y algunos pagos
            if (index === 0) {
              status = 'paid'
              paidDate = new Date().toISOString().split('T')[0]
              method = 'transferencia'
            } else if (index === 1) {
              status = 'overdue' // Vencido
            } else {
              status = 'pending' // Pendiente
            }
          }

          samplePayments.push({
            id: `payment-${monthStr}-${plan.studentId}`,
            studentId: plan.studentId,
            amount: finalAmount,
            dueDate: dueDate.toISOString().split('T')[0],
            paidDate,
            method,
            status,
            period: monthStr,
            discount: discountAmount > 0 ? discountAmount : undefined,
            receiptNumber: status === 'paid' ? `REC-${Math.floor(Math.random() * 10000)}` : undefined,
            createdDate: new Date(targetDate).toISOString(),
            notes: plan.notes
          })
        })
      }

      state.paymentPlans = samplePlans
      state.payments = samplePayments

      // Crear algunos recordatorios de ejemplo
      const sampleReminders: PaymentReminder[] = [
        {
          id: 'reminder-1',
          studentId: baseTimestamp.toString() + '2',
          paymentId: samplePayments.find(p => p.studentId === baseTimestamp.toString() + '2' && p.status === 'overdue')?.id || '',
          type: 'overdue',
          message: 'Su pago de octubre está vencido. Por favor, póngase al día.',
          sentDate: new Date().toISOString(),
          isRead: false
        },
        {
          id: 'reminder-2',
          studentId: baseTimestamp.toString() + '4',
          paymentId: samplePayments.find(p => p.studentId === baseTimestamp.toString() + '4' && p.status === 'pending')?.id || '',
          type: 'pre-due',
          message: 'Recordatorio: Su pago vence en 3 días.',
          sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: false
        }
      ]

      state.reminders = sampleReminders
    },
  },
})

export const {
  addPayment,
  updatePayment,
  deletePayment,
  markPaymentAsPaid,
  addPaymentPlan,
  updatePaymentPlan,
  deletePaymentPlan,
  addReminder,
  markReminderAsRead,
  deleteReminder,
  setSelectedMonth,
  setSelectedStatus,
  setSelectedStudent,
  setShowOverdueOnly,
  generateMonthlyPayments,
  updatePaymentStatuses,
  loadSamplePaymentData,
} = paymentsSlice.actions

export default paymentsSlice.reducer