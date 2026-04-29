#!/usr/bin/env node
/**
 * Complete test suite with shift creation
 */

const API_URL = 'http://localhost:8000/api/v1'

async function request(method, path, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${globalThis.token || ''}`,
    },
  }
  if (body) options.body = JSON.stringify(body)

  const response = await fetch(`${API_URL}${path}`, options)
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(`${method} ${path}: ${response.status} - ${JSON.stringify(data)}`)
  }
  return data
}

function getDayOfWeek() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
}

async function main() {
  console.log('🚀 Car Wash Management System - Complete Test Suite\n')

  try {
    // 1. LOGIN
    console.log('1️⃣  Testing LOGIN...')
    const loginRes = await request('POST', '/auth/login', {
      email: 'admin@lavadero.com',
      password: 'admin123',
    })
    globalThis.token = loginRes.access_token
    const adminId = loginRes.user.id
    console.log(`✅ Login successful`)
    console.log(`   User: ${loginRes.user.name} (${loginRes.user.role})`)

    // 2. CREATE SHIFT FOR TODAY
    console.log(`\n2️⃣  Creating shift for today (${getDayOfWeek()})...`)
    const todayShift = await request('POST', '/shifts', {
      employee_id: adminId,
      day_of_week: getDayOfWeek(),
      start_time: '09:00',
      end_time: '17:00',
    })
    console.log(`✅ Shift created for ${loginRes.user.name}`)
    console.log(`   Day: ${todayShift.day_of_week}`)
    console.log(`   Hours: ${todayShift.start_time} - ${todayShift.end_time}`)

    // 3. GET WASH TYPES
    console.log('\n3️⃣  Fetching wash types...')
    const washTypes = await request('GET', '/wash-types')
    const activeWash = washTypes.filter(w => w.status === 'active')
    console.log(`✅ Found ${activeWash.length} active wash types`)
    console.log(`   First: ${activeWash[0].name} - $${activeWash[0].price}`)

    // 4. REGISTER VEHICLE ENTRY
    console.log('\n4️⃣  Testing VEHICLE ENTRY...')
    const vehicle1 = await request('POST', '/vehicles', {
      plate: 'ABC123',
      brand: 'Toyota',
      customer_name: 'Juan Pérez',
      customer_phone: '+54 9 11 1234-5678',
      assigned_employee_id: adminId,
      wash_type_id: activeWash[0].id,
      notes: 'Test vehicle 1',
    })
    console.log(`✅ Vehicle created: ${vehicle1.plate}`)
    console.log(`   Status: ${vehicle1.status}`)

    // 5. GET IN-PROGRESS VEHICLES
    console.log('\n5️⃣  Fetching in-progress vehicles...')
    const inProgress = await request('GET', '/vehicles/in-progress')
    console.log(`✅ Found ${inProgress.length} vehicles in progress`)

    // 6. UPDATE VEHICLE (edit modal test)
    console.log('\n6️⃣  Testing VEHICLE UPDATE (edit modal)...')
    const updated = await request('PUT', `/vehicles/${vehicle1.id}`, {
      assigned_employee_id: adminId,
      entry_timestamp: new Date().toISOString(),
    })
    console.log(`✅ Vehicle updated successfully`)
    console.log(`   Updated at: ${new Date(updated.entry_timestamp).toLocaleString()}`)

    // 7. REGISTER EXIT & AUTO TRANSACTION
    console.log('\n7️⃣  Testing VEHICLE EXIT (auto transaction)...')
    const exitRes = await request('PUT', `/vehicles/${vehicle1.id}/exit`, {})
    console.log(`✅ Vehicle exited: ${exitRes.vehicle.plate}`)
    console.log(`   Status: ${exitRes.vehicle.status}`)
    console.log(`   Transaction ID: ${exitRes.transaction_id}`)

    // 8. FETCH TRANSACTION
    console.log('\n8️⃣  Fetching created transaction...')
    const transaction = await request('GET', `/transactions/${exitRes.transaction_id}`)
    console.log(`✅ Transaction retrieved`)
    console.log(`   Amount: $${transaction.amount}`)
    console.log(`   Wash type: ${activeWash[0].name}`)

    // 9. CREATE ANOTHER VEHICLE (for dashboard)
    console.log('\n9️⃣  Creating another vehicle for dashboard test...')
    const vehicle2 = await request('POST', '/vehicles', {
      plate: 'XYZ789',
      brand: 'Ford',
      customer_name: 'María González',
      customer_phone: '+54 9 11 9876-5432',
      assigned_employee_id: adminId,
      wash_type_id: activeWash[0].id,
      notes: 'Dashboard test vehicle',
    })
    console.log(`✅ Vehicle created: ${vehicle2.plate}`)

    // 10. FINAL DASHBOARD STATE
    console.log('\n🔟 Final dashboard state...')
    const finalVehicles = await request('GET', '/vehicles/in-progress')
    const finalTransactions = await request('GET', '/transactions')
    console.log(`✅ ${finalVehicles.length} vehicle(s) in progress`)
    console.log(`✅ ${finalTransactions.length} total transaction(s)`)

    console.log('\n' + '='.repeat(60))
    console.log('✅ ALL TESTS PASSED!')
    console.log('='.repeat(60))
    console.log('\n✨ Test Coverage:')
    console.log('   ✓ Authentication & JWT')
    console.log('   ✓ Shift creation (required for vehicle assignment)')
    console.log('   ✓ Vehicle entry registration')
    console.log('   ✓ Vehicle list/in-progress fetching')
    console.log('   ✓ Vehicle update (edit modal)')
    console.log('   ✓ Vehicle exit & automatic transaction creation')
    console.log('   ✓ Transaction retrieval')
    console.log('\n🌐 Frontend Ready: http://localhost:5173')
    console.log('🔑 Admin Login: admin@lavadero.com / admin123\n')

  } catch (err) {
    console.error(`\n❌ Test failed:`)
    console.error(`   ${err.message}\n`)
    process.exit(1)
  }
}

main()
