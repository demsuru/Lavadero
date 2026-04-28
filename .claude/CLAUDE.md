# CLAUDE.md - Car Wash Management System

## Project

**Car Wash Management** - Comprehensive web system for managing daily car wash operations.
- **Type**: Web application (React + FastAPI)
- **Scale**: Single car wash location
- **Status**: Backend Phase 1 complete (51/51 tests passing). Frontend pending.

---

## Architectural Decisions

### Technology Stack
- **Backend**: FastAPI + Python + SQLAlchemy (ORM)
- **Frontend**: React (Context API or Redux - to be defined)
- **Database**:
  - **SQL** (PostgreSQL/MySQL): employees, shifts, wash_types, transactions
  - **NoSQL** (MongoDB): vehicles (flexible schema)
- **Deployment**: To be defined
- **Authentication**: DEFERRED (Phase 3+)

### Business Decisions
- ✅ Two initial wash types (basic, deep) - extensible
- ✅ No customer registration, vehicles yes
- ✅ Payment method doesn't matter, only amount
- ✅ Manager assigns weekly shifts
- ✅ Employee registers vehicle entry/exit and is assigned to vehicle
- ✅ Transactions generated automatically on vehicle exit
- ✅ Reports: Operational, Financial, HR (Phase 2)
- ✅ **Soft delete (baja lógica) only** — NEVER physically delete employees or wash types. Set `status = inactive`. Historical records (transactions, vehicle assignments) are preserved.
- ❌ No cancel flow for transactions (exit = final)
- ❌ No expenses for now (consider Phase 4+)

### MVC Architecture
- **Models**: Business logic (EmployeeService, VehicleService, etc.)
- **Controllers**: FastAPI endpoints
- **Views**: React components
- **Clear separation**: Backend handles all logic, frontend is presentation

---

## Folder Structure (Planned - Aligned with fastapi-templates skill)

