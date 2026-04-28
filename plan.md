# Plan - Sistema de Gestión Lavadero de Autos

## 1. Descripción General del Proyecto

**Objetivo**: Crear un sistema integral para gestionar las operaciones diarias de un lavadero de autos, incluyendo registro de vehículos, gestión de empleados, turnos, ingresos y reportes.

**Alcance**: Un solo lavadero, aplicación web (React + FastAPI), enfoque operacional e informativo.

---

## 2. Módulos Principales

### 2.1 Módulo de Entrada/Salida de Vehículos
- **Responsable**: Empleado recepcionista
- **Funcionalidades**:
  - Registrar entrada de vehículo (placa, marca, nombre cliente, asignar empleado)
  - Seleccionar tipo de lavado (básico o profundo)
  - Registrar salida de vehículo (genera transacción de ingreso)
  - Visualizar estado actual de autos en el lavadero
  - Historial de autos procesados

### 2.2 Módulo de Horarios de Empleados
- **Responsable**: Manager
- **Funcionalidades**:
  - Registrar nuevos empleados
  - Asignar/modificar turnos semanales (día, hora inicio, hora fin)
  - Ver plantilla semanal (matriz empleado vs día/horario)
  - Eliminar empleados
  - Visualizar disponibilidad de empleados

### 2.3 Módulo de Contabilidad
- **Responsable**: Contador/Admin
- **Funcionalidades**:
  - Registro automático de ingresos por lavado completado
  - Cierre de caja (ingresos del día)
  - Histórico de transacciones
  - **Futuro**: Integración de gastos, margen de ganancia

### 2.4 Módulo de Reportes
- **Responsable**: Manager/Admin
- **Reportes implementados**:
  - **Operacionales**: Autos procesados por día/empleado, tiempo promedio de lavado
  - **Financieros**: Ingresos por día, tipo de lavado más popular, ingresos por empleado
  - **Recursos Humanos**: Autos procesados por empleado, productividad
- **Diseño**: Extensible para agregar más reportes

### 2.5 Módulo Super Admin (Futuro)
- Por definir: Posibles funcionalidades multi-sucursal o configuración global
- Dejar estructura preparada

---

## 3. Entidades de Datos

### 3.1 Empleado
```json
{
  "id": "uuid",
  "nombre": "string",
  "email": "string (opcional)",
  "telefono": "string (opcional)",
  "rol": "enum (empleado, manager, admin)",
  "estado": "enum (activo, inactivo)",
  "fecha_creacion": "timestamp",
  "fecha_ultima_modificacion": "timestamp"
}
```

### 3.2 Turno
```json
{
  "id": "uuid",
  "empleado_id": "uuid",
  "dia_semana": "enum (lunes, martes, ..., domingo)",
  "hora_inicio": "string (HH:mm)",
  "hora_fin": "string (HH:mm)",
  "fecha_creacion": "timestamp",
  "fecha_ultima_modificacion": "timestamp"
}
```

### 3.3 Tipo de Lavado
```json
{
  "id": "uuid",
  "nombre": "string (ej: 'Lavado Básico')",
  "descripcion": "string",
  "precio": "float",
  "estado": "enum (activo, inactivo)",
  "fecha_creacion": "timestamp",
  "fecha_ultima_modificacion": "timestamp"
}
```

### 3.4 Vehículo
```json
{
  "id": "uuid",
  "placa": "string (NO única — misma placa puede tener múltiples visitas)",
  "marca": "string",
  "nombre_cliente": "string",
  "telefono_cliente": "string (opcional)",
  "empleado_asignado_id": "uuid",
  "tipo_lavado_id": "uuid",
  "timestamp_entrada": "timestamp",
  "timestamp_salida": "timestamp (null hasta la salida)",
  "estado": "enum (en_proceso, completado)",
  "observaciones": "string (opcional)",
  "fecha_creacion": "timestamp"
}
```

### 3.5 Transacción (Ingreso)
```json
{
  "id": "uuid",
  "vehiculo_id": "uuid",
  "tipo_lavado_id": "uuid",
  "empleado_id": "uuid",
  "monto": "float",
  "fecha_transaccion": "timestamp",
  "observaciones": "string (opcional)"
}
```

---

## 4. Flujos de Negocio

### 4.1 Flujo: Entrada de Vehículo
```
1. Empleado abre módulo "Entrada de Vehículos"
2. Ingresa:
   - Placa del auto
   - Marca del auto
   - Nombre del cliente
   - Teléfono del cliente (opcional, para llamarlo cuando esté listo)
   - Selecciona tipo de lavado (básico o profundo)
   - Selecciona empleado asignado (solo empleados activos con turno hoy)
3. Sistema registra timestamp_entrada
4. Vehículo queda en estado "en_proceso"
5. Se muestra en dashboard con estado actual
```

