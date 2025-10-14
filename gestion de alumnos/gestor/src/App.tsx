import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faUsers, faGraduationCap, faCalendarAlt, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { addStudent, updateStudent, deleteStudent, setSearchTerm, setBeltFilter, setStatusFilter, type Student } from './store/slices/studentsSlice'
import StudentForm from './components/StudentForm'
import StudentCard from './components/StudentCard'
import Dashboard from './components/Dashboard'
import ClassManagement from './components/ClassManagement'
import PaymentManagement from './components/PaymentManagement'

function App() {
  const dispatch = useAppDispatch()
  const { filteredStudents, searchTerm, selectedBelt, selectedStatus } = useAppSelector(state => state.students)
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'classes' | 'payments'>('dashboard')

  const belts = ['Blanco', 'Amarillo', 'Naranja', 'Verde', 'Azul', 'Marrón', 'Negro 1º Dan', 'Negro 2º Dan', 'Negro 3º Dan']
  const statuses = ['active', 'inactive', 'suspended']

  const handleAddStudent = (student: Student) => {
    const newStudent: Student = {
      ...student,
      id: student.id || Date.now().toString()
    }
    dispatch(addStudent(newStudent))
    setShowForm(false)
  }

  const handleUpdateStudent = (student: Student) => {
    dispatch(updateStudent(student))
    setEditingStudent(null)
    setShowForm(false)
  }

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      dispatch(deleteStudent(id))
    }
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faGraduationCap} className="text-2xl" />
              <h1 className="text-2xl font-bold">Sistema de Gestión - Taekwondo</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded transition-colors ${
                  activeTab === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-4 py-2 rounded transition-colors ${
                  activeTab === 'students' ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Estudiantes
              </button>
              <button
                onClick={() => setActiveTab('classes')}
                className={`px-4 py-2 rounded transition-colors ${
                  activeTab === 'classes' ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Clases
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-2 rounded transition-colors ${
                  activeTab === 'payments' ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Pagos
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        
        {activeTab === 'classes' && <ClassManagement />}
        
        {activeTab === 'payments' && <PaymentManagement />}
        
        {activeTab === 'students' && (
          <>
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar estudiantes..."
                      value={searchTerm}
                      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Filters */}
                  <div className="flex gap-2">
                    <select
                      value={selectedBelt}
                      onChange={(e) => dispatch(setBeltFilter(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todas las cintas</option>
                      {belts.map(belt => (
                        <option key={belt} value={belt}>{belt}</option>
                      ))}
                    </select>
                    
                    <select
                      value={selectedStatus}
                      onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos los estados</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status === 'active' ? 'Activo' : status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Add Button */}
                <button
                  onClick={() => {
                    setEditingStudent(null)
                    setShowForm(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Agregar Estudiante
                </button>
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map(student => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={handleEditStudent}
                  onDelete={handleDeleteStudent}
                />
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faUsers} className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl text-gray-500 mb-2">No hay estudiantes</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm || selectedBelt || selectedStatus
                    ? 'No se encontraron estudiantes con los filtros aplicados'
                    : 'Comienza agregando tu primer estudiante'
                  }
                </p>
                <button
                  onClick={() => {
                    setEditingStudent(null)
                    setShowForm(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Agregar Estudiante
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Form */}
      {showForm && (
        <StudentForm
          student={editingStudent}
          onSave={editingStudent ? handleUpdateStudent : handleAddStudent}
          onCancel={() => {
            setShowForm(false)
            setEditingStudent(null)
          }}
        />
      )}
    </div>
  )
}

export default App