```
lavadero/
├── plan.md                      # Business plan (main reference)
├── .claude/
│   └── CLAUDE.md               # This file
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI entry point + lifespan
│   │   ├── core/               # Central configuration
│   │   │   ├── config.py       # Configuration (DB, env vars)
│   │   │   ├── database.py     # SQL connection (PostgreSQL)
│   │   │   └── security.py     # Security (future: auth)
│   │   ├── models/             # SQLAlchemy models (SQL)
│   │   │   ├── employee.py
│   │   │   ├── shift.py
│   │   │   ├── wash_type.py
│   │   │   ├── transaction.py
│   │   │   └── base.py         # Base models config
│   │   ├── schemas/            # Pydantic schemas (validation)
│   │   │   ├── employee.py
│   │   │   ├── shift.py
│   │   │   ├── wash_type.py
│   │   │   ├── vehicle.py
│   │   │   └── transaction.py
│   │   ├── repositories/       # Data access layer (Repository pattern)
│   │   │   ├── base_repository.py
│   │   │   ├── employee_repository.py
│   │   │   ├── shift_repository.py
│   │   │   ├── wash_type_repository.py
│   │   │   ├── vehicle_repository.py
│   │   │   └── transaction_repository.py
│   │   ├── services/           # Business logic
│   │   │   ├── employee_service.py
│   │   │   ├── shift_service.py
│   │   │   ├── vehicle_service.py
│   │   │   ├── transaction_service.py
│   │   │   └── report_service.py
│   │   ├── api/                # API routes (versioned)
│   │   │   ├── dependencies.py # Shared dependencies
│   │   │   └── v1/
│   │   │       ├── endpoints/  # Endpoints by feature
│   │   │       │   ├── employees.py
│   │   │       │   ├── shifts.py
│   │   │       │   ├── wash_types.py
│   │   │       │   ├── vehicles.py
│   │   │       │   ├── transactions.py
│   │   │       │   └── reports.py
│   │   │       └── router.py   # Groups v1 routers
│   │   └── utils/
│   │       ├── validators.py
│   │       └── helpers.py
│   ├── tests/                  # Tests (pytest)
│   │   ├── conftest.py
│   │   ├── test_employees.py
│   │   └── test_vehicles.py
│   ├── requirements.txt         # Python dependencies
│   └── .env.example            # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Employees/
│   │   │   │   ├── EmployeeList.jsx
│   │   │   │   ├── EmployeeForm.jsx
│   │   │   │   └── EmployeeCard.jsx
│   │   │   ├── Schedules/
│   │   │   │   ├── WeeklySchedule.jsx
│   │   │   │   ├── ShiftForm.jsx
│   │   │   │   └── ShiftCard.jsx
│   │   │   ├── Vehicles/
│   │   │   │   ├── VehicleEntry.jsx
│   │   │   │   ├── VehicleExit.jsx
│   │   │   │   └── VehicleList.jsx
│   │   │   ├── Reports/
│   │   │   │   ├── OperationalReport.jsx
│   │   │   │   ├── FinancialReport.jsx
│   │   │   │   ├── HRReport.jsx
│   │   │   │   └── ReportChart.jsx
│   │   │   └── Common/         # Reusable components
│   │   │       ├── FormInput.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Table.jsx
│   │   │       └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EmployeesPage.jsx
│   │   │   ├── SchedulesPage.jsx
│   │   │   ├── VehiclesPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── WashTypesPage.jsx
│   │   │   └── Layout.jsx
│   │   ├── hooks/              # Custom hooks (reusable)
│   │   │   ├── useEmployees.js
│   │   │   ├── useShifts.js
│   │   │   ├── useVehicles.js
│   │   │   ├── useReports.js
│   │   │   └── useApi.js       # Base hook for API calls
│   │   ├── services/           # API calls (SWR or fetch)
│   │   │   ├── api.js         # Base API client
│   │   │   ├── employeeService.js
│   │   │   ├── shiftService.js
│   │   │   └── vehicleService.js
│   │   ├── context/            # Context API (state management)
│   │   │   ├── EmployeeContext.jsx
│   │   │   ├── VehicleContext.jsx
│   │   │   └── AppContext.jsx
│   │   ├── utils/
│   │   │   ├── formatters.js  # Data formatting
│   │   │   ├── validators.js  # Client-side validation
│   │   │   └── constants.js   # Global constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js         # Vite config
│   └── .env.example
│
└── docs/                        # Additional documentation
    └── db-schema.md            # Database schema details
```

---

## Main Entities

### SQL (PostgreSQL/MySQL)

#### Employee
```python
id (UUID, PK)
name (String)
email (String, nullable)
phone (String, nullable)
role (Enum: employee, manager, admin)
status (Enum: active, inactive)
created_at (Timestamp)
updated_at (Timestamp)
```

#### Shift
```python
id (UUID, PK)
employee_id (UUID, FK -> Employee)
day_of_week (Enum: monday-sunday)
start_time (Time)
end_time (Time)
created_at (Timestamp)
updated_at (Timestamp)
```

#### WashType
```python
id (UUID, PK)
name (String, unique)
description (String, nullable)
price (Float)
status (Enum: active, inactive)
created_at (Timestamp)
updated_at (Timestamp)
```

#### Transaction
```python
id (UUID, PK)
vehicle_id (UUID)
wash_type_id (UUID, FK -> WashType)
employee_id (UUID, FK -> Employee)
amount (Float)
transaction_date (Timestamp)
notes (String, nullable)
```

### NoSQL (MongoDB)

#### Vehicle (JSON Document)
```json
{
  "_id": "ObjectId",
  "plate": "String (NOT unique — same plate can have multiple visit records)",
  "brand": "String",
  "customer_name": "String",
  "customer_phone": "String (nullable)",
  "assigned_employee_id": "UUID",
  "wash_type_id": "UUID",
  "entry_timestamp": "Timestamp",
  "exit_timestamp": "Timestamp (null until exit)",
  "status": "String (in_progress, completed)",
  "notes": "String (nullable)",
  "created_at": "Timestamp"
}
```

---

## Main Flows (Reference)

See **plan.md** section 4 for complete details.

