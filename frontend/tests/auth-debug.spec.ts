import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8000/api/v1';
const APP_URL = 'http://localhost:5174';

test.describe('Auth Debug - Vehicle Exit Flow', () => {
  test('complete auth and exit flow', async ({ page, context }) => {
    // Set up logging
    page.on('console', msg => {
      console.log(`[Page Console] ${msg.type()}: ${msg.text()}`);
    });

    // Log all network requests
    context.on('response', async (response) => {
      const url = response.url();
      const status = response.status();

      if (url.includes('/api/v1/')) {
        console.log(`[API] ${status} ${url.split('/api/v1/')[1]}`);
      }
    });

    // Step 1: Do login via API
    console.log('\n=== STEP 1: Login ===');
    const loginResponse = await context.request.post(`${API_URL}/auth/login`, {
      data: { email: 'test@lavadero.com', password: 'password123' },
    });

    const tokenData = await loginResponse.json();
    const token = tokenData.access_token;

    console.log(`Login status: ${loginResponse.status()}`);
    console.log(`Token: ${token.substring(0, 20)}...`);

    // Step 2: Navigate to app
    console.log('\n=== STEP 2: Navigate to App ===');
    await page.goto(APP_URL);

    // Step 3: Store token before page loads fully
    console.log('\n=== STEP 3: Store Token ===');
    await page.evaluate((t) => {
      console.log('Setting token in localStorage');
      localStorage.setItem('lavadero_token', t);
    }, token);

    // Step 4: Wait for page content
    console.log('\n=== STEP 4: Wait for page load ===');
    await page.waitForLoadState('networkidle');

    // Step 5: Check what's displayed
    console.log('\n=== STEP 5: Check Page State ===');
    const loginButton = page.locator('button:has-text("Iniciar sesión")');
    const loginVisible = await loginButton.isVisible().catch(() => false);

    const vehicleCards = page.locator('[class*="glass-card"]');
    const cardCount = await vehicleCards.count();

    console.log(`Login button visible: ${loginVisible}`);
    console.log(`Vehicle cards found: ${cardCount}`);

    if (loginVisible) {
      console.log('ERROR: Still on login page after setting token!');

      // Test the token directly
      console.log('\n=== STEP 6: Test token directly ===');
      const meResponse = await context.request.get(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log(`/auth/me response: ${meResponse.status()}`);
      if (meResponse.ok()) {
        const userData = await meResponse.json();
        console.log(`User data: ${JSON.stringify(userData)}`);
      } else {
        const error = await meResponse.text();
        console.log(`Error: ${error}`);
      }

      // Check if frontend is making the /auth/me call
      console.log('\n=== STEP 7: Reload page and monitor /auth/me ===');

      let authMeCalled = false;
      context.on('response', (response) => {
        if (response.url().includes('/auth/me')) {
          authMeCalled = true;
          console.log(`[Important] /auth/me called with status ${response.status()}`);
        }
      });

      await page.reload();
      await page.waitForTimeout(2000);

      console.log(`/auth/me was called: ${authMeCalled}`);

      if (!authMeCalled) {
        console.log('WARNING: AuthContext is not calling /auth/me');
      }
    } else {
      console.log('SUCCESS: Navigated past login screen');

      // Try to find and click exit button
      console.log('\n=== STEP 6: Look for exit button ===');
      const exitButtons = page.locator('button:has-text("Registrar salida")');
      const exitCount = await exitButtons.count();

      console.log(`Exit buttons found: ${exitCount}`);

      if (exitCount > 0) {
        console.log('SUCCESS: Found exit button!');

        // Click it
        const btn = exitButtons.first();
        await btn.click();

        // Wait for dialog
        await page.waitForTimeout(800);

        const dialogs = page.locator('[role="dialog"]');
        const dialogCount = await dialogs.count();

        console.log(`Dialogs after click: ${dialogCount}`);

        if (dialogCount > 0) {
          console.log('SUCCESS: Dialog opened!');
        } else {
          console.log('ERROR: Dialog did not open');
        }
      }
    }
  });
});
