#!/usr/bin/env node
/**
 * Test the dashboard endpoint
 * Verifies: completed_count and revenue_today
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
  console.log('🧪 Testing Dashboard Endpoint\n')

  try {
    // 1. LOGIN
    console.log('1️⃣  LOGIN...')
    const loginRes = await request('POST', '/auth/login', {
      email: 'admin@lavadero.com',
      password: 'admin123',
    })
    globalThis.token = loginRes.access_token
    const adminId = loginRes.user.id
    console.log(`✅ Logged in\n`)

    // 2. CREATE SHIFT IF NEEDED
    console.log('2️⃣  Ensuring admin has shift for today...')
    try {
      await request('POST', '/shifts', {
        employee_id: adminId,
        day_of_week: getDayOfWeek(),
        start_time: '09:00',
        end_time: '17:00',
      })
      console.log(`✅ Shift created for today\n`)
    } catch (err) {
      if (err.message.includes('overlaps')) {
        console.log(`✅ Shift already exists for today\n`)
      } else {
        throw err
      }
    }

    // 3. GET CURRENT DASHBOARD STATS (BEFORE)
    console.log('3️⃣  Getting dashboard stats BEFORE creating vehicle...')
    const statsBefore = await request('GET', '/dashboard/today')
    console.log(`✅ Stats BEFORE:`)
    console.log(`   Completed: ${statsBefore.completed_count}`)
    console.log(`   Revenue: $${statsBefore.revenue_today}\n`)

    // 4. CREATE A VEHICLE
    console.log('4️⃣  Creating a vehicle...')
    const washTypes = await request('GET', '/wash-types')
    const activeWash = washTypes.find(w => w.status === 'active')

    const vehicle = await request('POST', '/vehicles', {
      plate: 'DASHBOARD-TEST',
      brand: 'TestBrand',
      customer_name: 'Dashboard Test',
      assigned_employee_id: adminId,
      wash_type_id: activeWash.id,
    })
    console.log(`✅ Vehicle created: ${vehicle.plate}\n`)

    // 5. REGISTER EXIT (create transaction)
    console.log('5️⃣  Registering vehicle exit...')
    const exitRes = await request('PUT', `/vehicles/${vehicle.id}/exit`, {})
    console.log(`✅ Vehicle exited, transaction ID: ${exitRes.transaction_id.slice(0, 8)}...\n`)

    // 6. GET DASHBOARD STATS AFTER
    console.log('6️⃣  Getting dashboard stats AFTER vehicle exit...')
    const statsAfter = await request('GET', '/dashboard/today')
    console.log(`✅ Stats AFTER:`)
    console.log(`   Completed: ${statsAfter.completed_count}`)
    console.log(`   Revenue: $${statsAfter.revenue_today}\n`)

    // 7. VERIFY CHANGES
    console.log('7️⃣  Verification:')
    const completedIncremented = statsAfter.completed_count > statsBefore.completed_count
    const revenueIncremented = statsAfter.revenue_today > statsBefore.revenue_today

    console.log(`   Completed count incremented: ${completedIncremented ? '✅ YES' : '❌ NO'}`)
    console.log(`   Revenue increased: ${revenueIncremented ? '✅ YES' : '❌ NO'}`)

    if (completedIncremented && revenueIncremented) {
      console.log('\n' + '='.repeat(60))
      console.log('✅ DASHBOARD TEST PASSED!')
      console.log('='.repeat(60))
      console.log(`\nCompleted vehicles: ${statsBefore.completed_count} → ${statsAfter.completed_count}`)
      console.log(`Revenue today: $${statsBefore.revenue_today} → $${statsAfter.revenue_today}`)
    } else {
      throw new Error('Dashboard stats did not update correctly')
    }

  } catch (err) {
    console.error(`\n❌ Test failed:`)
    console.error(`   ${err.message}\n`)
    process.exit(1)
  }
}

main()