### Quick summary:
1. **Vehicle entry**: Register plate, brand, customer name, customer phone (optional), assign employee (active + has shift today), wash type
2. **Vehicle exit**: Register exit → Create transaction automatically
3. **Shift assignment**: Manager creates/modifies/deletes shifts (no overlaps)
4. **CRUD Employees**: Create, list, update, deactivate (soft delete — never physical delete)
5. **Reports**: Calculations on operations, finances, HR

---

## FastAPI Endpoints (Planned - v1)

```
[GET/POST]   /api/v1/employees
[GET/PUT/DELETE] /api/v1/employees/{id}
[GET]        /api/v1/employees/available      # Active employees with shift today

[GET/POST]   /api/v1/shifts
[GET/PUT/DELETE] /api/v1/shifts/{id}
[GET]        /api/v1/shifts/employee/{employee_id}

[GET/POST]   /api/v1/wash-types
[PUT/DELETE] /api/v1/wash-types/{id}

[GET/POST]   /api/v1/vehicles
[PUT]        /api/v1/vehicles/{id}/exit
[GET]        /api/v1/vehicles/in-progress

[GET]        /api/v1/transactions
[GET]        /api/v1/transactions/{id}
[GET]        /api/v1/transactions/date/{date}

[GET]        /api/v1/reports/operational?start_date&end_date
[GET]        /api/v1/reports/financial?start_date&end_date
[GET]        /api/v1/reports/hr?start_date&end_date
```

---

## Role Responsibilities

- **employee**: Washes cars only. Appears as an assignable resource. Does NOT operate the UI.
- **manager**: Operates the system daily — registers vehicle entries/exits, assigns employees to vehicles, manages shifts.
- **admin**: Manages managers, general configuration.

> **Auth note (Phase 3)**: Role enforcement is deferred. `registered_by_id` on vehicles will auto-fill from the manager's auth token in Phase 3 — no need to track it in Phase 1.

---

## Critical Validations

- **Shift**: `end_time > start_time`, no overlaps for same employee. Model is **weekly recurring** (employee works *every* Monday), not calendar-based — no support for one-off exceptions yet (Phase 3+)
- **Vehicle**: plate is NOT unique (same car can visit multiple times); assigned_employee must be active AND have a shift on the current day of the week
- **Transaction**: Generated ONLY when registering vehicle exit (no cancel flow)
- **Employee**: `role` must be valid (employee, manager, admin); soft delete only — never physically delete, set `status = inactive` instead. Inactive employees keep all historical transactions/shifts.
- **WashType**: soft delete only — set `status = inactive`. Can be reactivated via PUT. Inactive wash types cannot be assigned to new vehicles.
- **Employee availability**: filter by `status = active` AND has a shift on today's `day_of_week`

---

## Development Phases

See **plan.md** section 7 for details.

**Phase 1 (MVP)**: Basic CRUD + vehicle entry/exit + automatic transactions
**Phase 2**: Reports (operational, financial, HR)
**Phase 3**: Improvements (export, notifications, history)
**Phase 4**: Expenses and profitability
**Phase 5**: Super Admin and multi-location

---

## Convenciones de Código

### 🌍 IMPORTANTE: Código en INGLÉS

**TODO el código debe estar en inglés**, aunque la interfaz sea en español:
- ✅ Nombres de variables, funciones, clases
- ✅ Nombres de archivos y carpetas
- ✅ Comentarios en el código
- ✅ Docstrings
- ✅ Nombres de métodos y propiedades
- ✅ Mensajes de error técnicos

**Excepciones** (pueden estar en español):
- ❌ Mensajes de error que se muestren al usuario (frontend)
- ❌ Labels, placeholders en la UI
- ❌ Textos de la interfaz

**Ejemplos**:
```python
# ✅ CORRECTO
async def create_employee(db: AsyncSession, employee_data: EmployeeCreate):
    """Create a new employee in the database."""
    
# ❌ INCORRECTO
async def crear_empleado(db: AsyncSession, datos_empleado: CrearEmpleado):
    """Crear nuevo empleado en la base de datos."""
```

