# Sistema de Gestión de Alumnos - Taekwondo

Un sistema completo de gestión de estudiantes para instructores de taekwondo, desarrollado con React, TypeScript, Redux y Tailwind CSS.

## 🚀 Características

- **Dashboard Interactivo**: Visualización de estadísticas principales
- **Gestión de Estudiantes**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Filtros Avanzados**: Búsqueda por nombre, email, cinta y estado
- **Distribución por Cintas**: Estadísticas detalladas por grados
- **Responsive Design**: Optimizado para dispositivos móviles y escritorio
- **Estado Global**: Gestión centralizada con Redux Toolkit

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Estado**: Redux Toolkit
- **Estilos**: Tailwind CSS
- **Iconos**: FontAwesome
- **Build Tool**: Vite
- **Bundler**: PostCSS + Autoprefixer

## 📋 Prerequisitos

- Node.js 20.19.0 o superior (Recomendado: LTS más reciente)
- npm o yarn

## 🔧 Instalación

1. **Clona o descarga el proyecto**
   ```bash
   cd gestor
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Actualiza Node.js (si es necesario)**
   - Descarga desde: https://nodejs.org/
   - Instala la versión LTS más reciente
   - Verifica con: `node -v`

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   - Visita: http://localhost:5173

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Previsualiza build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── StudentCard.tsx # Tarjeta de estudiante
│   └── StudentForm.tsx # Formulario de estudiante
├── store/              # Estado Redux
│   ├── slices/         # Redux slices
│   ├── hooks.ts        # Hooks tipados
│   └── store.ts        # Configuración store
├── App.tsx             # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 👥 Funcionalidades del Sistema

### Dashboard
- Estadísticas generales (total, activos, inactivos, suspendidos)
- Ingresos mensuales calculados
- Distribución por grados de cinta
- Lista de estudiantes recientes

### Gestión de Estudiantes
- **Agregar**: Formulario completo con validaciones
- **Editar**: Modificación de datos existentes  
- **Eliminar**: Confirmación antes de eliminar
- **Filtrar**: Por nombre, email, cinta y estado
- **Buscar**: Búsqueda en tiempo real

### Campos de Estudiante
- Información personal (nombre, email, teléfono, fecha nacimiento)
- Contacto de emergencia
- Grado de cinta (desde Blanco hasta Negro 3º Dan)
- Estado (Activo, Inactivo, Suspendido)
- Fecha de ingreso y cuota mensual

## 🎨 Interfaz de Usuario

- **Diseño Moderno**: Interface limpia y profesional
- **Responsive**: Adaptada a móviles, tablets y escritorio
- **Iconografía**: Iconos intuitivos con FontAwesome
- **Colores Temáticos**: Esquema de colores para cintas y estados
- **Navegación Intuitiva**: Tabs para Dashboard y Estudiantes

## ⚠️ Solución de Problemas

### Error de Node.js
Si ves el error "Vite requires Node.js version 20.19+":
1. Descarga Node.js LTS desde: https://nodejs.org/
2. Instala la versión más reciente
3. Cierra y reabre VS Code completamente
4. Ejecuta `node -v` para verificar la versión
5. Ejecuta `npm install` nuevamente

### Error de crypto.hash
Este error está relacionado con la versión de Node.js. Sigue los pasos anteriores para actualizar.

### Problemas de Tailwind
Si los estilos no se cargan:
1. Verifica que existe `tailwind.config.js`
2. Confirma que `postcss.config.js` tiene la configuración correcta
3. Revisa que `src/index.css` contiene las directivas de Tailwind

## 🚀 Despliegue

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/` y pueden ser desplegados en cualquier servidor web estático.

## 🔮 Próximas Características

- [ ] Persistencia de datos (LocalStorage/Backend)
- [ ] Autenticación y autorización
- [ ] Reportes en PDF
- [ ] Sistema de pagos
- [ ] Calendario de clases
- [ ] Notificaciones automáticas
- [ ] Backup y restauración de datos

## 📝 Notas de Desarrollo

Este sistema fue creado como una solución completa para la gestión de estudiantes en escuelas de taekwondo. El código está estructurado de manera modular y escalable, permitiendo fáciles extensiones y modificaciones.

---

**Desarrollado para instructores de taekwondo** 🥋
```
