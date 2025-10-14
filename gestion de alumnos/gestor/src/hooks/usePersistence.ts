import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { DataPersistenceService } from '../services/dataPersistenceSimple'

export const usePersistence = () => {
  
  const students = useSelector((state: RootState) => state.students.students)
  const classes = useSelector((state: RootState) => state.classes.schedules)
  const payments = useSelector((state: RootState) => state.payments.payments)

  // Guardar automáticamente cuando cambien los datos
  useEffect(() => {
    if (students.length > 0) {
      DataPersistenceService.saveStudents(students)
    }
  }, [students])

  useEffect(() => {
    if (classes.length > 0) {
      DataPersistenceService.saveClasses(classes)
    }
  }, [classes])

  useEffect(() => {
    if (payments.length > 0) {
      DataPersistenceService.savePayments(payments)
    }
  }, [payments])

  // Cargar datos al inicializar
  const loadInitialData = () => {
    try {
      const savedStudents = DataPersistenceService.loadStudents()
      const savedClasses = DataPersistenceService.loadClasses()
      const savedPayments = DataPersistenceService.loadPayments()

      if (savedStudents.length > 0) {
        // Aquí necesitaremos importar las acciones de Redux
        // dispatch(setStudents(savedStudents))
      }

      if (savedClasses.length > 0) {
        // dispatch(setClasses(savedClasses))
      }

      if (savedPayments.length > 0) {
        // dispatch(setPayments(savedPayments))
      }

      return {
        students: savedStudents,
        classes: savedClasses,
        payments: savedPayments
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
      return {
        students: [],
        classes: [],
        payments: []
      }
    }
  }

  const exportData = () => {
    return DataPersistenceService.exportToJSON()
  }

  const importData = (jsonString: string) => {
    return DataPersistenceService.importFromJSON(jsonString)
  }

  const exportCSV = (type: 'students' | 'classes' | 'payments') => {
    return DataPersistenceService.exportToCSV(type)
  }

  const getStorageStatus = () => {
    return DataPersistenceService.getStorageStatus()
  }

  const createBackup = () => {
    return DataPersistenceService.createFullBackup()
  }

  return {
    loadInitialData,
    exportData,
    importData,
    exportCSV,
    getStorageStatus,
    createBackup
  }
}