```javascript
// ✅ CORRECTO
const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  
// ❌ INCORRECTO
const useEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
```

---

### Backend (FastAPI/Python)
- **Async obligatorio**: Todas las funciones deben ser `async` (FastAPI + SQLAlchemy async)
- Nombres en **snake_case**
- Modelos: `Employee` (SQLAlchemy, nombres plurales en tablas: `employees`)
- Schemas: `EmployeeCreate`, `EmployeeUpdate`, `EmployeeRead` (Pydantic)
- Repositories: `EmployeeRepository` (data access - hereda de BaseRepository)
- Services: `EmployeeService` (lógica de negocio)
- Endpoints: En `api/v1/endpoints/employees.py`
- Funciones: `create_employee()`, `get_employee_by_id()` (async)
- Docstrings en funciones públicas (breves)
- Type hints obligatorios
- Dependency Injection vía `Depends()` de FastAPI
- **Try-Catch en Services**: Capturar excepciones en lógica de negocio (try en service, raise HTTPException en endpoint)
  ```python
  # service.py
  async def create_employee(self, db, data):
      try:
          # business logic
      except ValueError as e:
          raise  # re-raise para que endpoint lo maneje
      except Exception as e:
          raise  # DatabaseError, IntegrityError, etc.
  
  # endpoint.py
  async def create(employee_in: EmployeeCreate, db = Depends(get_db)):
      try:
          employee = await service.create_employee(db, employee_in)
          return employee
      except ValueError as e:
          raise HTTPException(status_code=400, detail=str(e))
      except Exception as e:
          raise HTTPException(status_code=500, detail="Internal server error")
  ```

### Frontend (React - Alineado con vercel-react-best-practices skill)
- Nombres en **PascalCase** para componentes
- Nombres en **camelCase** para funciones/variables
- Componentes: `EmployeeForm.jsx` (extraer componentes para memoización)
- Hooks: `useEmployees()`, `useShifts()` (custom hooks reutilizables)
- Context: `EmployeeContext`, `ShiftContext` (state management)
- Props: destructuradas, type checking con TypeScript preferentemente
- Carpetas por feature (Empleados/, Vehiculos/, etc.)
- **Data fetching**: 
  - Cliente: Usar SWR para deduplicación automática de requests
  - Lazy load components pesados con `React.lazy()` + Suspense
  - Evitar waterfalls: fetch en paralelo cuando sea posible
- **Optimización**:
  - Memoización con `React.memo()` solo cuando es necesario
  - `useCallback` y `useMemo` para deps estables
  - Evitar re-renders innecesarios (rerender-defer-reads)
  - Usar `useTransition` para updates no-urgentes
- **Bundle size**:
  - Imports directos, evitar barrel files
  - Dynamic imports (`next/dynamic`) para componentes grandes
  - Defer third-party scripts (analytics, logging)

### Base de Datos
- Tablas en **snake_case** plural (empleados, turnos, tipos_lavado)
- Columnas en **snake_case**
- Foreign keys: `{tabla}_id`
- Booleanos: `estado` (activo/inactivo) o is_{atributo}
- Timestamps siempre con zona horaria

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost/car_wash_db
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=car_wash_nosql
DEBUG=True
SECRET_KEY=your_secret_key_here
ENVIRONMENT=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

---

## Comandos Útiles

### Backend
```bash
# Activar venv (Windows)
venv\Scripts\activate

# Iniciar servidor de desarrollo
uvicorn app.main:app --reload

# Correr pruebas (requiere servidor corriendo)
python run_tests.py

# Limpiar BD de prueba (PostgreSQL + MongoDB)
python -c "
import asyncio, asyncpg
async def clean():
    conn = await asyncpg.connect('postgresql://postgres:postgres@localhost/car_wash_db')
    await conn.execute('TRUNCATE TABLE transactions, shifts, employees, wash_types CASCADE')
    await conn.close()
asyncio.run(clean())
"
```

### Frontend
- Por definir al inicializar el proyecto

---

## Dependencias