### 4.2 Flujo: Salida de Vehículo
```
1. Empleado registra salida del vehículo (búsqueda por placa)
2. Sistema calcula timestamp_salida
3. Se crea automáticamente transacción:
   - monto = precio del tipo_lavado
   - empleado_id = empleado asignado
4. Vehículo cambia estado a "completado"
5. Se registra en módulo de contabilidad
6. Se actualiza dashboard
```

### 4.3 Flujo: Asignación de Turnos
```
1. Manager accede a "Gestión de Horarios"
2. Ve plantilla semanal (matriz empleado x día)
3. Puede:
   - Crear nuevo turno: empleado + día + hora inicio + hora fin
   - Modificar turno existente
   - Eliminar turno
4. Sistema valida:
   - No haya solapamientos para un mismo empleado
   - Horarios válidos (fin > inicio)
5. Cambios se reflejan inmediatamente en la plantilla
```

### 4.4 Flujo: Registro de Empleado
```
1. Manager accede a "Gestión de Empleados"
2. Crea nuevo empleado (nombre, email, teléfono, rol)
3. Asigna turnos asociados
4. Empleado queda disponible para asignaciones
```

### 4.5 Flujo: Generación de Reportes
```
1. Admin/Manager accede a "Reportes"
2. Selecciona tipo de reporte y rango de fechas
3. Sistema calcula:
   - **Operacionales**: Cantidad autos/empleado, tiempo promedio
   - **Financieros**: Ingresos totales, por tipo de lavado, por empleado
   - **RRHH**: Autos procesados, ranking de productividad
4. Se muestra en gráficos/tablas y permite exportar
```

---

## 5. Arquitectura MVC

### 5.1 Backend (FastAPI)

#### Controllers (Rutas)
```
/api/empleados
  GET /              -> Listar empleados
  POST /             -> Crear empleado
  GET /{id}          -> Obtener empleado
  PUT /{id}          -> Actualizar empleado
  DELETE /{id}       -> Eliminar empleado

/api/turnos
  GET /              -> Listar turnos
  POST /             -> Crear turno
  GET /{id}          -> Obtener turno
  PUT /{id}          -> Actualizar turno
  DELETE /{id}       -> Eliminar turno
  GET /empleado/{emp_id}  -> Turnos de un empleado

/api/tipos-lavado
  GET /              -> Listar tipos de lavado
  POST /             -> Crear tipo de lavado
  PUT /{id}          -> Actualizar tipo de lavado
  DELETE /{id}       -> Eliminar tipo de lavado

/api/vehiculos
  GET /              -> Listar vehículos (con filtros)
  POST /             -> Registrar entrada de vehículo
  PUT /{id}/salida   -> Registrar salida de vehículo
  GET /{id}          -> Obtener detalles del vehículo
  GET /en-proceso    -> Vehículos actualmente en lavado

/api/transacciones
  GET /              -> Listar transacciones
  GET /{id}          -> Obtener transacción
  GET /fecha/{fecha} -> Transacciones por fecha (cierre de caja)

/api/reportes
  GET /operacional?fecha_inicio&fecha_fin  -> Reporte operacional
  GET /financiero?fecha_inicio&fecha_fin   -> Reporte financiero
  GET /rrhh?fecha_inicio&fecha_fin         -> Reporte RRHH
```

#### Models (Lógica de negocio)
```
- EmpleadoService: CRUD, validación de empleados
- TurnoService: CRUD, validaciones (no solapamiento)
- TipoLavadoService: CRUD, gestión de servicios
- VehiculoService: Registro entrada/salida, asignación
- TransaccionService: Creación automática, historial
- ReporteService: Cálculos de reportes
```

#### Validaciones importantes
```
- Turno: hora_fin > hora_inicio
- Turno: No solapamientos para mismo empleado
- Vehículo: Placa NO es única (mismo auto puede volver múltiples veces)
- Vehículo: Empleado asignado debe estar activo Y tener turno el día actual
- Transacción: Se crea solo al registrar salida (no hay flujo de cancelación)
- Empleado: Baja lógica únicamente (estado=inactivo), nunca se elimina físicamente
```

### 5.2 Frontend (React)

