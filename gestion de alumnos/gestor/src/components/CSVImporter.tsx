import React, { useState, useRef } from 'react'
import { useAppDispatch } from '../store/hooks'
import { addStudent, type Student } from '../store/slices/studentsSlice'

interface CSVImportResult {
  success: number
  errors: string[]
  total: number
}

const CSVImporter: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<CSVImportResult | null>(null)
  const [csvPreview, setCsvPreview] = useState<string[][]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  const processCSVData = (csvText: string): Student[] => {
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []

    const students: Student[] = []
    
    // Intentar detectar el formato automáticamente
    const headers = parseCSVLine(lines[0].toLowerCase())
    
    // Mapeo flexible de columnas
    const columnMap = {
      id: headers.findIndex(h => h.includes('id') || h.includes('identificador')),
      dni: headers.findIndex(h => h.includes('dni') || h.includes('documento') || h.includes('cedula')),
      name: headers.findIndex(h => h.includes('nombre') || h.includes('name') || h.includes('apellido')),
      email: headers.findIndex(h => h.includes('email') || h.includes('correo') || h.includes('mail')),
      belt: headers.findIndex(h => h.includes('cinta') || h.includes('belt') || h.includes('grado')),
      birthDate: headers.findIndex(h => h.includes('nacimiento') || h.includes('birth') || h.includes('fecha')),
      phone: headers.findIndex(h => h.includes('telefono') || h.includes('phone') || h.includes('celular')),
      emergencyContact: headers.findIndex(h => h.includes('emergencia') || h.includes('emergency') || h.includes('contacto')),
      joinDate: headers.findIndex(h => h.includes('ingreso') || h.includes('join') || h.includes('alta')),
      monthlyFee: headers.findIndex(h => h.includes('cuota') || h.includes('fee') || h.includes('mensual')),
      status: headers.findIndex(h => h.includes('estado') || h.includes('status')),
      practiceLocation: headers.findIndex(h => h.includes('sede') || h.includes('location') || h.includes('dojo')),
      shift: headers.findIndex(h => h.includes('turno') || h.includes('shift') || h.includes('horario')),
      instructor: headers.findIndex(h => h.includes('instructor') || h.includes('profesor') || h.includes('maestro'))
    }

    // Procesar cada fila de datos
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length < 2) continue // Saltar filas vacías

      const student: Student = {
        id: columnMap.id >= 0 ? values[columnMap.id] || `csv-${Date.now()}-${i}` : `csv-${Date.now()}-${i}`,
        dni: columnMap.dni >= 0 ? values[columnMap.dni] || '' : '',
        name: columnMap.name >= 0 ? values[columnMap.name] || '' : values[0] || '', // Fallback a primera columna
        email: columnMap.email >= 0 ? values[columnMap.email] || '' : '',
        belt: columnMap.belt >= 0 ? values[columnMap.belt] || 'Blanco (10)' : 'Blanco (10)',
        birthDate: columnMap.birthDate >= 0 ? values[columnMap.birthDate] || '' : '',
        phone: columnMap.phone >= 0 ? values[columnMap.phone] || '' : '',
        emergencyContact: columnMap.emergencyContact >= 0 ? values[columnMap.emergencyContact] || '' : '',
        joinDate: columnMap.joinDate >= 0 ? values[columnMap.joinDate] || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        monthlyFee: columnMap.monthlyFee >= 0 ? parseFloat(values[columnMap.monthlyFee]) || 0 : 0,
        status: columnMap.status >= 0 ? values[columnMap.status] as 'active' | 'inactive' | 'suspended' || 'active' : 'active',
        practiceLocation: columnMap.practiceLocation >= 0 ? values[columnMap.practiceLocation] || '' : '',
        shift: columnMap.shift >= 0 ? values[columnMap.shift] || '' : '',
        instructor: columnMap.instructor >= 0 ? values[columnMap.instructor] || '' : '',
        // Campos adicionales opcionales
        isCompleteForDiploma: false,
        observations: ''
      }

      // Solo agregar si tiene nombre
      if (student.name.trim()) {
        students.push(student)
      }
    }

    return students
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setResult(null)
    setCsvPreview([])

    try {
      const text = await file.text()
      
      // Mostrar preview
      const lines = text.split('\n').slice(0, 6) // Primeras 6 líneas
      const preview = lines.map(line => parseCSVLine(line))
      setCsvPreview(preview)

      // Procesar datos
      const students = processCSVData(text)
      
      if (students.length === 0) {
        setResult({
          success: 0,
          errors: ['No se encontraron estudiantes válidos en el archivo'],
          total: 0
        })
        return
      }

      // Importar estudiantes
      const errors: string[] = []
      let successCount = 0

      students.forEach((student, index) => {
        try {
          dispatch(addStudent(student))
          successCount++
        } catch (error) {
          errors.push(`Error en fila ${index + 2}: ${error}`)
        }
      })

      setResult({
        success: successCount,
        errors,
        total: students.length
      })

    } catch (error) {
      setResult({
        success: 0,
        errors: [`Error procesando archivo: ${error}`],
        total: 0
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        <i className="fas fa-file-csv mr-2"></i>
        Importar desde Google Sheets (CSV)
      </h3>

      {/* Instrucciones */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">📋 Instrucciones:</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. En Google Sheets: <strong>Archivo → Descargar → CSV (.csv)</strong></li>
          <li>2. El sistema detecta automáticamente las columnas</li>
          <li>3. Columnas reconocidas: Nombre, DNI, Email, Cinta, Teléfono, etc.</li>
          <li>4. Los estudiantes existentes no se duplicarán</li>
        </ol>
      </div>

      {/* Selector de archivo */}
      <div className="mb-6">
        <button
          onClick={handleFileSelect}
          disabled={isImporting}
          className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-3 rounded-md transition-colors"
        >
          <i className="fas fa-upload mr-2"></i>
          {isImporting ? 'Procesando...' : 'Seleccionar archivo CSV'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.txt"
          style={{ display: 'none' }}
        />
      </div>

      {/* Preview del CSV */}
      {csvPreview.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">📄 Vista previa del archivo:</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <tbody>
                {csvPreview.map((row, index) => (
                  <tr key={index} className={index === 0 ? 'bg-gray-100 font-semibold' : ''}>
                    {row.slice(0, 6).map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-200 px-2 py-1 text-xs">
                        {cell.substring(0, 20)}{cell.length > 20 ? '...' : ''}
                      </td>
                    ))}
                    {row.length > 6 && (
                      <td className="border border-gray-200 px-2 py-1 text-xs text-gray-500">
                        +{row.length - 6} columnas más...
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resultado de la importación */}
      {result && (
        <div className="mt-6">
          <div className={`p-4 rounded-md ${
            result.errors.length === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            <h4 className="font-semibold mb-2">
              📊 Resultado de la importación:
            </h4>
            <p className="mb-2">
              ✅ <strong>{result.success}</strong> estudiantes importados correctamente
              {result.total > result.success && (
                <span> de {result.total} total</span>
              )}
            </p>
            
            {result.errors.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-red-700">⚠️ Errores encontrados:</p>
                <ul className="mt-1 text-sm">
                  {result.errors.slice(0, 5).map((error, index) => (
                    <li key={index} className="text-red-600">• {error}</li>
                  ))}
                  {result.errors.length > 5 && (
                    <li className="text-red-600">• ... y {result.errors.length - 5} errores más</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Formatos soportados */}
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Formatos detectados automáticamente:</strong></p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs">
          <div>• Nombre / Name</div>
          <div>• DNI / Documento</div>
          <div>• Email / Correo</div>
          <div>• Teléfono / Phone</div>
          <div>• Cinta / Belt / Grado</div>
          <div>• Fecha Nacimiento</div>
          <div>• Contacto Emergencia</div>
          <div>• Sede / Location</div>
          <div>• Turno / Horario</div>
          <div>• Instructor / Maestro</div>
          <div>• Cuota Mensual</div>
          <div>• Estado / Status</div>
        </div>
      </div>
    </div>
  )
}

export default CSVImporter