### Frontend (package.json - Alineado con vercel-react-best-practices)

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "swr": "^2.x",                          # Data fetching + caching
    "axios": "^1.x",                        # HTTP client
    "zustand": "^4.x",                      # State management (alternativa a Context)
    "react-router-dom": "^6.x",             # Routing
    "lucide-react": "^latest",              # UI Icons
    "@headlessui/react": "^1.x",            # Unstyled components
    "clsx": "^latest",                      # className utility
    "date-fns": "^latest"                   # Date manipulation
  },
  "devDependencies": {
    "vite": "^latest",                      # Fast bundler
    "@vitejs/plugin-react": "^latest",
    "typescript": "^latest",
    "tailwindcss": "^latest",               # CSS framework
    "postcss": "^latest",
    "autoprefixer": "^latest",
    "eslint": "^latest",
    "eslint-plugin-react": "^latest",
    "eslint-plugin-react-hooks": "^latest",
    "vitest": "^latest",                    # Testing framework
    "@testing-library/react": "^latest"
  }
}
```

**Notas**:
- SWR: Deduplicación automática de requests, perfect para Reportes y listas
- Zustand: Alternativa ligera a Redux si state management es complejo
- Vite: Build tool moderno, más rápido que Create React App
- Tailwind: CSS utility-first para diseño rápido

### Backend (requirements.txt - instalado en venv/)

```
fastapi>=0.104.0                # API framework
uvicorn[standard]>=0.24.0       # ASGI server
sqlalchemy[asyncio]>=2.0.0      # ORM async (Mapped/mapped_column style)
asyncpg>=0.29.0                 # PostgreSQL async driver
motor>=3.3.0                    # MongoDB async driver (Motor)
pydantic[email]>=2.5.0          # Validación de datos (v2)
pydantic-settings>=2.1.0        # Configuración con .env
python-dotenv>=1.0.0            # Variables de entorno
alembic>=1.12.0                 # Database migrations (diferido)
pytest>=7.4.0                   # Unit testing
pytest-asyncio>=0.21.0          # Async test support
httpx>=0.25.0                   # HTTP client (testing)
```

---

## Puntos de Decisión Abiertos

- [x] PostgreSQL o MySQL para SQL → **PostgreSQL 17.9** con asyncpg
- [x] Usar Alembic para migrations o manual → **auto create_all en startup** (Alembic diferido)
- [ ] Context API o Redux para state management (frontend)
- [ ] Testing: pytest para backend, Jest para frontend
- [ ] Autenticación: JWT o sesiones (Fase 3+)
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Exportar reportes (PDF, Excel)

---

## Quick Reference

- **Business plan**: `plan.md`
- **Database structure**: "Main Entities" section above
- **Flows**: "Main Flows" section
- **Stack**: "Stack Tecnológico" section
- **Phases**: `plan.md` section 7

---

## Repository Pattern (Skill Integration)

The `fastapi-templates` skill introduces the **Repository pattern** that improves architecture:

### Architecture Layers
```
Controller (Endpoint)
    ↓
Service (Business logic)
    ↓
Repository (Data access)
    ↓
Database (SQLAlchemy Models)
```

### Implementation
- **BaseRepository**: Generic class with basic CRUD (get, get_multi, create, update, delete)
- **SpecificRepository**: Extends BaseRepository with custom queries
- **Service**: Uses repositories and encapsulates business logic
- **Endpoint**: Calls services, handles HTTP

**Example flow**:
```
POST /api/v1/employees
  → EmployeeController.create_employee()
    → EmployeeService.create_employee()
      → EmployeeRepository.create()
        → db.execute(insert) → SQLAlchemy → PostgreSQL
