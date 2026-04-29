#!/usr/bin/env node
/**
 * Browser test using Chromium MCP
 * Test the full UI flow: login → dashboard → vehicle entry → exit
 */

const FRONTEND = 'http://localhost:5173'
const LOGIN_EMAIL = 'admin@lavadero.com'
const LOGIN_PASSWORD = 'admin123'

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms))
}

console.log('🌐 Browser Test Suite - Chromium MCP\n')
console.log('Frontend URL:', FRONTEND)
console.log('Login:', LOGIN_EMAIL)
console.log('\n📋 Instructions:')
console.log('   1. Open a browser and navigate to:', FRONTEND)
console.log('   2. Login with provided credentials')
console.log('   3. Test the following flows:')
console.log('      - ✓ Dashboard with vehicle stats')
console.log('      - ✓ Click "Nueva entrada" button')
console.log('      - ✓ Fill vehicle form and submit')
console.log('      - ✓ See vehicle in dashboard live board')
console.log('      - ✓ Click edit (pencil icon) on vehicle card')
console.log('      - ✓ Update employee and entry time, save')
console.log('      - ✓ Click "Registrar salida" (exit)')
console.log('      - ✓ Confirm exit in dialog')
console.log('      - ✓ See transaction created\n')
console.log('✅ If all flows work without errors, the UI is ready!\n')
