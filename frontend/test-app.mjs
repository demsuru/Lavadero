#!/usr/bin/env node
/**
 * Automated test script for the Car Wash Management System
 * Tests: Login → Dashboard → Vehicle Entry → Vehicle Exit
 */

const API_URL = 'http://localhost:8000/api/v1'
const FRONTEND_URL = 'http://localhost:5173'

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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

async function main() {
  console.log('🚀 Car Wash Management System - Test Suite\n')

  try {
    // 1. LOGIN
    console.log('1️⃣  Testing LOGIN...')
    const loginRes = await request('POST', '/auth/login', {
      email: 'admin@lavadero.com',
      password: 'admin123',
    })
    globalThis.token = loginRes.access_token
    console.log(`✅ Login successful. Token: ${globalThis.token.slice(0, 20)}...`)
    console.log(`   User: ${loginRes.user.name} (${loginRes.user.role})`)

    // 2. GET AVAILABLE EMPLOYEES
    console.log('\n2️⃣  Fetching available employees...')
    const employees = await request('GET', '/employees')
    const activeEmps = employees.filter(e => e.status === 'active')
    console.log(`✅ Found ${employees.length} employees (${activeEmps.length} active)`)
    if (activeEmps.length === 0) {
      console.log('⚠️  Warning: No active employees. Cannot test vehicle entry.')
    } else {
      console.log(`   First active: ${activeEmps[0].name}`)
    }

    // 3. GET WASH TYPES
    console.log('\n3️⃣  Fetching wash types...')
    const washTypes = await request('GET', '/wash-types')
    const activeWash = washTypes.filter(w => w.status === 'active')
    console.log(`✅ Found ${washTypes.length} wash types (${activeWash.length} active)`)
    if (activeWash.length === 0) {
      console.log('⚠️  Warning: No active wash types. Cannot test vehicle entry.')
    } else {
      console.log(`   First active: ${activeWash[0].name} - $${activeWash[0].price}`)
    }

    // 4. CREATE VEHICLE (if we have employees and wash types)
    let vehicleId = null
    if (activeEmps.length > 0 && activeWash.length > 0) {
      console.log('\n4️⃣  Testing VEHICLE ENTRY (register entry)...')
      const vehicle = await request('POST', '/vehicles', {
        plate: 'TEST001',
        brand: 'Toyota',
        customer_name: 'Test Customer',
        customer_phone: '+54 9 11 1234-5678',
        assigned_employee_id: activeEmps[0].id,
        wash_type_id: activeWash[0].id,
        notes: 'Test vehicle entry',
      })
      vehicleId = vehicle.id
      console.log(`✅ Vehicle created: ${vehicle.plate}`)
      console.log(`   ID: ${vehicleId}`)
      console.log(`   Status: ${vehicle.status}`)
      console.log(`   Assigned to: ${activeEmps[0].name}`)

      // 5. GET IN-PROGRESS VEHICLES
      console.log('\n5️⃣  Fetching in-progress vehicles...')
      const inProgress = await request('GET', '/vehicles/in-progress')
      console.log(`✅ Found ${inProgress.length} in-progress vehicles`)
      const found = inProgress.find(v => v.id === vehicleId)
      if (found) {
        console.log(`   ✅ Our test vehicle is listed`)
      }

      // 6. REGISTER EXIT (and create transaction)
      console.log('\n6️⃣  Testing VEHICLE EXIT (register exit + auto transaction)...')
      await sleep(1000) // Small delay
      const exitRes = await request('PUT', `/vehicles/${vehicleId}/exit`, {})
      console.log(`✅ Vehicle exited: ${exitRes.vehicle.plate}`)
      console.log(`   Status: ${exitRes.vehicle.status}`)
      console.log(`   Transaction ID: ${exitRes.transaction_id}`)

      // 7. GET TRANSACTION
      console.log('\n7️⃣  Fetching transaction...')
      const transaction = await request('GET', `/transactions/${exitRes.transaction_id}`)
      console.log(`✅ Transaction retrieved`)
      console.log(`   Amount: $${transaction.amount}`)
      console.log(`   Employee: ${transaction.employee_id}`)
    } else {
      console.log('\n⚠️  Skipping vehicle tests (missing employees or wash types)')
    }

    // 8. GET DASHBOARD STATS
    console.log('\n8️⃣  Checking dashboard data...')
    const stats = await request('GET', '/vehicles/in-progress')
    console.log(`✅ Dashboard will show ${stats.length} vehicles in progress`)

    console.log('\n✅ All tests passed!\n')
    console.log('📋 Summary:')
    console.log(`   ✓ Authentication (JWT)`)
    console.log(`   ✓ Employee fetching`)
    console.log(`   ✓ Wash type fetching`)
    if (vehicleId) {
      console.log(`   ✓ Vehicle entry creation`)
      console.log(`   ✓ Vehicle exit + auto transaction`)
      console.log(`   ✓ Transaction retrieval`)
    }
    console.log(`\n🌐 Frontend is running at: ${FRONTEND_URL}`)
    console.log(`🔐 Login with: admin@lavadero.com / admin123\n`)

  } catch (err) {
    console.error(`\n❌ Test failed:`)
    console.error(`   ${err.message}\n`)
    process.exit(1)
  }
}

main()
