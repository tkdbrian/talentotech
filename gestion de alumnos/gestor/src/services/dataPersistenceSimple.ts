// Servicio de persistencia simplificado
import type { Student } from '../store/slices/studentsSlice'

export interface StorageStatus {
  used: number
  available: number
  percentage: number
  canStore: boolean
}

export class DataPersistenceService {
  private static readonly STORAGE_KEYS = {
    STUDENTS: 'taekwondo_students',
    CLASSES: 'taekwondo_classes',
    PAYMENTS: 'taekwondo_payments',
    BACKUP: 'taekwondo_backup'
  }

  // ====== ESTUDIANTES ======
  static saveStudents(students: Student[]): boolean {
    try {
      const data = {
        data: students,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(this.STORAGE_KEYS.STUDENTS, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error saving students:', error)
      return false
    }
  }

  static loadStudents(): Student[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.STUDENTS)
      if (!stored) return []
      
      const data = JSON.parse(stored)
      return Array.isArray(data.data) ? data.data : []
    } catch (error) {
      console.error('Error loading students:', error)
      return []
    }
  }

  // ====== CLASES (PLACEHOLDER) ======
  static saveClasses(classes: unknown[]): boolean {
    try {
      const data = {
        data: classes,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(this.STORAGE_KEYS.CLASSES, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error saving classes:', error)
      return false
    }
  }

  static loadClasses(): unknown[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.CLASSES)
      if (!stored) return []
      
      const data = JSON.parse(stored)
      return Array.isArray(data.data) ? data.data : []
    } catch (error) {
      console.error('Error loading classes:', error)
      return []
    }
  }

  // ====== PAGOS (PLACEHOLDER) ======
  static savePayments(payments: unknown[]): boolean {
    try {
      const data = {
        data: payments,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(this.STORAGE_KEYS.PAYMENTS, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error saving payments:', error)
      return false
    }
  }

  static loadPayments(): unknown[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.PAYMENTS)
      if (!stored) return []
      
      const data = JSON.parse(stored)
      return Array.isArray(data.data) ? data.data : []
    } catch (error) {
      console.error('Error loading payments:', error)
      return []
    }
  }

  // ====== BACKUP ======
  static createFullBackup() {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      students: this.loadStudents(),
      classes: this.loadClasses(),
      payments: this.loadPayments(),
      metadata: {
        totalRecords: 0,
        source: 'local' as const
      }
    }
    
    backup.metadata.totalRecords = 
      backup.students.length + backup.classes.length + backup.payments.length
    
    localStorage.setItem(this.STORAGE_KEYS.BACKUP, JSON.stringify(backup))
    return backup
  }

  // ====== EXPORT/IMPORT ======
  static exportToJSON(): string {
    const backup = this.createFullBackup()
    return JSON.stringify(backup, null, 2)
  }

  static exportToCSV(type: 'students' | 'classes' | 'payments'): string {
    if (type === 'students') {
      const students = this.loadStudents()
      if (students.length === 0) return ''

      const headers = [
        'ID', 'DNI', 'Nombre', 'Email', 'Cinta', 'Fecha Nacimiento', 
        'Teléfono', 'Contacto Emergencia', 'Fecha Ingreso', 'Cuota Mensual', 
        'Estado', 'Sede', 'Turno', 'Instructor'
      ]

      const csvContent = [
        headers.join(','),
        ...students.map(student => [
          student.id,
          student.dni || '',
          `"${student.name}"`,
          student.email,
          `"${student.belt}"`,
          student.birthDate,
          student.phone,
          `"${student.emergencyContact}"`,
          student.joinDate,
          student.monthlyFee,
          student.status,
          student.practiceLocation || '',
          student.shift || '',
          student.instructor || ''
        ].join(','))
      ].join('\n')

      return csvContent
    }
    
    return ''
  }

  static importFromJSON(jsonString: string): boolean {
    try {
      const backup = JSON.parse(jsonString)
      
      if (backup.students && Array.isArray(backup.students)) {
        this.saveStudents(backup.students)
      }
      
      return true
    } catch (error) {
      console.error('Error importing JSON:', error)
      return false
    }
  }

  // ====== STORAGE STATUS ======
  static getStorageStatus(): StorageStatus {
    try {
      let used = 0
      
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('taekwondo_')) {
          used += localStorage.getItem(key)?.length || 0
        }
      }
      
      const available = 5 * 1024 * 1024 // 5MB typical limit
      const percentage = (used / available) * 100
      
      return {
        used,
        available,
        percentage,
        canStore: percentage < 90
      }
    } catch {
      return { used: 0, available: 0, percentage: 0, canStore: false }
    }
  }

  static clearAllData(): boolean {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch {
      return false
    }
  }
}