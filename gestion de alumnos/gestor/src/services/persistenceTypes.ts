// Tipos para el sistema de persistencia
import type { Student } from '../store/slices/studentsSlice'
import type { ClassSchedule, ClassSession } from '../store/slices/classesSlice'
import type { Payment, PaymentPlan, PaymentReminder } from '../store/slices/paymentsSlice'

export interface DataBackup {
  timestamp: string
  version: string
  students: Student[]
  classes: (ClassSchedule | ClassSession)[]
  payments: (Payment | PaymentPlan | PaymentReminder)[]
  metadata: {
    totalRecords: number
    lastSync?: string
    source: 'local' | 'sheets' | 'backup'
  }
}

export interface StorageData<T> {
  data: T[]
  timestamp: string
  checksum: string
}

export interface StorageStatus {
  used: number
  available: number
  percentage: number
  canStore: boolean
}

export interface BackupItem<T = unknown> {
  type: string
  data: T[]
  timestamp: string
}

export interface CSVImportResult {
  success: boolean
  imported: number
  errors: string[]
}

export interface GoogleSheetsConfig {
  sheetId: string
  apiKey: string
  range?: string
}

export interface SyncResult {
  success: boolean
  recordsProcessed: number
  conflicts: number
  errors: string[]
}