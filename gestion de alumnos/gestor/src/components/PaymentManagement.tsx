import { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faDollarSign, 
  faCalendarAlt, 
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faPlus,
  faFilter,
  faReceipt,
  faChartLine,
  faBell,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  loadSamplePaymentData,
  generateMonthlyPayments,
  updatePaymentStatuses,
  setSelectedMonth,
  setSelectedStatus,
  setSelectedStudent,
  setShowOverdueOnly,
  markPaymentAsPaid,
  type Payment,
  type PaymentStatus,
  type PaymentMethod
} from '../store/slices/paymentsSlice'
import PaymentForm from './PaymentForm'
import PaymentPlanForm from './PaymentPlanForm'

type ViewMode = 'overview' | 'payments' | 'plans' | 'reports'

export default function PaymentManagement() {
  const dispatch = useAppDispatch()
  const { 
    payments, 
    paymentPlans, 
    reminders,
    selectedMonth, 
    selectedStatus, 
    selectedStudent,
    showOverdueOnly 
  } = useAppSelector(state => state.payments)
  const { students } = useAppSelector(state => state.students)

  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [selectedPaymentForPay, setSelectedPaymentForPay] = useState<Payment | null>(null)

  // Cargar datos de ejemplo si no hay pagos
  useEffect(() => {
    if (payments.length === 0 && paymentPlans.length === 0) {
      dispatch(loadSamplePaymentData())
    }
  }, [payments.length, paymentPlans.length, dispatch])

  // Actualizar estados de pagos periódicamente
  useEffect(() => {
    dispatch(updatePaymentStatuses())
  }, [dispatch])

  // Filtrar pagos según criterios seleccionados
  const filteredPayments = useMemo(() => {
    let filtered = payments

    if (selectedMonth) {
      filtered = filtered.filter(payment => payment.period === selectedMonth)
    }

    if (selectedStatus) {
      filtered = filtered.filter(payment => payment.status === selectedStatus)
    }

    if (selectedStudent) {
      filtered = filtered.filter(payment => payment.studentId === selectedStudent)
    }

    if (showOverdueOnly) {
      filtered = filtered.filter(payment => payment.status === 'overdue')
    }

    return filtered.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
  }, [payments, selectedMonth, selectedStatus, selectedStudent, showOverdueOnly])

  // Calcular estadísticas
  const stats = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const currentMonthPayments = payments.filter(p => p.period === currentMonth)
    
    const totalPaid = currentMonthPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const totalPending = currentMonthPayments
      .filter(p => p.status === 'pending' || p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const overdueCount = currentMonthPayments.filter(p => p.status === 'overdue').length
    const paidCount = currentMonthPayments.filter(p => p.status === 'paid').length
    
    return {
      totalPaid,
      totalPending,
      overdueCount,
      paidCount,
      totalPayments: currentMonthPayments.length,
      unreadReminders: reminders.filter(r => !r.isRead).length
    }
  }, [payments, reminders])

  const getStudent = (studentId: string) => {
    return students.find(s => s.id === studentId)
  }

  const getStatusColor = (status: PaymentStatus) => {
    const colors = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-red-100 text-red-800',
      'partial': 'bg-blue-100 text-blue-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: PaymentStatus) => {
    const icons = {
      'paid': faCheckCircle,
      'pending': faClock,
      'overdue': faExclamationTriangle,
      'partial': faClock,
      'cancelled': faExclamationTriangle
    }
    return icons[status] || faClock
  }

  const getStatusText = (status: PaymentStatus) => {
    const texts = {
      'paid': 'Pagado',
      'pending': 'Pendiente',
      'overdue': 'Vencido',
      'partial': 'Parcial',
      'cancelled': 'Cancelado'
    }
    return texts[status] || status
  }

  const handleGeneratePayments = () => {
    dispatch(generateMonthlyPayments({ month: selectedMonth }))
  }

  const handleMarkAsPaid = (payment: Payment, paymentData: {
    method: PaymentMethod
    paidDate: string
    receiptNumber?: string
    paidBy?: string
    notes?: string
  }) => {
    dispatch(markPaymentAsPaid({
      paymentId: payment.id,
      ...paymentData
    }))
    setSelectedPaymentForPay(null)
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <FontAwesomeIcon icon={faDollarSign} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <FontAwesomeIcon icon={faClock} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">${stats.totalPending.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-red-500 p-3 rounded-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdueCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FontAwesomeIcon icon={faBell} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recordatorios</p>
              <p className="text-2xl font-bold text-blue-600">{stats.unreadReminders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de vistas */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-2" />
              Resumen
            </button>
            <button
              onClick={() => setViewMode('payments')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'payments' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <FontAwesomeIcon icon={faReceipt} className="mr-2" />
              Pagos
            </button>
            <button
              onClick={() => setViewMode('plans')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'plans' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Planes
            </button>
            <button
              onClick={() => setViewMode('reports')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'reports' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-2" />
              Reportes
            </button>
          </div>

          <div className="flex gap-2">
            {viewMode === 'payments' && (
              <>
                <button
                  onClick={handleGeneratePayments}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Generar Mes
                </button>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Nuevo Pago
                </button>
              </>
            )}
            {viewMode === 'plans' && (
              <button
                onClick={() => setShowPlanForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} />
                Nuevo Plan
              </button>
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
              <label className="block text-xs text-gray-600 mb-1">Mes</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => dispatch(setSelectedMonth(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Estado</label>
              <select
                value={selectedStatus}
                onChange={(e) => dispatch(setSelectedStatus(e.target.value as PaymentStatus | ''))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="paid">Pagados</option>
                <option value="pending">Pendientes</option>
                <option value="overdue">Vencidos</option>
                <option value="partial">Parciales</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Estudiante</label>
              <select
                value={selectedStudent}
                onChange={(e) => dispatch(setSelectedStudent(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estudiantes</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showOverdueOnly}
                  onChange={(e) => dispatch(setShowOverdueOnly(e.target.checked))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Solo vencidos</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal según vista seleccionada */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumen del mes actual */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Resumen de {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">Pagos realizados</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-700">{stats.paidCount}</div>
                  <div className="text-sm text-green-600">${stats.totalPaid.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-700">Pendientes de pago</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-700">{stats.totalPayments - stats.paidCount}</div>
                  <div className="text-sm text-yellow-600">${stats.totalPending.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-red-700">Pagos vencidos</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-700">{stats.overdueCount}</div>
                  <div className="text-sm text-red-600">Requieren atención</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recordatorios pendientes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recordatorios Recientes
            </h2>
            
            {reminders.filter(r => !r.isRead).length > 0 ? (
              <div className="space-y-3">
                {reminders
                  .filter(r => !r.isRead)
                  .slice(0, 5)
                  .map(reminder => {
                    const student = getStudent(reminder.studentId)
                    return (
                      <div key={reminder.id} className="border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{student?.name}</p>
                            <p className="text-sm text-gray-600">{reminder.message}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reminder.type === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reminder.type === 'overdue' ? 'Vencido' : 'Próximo'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-green-300 mb-4" />
                <p className="text-gray-500">No hay recordatorios pendientes</p>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'payments' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Gestión de Pagos ({filteredPayments.length})
          </h2>
          
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map(payment => {
                    const student = getStudent(payment.studentId)
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student?.name}</div>
                            <div className="text-sm text-gray-500">{student?.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.period + '-01').toLocaleDateString('es-ES', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                          {payment.discount && (
                            <div className="text-xs text-green-600">Desc: ${payment.discount.toFixed(2)}</div>
                          )}
                          {payment.penalty && (
                            <div className="text-xs text-red-600">Recargo: ${payment.penalty.toFixed(2)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.dueDate).toLocaleDateString()}
                          {payment.paidDate && (
                            <div className="text-xs text-green-600">
                              Pagado: {new Date(payment.paidDate).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            <FontAwesomeIcon icon={getStatusIcon(payment.status)} className="mr-1" />
                            {getStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {payment.status !== 'paid' && (
                            <button
                              onClick={() => setSelectedPaymentForPay(payment)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1" />
                              Pagar
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingPayment(payment)
                              setShowPaymentForm(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faReceipt} className="text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">No hay pagos que coincidan con los filtros</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'plans' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Planes de Pago ({paymentPlans.length})
          </h2>
          
          {paymentPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentPlans.map(plan => {
                const student = getStudent(plan.studentId)
                return (
                  <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{student?.name}</h3>
                        <p className="text-sm text-gray-600">{student?.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Cuota mensual:</span>
                        <span className="font-medium">${plan.monthlyAmount}</span>
                      </div>
                      {plan.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Descuento:</span>
                          <span className="font-medium">{plan.discount}%</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Vencimiento:</span>
                        <span>Día {plan.dueDay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Desde:</span>
                        <span>{new Date(plan.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {plan.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">{plan.notes}</p>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Editar Plan
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">No hay planes de pago configurados</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'reports' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Reportes Financieros
          </h2>
          <p className="text-gray-600">
            Funcionalidad de reportes en desarrollo...
          </p>
        </div>
      )}

      {/* Modal para formulario de pagos */}
      {showPaymentForm && (
        <PaymentForm
          payment={editingPayment}
          onCancel={() => {
            setShowPaymentForm(false)
            setEditingPayment(null)
          }}
        />
      )}

      {/* Modal para formulario de planes */}
      {showPlanForm && (
        <PaymentPlanForm
          onCancel={() => setShowPlanForm(false)}
        />
      )}

      {/* Modal para marcar pago como realizado */}
      {selectedPaymentForPay && (
        <QuickPaymentModal
          payment={selectedPaymentForPay}
          onPay={handleMarkAsPaid}
          onCancel={() => setSelectedPaymentForPay(null)}
        />
      )}
    </div>
  )
}

// Componente para pago rápido
function QuickPaymentModal({ 
  payment, 
  onPay, 
  onCancel 
}: { 
  payment: Payment
  onPay: (payment: Payment, data: {
    method: PaymentMethod
    paidDate: string
    receiptNumber?: string
    paidBy?: string
    notes?: string
  }) => void
  onCancel: () => void
}) {
  const [method, setMethod] = useState<PaymentMethod>('efectivo')
  const [receiptNumber, setReceiptNumber] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [notes, setNotes] = useState('')
  
  const { students } = useAppSelector(state => state.students)
  const student = students.find(s => s.id === payment.studentId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPay(payment, {
      method,
      paidDate: new Date().toISOString().split('T')[0],
      receiptNumber: receiptNumber || undefined,
      paidBy: paidBy || undefined,
      notes: notes || undefined
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Registrar Pago</h3>
          <p className="text-sm text-gray-600">{student?.name}</p>
          <p className="text-lg font-bold text-green-600">${payment.amount.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de pago *
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="cheque">Cheque</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de recibo
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="REC-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recibido por
              </label>
              <input
                type="text"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del instructor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Observaciones adicionales..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              Confirmar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}