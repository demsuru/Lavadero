# -*- coding: utf-8 -*-
import httpx
from datetime import datetime

BASE = "http://localhost:8000/api/v1"
TODAY = datetime.now().strftime("%A").lower()  # e.g., "monday", "sunday"
results = {"passed": 0, "failed": 0}

def check(label, r, expected):
    passed = r.status_code == expected
    results["passed" if passed else "failed"] += 1
    icon = "[OK  ]" if passed else "[FAIL]"
    print(f"{icon} {label} -> {r.status_code} (expected {expected})")
    if not passed:
        print(f"       {r.text[:200]}")
    try:
        return r.json() if passed and r.status_code != 204 else None
    except Exception:
        return None

# ════════════════════════════════════════════════════════════════
print("\n=== WASH TYPES ===")

r = httpx.post(f"{BASE}/wash-types/", json={"name": "Lavado Basico", "price": 5000})
wt_basic = check("Crear Lavado Basico", r, 201)

r = httpx.post(f"{BASE}/wash-types/", json={"name": "Lavado Profundo", "price": 12000})
wt_deep = check("Crear Lavado Profundo", r, 201)

r = httpx.get(f"{BASE}/wash-types/")
lista = check("Listar wash types", r, 200)
print(f"       -> {len(lista)} tipos")

r = httpx.post(f"{BASE}/wash-types/", json={"name": "Lavado Basico", "price": 3000})
check("FAIL nombre duplicado", r, 400)

r = httpx.post(f"{BASE}/wash-types/", json={"name": "Precio Negativo", "price": -500})
check("FAIL precio negativo", r, 422)

r = httpx.post(f"{BASE}/wash-types/", json={"name": "Precio Cero", "price": 0})
check("FAIL precio cero", r, 422)

r = httpx.delete(f"{BASE}/wash-types/{wt_deep['id']}")
check("Desactivar Lavado Profundo", r, 200)

r = httpx.get(f"{BASE}/wash-types/?only_active=true")
activos = check("Listar solo activos (esperado: 2, uno es 'Test')", r, 200)
print(f"       -> {len(activos)} activos")

r = httpx.put(f"{BASE}/wash-types/{wt_deep['id']}", json={"status": "active"})
check("Reactivar Lavado Profundo", r, 200)

r = httpx.get(f"{BASE}/wash-types/?only_active=true")
activos = check("Listar activos tras reactivar", r, 200)
deep_activo = any(w["id"] == wt_deep["id"] and w["status"] == "active" for w in activos)
print(f"       -> Lavado Profundo activo: {deep_activo}")

# ════════════════════════════════════════════════════════════════
print("\n=== EMPLOYEES ===")

r = httpx.post(f"{BASE}/employees/", json={"name": "Carlos Gomez", "email": "carlos@lavadero.com", "phone": "3001234567", "role": "employee"})
emp_carlos = check("Crear Carlos (employee)", r, 201)

r = httpx.post(f"{BASE}/employees/", json={"name": "Luis Torres", "phone": "3009876543", "role": "employee"})
emp_luis = check("Crear Luis (sin email)", r, 201)

r = httpx.post(f"{BASE}/employees/", json={"name": "Ana Martinez", "email": "ana@lavadero.com", "role": "manager"})
emp_ana = check("Crear Ana (manager)", r, 201)

r = httpx.post(f"{BASE}/employees/", json={"name": "Sin Turno", "role": "employee"})
emp_noshift = check("Crear empleado sin turno", r, 201)

r = httpx.get(f"{BASE}/employees/")
todos = check("Listar empleados", r, 200)
print(f"       -> {len(todos)} empleados")

r = httpx.post(f"{BASE}/employees/", json={"name": "Dup", "email": "carlos@lavadero.com", "role": "employee"})
check("FAIL email duplicado", r, 400)

r = httpx.post(f"{BASE}/employees/", json={"name": "Rol Invalido", "role": "superusuario"})
check("FAIL rol invalido", r, 422)

r = httpx.get(f"{BASE}/employees/00000000-0000-0000-0000-000000000000")
check("FAIL ID inexistente", r, 404)

r = httpx.delete(f"{BASE}/employees/{emp_luis['id']}")
data = check("Desactivar Luis (soft delete)", r, 200)
print(f"       -> Luis status: {data['status']}")

r = httpx.get(f"{BASE}/employees/")
todos = check("Luis sigue en lista general", r, 200)
luis = next((e for e in todos if e["id"] == emp_luis["id"]), None)
print(f"       -> Luis en lista: {luis is not None}, status: {luis['status']}")

