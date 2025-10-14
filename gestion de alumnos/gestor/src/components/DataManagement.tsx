import React, { useState, useRef } from 'react'
import { usePersistence } from '../hooks/usePersistence'
import CSVImporter from './CSVImporter'

const DataManagement: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
    exportData,
    importData,
    exportCSV,
    getStorageStatus,
    createBackup
  } = usePersistence()

  const storageStatus = getStorageStatus()

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleExportJSON = () => {
    try {
      setIsExporting(true)
      const data = exportData()
      
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `taekwondo-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showMessage('success', 'Datos exportados exitosamente')
    } catch (error) {
      console.error('Error exporting data:', error)
      showMessage('error', 'Error al exportar los datos')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCSV = (type: 'students' | 'classes' | 'payments') => {
    try {
      const csvData = exportCSV(type)
      if (!csvData) {
        showMessage('info', `No hay datos de ${type} para exportar`)
        return
      }
      
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showMessage('success', `${type} exportados a CSV`)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      showMessage('error', 'Error al exportar CSV')
    }
  }

  const handleImportJSON = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        setIsImporting(true)
        const content = e.target?.result as string
        const success = importData(content)
        
        if (success) {
          showMessage('success', 'Datos importados exitosamente. Recarga la página para ver los cambios.')
        } else {
          showMessage('error', 'Error al importar los datos. Verifica el formato del archivo.')
        }
      } catch (error) {
        console.error('Error importing data:', error)
        showMessage('error', 'Error al procesar el archivo')
      } finally {
        setIsImporting(false)
      }
    }
    reader.readAsText(file)
  }

  const handleCreateBackup = () => {
    try {
      const backup = createBackup()
      showMessage('success', `Backup creado: ${backup.metadata.totalRecords} registros`)
    } catch (error) {
      console.error('Error creating backup:', error)
      showMessage('error', 'Error al crear backup')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        <i className="fas fa-database mr-2"></i>
        Gestión de Datos
      </h2>

      {/* Mensaje de estado */}
      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' :
          message.type === 'error' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Estado del almacenamiento */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Estado del Almacenamiento</h3>
        <div className="flex items-center mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                storageStatus.percentage > 90 ? 'bg-red-500' :
                storageStatus.percentage > 70 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(storageStatus.percentage, 100)}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {storageStatus.percentage.toFixed(1)}%
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Usado: {(storageStatus.used / 1024).toFixed(2)} KB
        </p>
      </div>

      {/* Exportar datos */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Exportar Datos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={handleExportJSON}
            disabled={isExporting}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
          >
            <i className="fas fa-download mr-2"></i>
            {isExporting ? 'Exportando...' : 'JSON Completo'}
          </button>
          
          <button
            onClick={() => handleExportCSV('students')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <i className="fas fa-file-csv mr-2"></i>
            CSV Estudiantes
          </button>
          
          <button
            onClick={() => handleExportCSV('classes')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <i className="fas fa-file-csv mr-2"></i>
            CSV Clases
          </button>
          
          <button
            onClick={() => handleExportCSV('payments')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <i className="fas fa-file-csv mr-2"></i>
            CSV Pagos
          </button>
        </div>
      </div>

      {/* Importar datos */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Importar Datos</h3>
        <button
          onClick={handleImportJSON}
          disabled={isImporting}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white px-4 py-2 rounded-md transition-colors"
        >
          <i className="fas fa-upload mr-2"></i>
          {isImporting ? 'Importando...' : 'Importar JSON'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          style={{ display: 'none' }}
        />
      </div>

      {/* Backup */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Backup Local</h3>
        <button
          onClick={handleCreateBackup}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <i className="fas fa-save mr-2"></i>
          Crear Backup
        </button>
      </div>

      {/* Importador de CSV desde Google Sheets */}
      <div className="mb-6">
        <CSVImporter />
      </div>

      {/* Integración con Google Sheets */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">
          <i className="fab fa-google mr-2"></i>
          Próximas Funciones
        </h3>
        <div className="space-y-2 text-sm text-blue-600">
          <p><strong>✅ Importador CSV:</strong> Migra tus datos desde Google Sheets</p>
          <p><strong>🔄 Sincronización automática:</strong> Conecta directamente con Google Sheets</p>
          <p><strong>☁️ Backup en la nube:</strong> Supabase, Firebase o similar</p>
          <p><strong>📱 App móvil:</strong> Control de asistencia desde el celular</p>
        </div>
      </div>
    </div>
  )
}

export default DataManagement