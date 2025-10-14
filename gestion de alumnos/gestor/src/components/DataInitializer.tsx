import { useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { DataPersistenceService } from '../services/dataPersistenceSimple'

// Este componente se encarga de cargar los datos almacenados al inicializar la app
export const DataInitializer: React.FC = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Cargar datos del localStorage al inicializar
    const loadInitialData = async () => {
      try {
        // Cargar estudiantes
        const savedStudents = DataPersistenceService.loadStudents()
        if (savedStudents.length > 0) {
          // Aquí importaremos la acción cuando esté disponible
          console.log('Loaded students:', savedStudents.length)
        }

        // Cargar clases
        const savedClasses = DataPersistenceService.loadClasses()
        if (savedClasses.length > 0) {
          console.log('Loaded classes:', savedClasses.length)
        }

        // Cargar pagos
        const savedPayments = DataPersistenceService.loadPayments()
        if (savedPayments.length > 0) {
          console.log('Loaded payments:', savedPayments.length)
        }

        console.log('📦 Sistema de persistencia inicializado')
      } catch (error) {
        console.error('❌ Error al cargar datos iniciales:', error)
      }
    }

    loadInitialData()
  }, [dispatch])

  // Este componente no renderiza nada visible
  return null
}