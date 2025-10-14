import type { Student } from '../store/slices/studentsSlice'

export const sampleStudents: Omit<Student, 'id'>[] = [
  {
    dni: '12345678',
    name: 'María García López',
    email: 'maria.garcia@email.com',
    belt: 'Verde (6)',
    birthDate: '2008-03-15',
    phone: '+1234567890',
    emergencyContact: 'Ana López (madre) - +1234567891',
    joinDate: '2023-01-15',
    monthlyFee: 120,
    status: 'active',
    practiceLocation: 'Sede Central',
    shift: 'Tarde',
    instructor: 'Instructor Principal',
    isCompleteForDiploma: true,
    observations: 'Excelente técnica, lista para próximo examen'
  },
  {
    dni: '23456789',
    name: 'Carlos Rodríguez Mendez',
    email: 'carlos.rodriguez@email.com',
    belt: 'Azul (4)',
    birthDate: '2010-07-22',
    phone: '+2345678901',
    emergencyContact: 'Luis Rodríguez (padre) - +2345678902',
    joinDate: '2023-05-10',
    monthlyFee: 100,
    status: 'active',
    practiceLocation: 'Sede Norte',
    shift: 'Mañana',
    instructor: 'Instructor Asistente 1',
    isCompleteForDiploma: false,
    observations: 'Necesita mejorar poomsae básicos'
  },
  {
    dni: '34567890',
    name: 'Ana Sofía Martínez',
    email: 'sofia.martinez@email.com',
    belt: 'Rojo (2)',
    birthDate: '2005-11-08',
    phone: '+3456789012',
    emergencyContact: 'Carmen Martínez (madre) - +3456789013',
    joinDate: '2022-03-20',
    monthlyFee: 150,
    status: 'active',
    practiceLocation: 'Sede Central',
    shift: 'Noche',
    instructor: 'Instructor Principal',
    isCompleteForDiploma: true,
    observations: 'Candidata a cinta negra, excelente liderazgo'
  },
  {
    dni: '45678901',
    name: 'Diego Fernández Silva',
    email: 'diego.fernandez@email.com',
    belt: 'Amarillo (8)',
    birthDate: '2012-01-30',
    phone: '+4567890123',
    emergencyContact: 'María Silva (madre) - +4567890124',
    joinDate: '2024-08-01',
    monthlyFee: 80,
    status: 'active',
    practiceLocation: 'Sede Sur',
    shift: 'Tarde',
    instructor: 'Instructor Asistente 2',
    isCompleteForDiploma: false,
    observations: 'Principiante con mucho entusiasmo'
  },
  {
    dni: '56789012',
    name: 'Valentina Torres Ruiz',
    email: 'valentina.torres@email.com',
    belt: 'Verde Punta Azul (5)',
    birthDate: '2009-06-14',
    phone: '+5678901234',
    emergencyContact: 'Roberto Torres (padre) - +5678901235',
    joinDate: '2023-09-12',
    monthlyFee: 110,
    status: 'active',
    practiceLocation: 'Sede Este',
    shift: 'Mañana',
    instructor: 'Instructor Asistente 1',
    isCompleteForDiploma: true,
    observations: 'Muy constante en entrenamientos'
  },
  {
    dni: '67890123',
    name: 'Sebastián Morales Castro',
    email: 'sebastian.morales@email.com',
    belt: 'Blanco (10)',
    birthDate: '2014-09-25',
    phone: '+6789012345',
    emergencyContact: 'Patricia Castro (madre) - +6789012346',
    joinDate: '2024-10-01',
    monthlyFee: 70,
    status: 'active',
    practiceLocation: 'Sede Central',
    shift: 'Tarde',
    instructor: 'Instructor Principal',
    isCompleteForDiploma: false,
    observations: 'Recién ingresado, muy motivado'
  },
  {
    dni: '78901234',
    name: 'Isabella Herrera Vega',
    email: 'isabella.herrera@email.com',
    belt: 'Azul Punta Roja (3)',
    birthDate: '2007-04-12',
    phone: '+7890123456',
    emergencyContact: 'Miguel Herrera (padre) - +7890123457',
    joinDate: '2022-11-18',
    monthlyFee: 140,
    status: 'active',
    practiceLocation: 'Sede Norte',
    shift: 'Noche',
    instructor: 'Instructor Principal',
    isCompleteForDiploma: true,
    observations: 'Competidora nacional, excelente nivel técnico'
  },
  {
    dni: '89012345',
    name: 'Mateo Jiménez Ortiz',
    email: 'mateo.jimenez@email.com',
    belt: 'Punta Amarilla (9)',
    birthDate: '2013-12-03',
    phone: '+8901234567',
    emergencyContact: 'Laura Ortiz (madre) - +8901234568',
    joinDate: '2024-06-15',
    monthlyFee: 75,
    status: 'inactive',
    practiceLocation: 'Sede Sur',
    shift: 'Mañana',
    instructor: 'Instructor Asistente 2',
    isCompleteForDiploma: false,
    observations: 'Suspendido temporalmente por viaje familiar'
  }
]

export const generateStudentId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

export const createSampleStudentsWithIds = (): Student[] => {
  return sampleStudents.map(student => ({
    ...student,
    id: generateStudentId()
  }))
}