# ════════════════════════════════════════════════════════════════
print("\n=== SHIFTS ===")

r = httpx.post(f"{BASE}/shifts/", json={"employee_id": emp_carlos["id"], "day_of_week": TODAY, "start_time": "08:00:00", "end_time": "17:00:00"})
shift_carlos = check("Turno Carlos hoy", r, 201)

r = httpx.post(f"{BASE}/shifts/", json={"employee_id": emp_ana["id"], "day_of_week": TODAY, "start_time": "08:00:00", "end_time": "17:00:00"})
shift_ana = check("Turno Ana hoy", r, 201)

r = httpx.post(f"{BASE}/shifts/", json={"employee_id": emp_carlos["id"], "day_of_week": TODAY, "start_time": "12:00:00", "end_time": "20:00:00"})
check("FAIL solapado total", r, 400)

r = httpx.post(f"{BASE}/shifts/", json={"employee_id": emp_carlos["id"], "day_of_week": TODAY, "start_time": "06:00:00", "end_time": "10:00:00"})
check("FAIL solapado parcial inicio", r, 400)

r = httpx.post(f"{BASE}/shifts/", json={"employee_id": emp_carlos["id"], "day_of_week": TODAY, "start_time": "17:00:00", "end_time": "08:00:00"})
check("FAIL fin antes que inicio", r, 422)

r = httpx.post(f"{BASE}/shifts/", json={"employee_id": emp_carlos["id"], "day_of_week": TODAY, "start_time": "08:00:00", "end_time": "08:00:00"})
check("FAIL inicio igual a fin", r, 422)

r = httpx.post(f"{BASE}/shifts/", json={"employee_id": emp_luis["id"], "day_of_week": TODAY, "start_time": "08:00:00", "end_time": "17:00:00"})
check("FAIL turno para empleado inactivo", r, 400)

# Pick a different day for the non-overlapping shift test
OTHER_DAY = "tuesday" if TODAY != "tuesday" else "wednesday"
r = httpx.post(f"{BASE}/shifts/", json={"employee_id": emp_carlos["id"], "day_of_week": OTHER_DAY, "start_time": "08:00:00", "end_time": "17:00:00"})
shift_otro_dia = check(f"Turno Carlos {OTHER_DAY} (no solapa)", r, 201)

r = httpx.get(f"{BASE}/employees/available")
disponibles = check(f"Empleados disponibles hoy ({TODAY})", r, 200)
nombres = [e["name"] for e in disponibles]
print(f"       -> Disponibles: {nombres}")
assert "Carlos Gomez" in nombres, "Carlos deberia estar disponible"
assert "Ana Martinez" in nombres, "Ana deberia estar disponible"
assert "Luis Torres" not in nombres, "Luis NO deberia estar disponible"
assert "Sin Turno" not in nombres, "Sin Turno NO deberia estar disponible"

r = httpx.delete(f"{BASE}/shifts/{shift_otro_dia['id']}")
check(f"Eliminar turno {OTHER_DAY} Carlos", r, 204)

# ════════════════════════════════════════════════════════════════
print("\n=== VEHICLES ===")

r = httpx.get(f"{BASE}/vehicles/in-progress")
en_proceso = check("En proceso al inicio (esperado: 0)", r, 200)
print(f"       -> {len(en_proceso)} en proceso")

r = httpx.post(f"{BASE}/vehicles/", json={
    "plate": "ABC123", "brand": "Toyota", "customer_name": "Juan Perez",
    "customer_phone": "3005556677",
    "assigned_employee_id": emp_carlos["id"],
    "wash_type_id": wt_basic["id"], "notes": "Rayon en puerta"
})
v1 = check("Entrada ABC123 con telefono y notas", r, 201)
print(f"       -> status: {v1['status']}, exit_timestamp: {v1['exit_timestamp']}")

r = httpx.post(f"{BASE}/vehicles/", json={
    "plate": "ABC123", "brand": "Toyota", "customer_name": "Juan Perez",
    "assigned_employee_id": emp_carlos["id"],
    "wash_type_id": wt_basic["id"]
})
v2 = check("Entrada ABC123 segunda vez (misma placa)", r, 201)

r = httpx.post(f"{BASE}/vehicles/", json={
    "plate": "XYZ999", "brand": "Ford", "customer_name": "Maria Lopez",
    "assigned_employee_id": emp_carlos["id"],
    "wash_type_id": wt_deep["id"]
})
v3 = check("Entrada XYZ999 sin telefono", r, 201)
print(f"       -> customer_phone: {v3['customer_phone']}")

