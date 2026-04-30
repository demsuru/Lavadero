const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let testsPassed = 0;
  let testsFailed = 0;
  let errors = [];

  page.on('response', response => {
    if (!response.ok() && response.status() !== 304) {
      if (!response.url().includes('assets') && !response.url().includes('bundle')) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    }
  });

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      testsPassed++;
    } catch (e) {
      console.log(`✗ ${name}: ${e.message}`);
      testsFailed++;
    }
  }

  try {
    // Test 1: Login
    await test('Login with admin credentials', async () => {
      await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
      await page.fill('input[type="email"]', 'admin@lavadero.com');
      await page.fill('input[type="password"]', 'test123');
      await page.locator('button[type="submit"]').click();
      await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
      const token = await page.evaluate(() => localStorage.getItem('lavadero_token'));
      if (!token) throw new Error('Token not stored');
    });

    // Test 2: Dashboard loads with correct heading
    await test('Dashboard loads with correct heading', async () => {
      const heading = await page.locator('text=Buenas').first();
      if (!await heading.isVisible()) throw new Error('Dashboard greeting not found');
    });

    // Test 3: Navigate to Vehicles
    await test('Navigate to Vehicles page', async () => {
      await page.click('text=Vehículos');
      await page.waitForURL(/vehicles/, { timeout: 5000 });
    });

    // Test 4: Navigate to Employees
    await test('Navigate to Employees page', async () => {
      await page.click('text=Empleados');
      await page.waitForURL(/employees/, { timeout: 5000 });
    });

    // Test 5: Navigate to Shifts
    await test('Navigate to Shifts page', async () => {
      await page.click('text=Turnos');
      await page.waitForURL(/shifts/, { timeout: 5000 });
    });

    // Test 6: Navigate to Wash Types
    await test('Navigate to Wash Types page', async () => {
      await page.click('text=Tipos de Lavado');
      await page.waitForURL(/wash-types/, { timeout: 5000 });
    });

    // Test 7: Navigate to Reports
    await test('Navigate to Reports page', async () => {
      await page.click('text=Reportes');
      await page.waitForURL(/reports/, { timeout: 5000 });
    });

    // Test 8: Navigate back to Dashboard
    await test('Navigate back to Dashboard', async () => {
      await page.click('text=Dashboard');
      await page.waitForURL(/\/$/, { timeout: 5000 });
    });

    // Test 9: Logout
    await test('Logout and clear token', async () => {
      await page.click('text=Cerrar sesión');
      await page.waitForURL(/login/, { timeout: 5000 });
      const token = await page.evaluate(() => localStorage.getItem('lavadero_token'));
      if (token) throw new Error('Token not cleared after logout');
    });

    // Test 10: Protected route redirects to login
    await test('Protected route redirects to login when not authenticated', async () => {
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
      if (!page.url().includes('login')) throw new Error('Not redirected to login');
    });

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`Tests Passed: ${testsPassed}`);
    console.log(`Tests Failed: ${testsFailed}`);
    if (errors.length > 0) {
      console.log(`\nAPI Errors:`);
      errors.forEach(err => console.log(`  - ${err}`));
    }
    console.log('='.repeat(50));
  } catch (e) {
    console.error(`Fatal error: ${e.message}`);
  } finally {
    await browser.close();
  }
})();