#### Páginas principales
```
/dashboard
  - Estado actual de vehículos en lavado
  - Resumen de ingresos del día
  - Acceso rápido a funciones

/entrada-vehiculos
  - Formulario de entrada
  - Búsqueda de vehículos en proceso
  - Estado actual

/salida-vehiculos
  - Búsqueda de vehículo por placa
  - Confirmar salida y generar recibo

/horarios
  - Plantilla semanal (matriz empleado x día)
  - Crear/editar/eliminar turnos
  - Validaciones en tiempo real

/empleados
  - Listado de empleados
  - Crear/editar/eliminar empleado
  - Ver turnos asignados

/reportes
  - Selector de tipo de reporte
  - Rango de fechas
  - Gráficos y tablas
  - Exportar opción

/tipos-lavado
  - Gestión de servicios
  - Crear/editar/eliminar tipos de lavado
```

#### Componentes reutilizables
```
- FormularioEmpleado
- TablaEmpleados
- PlantillaSemanal
- FormularioTurno
- FormularioVehiculo
- ListadoVehiculos
- TablaTransacciones
- GraficoReportes
```

---

## 6. Base de Datos

### 6.1 Tipo de BD
- **Relacional (SQL)**: Para empleados, turnos, tipos de lavado, transacciones
- **NoSQL (Documento)**: Para vehículos (schema flexible, información variable)

### 6.2 Estructura propuesta
```
SQL (PostgreSQL o MySQL):
  - empleados
  - turnos
  - tipos_lavado
  - transacciones

NoSQL (MongoDB o Firebase):
  - vehiculos (esquema flexible, datos del cliente, observaciones)
```

### 6.3 Justificación
- **SQL**: Datos estructurados, relaciones claras, ACID
- **NoSQL para vehículos**: Flexibilidad para agregar campos de clientes, observaciones especiales, historial
- **Alternativa**: Usar solo SQL con campo JSON para datos de cliente

---

## 7. Fases de Desarrollo

### Fase 1: Core Operacional (MVP)
- [ ] CRUD Empleados
- [ ] CRUD Turnos
- [ ] CRUD Tipos de Lavado
- [ ] Entrada de vehículos
- [ ] Salida de vehículos
- [ ] Transacciones automáticas

### Fase 2: Reportes
- [ ] Reportes operacionales
- [ ] Reportes financieros
- [ ] Reportes RRHH

### Fase 3: Mejoras y Optimizaciones
- [ ] Autenticación y roles (login manager/admin, registered_by_id en vehículos)
- [ ] Notificaciones/alertas
- [ ] Exportar datos a CSV (transacciones, reportes)

### Fase 4: Contabilidad Avanzada
- [ ] Cierre fiscal diario: resumen automático de todas las transacciones del día (total ingresos, cantidad de autos, desglose por tipo de lavado, empleado más productivo). Se genera como documento persistente.
- [ ] Historial de cierres fiscales
- [ ] Registro de gastos
- [ ] Cálculo de margen de ganancia

### Fase 5: Analítica de Vehículos/Clientes
- [ ] Consultas por placa: frecuencia de visitas, último servicio, historial completo
- [ ] "¿Cuántas veces vino esta placa este mes?" — query directa en MongoDB por plate + fecha
- [ ] Exportar historial de visitas por placa a CSV
- [ ] Nota: customer_phone es solo operacional (llamar cuando el auto está listo), no se usa como identificador

### Fase 6: Super Admin y Multi-sucursal
- [ ] Estructura para múltiples locales
- [ ] Dashboard consolidado
- [ ] Gestión centralizada

---

## 8. Consideraciones Técnicas

### 8.1 Stack
- **Backend**: FastAPI, Python, SQLAlchemy (ORM)
- **Frontend**: React, Context API o Redux
- **BD**: PostgreSQL (SQL) + MongoDB (NoSQL) o híbrido
- **Despliegue**: (Por definir)

### 8.2 Validaciones críticas
```
- Horarios: Sin solapamientos
- Vehículos: Placa única
- Transacciones: Se generan solo al salir vehículo
- Empleados: Rol debe ser válido
```

### 8.3 Extensibilidad
- **Nuevos tipos de lavado**: Solo agregar registro en BD, no cambios en lógica
- **Nuevos reportes**: Agregar endpoint y componente React
- **Nuevos módulos**: Arquitectura permite agregar sin impactar existentes

---

## 9. Puntos de Decisión Abiertos

- [ ] ¿Autenticación y roles desde el inicio o después?
- [ ] ¿Super Admin requiere multi-sucursal o solo configuración?
- [ ] ¿Exportar reportes en qué formatos? (PDF, Excel, etc.)
- [ ] ¿Notificaciones en tiempo real (WebSockets) o consulta manual?
- [ ] ¿Integración de gastos desde el inicio o Fase 4?

---

## 10. Próximos Pasos

1. ✅ Definir arquitectura MVC y entidades
2. ⏳ Definir autenticación y roles
3. ⏳ Crear modelos de BD
4. ⏳ Implementar API endpoints (Fase 1)
5. ⏳ Implementar componentes React (Fase 1)