```

### Benefits
- Clear separation of concerns
- Easy to test (mock repositories)
- Basic CRUD reusability
- Flexibility for complex queries

---

## Error Handling (Try-Catch Strategy)

### Distribution of Responsibilities:

**Service Layer** (where errors occur):
- Capture exceptions related to business logic
- Raise specific exceptions (ValueError, RuntimeError)
- DO NOT convert to HTTPException (that's the endpoint's job)

**Endpoint Layer** (presentation):
- Capture exceptions from service
- Convert to HTTPException with appropriate HTTP status code
- Log if necessary

### Example:
```python
# service.py
async def create_employee(self, db: AsyncSession, employee_data: EmployeeCreate) -> Employee:
    try:
        # Business logic validation
        existing = await self.repository.get_by_email(db, employee_data.email)
        if existing:
            raise ValueError("Email already registered")
        
        # Create employee
        employee = await self.repository.create(db, employee_data)
        return employee
    except ValueError:
        raise  # Re-raise for endpoint to handle
    except Exception as e:
        raise RuntimeError(f"Error creating employee: {str(e)}")

# endpoint.py
@router.post("/", response_model=EmployeeRead, status_code=201)
async def create_employee(
    employee_data: EmployeeCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        employee = await service.create_employee(db, employee_data)
        return employee
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## Async/Await Requirement

**IMPORTANT**: All code must be **async**. This includes:
- Handlers: `async def create_employee()`
- Database calls: `await db.execute()`
- Repository methods: `async def get()`
- Service methods: `async def create_employee()`
- Middlewares
- Lifespan events

The skill provides proven patterns for this. See SKILL.md in `.agents/skills/fastapi-templates/`

---

## Skills Integration

### Backend: fastapi-templates
**Installed skill**: `fastapi-templates` in `.agents/skills/fastapi-templates/`

The skill provides:
- ✅ Recommended folder structure (core/, api/v1/, repositories/)
- ✅ Async/await patterns
- ✅ Repository pattern with generic BaseRepository
- ✅ Service Layer examples
- ✅ Testing examples with pytest
- ✅ Configuration with Pydantic Settings
- ✅ CORS middleware setup
- ✅ Lifespan events for startup/shutdown

### Frontend: vercel-react-best-practices
**Installed skill**: `vercel-react-best-practices` in `.agents/skills/vercel-react-best-practices/`

The skill provides **70 performance rules** in 8 categories:
1. **Eliminating Waterfalls (CRITICAL)**: Async parallelization, defer awaits
2. **Bundle Size (CRITICAL)**: Dynamic imports, barrel imports, code splitting
3. **Server-Side Performance (HIGH)**: React cache, deduplication, parallel fetching
4. **Client-Side Data Fetching (MEDIUM-HIGH)**: SWR, event listener dedup
5. **Re-render Optimization (MEDIUM)**: Memo, useCallback, derived state
6. **Rendering Performance (MEDIUM)**: Suspense, conditional rendering, transitions
7. **JavaScript Performance (LOW-MEDIUM)**: Caching, loops optimization
8. **Advanced Patterns (LOW)**: Effect event deps, refs

**Reference**: Read individual rules in `rules/*.md` as needed.

**Our architecture is aligned with both skills.** Use them as reference when implementing.

---

## Important Notes

1. **🌍 Code in ENGLISH**: ALL code (variables, functions, file names, comments) must be in English. The interface will be in Spanish. See section "IMPORTANT: Code in ENGLISH".
2. **Authentication**: Deferred (Phase 3+). Skill has examples in `core/security.py`.
3. **NoSQL for vehicles**: MongoDB for flexible customer data. SQL for structured data.
4. **Automatic transactions**: Created ONLY when vehicle exits, not before. Service validates this.
5. **Reports**: Implement in Phase 2, designed to be extensible (reports as endpoints).
6. **Scalability**: Structure ready to add modules without changing existing ones (new v2 later).
7. **Async mandatory**: Everything must be `async` - use skill patterns as reference.
8. **Repository Pattern**: Critical implementation for layer separation (data access vs logic).
9. **Versioning**: Use `/api/v1/` from the start to allow v2 without conflicts later.
10. **Try-Catch in Services**: Mandatory to capture exceptions in services, convert to HTTPException in endpoints. See "Error Handling" section.
11. **Installed skills**: `fastapi-templates` (backend) and `vercel-react-best-practices` (frontend) - see "Skills Integration" section.
