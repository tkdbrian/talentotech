import type { GUP } from '../store/slices/studentsSlice'

// Definición de la progresión de cinturones según reglas de negocio
export const GUP_PROGRESSION: Record<GUP, { 
  name: string
  level: number
  color: string
  nextGUP?: GUP
  minDaysBetweenExams: number
}> = {
  'BLANCO_10': {
    name: 'Blanco',
    level: 10,
    color: 'bg-gray-100 text-gray-800',
    nextGUP: 'PUNTA_AMARILLA_9',
    minDaysBetweenExams: 60
  },
  'PUNTA_AMARILLA_9': {
    name: 'Punta Amarilla',
    level: 9,
    color: 'bg-yellow-100 text-yellow-800',
    nextGUP: 'AMARILLO_8',
    minDaysBetweenExams: 60
  },
  'AMARILLO_8': {
    name: 'Amarillo',
    level: 8,
    color: 'bg-yellow-200 text-yellow-800',
    nextGUP: 'AMARILLO_PUNTA_VERDE_7',
    minDaysBetweenExams: 60
  },
  'AMARILLO_PUNTA_VERDE_7': {
    name: 'Amarillo Punta Verde',
    level: 7,
    color: 'bg-green-100 text-green-800',
    nextGUP: 'VERDE_6',
    minDaysBetweenExams: 60
  },
  'VERDE_6': {
    name: 'Verde',
    level: 6,
    color: 'bg-green-200 text-green-800',
    nextGUP: 'VERDE_PUNTA_AZUL_5',
    minDaysBetweenExams: 90
  },
  'VERDE_PUNTA_AZUL_5': {
    name: 'Verde Punta Azul',
    level: 5,
    color: 'bg-blue-100 text-blue-800',
    nextGUP: 'AZUL_4',
    minDaysBetweenExams: 90
  },
  'AZUL_4': {
    name: 'Azul',
    level: 4,
    color: 'bg-blue-200 text-blue-800',
    nextGUP: 'AZUL_PUNTA_ROJA_3',
    minDaysBetweenExams: 90
  },
  'AZUL_PUNTA_ROJA_3': {
    name: 'Azul Punta Roja',
    level: 3,
    color: 'bg-red-100 text-red-800',
    nextGUP: 'ROJO_2',
    minDaysBetweenExams: 120
  },
  'ROJO_2': {
    name: 'Rojo',
    level: 2,
    color: 'bg-red-200 text-red-800',
    nextGUP: 'ROJO_PUNTA_NEGRA_1',
    minDaysBetweenExams: 120
  },
  'ROJO_PUNTA_NEGRA_1': {
    name: 'Rojo Punta Negra',
    level: 1,
    color: 'bg-gray-800 text-white',
    minDaysBetweenExams: 180
  }
}

// Función para obtener la información del GUP
export const getGUPInfo = (gup: GUP) => {
  return GUP_PROGRESSION[gup]
}

// Función para calcular la fecha sugerida del próximo examen
export const calculateNextExamDate = (lastExamDate: string, currentGUP: GUP): string | null => {
  const gupInfo = getGUPInfo(currentGUP)
  if (!gupInfo.nextGUP) return null // Ya está en el máximo nivel
  
  const lastDate = new Date(lastExamDate)
  const nextDate = new Date(lastDate.getTime() + (gupInfo.minDaysBetweenExams * 24 * 60 * 60 * 1000))
  
  return nextDate.toISOString().split('T')[0]
}

// Función para verificar si un estudiante está listo para examen
export const isReadyForExam = (lastExamDate: string, currentGUP: GUP): boolean => {
  const suggestedDate = calculateNextExamDate(lastExamDate, currentGUP)
  if (!suggestedDate) return false
  
  const today = new Date()
  const suggested = new Date(suggestedDate)
  
  return today >= suggested
}

// Función para obtener todos los GUPs ordenados
export const getAllGUPs = (): GUP[] => {
  return Object.keys(GUP_PROGRESSION) as GUP[]
}

// Función para obtener el siguiente GUP
export const getNextGUP = (currentGUP: GUP): GUP | null => {
  return GUP_PROGRESSION[currentGUP].nextGUP || null
}

// Función para verificar si el DNI es válido (básico)
export const isValidDNI = (dni: string): boolean => {
  return /^\d{7,8}$/.test(dni)
}