r = httpx.get(f"{BASE}/vehicles/in-progress")
en_proceso = check("En proceso (esperado: 3)", r, 200)
print(f"       -> {len(en_proceso)} en proceso")

r = httpx.post(f"{BASE}/vehicles/", json={
    "plate": "DEF456", "brand": "Chevrolet", "customer_name": "Test",
    "assigned_employee_id": emp_luis["id"],
    "wash_type_id": wt_basic["id"]
})
check("FAIL empleado inactivo", r, 400)

r = httpx.post(f"{BASE}/vehicles/", json={
    "plate": "DEF456", "brand": "Honda", "customer_name": "Test",
    "assigned_employee_id": emp_noshift["id"],
    "wash_type_id": wt_basic["id"]
})
check("FAIL empleado sin turno hoy", r, 400)

r = httpx.post(f"{BASE}/vehicles/", json={
    "plate": "GHI789", "brand": "Kia", "customer_name": "Test",
    "assigned_employee_id": emp_carlos["id"],
    "wash_type_id": "00000000-0000-0000-0000-000000000000"
})
check("FAIL wash type ID inexistente", r, 400)

r = httpx.put(f"{BASE}/vehicles/{v1['id']}/exit")
exit1 = check("Salida ABC123 primer vehiculo", r, 200)
print(f"       -> vehicle status: {exit1['vehicle']['status']}, transaction_id: {exit1['transaction_id']}")
transaction_id = exit1["transaction_id"]

r = httpx.get(f"{BASE}/vehicles/in-progress")
en_proceso = check("En proceso tras salida (esperado: 2)", r, 200)
print(f"       -> {len(en_proceso)} en proceso")

r = httpx.put(f"{BASE}/vehicles/{v1['id']}/exit")
check("FAIL segunda salida del mismo vehiculo", r, 400)

r = httpx.put(f"{BASE}/vehicles/000000000000000000000000/exit")
check("FAIL salida con ID inexistente", r, 400)

# ════════════════════════════════════════════════════════════════
print("\n=== TRANSACTIONS ===")

r = httpx.get(f"{BASE}/transactions/")
trans = check("Listar transacciones (esperado: 1)", r, 200)
print(f"       -> {len(trans)} transacciones")
if trans:
    t = trans[0]
    print(f"       -> amount: {t['amount']}, employee_id matches: {t['employee_id'] == emp_carlos['id']}")

r = httpx.get(f"{BASE}/transactions/{transaction_id}")
t = check("Obtener transaccion por ID", r, 200)
if t:
    print(f"       -> amount: {t['amount']} (precio lavado basico: 5000.0)")
    assert t["amount"] == 5000.0, f"Monto incorrecto: {t['amount']}"
    assert t["employee_id"] == emp_carlos["id"], "employee_id no coincide"
    assert t["vehicle_id"] == v1["id"], "vehicle_id no coincide"

r = httpx.get(f"{BASE}/transactions/date/2026-04-27")
check("Transacciones de hoy", r, 200)

r = httpx.get(f"{BASE}/transactions/date/2026-04-26")
ayer = check("Transacciones de ayer (esperado: 0)", r, 200)
print(f"       -> {len(ayer)} transacciones ayer")

r = httpx.get(f"{BASE}/transactions/00000000-0000-0000-0000-000000000000")
check("FAIL transaccion ID inexistente", r, 404)

# Registrar segunda salida y verificar monto diferente
r = httpx.put(f"{BASE}/vehicles/{v3['id']}/exit")
exit3 = check("Salida XYZ999 (Lavado Profundo $12000)", r, 200)
r = httpx.get(f"{BASE}/transactions/{exit3['transaction_id']}")
t3 = check("Verificar monto transaccion Lavado Profundo", r, 200)
if t3:
    print(f"       -> amount: {t3['amount']} (precio lavado profundo: 12000.0)")
    assert t3["amount"] == 12000.0, f"Monto incorrecto: {t3['amount']}"

r = httpx.get(f"{BASE}/transactions/")
trans = check("Total transacciones (esperado: 2)", r, 200)
print(f"       -> {len(trans)} transacciones")

# ════════════════════════════════════════════════════════════════
print("\n=== HEALTH CHECK ===")
r = httpx.get("http://localhost:8000/health")
check("Health check", r, 200)

# ════════════════════════════════════════════════════════════════
print(f"\n{'='*50}")
print(f"RESULTADO: {results['passed']} pasaron | {results['failed']} fallaron")
print('='*50)
