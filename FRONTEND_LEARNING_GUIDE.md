# 📚 Guía Completa de Aprendizaje del Frontend - Lavadero

**Autor**: Claude (Tutor)  
**Fecha**: Abril 2026  
**Nivel**: Junior → Intermedio  
**Objetivo**: Comprender completamente la arquitectura, patrones y decisiones del frontend

---

## 📑 Tabla de Contenidos

1. [Introducción y Visión General](#introducción-y-visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Conceptos Fundamentales de React](#conceptos-fundamentales-de-react)
5. [Arquitectura del Frontend](#arquitectura-del-frontend)
6. [Sistema de Tipos con TypeScript](#sistema-de-tipos-con-typescript)
7. [Servicios y Comunicación con la API](#servicios-y-comunicación-con-la-api)
8. [Hooks Personalizados](#hooks-personalizados)
9. [Context API - Manejo del Estado Global](#context-api---manejo-del-estado-global)
10. [Componentes Reutilizables](#componentes-reutilizables)
11. [Páginas Principales](#páginas-principales)
12. [Patrones y Mejores Prácticas](#patrones-y-mejores-prácticas)
13. [Flujos de Datos](#flujos-de-datos)
14. [Cómo Navegar y Contribuir](#cómo-navegar-y-contribuir)
15. [Troubleshooting y Debugging](#troubleshooting-y-debugging)

---

## Introducción y Visión General

### ¿Qué es este Frontend?

Este es el frontend de **Lavadero**, un sistema completo de gestión para un lavadero de autos. Permite a los managers:

- 📊 Ver un dashboard en tiempo real con estadísticas del día
- 🚗 Registrar entrada y salida de vehículos
- 👥 Gestionar empleados y asignaciones
- 📅 Crear y gestionar turnos
- 💧 Configurar tipos de lavado
- 📈 Ver reportes detallados de operaciones y finanzas

### Tecnología Principal

El frontend está construido con:
- **React 19** (librería moderna para interfaces)
- **TypeScript** (lenguaje que añade tipado a JavaScript)
- **Vite** (herramienta rápida para desarrollo)
- **Tailwind CSS** (estilos con utilidades)
- **SWR** (manejo de datos con caché automática)
- **React Router** (navegación entre páginas)
- **Lucide React** (iconos)

### El "Por Qué" de Cada Tecnología

| Tecnología | ¿Por qué? |
|------------|-----------|
| React | Componentes reutilizables, actualización eficiente de UI |
| TypeScript | Errores detectados en desarrollo, no en producción |
| Vite | Desarrollo ultrarrápido (~100ms) vs Webpack (~1s) |
| Tailwind | Estilos rápidos sin escribir CSS personalizado |
| SWR | Caché automática de datos, no hace requests duplicados |
| React Router | Navegación sin recargar página (SPA) |

---

## Stack Tecnológico

### Dependencias Principales (package.json)

```json
{
  "dependencies": {
    "react": "^19.2.5",                    // Librería principal
    "react-dom": "^19.2.5",                // Renderizar en el navegador
    "react-router-dom": "^7.14.2",         // Navegación entre páginas
    "axios": "^1.15.2",                    // Cliente HTTP (llamadas a API)
    "swr": "^2.4.1",                       // Caché inteligente de datos
    "tailwindcss": "^4.2.4",               // Estilos (framework CSS)
    "date-fns": "^4.1.0",                  // Manipulación de fechas
    "lucide-react": "^1.11.0",             // Iconos hermosos
    "clsx": "^2.1.1",                      // Combinar clases CSS
    "recharts": "^3.8.1"                   // Gráficos
  }
}
```

### Scripts Principales

```bash
npm run dev        # Inicia servidor de desarrollo (localhost:5173)
npm run build      # Compila para producción
npm run lint       # Verifica errores con ESLint
npm run test       # Ejecuta pruebas
```

---

## Estructura del Proyecto

### Árbol de Carpetas (Foco en src/)

```
frontend/
├── src/
│   ├── main.tsx                          # Punto de entrada (monta la app)
│   ├── index.css                         # Estilos globales
│   ├── App.tsx                           # Componente raíz con rutas
│   │
│   ├── types/                            # Definiciones de TypeScript
│   │   └── index.ts                      # Todos los tipos y interfaces
│   │
│   ├── context/                          # Estado global (Context API)
│   │   └── AuthContext.tsx               # Autenticación del usuario
│   │
│   ├── services/                         # Comunicación con API
│   │   ├── api.ts                        # Cliente HTTP (Axios configurado)
│   │   ├── authService.ts                # Métodos de login/logout
│   │   ├── employeeService.ts            # CRUD de empleados
│   │   ├── vehicleService.ts             # CRUD de vehículos
│   │   ├── shiftService.ts               # CRUD de turnos
│   │   ├── washTypeService.ts            # CRUD de tipos de lavado
│   │   ├── dashboardService.ts           # Datos del dashboard
│   │   └── reportsService.ts             # Datos de reportes
│   │
│   ├── hooks/                            # Hooks personalizados (reutilizables)
│   │   ├── useEmployees.ts               # Datos y operaciones de empleados
│   │   ├── useVehicles.ts                # Datos y operaciones de vehículos
│   │   ├── useShifts.ts                  # Datos y operaciones de turnos
│   │   ├── useWashTypes.ts               # Datos de tipos de lavado
│   │   ├── useDashboard.ts               # Datos del dashboard
│   │   └── useReports.ts                 # Datos de reportes
│   │
│   ├── pages/                            # Páginas (una por ruta principal)
│   │   ├── Layout.tsx                    # Layout base (sidebar + contenido)
│   │   ├── LoginPage.tsx                 # Página de login
│   │   ├── Dashboard.tsx                 # Panel principal
│   │   ├── VehiclesPage.tsx              # Gestión de vehículos
│   │   ├── EmployeesPage.tsx             # Gestión de empleados
│   │   ├── ShiftsPage.tsx                # Gestión de turnos
│   │   ├── WashTypesPage.tsx             # Gestión de tipos de lavado
│   │   └── ReportsPage.tsx               # Reportes y estadísticas
│   │
│   ├── components/                       # Componentes reutilizables
│   │   ├── common/                       # Componentes básicos (botón, input, etc)
│   │   │   ├── Button.tsx                # Botón con variantes
│   │   │   ├── FormInput.tsx             # Input, Select, Textarea
│   │   │   ├── Modal.tsx                 # Modal genérico
│   │   │   ├── ConfirmDialog.tsx         # Diálogo de confirmación
│   │   │   ├── Badge.tsx                 # Etiqueta pequeña
│   │   │   ├── Sidebar.tsx               # Barra lateral navegación
│   │   │   ├── ProtectedRoute.tsx        # Protección de rutas
│   │   │   └── SkeletonCard.tsx          # Esqueleto de carga
│   │   │
│   │   ├── Dashboard/                    # Componentes del dashboard
│   │   │   ├── StatCard.tsx              # Tarjeta de estadística
│   │   │   └── VehicleProgressCard.tsx   # Tarjeta de vehículo en progreso
│   │   │
│   │   ├── Vehicles/                     # Componentes de vehículos
│   │   │   ├── VehicleEntryDrawer.tsx    # Formulario entrada de vehículo
│   │   │   └── VehicleEditModal.tsx      # Modal editar vehículo
│   │   │
│   │   ├── Employees/                    # Componentes de empleados
│   │   │   └── EmployeeModal.tsx         # Modal crear/editar empleado
│   │   │
│   │   └── Reports/                      # Componentes de reportes
│   │       ├── ReportFilters.tsx         # Filtros de fecha
│   │       ├── RevenueBarChart.tsx       # Gráfico de ingresos
│   │       ├── EmployeeStatsTable.tsx    # Tabla de estadísticas
│   │       ├── VehicleSearchPanel.tsx    # Búsqueda de vehículos
│   │       └── StatCard.tsx              # Tarjeta de estadística
│   │
│   └── utils/                            # Funciones utilitarias
│       ├── formatters.ts                 # Formateo de datos (moneda, fechas)
│       └── dateUtils.ts                  # Utilidades de fechas
│
├── package.json                          # Dependencias
├── vite.config.ts                        # Configuración de Vite
├── tailwind.config.ts                    # Configuración de Tailwind
├── tsconfig.json                         # Configuración de TypeScript
└── index.html                            # HTML principal

```

### Por qué esta estructura?

✅ **Escalabilidad**: Fácil agregar nuevas páginas y componentes  
✅ **Mantenibilidad**: Cada archivo tiene una responsabilidad clara  
✅ **Reutilización**: Componentes y hooks compartidos en la carpeta adecuada  
✅ **Testabilidad**: Fácil de probar cada parte independientemente  

---

## Conceptos Fundamentales de React

### 1. Componentes - Los Bloques de Construcción

**¿Qué es un componente?** Una función que devuelve JSX (HTML en JavaScript)

```typescript
// COMPONENTE SIMPLE
export function HelloWorld() {
  return <h1>¡Hola Mundo!</h1>
}

// COMPONENTE CON PROPS (parámetros)
interface GreetingProps {
  name: string
  age: number
}

export function Greeting({ name, age }: GreetingProps) {
  return <p>Hola {name}, tienes {age} años</p>
}

// COMPONENTE CON ESTADO
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  )
}
```

**Aclaración importante**: En este proyecto TODO son componentes funcionales (functions), NO clases.

### 2. JSX - HTML en JavaScript

JSX permite escribir código que se parece a HTML dentro de JavaScript:

```typescript
// Así se ve en el código:
<div className="card">
  <h1>Título</h1>
  <p>Descripción</p>
</div>

// Se transforma a JavaScript:
React.createElement('div', { className: 'card' },
  React.createElement('h1', null, 'Título'),
  React.createElement('p', null, 'Descripción')
)
```

**Reglas importantes de JSX**:
- `className` en lugar de `class` (class es palabra reservada)
- `onClick`, `onChange` para eventos (camelCase)
- Las variables van en `{llaves}`
- Necesitas un elemento raíz (no puedes devolver 2 elementos al mismo nivel)

```typescript
// ❌ INCORRECTO - 2 elementos raíz
export function Bad() {
  return (
    <div>Div 1</div>
    <div>Div 2</div>
  )
}

// ✅ CORRECTO - 1 elemento raíz
export function Good() {
  return (
    <div>
      <div>Div 1</div>
      <div>Div 2</div>
    </div>
  )
}

// ✅ O usar Fragment (no renderiza un div extra)
export function AlsoGood() {
  return (
    <>
      <div>Div 1</div>
      <div>Div 2</div>
    </>
  )
}
```

### 3. Props - Pasar Datos entre Componentes

Props es cómo los datos fluyen HACIA ABAJO en React:

```typescript
// Componente padre
export function Parent() {
  const user = { name: 'Juan', role: 'admin' }
  
  return <Child user={user} isActive={true} />
}

// Componente hijo
interface ChildProps {
  user: { name: string; role: string }
  isActive: boolean
}

export function Child({ user, isActive }: ChildProps) {
  return (
    <div>
      <p>Nombre: {user.name}</p>
      <p>Rol: {user.role}</p>
      <p>¿Activo?: {isActive ? 'Sí' : 'No'}</p>
    </div>
  )
}
```

**Importante**: Props son READONLY (no puedes modificarlas). Si necesitas cambiar datos, usa `useState` (ver abajo).

### 4. State (useState) - Datos que Cambian

`useState` es un hook que permite componentes tener estado (datos que cambian):

```typescript
import { useState } from 'react'

export function FormExample() {
  // const [variable, funcionParaActualizar] = useState(valorInicial)
  const [name, setName] = useState('') // Inicia vacío
  const [age, setAge] = useState(0)    // Inicia en 0
  
  const handleSubmit = () => {
    console.log(`Datos: ${name}, ${age}`)
    // Aquí enviarías a la API
  }
  
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <button onClick={handleSubmit}>
        Enviar
      </button>
    </div>
  )
}
```

**Conceptos clave**:
- `name` es el estado actual
- `setName(nuevoValor)` es la función para actualizarlo
- Cada vez que actualizas el state, React "re-renderiza" el componente (dibuja de nuevo)
- Las líneas con `useState` deben estar al INICIO de la función (no dentro de if/for)

### 5. Efectos Secundarios - useEffect

`useEffect` permite ejecutar código cuando el componente "monta" (aparece) o cuando cambian datos:

```typescript
import { useState, useEffect } from 'react'

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Ejecutar cuando el componente monta O cuando userId cambia
  useEffect(() => {
    setLoading(true)
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
  }, [userId]) // Array de "dependencias"
  
  if (loading) return <p>Cargando...</p>
  if (!user) return <p>Usuario no encontrado</p>
  
  return <div>Nombre: {user.name}</div>
}
```

**El array de dependencias es CRÍTICO**:

| Dependencias | ¿Cuándo ejecutar? | Caso de uso |
|--------------|-------------------|------------|
| `[]` | Una sola vez (cuando monta) | Cargar datos iniciales |
| `[userId]` | Cuando userId cambia | Recargar datos si el usuario cambia |
| Sin array | Cada render | ❌ EVITAR - causa loops infinitos |

### 6. Renderizado Condicional

```typescript
export function ConditionalRender({ isAdmin, count }: Props) {
  // Opción 1: if/else
  if (!isAdmin) {
    return <p>No tienes permiso</p>
  }
  
  // Opción 2: Operador ternario
  return (
    <div>
      {isAdmin ? <AdminPanel /> : <UserPanel />}
    </div>
  )
}

// Opción 3: && (si es true, renderiza)
export function LogicalAnd({ isOpen }: { isOpen: boolean }) {
  return (
    <div>
      {isOpen && <p>Menú abierto</p>}
    </div>
  )
}
```

### 7. Listas - map()

Para renderizar listas usamos `.map()`:

```typescript
interface Employee {
  id: string
  name: string
  role: string
}

export function EmployeeList({ employees }: { employees: Employee[] }) {
  return (
    <ul>
      {employees.map(employee => (
        <li key={employee.id}>
          <strong>{employee.name}</strong> - {employee.role}
        </li>
      ))}
    </ul>
  )
}
```

**Importante**: SIEMPRE usa `key={id}` (identificador único) en listas. React lo usa para saber qué cambió.

---

## Arquitectura del Frontend

### Capas de la Arquitectura

El frontend está dividido en capas, de abajo hacia arriba:

```
┌─────────────────────────────────────┐
│    PÁGINAS (Pages)                  │  ← Lo que ves
├─────────────────────────────────────┤
│    COMPONENTES (Components)         │  ← Bloques de UI
├─────────────────────────────────────┤
│    HOOKS (Hooks Personalizados)     │  ← Lógica reutilizable
├─────────────────────────────────────┤
│    SERVICIOS (API Services)         │  ← Comunicación con backend
├─────────────────────────────────────┤
│    CONTEXT (Estado Global)          │  ← Autenticación
├─────────────────────────────────────┤
│    TIPOS (TypeScript)               │  ← Contrato de datos
└─────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario hace clic → Componente → Hook → Servicio → API (Backend) → Respuesta → Estado actualizado → UI se redibuja
```

**Ejemplo real**: Usuario hace clic en "Registrar entrada de vehículo"

1. **Componente** (`VehicleEntryDrawer`) escucha el click
2. **Hook** (`useVehiclesInProgress`) tiene función `enterVehicle()`
3. **Servicio** (`vehicleService.create()`) arma la request HTTP
4. **Axios** (en `api.ts`) envía el request al backend
5. **Backend** crea el vehículo y responde
6. **Hook** actualiza el estado con `mutate()` (recargar lista)
7. **Componente** se redibuja mostrando el nuevo vehículo

### Patrones Principales

#### Patrón 1: Service + Hook + Component

**Archivo 1: Service** (`services/employeeService.ts`)
```typescript
import api from './api'

export const employeeService = {
  getAll: () => api.get<Employee[]>('/employees').then(r => r.data),
  create: (data: EmployeeCreate) => 
    api.post<Employee>('/employees', data).then(r => r.data),
}
```

**Archivo 2: Hook** (`hooks/useEmployees.ts`)
```typescript
import useSWR from 'swr'
import { employeeService } from '../services/employeeService'

export function useEmployees() {
  const { data, mutate } = useSWR('employees', employeeService.getAll)
  
  const createEmployee = async (data) => {
    await employeeService.create(data)
    mutate() // Recargar lista
  }
  
  return { employees: data ?? [], createEmployee }
}
```

**Archivo 3: Component** (`pages/EmployeesPage.tsx`)
```typescript
export function EmployeesPage() {
  const { employees, createEmployee } = useEmployees()
  
  const handleSubmit = async (data) => {
    await createEmployee(data)
    // UI se actualiza automáticamente
  }
  
  return <div>{employees.map(e => <div>{e.name}</div>)}</div>
}
```

#### Patrón 2: Context para Estado Global

```typescript
// 1. Crear contexto
const AuthContext = createContext<AuthContextValue | null>(null)

// 2. Proveedor
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Hook para usar
export function useAuth() {
  return useContext(AuthContext)
}

// En App.tsx
<AuthProvider>
  <Routes>...</Routes>
</AuthProvider>

// En cualquier componente
function MyComponent() {
  const { user } = useAuth()
  return <p>{user?.name}</p>
}
```

---

## Sistema de Tipos con TypeScript

### ¿Por qué TypeScript?

TypeScript detecta errores **antes de que lleguen a producción**:

```typescript
// ❌ Sin TypeScript (error solo en runtime)
function greet(name) {
  console.log(name.toUpperCase()) // ¿name es string?
}
greet(123) // 💥 Error: "123.toUpperCase is not a function"

// ✅ Con TypeScript (error en desarrollo)
function greet(name: string) {
  console.log(name.toUpperCase()) // ✓ Seguro
}
greet(123) // ❌ Error: "Argument of type 'number' is not assignable to parameter of type 'string'"
```

### Tipos Básicos

```typescript
// Tipos primitivos
const name: string = 'Juan'
const age: number = 30
const active: boolean = true
const empty: null = null
const undefined_val: undefined = undefined

// Arrays
const numbers: number[] = [1, 2, 3]
const names: Array<string> = ['Juan', 'Ana']
const mixed: (string | number)[] = ['texto', 123]

// Uniones (valor puede ser uno de varios tipos)
const status: 'active' | 'inactive' = 'active'
const count: string | number = 'cinco'

// Any (evitar cuando sea posible - pierde ventaja de TypeScript)
const anything: any = 'puede ser cualquier cosa'

// Unknown (más seguro que any)
const unknown_val: unknown = 'algo'
// Necesitas validar antes de usar:
if (typeof unknown_val === 'string') {
  console.log(unknown_val.toUpperCase())
}
```

### Interfaces - Describir Objetos

```typescript
// Interface define la "forma" de un objeto
interface Employee {
  id: string
  name: string
  email?: string      // ? = opcional
  role: 'employee' | 'manager' | 'admin'
  status: 'active' | 'inactive'
  created_at: string
}

// Usar la interface
const emp: Employee = {
  id: '123',
  name: 'Juan',
  role: 'manager',
  status: 'active',
  created_at: '2024-01-01'
  // email es opcional, no es necesario
}

// Para crear/actualizar (no necesita todos los campos)
interface EmployeeCreate {
  name: string
  email?: string
  role: 'employee' | 'manager' | 'admin'
}

const newEmp: EmployeeCreate = {
  name: 'Ana',
  role: 'employee'
}
```

### Type Aliases vs Interfaces

```typescript
// Type Alias (más flexible)
type Status = 'active' | 'inactive'
type Response<T> = { data: T; error: null } | { data: null; error: string }

// Interface (mejor para objetos grandes)
interface User {
  id: string
  name: string
}

// Extender
interface Manager extends User {
  team: User[]
}
```

### Genéricos - Reutilizar Tipos

Los genéricos permiten escribir código reutilizable con tipos seguros:

```typescript
// ❌ Sin genéricos - repetir código
function getEmployees(): Employee[] {
  return api.get('/employees').then(r => r.data)
}

function getVehicles(): Vehicle[] {
  return api.get('/vehicles').then(r => r.data)
}

// ✅ Con genéricos - una sola función
function getMany<T>(endpoint: string): T[] {
  return api.get<T[]>(endpoint).then(r => r.data)
}

// Usar
const employees = await getMany<Employee>('/employees')
const vehicles = await getMany<Vehicle>('/vehicles')
```

### Tipos en el Proyecto (`types/index.ts`)

Todos los tipos están centralizados:

```typescript
// Tipos de datos del backend
export interface Employee {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: EmployeeRole
  status: EmployeeStatus
  created_at: string
  updated_at: string
}

// Tipos para crear (sin id ni timestamps)
export interface EmployeeCreate {
  name: string
  email?: string | null
  phone?: string | null
  role: EmployeeRole
}

// Tipos para actualizar (todo opcional)
export interface EmployeeUpdate {
  name?: string
  email?: string | null
  phone?: string | null
  role?: EmployeeRole
  status?: EmployeeStatus
}

// Type literal (valores específicos)
export type EmployeeRole = 'employee' | 'manager' | 'admin' | 'superadmin'
export type EmployeeStatus = 'active' | 'inactive'
```

---

## Servicios y Comunicación con la API

### Capa de Servicios - ¿Para qué sirve?

La capa de servicios **encapsula toda comunicación con la API**. Beneficios:

✅ Si la URL de API cambia, cambias en UN lugar  
✅ Reutilizable desde múltiples componentes  
✅ Lógica de transformación de datos  
✅ Manejo de errores centralizado  

### axios - Cliente HTTP

El proyecto usa **axios** en lugar de `fetch` porque:

- ✅ API más simple
- ✅ Interceptores (ejecutar código en TODAS las requests)
- ✅ Timeout automático
- ✅ Cancelación de requests

### Cliente API Configurado (`services/api.ts`)

```typescript
import axios from 'axios'
import { TOKEN_KEY } from '../context/AuthContext'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// INTERCEPTOR DE REQUEST
// Se ejecuta ANTES de enviar cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    // Agregar token al header Authorization
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// INTERCEPTOR DE RESPONSE
// Se ejecuta DESPUÉS de recibir cada respuesta
api.interceptors.response.use(
  (res) => res, // Respuesta exitosa, pasar adelante
  (err) => {
    // Respuesta con error
    if (err.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login' // Enviar a login
    }
    const message = err.response?.data?.detail || 'Error inesperado'
    return Promise.reject(new Error(message))
  }
)

export default api
```

**¿Cómo funciona?**

1. Usuario hace login → token se guarda en localStorage
2. Componente quiere hacer request → servicio llama `api.get(...)`
3. **Interceptor REQUEST** agrega el token al header
4. Request se envía al backend CON el token
5. Backend responde
6. **Interceptor RESPONSE** chequea si es error 401 → redirige a login

### Servicios en la Práctica

#### Ejemplo 1: employeeService.ts

```typescript
import api from './api'
import type { Employee, EmployeeCreate, EmployeeUpdate } from '../types'

export const employeeService = {
  // GET /employees
  getAll: () => 
    api.get<Employee[]>('/employees').then(r => r.data),
  
  // GET /employees/available (solo con turno hoy)
  getAvailable: () => 
    api.get<Employee[]>('/employees/available').then(r => r.data),
  
  // GET /employees/{id}
  getById: (id: string) => 
    api.get<Employee>(`/employees/${id}`).then(r => r.data),
  
  // POST /employees
  create: (data: EmployeeCreate) => 
    api.post<Employee>('/employees', data).then(r => r.data),
  
  // PUT /employees/{id}
  update: (id: string, data: EmployeeUpdate) => 
    api.put<Employee>(`/employees/${id}`, data).then(r => r.data),
  
  // DELETE /employees/{id}
  deactivate: (id: string) => 
    api.delete<Employee>(`/employees/${id}`).then(r => r.data),
}
```

**Explicación**:
- Cada método es `async` (devuelve promesa)
- `.then(r => r.data)` extrae solo los datos (axios envuelve en `{ data, status, ... }`)
- El tipo `<Employee>` le dice a TypeScript qué tipo de dato espera recibir
- Los errores son capturados por el interceptor

#### Ejemplo 2: vehicleService.ts

```typescript
export const vehicleService = {
  getAll: () => api.get<Vehicle[]>('/vehicles').then(r => r.data),
  
  getInProgress: () => 
    api.get<Vehicle[]>('/vehicles/in-progress').then(r => r.data),
  
  create: (data: VehicleCreate) => 
    api.post<Vehicle>('/vehicles', data).then(r => r.data),
  
  update: (id: string, data: { assigned_employee_id?: string }) =>
    api.put<Vehicle>(`/vehicles/${id}`, data).then(r => r.data),
  
  registerExit: (id: string) =>
    // Nota: response contiene vehicle Y transaction_id
    api.put<{ vehicle: Vehicle; transaction_id: string }>(`/vehicles/${id}/exit`)
      .then(r => r.data.vehicle), // Extraer solo el vehículo
}
```

### Manejo de Errores en Servicios

```typescript
// En el hook
const createEmployee = async (data: EmployeeCreate) => {
  try {
    const created = await employeeService.create(data)
    mutate() // Recargar lista
    return created
  } catch (err) {
    // El error fue interceptado por axios
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('Error creando empleado:', message)
    throw err // Pasar al componente si quiere manejar
  }
}

// En el componente
const handleSubmit = async (data) => {
  try {
    await createEmployee(data)
    // Mostrar éxito
  } catch (err) {
    // Mostrar error
    setError(err instanceof Error ? err.message : 'Error')
  }
}
```

---

## Hooks Personalizados

### ¿Qué es un Hook Personalizado?

Un hook es una **función reutilizable que encapsula lógica de React**. Los hooks personalizados:

- ✅ Combinan `useState`, `useEffect`, `useContext`, etc.
- ✅ Se pueden usar en múltiples componentes
- ✅ Mantienen los componentes limpios y legibles
- ✅ Son testeable independientemente

### Reglas de Hooks

❌ **NUNCA**:
- Llamar hooks dentro de if/for/while
- Llamar hooks fuera de funciones
- Cambiar el número de hooks

✅ **SIEMPRE**:
- Llamar hooks al INICIO de la función
- Usar en componentes o hooks personalizados

### SWR - Fetching Inteligente

**SWR** = Stale While Revalidate

Es una librería que maneja datos de forma inteligente:

```typescript
import useSWR from 'swr'

function MyComponent() {
  // const { data, error, isLoading, mutate } = useSWR(key, fetcher, options)
  const { data, error, isLoading, mutate } = useSWR(
    'employees',                           // Key única (para caché)
    () => employeeService.getAll(),        // Función que fetcha
    { refreshInterval: 60_000 }            // Opciones
  )
  
  // data = los empleados
  // error = si algo falló
  // isLoading = mientras carga
  // mutate = función para recargar datos
}
```

**Características inteligentes de SWR**:

1. **Deduplicación**: Si 2 componentes piden lo mismo, hace 1 request
2. **Caché**: Guarda datos en memoria, muy rápido en siguientes accesos
3. **Revalidación**: Puede refrescar datos automáticamente
4. **Optimistic Updates**: Actualizar UI antes de que la API responda

### Ejemplos de Hooks del Proyecto

#### Hook 1: useEmployees

```typescript
export function useEmployees() {
  // 1. Datos básicos
  const { data, error, isLoading, mutate } = useSWR(
    'employees',                      // Key para caché
    employeeService.getAll            // Función que fetcha
  )
  
  // 2. Crear empleado
  const createEmployee = async (data: EmployeeCreate) => {
    const created = await employeeService.create(data)
    mutate()  // Recargar lista (SWR hará request GET /employees)
    return created
  }
  
  // 3. Actualizar empleado
  const updateEmployee = async (id: string, data: EmployeeUpdate) => {
    const updated = await employeeService.update(id, data)
    mutate()  // Recargar lista
    return updated
  }
  
  // 4. Desactivar empleado (soft delete)
  const deactivateEmployee = async (id: string) => {
    await employeeService.deactivate(id)
    mutate()  // Recargar lista
  }
  
  return {
    employees: data ?? [],              // Si no hay datos, array vacío
    isLoading,
    error,
    createEmployee,
    updateEmployee,
    deactivateEmployee,
    refresh: mutate,
  }
}

// HOOK ESPECIAL: empleados disponibles (con turno hoy)
export function useAvailableEmployees() {
  const { data, error, isLoading, mutate } = useSWR(
    'employees/available',
    employeeService.getAvailable,
    {
      refreshInterval: 60_000  // Auto-refresh cada 60 segundos
    }
  )
  return { employees: data ?? [], isLoading, error, mutate }
}

// HOOK PARA INVALIDAR (forzar recarga)
export function useInvalidateAvailableEmployees() {
  const { mutate } = useSWRConfig()  // Acceso a configuración global de SWR
  return () => mutate('employees/available')
}
```

**Cómo se usa**:
```typescript
function EmployeeList() {
  const { employees, createEmployee, isLoading } = useEmployees()
  
  return (
    <div>
      {isLoading ? <p>Cargando...</p> : (
        <ul>
          {employees.map(e => <li key={e.id}>{e.name}</li>)}
        </ul>
      )}
      <button onClick={() => createEmployee({ name: 'Nuevo' })}>
        Crear
      </button>
    </div>
  )
}
```

#### Hook 2: useVehiclesInProgress

```typescript
export function useVehiclesInProgress() {
  const { data, error, isLoading, mutate } = useSWR(
    'vehicles/in-progress',           // Solo vehículos en progreso
    vehicleService.getInProgress,
    { refreshInterval: 30_000 }       // Refresh cada 30 segundos (actualización en vivo)
  )
  
  // Registrar entrada
  const enterVehicle = async (data: VehicleCreate) => {
    const created = await vehicleService.create(data)
    mutate()  // Agregar a lista
    return created
  }
  
  // Registrar salida (genera transacción automáticamente)
  const exitVehicle = async (id: string) => {
    const updated = await vehicleService.registerExit(id)
    await mutate()  // Recargar (se elimina de la lista porque status = completed)
    return updated
  }
  
  // Actualizar vehículo (cambiar empleado asignado, etc)
  const updateVehicle = async (id: string, updates: { assigned_employee_id?: string }) => {
    const updated = await vehicleService.update(id, updates)
    await mutate()
    return updated
  }
  
  return {
    vehicles: data ?? [],
    isLoading,
    error,
    enterVehicle,
    exitVehicle,
    updateVehicle,
    refresh: mutate,
  }
}
```

#### Hook 3: useDashboardTodayStats

```typescript
export function useDashboardTodayStats() {
  const { data, error, isLoading, mutate } = useSWR(
    'dashboard/today',                // Estadísticas del dashboard
    dashboardService.getTodayStats,
    { refreshInterval: 30_000 }       // Actualizar cada 30 segundos
  )
  
  return {
    completedCount: data?.completed_count ?? 0,
    revenueToday: data?.revenue_today ?? 0,
    isLoading,
    error,
    refresh: mutate,
  }
}
```

**¿Notas qué patrón hay?**

1. **Configurar SWR** con key, fetcher y opciones
2. **Crear funciones** para operaciones (crear, actualizar, etc)
3. **Llamar mutate()** después de cambiar datos para refrescar
4. **Retornar** estado + funciones + refresh

---

## Context API - Manejo del Estado Global

### ¿Cuándo usar Context?

Context es para datos que **MUCHOS componentes necesitan** (sin pasar por props):

| Usar Context | Usar useState local |
|--------------|-------------------|
| Autenticación (todos necesitan saber si están logged in) | Toggle de modal en un componente |
| Tema (dark/light) | Formulario de entrada |
| Idioma | Estado temporal |
| Usuario actual | Datos que solo usa 1-2 componentes |

### AuthContext - El Único Context del Proyecto

```typescript
import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'
import type { AuthenticatedUser, LoginCredentials } from '../types'

const TOKEN_KEY = 'lavadero_token'

// 1. TIPO: Definir qué contiene el contexto
interface AuthContextValue {
  user: AuthenticatedUser | null
  token: string | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

// 2. CREAR: Crear el contexto (null es valor por defecto)
const AuthContext = createContext<AuthContextValue | null>(null)

// 3. PROVEEDOR: Componente que proporciona datos
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [token, setToken] = useState<string | null>(() => {
    // Leer token del localStorage al iniciar
    return localStorage.getItem(TOKEN_KEY)
  })
  const [isLoading, setIsLoading] = useState(true)

  // Verificar token al montar
  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }
    
    // Llamar /auth/me para validar token
    authService.me()
      .then(setUser)
      .catch(() => {
        // Token inválido
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      })
      .finally(() => setIsLoading(false))
  }, []) // [] = ejecutar UNA sola vez
  
  // Función login
  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    localStorage.setItem(TOKEN_KEY, response.access_token)
    setToken(response.access_token)
    setUser(response.user)
  }
  
  // Función logout
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 4. HOOK PARA USAR
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

export { TOKEN_KEY }
```

### Cómo se Usa el Context

```typescript
// En App.tsx - Envolver toda la app
<AuthProvider>
  <Routes>...</Routes>
</AuthProvider>

// En cualquier componente
function LoginForm() {
  const { login } = useAuth()
  
  const handleSubmit = async (email: string, password: string) => {
    await login({ email, password })
    // User está automáticamente disponible en otros componentes
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}

// En otro componente
function UserInfo() {
  const { user, logout } = useAuth()
  
  return (
    <div>
      <p>Usuario: {user?.name}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  )
}
```

### Flow de Autenticación Completo

```
1. App abre → App.tsx monta → AuthProvider ejecuta useEffect
2. useEffect lee token del localStorage
3. Si existe, llama authService.me() para validar
4. Si válido, setUser con datos del usuario
5. Mientras, isLoading = true (muestra spinner)

6. Usuario ve formulario de login
7. Usuario escribe email/password y hace submit
8. login() llamado → authService.login(credentials)
9. Backend responde con token y user
10. localStorage.setItem(TOKEN_KEY, token)
11. setToken(token) y setUser(user)

12. App ve que user existe → redirige a /dashboard
13. Componentes pueden acceder user via useAuth()

14. Usuario hace click en "Cerrar sesión"
15. logout() llamado → localStorage.removeItem(TOKEN_KEY)
16. setToken(null) y setUser(null)
17. App ve user = null → redirige a /login
```

---

## Componentes Reutilizables

### Filosofía

Cada componente reutilizable debe ser:
- ✅ Simple y enfocado
- ✅ Bien documentado via TypeScript
- ✅ Flexible con props
- ✅ Sin lógica de negocio

### Componentes en `components/common/`

#### 1. Button.tsx

```typescript
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant        // Estilo
  size?: ButtonSize              // Tamaño
  loading?: boolean              // Mostrar spinner
  icon?: React.ReactNode         // Icono opcional
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 rounded-lg font-medium transition-all',
        variant === 'primary' && 'bg-blue-primary hover:bg-blue-hover text-white',
        variant === 'secondary' && 'bg-navy-700 hover:bg-navy-600 text-navy-100',
        variant === 'danger' && 'bg-status-red/10 hover:bg-status-red/20 text-status-red',
        variant === 'ghost' && 'hover:bg-navy-700 text-navy-300',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  )
}
```

**Uso**:
```typescript
<Button>Aceptar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="danger" size="sm">Eliminar</Button>
<Button icon={<Plus size={15} />} loading={isLoading}>Crear</Button>
```

#### 2. FormInput.tsx

```typescript
// Para inputs de texto, selects, textareas

export function FormInput({ 
  label, 
  error, 
  hint, 
  ...props 
}: FormInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-navy-300 uppercase">
        {label}
      </label>
      <input 
        className={clsx(
          'w-full bg-navy-900 border border-navy-600 rounded-lg px-3 py-2',
          'focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30',
          error && 'border-status-red'
        )}
        {...props}
      />
      {hint && <p className="text-xs text-navy-400">{hint}</p>}
      {error && <p className="text-xs text-status-red">{error}</p>}
    </div>
  )
}

export function FormSelect({ label, error, children, ...props }: FormSelectProps) {
  // Similar a FormInput pero con <select>
}

export function FormTextarea({ label, error, ...props }: FormTextareaProps) {
  // Similar a FormInput pero con <textarea>
}
```

**Uso**:
```typescript
<FormInput 
  label="Nombre"
  placeholder="Juan Pérez"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.name}
/>

<FormSelect
  label="Rol"
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option value="">— Seleccionar —</option>
  <option value="admin">Administrador</option>
  <option value="manager">Gerente</option>
</FormSelect>

<FormTextarea
  label="Notas"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>
```

#### 3. ConfirmDialog.tsx

```typescript
interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  variant?: 'warning' | 'danger'
}

// Uso
<ConfirmDialog
  open={!!exitTarget}
  onClose={() => setExitTarget(null)}
  onConfirm={handleConfirmExit}
  title="Registrar salida"
  description="¿Confirmás la salida? Se generará transacción automáticamente."
  confirmLabel="Confirmar"
  loading={isLoading}
  variant="warning"
/>
```

#### 4. Badge.tsx

Etiqueta pequeña para estados:

```typescript
<Badge variant="blue">En progreso</Badge>
<Badge variant="green" pulse>Activo</Badge>
<Badge variant="red">Inactivo</Badge>
```

---

## Páginas Principales

### Estructura de Páginas

Cada página:
1. Usa hooks para datos
2. Maneja estado local (modales, filtros, etc)
3. Renderiza componentes reutilizables
4. Es bastante "seca" (sin lógica complicada)

### Dashboard.tsx - La Página Principal

```typescript
export default function Dashboard() {
  // 1. Hooks para datos
  const { vehicles, exitVehicle, updateVehicle, refresh } = useVehiclesInProgress()
  const { employees } = useAvailableEmployees()
  const { washTypes } = useWashTypes()
  const { completedCount, revenueToday, refresh: refreshDashboard } = useDashboardTodayStats()

  // 2. Estado local (modales, confirmaciones)
  const [exitTarget, setExitTarget] = useState<string | null>(null)
  const [exitLoading, setExitLoading] = useState(false)
  const [editTarget, setEditTarget] = useState<Vehicle | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // 3. Handlers para acciones
  const handleConfirmExit = async () => {
    if (!exitTarget) return
    setExitLoading(true)
    try {
      await exitVehicle(exitTarget)
      setExitTarget(null)
      refreshDashboard()
    } catch (err) {
      setExitError(err instanceof Error ? err.message : 'Error')
    } finally {
      setExitLoading(false)
    }
  }

  // 4. Renderizar
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1>Dashboard</h1>
        <Button onClick={() => refresh()}>Actualizar</Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="En progreso" value={vehicles.length} />
        <StatCard label="Completados" value={completedCount} />
        <StatCard label="Facturado" value={formatCurrency(revenueToday)} />
        <StatCard label="Empleados" value={activeEmployees.length} />
      </div>

      {/* Live board */}
      <div>
        {isLoading ? (
          <SkeletonLoader />
        ) : vehicles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {vehicles.map(vehicle => (
              <VehicleProgressCard
                key={vehicle.id}
                vehicle={vehicle}
                onExit={() => setExitTarget(vehicle.id)}
                onEdit={() => { setEditTarget(vehicle); setEditModalOpen(true) }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <VehicleEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdateVehicle}
        vehicle={editTarget}
      />

      <ConfirmDialog
        open={!!exitTarget}
        onConfirm={handleConfirmExit}
        title="Registrar salida"
        loading={exitLoading}
      />
    </div>
  )
}
```

**Patrón observado**:
1. Obtener datos con hooks
2. Estado local para UI (modales, forms)
3. Handlers que llaman funciones del hook
4. Condicionales para loading/empty states
5. Componentes reutilizables

### VehiclesPage.tsx - Lista de Vehículos

Muy similar a Dashboard pero enfocado en tabla completa. Patrón idéntico.

### ReportsPage.tsx - Reportes

```typescript
export default function ReportsPage() {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

  // 1. Estado para filtros
  const [startDate, setStartDate] = useState(format(weekStart, 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(weekEnd, 'yyyy-MM-dd'))

  // 2. Datos (re-fetch cuando fechas cambian)
  const { data: summary } = useReportSummary(startDate, endDate)
  const { data: revenueData } = useRevenueChart(startDate, endDate)
  const { data: employeeData } = useEmployeeStats(startDate, endDate)

  // 3. Handlers para cambiar filtros
  const handleDateChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
  }

  // 4. Renderizar
  return (
    <div>
      <ReportFilters onDateChange={handleDateChange} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <StatCard label="Total ingresos" value={summary?.total_revenue} />
          <StatCard label="Vehículos" value={summary?.total_vehicles} />
        </div>
        <RevenueBarChart data={revenueData} />
      </div>
      <EmployeeStatsTable data={employeeData} />
    </div>
  )
}
```

---

## Patrones y Mejores Prácticas

### Patrón 1: Componentes Controlados

Un componente controlado es donde React "controla" el valor del input:

```typescript
// ❌ Descontrolado (no recommended)
export function BadForm() {
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleSubmit = () => {
    console.log(inputRef.current?.value) // Leer del DOM
  }
  
  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

// ✅ Controlado (usar state)
export function GoodForm() {
  const [name, setName] = useState('')
  
  const handleSubmit = () => {
    console.log(name) // Leer del state
  }
  
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
```

**Ventaja**: React siempre sabe el valor actual, puede validar/transformar en tiempo real.

### Patrón 2: Lifting State Up

Si 2 componentes necesitan compartir estado, subirlo al padre común:

```typescript
// ❌ Incorrecto - estado duplicado
function Parent() {
  return (
    <div>
      <FilterComponent />
      <ListComponent />
    </div>
  )
}

function FilterComponent() {
  const [search, setSearch] = useState('')
  // List no sabe del search
}

function ListComponent() {
  // No puede acceder a search de FilterComponent
}

// ✅ Correcto - estado en parent
function Parent() {
  const [search, setSearch] = useState('')
  
  return (
    <div>
      <FilterComponent search={search} onSearchChange={setSearch} />
      <ListComponent search={search} />
    </div>
  )
}

function FilterComponent({ search, onSearchChange }: Props) {
  return (
    <input
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  )
}

function ListComponent({ search }: Props) {
  return (
    <ul>
      {items
        .filter(i => i.name.includes(search))
        .map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  )
}
```

### Patrón 3: Render Props para Lógica Flexible

```typescript
// ❌ Difícil customizar
function DataFetcher() {
  const [data, setData] = useState(null)
  // ¿Qué si quiero renderizar diferente en otro lugar?
  return <DefaultUI data={data} />
}

// ✅ Render props
interface DataFetcherProps {
  children: (data: unknown, loading: boolean) => React.ReactNode
}

function DataFetcher({ children }: DataFetcherProps) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  return <>{children(data, loading)}</>
}

// Usar
<DataFetcher>
  {(data, loading) => (
    loading ? <Spinner /> : <CustomUI data={data} />
  )}
</DataFetcher>
```

### Patrón 4: Composición sobre Herencia

```typescript
// ❌ Herencia (evitar)
class Button extends HTMLButtonElement {
  // Difícil de mantener, se entrelaza lógica
}

// ✅ Composición (usar)
function Button({ icon, label, onClick }: Props) {
  return (
    <button onClick={onClick}>
      {icon && <Icon />}
      {label}
    </button>
  )
}

// Reutilizar en nuevos componentes
function PrimaryButton(props: Props) {
  return <Button {...props} className="bg-blue" />
}
```

### Patrón 5: SWR para Caché Inteligente

```typescript
// ❌ Refetching innecesario
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/users').then(r => r.json()).then(setUsers) // Cada render = request
  }, [])
}

// ✅ SWR (deduplicación automática)
function UserList() {
  const { data: users } = useSWR('users', () => fetch('/users').then(r => r.json()))
  // Mismo request en múltiples componentes = 1 fetch
  // Siguientes accesos = instantáneo (caché)
}

// Invalidar cuando necesites datos frescos
const { mutate } = useSWRConfig()
await createUser(data)
mutate('users') // Refetch solo cuando necesitas
```

### Patrón 6: Validación de Formularios

```typescript
interface FormErrors {
  [key: string]: string | undefined
}

function Form() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  
  const validate = () => {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = 'Requerido'
    if (!form.email.includes('@')) errs.email = 'Email inválido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    await submitForm(form)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre"
        value={form.name}
        onChange={(e) => {
          setForm(f => ({ ...f, name: e.target.value }))
          setErrors(er => ({ ...er, name: undefined })) // Limpiar error
        }}
        error={errors.name}
      />
      <FormInput
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => {
          setForm(f => ({ ...f, email: e.target.value }))
          setErrors(er => ({ ...er, email: undefined }))
        }}
        error={errors.email}
      />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

---

## Flujos de Datos

### Flujo 1: Login

```
1. Usuario ve LoginPage
2. Ingresa email/password
3. Click "Login"
   ├─ handleSubmit() en LoginPage
   ├─ await authService.login(credentials)
   │  ├─ axios.post('/auth/login', credentials)
   │  └─ Backend valida y devuelve token + user
   ├─ login() desde useAuth()
   │  ├─ localStorage.setItem(TOKEN_KEY, token)
   │  ├─ setToken(token)
   │  ├─ setUser(user)
   │  └─ AuthContext actualizado
   └─ App detecta que user existe
      └─ Redirige a /dashboard

4. En Dashboard
   ├─ useVehiclesInProgress() hook
   │  ├─ axios.get con Authorization header (token)
   │  ├─ Backend devuelve vehículos en progreso
   │  └─ SWR guarda en caché
   └─ Renderizar lista
```

### Flujo 2: Registrar Entrada de Vehículo

```
1. Usuario en Dashboard hace click "Nueva entrada"
2. VehicleEntryDrawer abre
3. Usuario llena formulario
4. Click "Registrar entrada"
   ├─ handleSubmit() en VehicleEntryDrawer
   ├─ validate() → chequea que campos obligatorios estén
   ├─ await enterVehicle(data)
   │  ├─ await vehicleService.create(data)
   │  │  └─ axios.post('/vehicles', data)
   │  │     └─ Backend crea vehículo en MongoDB
   │  └─ mutate() → refetch /vehicles/in-progress
   │     └─ SWR hace GET y actualiza caché
   └─ Componente se redibuja
      └─ Nuevo vehículo visible en lista
```

### Flujo 3: Registrar Salida y Generar Transacción

```
1. Usuario en Dashboard ve vehículo
2. Click botón "Registrar salida"
   ├─ setExitTarget(vehicleId)
   └─ ConfirmDialog abre
3. Click "Confirmar salida"
   ├─ handleConfirmExit()
   ├─ await exitVehicle(id)
   │  ├─ await vehicleService.registerExit(id)
   │  │  └─ axios.put('/vehicles/{id}/exit')
   │  │     ├─ Backend: actualiza vehicle.status = 'completed'
   │  │     ├─ Backend: crea Transaction automáticamente
   │  │     └─ Devuelve vehicle (completado)
   │  └─ mutate() → refetch /vehicles/in-progress
   │     └─ SWR hace GET pero sin vehículo (status != in_progress)
   └─ Componente desaparece de lista
4. refreshDashboard() → actualiza stats (completedCount, revenueToday)
```

### Flujo 4: Editar Vehículo (Cambiar Empleado Asignado)

```
1. Usuario en Dashboard
2. Click ícono editar en VehicleProgressCard
   ├─ setEditTarget(vehicle)
   └─ VehicleEditModal abre
3. Usuario selecciona nuevo empleado
4. Click "Guardar"
   ├─ handleUpdateVehicle(vehicleId, { assigned_employee_id: newId })
   ├─ await updateVehicle(vehicleId, data)
   │  ├─ await vehicleService.update(vehicleId, data)
   │  │  └─ axios.put('/vehicles/{id}', data)
   │  │     └─ Backend: actualiza vehicle.assigned_employee_id
   │  └─ mutate() → refetch /vehicles/in-progress
   │     └─ Vehículo actualizado en caché
   └─ Modal se cierra
      └─ Componente redibuja con nuevo empleado
```

### Flujo 5: Ver Reportes

```
1. Usuario (admin) click en "Reportes"
   └─ ReportsPage.tsx monta
2. ReportsPage.tsx
   ├─ useState para startDate, endDate (por defecto esta semana)
   ├─ useReportSummary(startDate, endDate) → hook
   │  └─ useSWR('reports/summary?start=...&end=...', dashboardService.getReportSummary)
   │     └─ axios.get('/reports/summary?start=...&end=...')
   │        └─ Backend calcula totales, promedios, etc
   ├─ useRevenueChart(startDate, endDate)
   │  └─ axios.get('/reports/revenue?start=...&end=...')
   │     └─ Backend devuelve datos por día
   └─ Renderizar tarjetas + gráficos
3. Usuario cambia fechas
   ├─ setStartDate, setEndDate
   └─ Hooks se re-ejecutan (dependencias cambiaron)
      └─ SWR detecta key cambió
      └─ Nuevo request con nuevas fechas
```

---

## Cómo Navegar y Contribuir

### Estructura Mental del Proyecto

Piensa en estas capas:

**Nivel 1: Tipos (types/index.ts)**
- Punto de verdad: qué forma tienen los datos
- Si agregas campo, lo primero es actualizar tipo

**Nivel 2: Servicios (services/)**
- Comunican con API
- Si endpoint cambia, actualizar servicio

**Nivel 3: Hooks (hooks/)**
- Usan servicios, manejan SWR
- Lógica reutilizable
- Si quieres cachear diferente, cambiar aquí

**Nivel 4: Componentes (components/)**
- Reutilizables, sin lógica compleja
- Si necesitas dato, pedir via props
- Si muchos componentes necesitan dato, subirlo al padre

**Nivel 5: Páginas (pages/)**
- Orchestrator
- Usan hooks, renderizan componentes
- Si lógica crece, extraer a hook

### Agregar Nuevo Recurso (CRUD Completo)

Supongamos quieres agregar gestión de "Supervisores":

#### Paso 1: Agregar tipos

```typescript
// frontend/src/types/index.ts
export type SupervisorRole = 'field' | 'office'
export type SupervisorStatus = 'active' | 'inactive'

export interface Supervisor {
  id: string
  name: string
  email: string
  phone: string | null
  role: SupervisorRole
  status: SupervisorStatus
  created_at: string
  updated_at: string
}

export interface SupervisorCreate {
  name: string
  email: string
  phone?: string | null
  role: SupervisorRole
}

export interface SupervisorUpdate {
  name?: string
  email?: string
  phone?: string | null
  role?: SupervisorRole
  status?: SupervisorStatus
}
```

#### Paso 2: Crear servicio

```typescript
// frontend/src/services/supervisorService.ts
import api from './api'
import type { Supervisor, SupervisorCreate, SupervisorUpdate } from '../types'

export const supervisorService = {
  getAll: () => api.get<Supervisor[]>('/supervisors').then(r => r.data),
  getById: (id: string) => api.get<Supervisor>(`/supervisors/${id}`).then(r => r.data),
  create: (data: SupervisorCreate) => api.post<Supervisor>('/supervisors', data).then(r => r.data),
  update: (id: string, data: SupervisorUpdate) => api.put<Supervisor>(`/supervisors/${id}`, data).then(r => r.data),
  deactivate: (id: string) => api.delete<Supervisor>(`/supervisors/${id}`).then(r => r.data),
}
```

#### Paso 3: Crear hook

```typescript
// frontend/src/hooks/useSupervisors.ts
import useSWR from 'swr'
import { supervisorService } from '../services/supervisorService'
import type { SupervisorCreate, SupervisorUpdate } from '../types'

export function useSupervisors() {
  const { data, error, isLoading, mutate } = useSWR('supervisors', supervisorService.getAll)

  const createSupervisor = async (data: SupervisorCreate) => {
    const created = await supervisorService.create(data)
    mutate()
    return created
  }

  const updateSupervisor = async (id: string, data: SupervisorUpdate) => {
    const updated = await supervisorService.update(id, data)
    mutate()
    return updated
  }

  const deactivateSupervisor = async (id: string) => {
    await supervisorService.deactivate(id)
    mutate()
  }

  return {
    supervisors: data ?? [],
    isLoading,
    error,
    createSupervisor,
    updateSupervisor,
    deactivateSupervisor,
    refresh: mutate,
  }
}
```

#### Paso 4: Crear componentes

```typescript
// frontend/src/components/Supervisors/SupervisorModal.tsx
// (Forma para crear/editar)

// frontend/src/components/Supervisors/SupervisorCard.tsx
// (Tarjeta para mostrar)
```

#### Paso 5: Crear página

```typescript
// frontend/src/pages/SupervisorsPage.tsx
import { useSupervisors } from '../hooks/useSupervisors'
import SupervisorModal from '../components/Supervisors/SupervisorModal'
import SupervisorCard from '../components/Supervisors/SupervisorCard'

export default function SupervisorsPage() {
  const { supervisors, createSupervisor, updateSupervisor, deactivateSupervisor } = useSupervisors()
  const [modalOpen, setModalOpen] = useState(false)
  
  // ... resto igual a pattern
}
```

#### Paso 6: Agregar ruta

```typescript
// frontend/src/App.tsx
import SupervisorsPage from './pages/SupervisorsPage'

<Route path="supervisors" element={<SupervisorsPage />} />
```

#### Paso 7: Agregar a navegación

```typescript
// frontend/src/components/common/Sidebar.tsx
const navItems = [
  // ...
  { to: '/supervisors', label: 'Supervisores', icon: ShieldCheck },
]
```

---

## Troubleshooting y Debugging

### Problema 1: ¿Por qué mi componente no se redibuja?

**Causa más común**: State no está siendo usado correctamente

```typescript
// ❌ INCORRECTO - No dispara re-render
const user = { name: 'Juan' }
function setName(newName) {
  user.name = newName // Modificar directo
}

// ✅ CORRECTO - Dispara re-render
const [user, setUser] = useState({ name: 'Juan' })
function changeName(newName) {
  setUser({ ...user, name: newName }) // Crear nuevo objeto
}
```

**React solo re-renderiza si el objeto CAMBIA (referencia diferente):**

```typescript
const [items, setItems] = useState([1, 2, 3])

// ❌ Incorrecto - mismo array
items.push(4)
setItems(items)

// ✅ Correcto - nuevo array
setItems([...items, 4])
```

### Problema 2: ¿Hook se ejecuta infinitamente?

**Causa**: Array de dependencias incorrecto

```typescript
// ❌ INCORRECTO - se ejecuta cada render
useEffect(() => {
  fetch('/data')
})

// ✅ CORRECTO - se ejecuta una sola vez
useEffect(() => {
  fetch('/data')
}, [])

// ✅ CORRECTO - se ejecuta cuando userId cambia
useEffect(() => {
  fetch(`/users/${userId}`)
}, [userId])
```

### Problema 3: Datos viejos después de update

**Causa**: SWR caché no se actualiza

```typescript
// ❌ Incorrecto - datos viejos
await createVehicle(data)
// ... lista no actualizada

// ✅ Correcto - forzar refetch
const { mutate } = useSWR(...)
await createVehicle(data)
mutate() // Refetch /vehicles
```

### Problema 4: Props undefined

**Causa**: TypeScript no chequea

```typescript
// ❌ Falta props
interface UserCardProps {
  name: string
  age: number
}

const UserCard = ({ name }) => <div>{name}</div> // ❌ age falta

// ✅ Completo
const UserCard = ({ name, age }: UserCardProps) => <div>{name} - {age}</div>
```

### Cómo Debuggear

#### 1. Browser DevTools

```typescript
// Agregar console.log
const handleSubmit = async (data) => {
  console.log('Form data:', data)  // ← Ver qué datos tienes
  try {
    const result = await createVehicle(data)
    console.log('Create response:', result)  // ← Ver qué devuelve API
  } catch (err) {
    console.error('Error:', err)  // ← Ver qué error
  }
}
```

#### 2. React DevTools (Extensión del navegador)

- Inspeccionar componentes
- Ver props en tiempo real
- Ver estado de hooks

#### 3. Network Tab

- Ver requests/responses exactos
- Chequear headers (Authorization)
- Ver status codes

#### 4. Debugger

```typescript
const handleSubmit = async (data) => {
  debugger  // ← Pausará aquí
  await createVehicle(data)
}
```

---

## Resumen de Conceptos Clave

### Los 5 Fundamentos de React

1. **Componentes**: Funciones que devuelven JSX
2. **Props**: Datos hacia ABAJO (parent → child)
3. **State**: Datos que cambian (useState)
4. **Effects**: Ejecutar código cuando montan/cambian (useEffect)
5. **Hooks**: Funciones reutilizables que encapsulan lógica

### Patrones Arquitectónicos del Proyecto

| Capa | Responsabilidad | Ejemplo |
|------|-----------------|---------|
| Types | Definir forma de datos | `Employee`, `VehicleCreate` |
| Services | Comunicar con API | `employeeService.getAll()` |
| Hooks | Lógica reutilizable + SWR | `useEmployees()` |
| Context | Estado global | `useAuth()` |
| Components | UI reutilizable | `Button`, `FormInput` |
| Pages | Orchestrador | `Dashboard`, `EmployeesPage` |

### Los 3 Principios

1. **Separación de Responsabilidades**: Cada archivo hace UNA cosa bien
2. **DRY (Don't Repeat Yourself)**: Si repetis código, extraer a función/hook
3. **Composición**: Combinar piezas simples para hacer cosas complejas

---

## Próximos Pasos - Tu Aprendizaje

### Ahora que entiendes la arquitectura:

1. **Ejecuta el proyecto localmente**
   ```bash
   npm install
   npm run dev
   ```

2. **Haz un cambio pequeño**
   - Cambia un color de Tailwind
   - Agrega un console.log
   - Modifica un texto de UI

3. **Sigue un flujo completo**
   - Cuando registras entrada de vehículo:
     - ¿Qué tipo es VehicleCreate?
     - ¿Qué hace vehicleService.create()?
     - ¿Cómo SWR refetch actualiza la lista?

4. **Intenta agregar un campo**
   - Empleado: agregar "email_verificado: boolean"
   - Pasos: tipo → backend → servicio → página → componente

5. **Lee la documentación oficial**
   - React: https://react.dev (gran documentación)
   - TypeScript: https://www.typescriptlang.org/docs (manual)
   - SWR: https://swr.vercel.app (10 min para entender)
   - Tailwind: https://tailwindcss.com (busca componente + clase)

### Recursos que te ayudarán

- **React DevTools**: Extensión para Chrome/Firefox
- **VSCode Extensions**: Prettier, ESLint, TypeScript Vue Extension
- **Postman/Insomnia**: Para probar endpoints de API
- **Network Tab**: Para ver qué requests hace el frontend

---

## Conclusión

Has aprendido:
- ✅ Cómo está organizado el proyecto (capas)
- ✅ Cómo fluyen los datos (props, state, context, hooks)
- ✅ Cómo comunicarse con la API (servicios, axios, SWR)
- ✅ Cómo crear componentes reutilizables
- ✅ Cómo agregar nuevas páginas/features
- ✅ Cómo debuggear problemas

**Lo más importante**: Lee el código del proyecto mientras estudias esta guía. Ver ejemplos reales (VehiclesPage.tsx, useEmployees.ts, etc) hará que todo cobre sentido.

¡Eres ahora un desarrollador frontend con visión de cómo construir aplicaciones React profesionales! 🚀

---

**Última actualización**: 30 de Abril de 2026  
**Tutor**: Claude (Antropic)  
**Nivel alcanzado**: Junior → Intermedio
