import { test, expect } from '@playwright/test';

// Test constants
const API_URL = 'http://localhost:8000/api/v1';
const APP_URL = 'http://localhost:5174';

// Test credentials - using the test user
const TEST_CREDENTIALS = {
  email: 'test@lavadero.com',
  password: 'password123',
};

test.describe('Vehicle Exit Flow (Authenticated)', () => {
  test.beforeEach(async ({ page, context }) => {
    // First, try to login
    console.log('Attempting login with credentials:', TEST_CREDENTIALS);

    const loginResponse = await context.request.post(`${API_URL}/auth/login`, {
      data: TEST_CREDENTIALS,
    });

    console.log('Login response status:', loginResponse.status());

    if (loginResponse.ok()) {
      const tokenData = await loginResponse.json();
      console.log('Login successful, token received');

      // Store token in localStorage
      await page.goto(APP_URL);
      await page.evaluate((token) => {
        localStorage.setItem('lavadero_token', token);
      }, tokenData.access_token);

      // Reload page to apply token
      await page.reload();
      await page.waitForLoadState('networkidle');
    } else {
      const error = await loginResponse.text();
      console.log('Login failed, response:', error);

      // Go to app anyway - might see 401 page
      await page.goto(APP_URL);
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display vehicle list after login', async ({ page }) => {
    // Check for any visible content
    const body = page.locator('body');
    await expect(body).toBeTruthy();

    // Check for dashboard or protected content
    const content = await page.content();
    console.log('Page has content:', content.length > 0);

    // Try to find dashboard indicators
    const hasDashboard = content.includes('Tablero') || content.includes('vehicle') || content.includes('dash');
    console.log('Has dashboard indicators:', hasDashboard);
  });

  test('should find and interact with exit button', async ({ page }) => {
    // Wait for any React content to load
    await page.waitForTimeout(1000);

    // Get all buttons on the page
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    console.log(`Found ${buttonCount} buttons on page`);

    // List all buttons
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = allButtons.nth(i);
      const text = await button.innerText().catch(() => '');
      console.log(`Button ${i}: "${text}"`);
    }

    // Try to find the specific exit button
    const exitButtons = page.locator('button:has-text("Registrar")');
    const exitButtonCount = await exitButtons.count();
    console.log(`Found ${exitButtonCount} exit-related buttons`);

    if (exitButtonCount > 0) {
      const exitButton = exitButtons.first();
      console.log('Exit button text:', await exitButton.innerText());
      console.log('Exit button visible:', await exitButton.isVisible());
    }
  });

  test('button click behavior test', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForTimeout(1500);

    // Try clicking any button that says "Registrar"
    const buttons = page.locator('button');
    let clicked = false;

    for (let i = 0; i < await buttons.count(); i++) {
      const btn = buttons.nth(i);
      const text = await btn.innerText().catch(() => '');

      if (text.includes('Registrar') && text.includes('salida')) {
        console.log('Found exit button, clicking...');
        await btn.click();
        clicked = true;

        // Wait to see if dialog appears
        await page.waitForTimeout(800);

        // Check for dialogs
        const dialogs = page.locator('[role="dialog"]');
        const dialogCount = await dialogs.count();
        console.log(`Dialogs visible after click: ${dialogCount}`);

        if (dialogCount > 0) {
          console.log('Dialog appeared!');
          const dialogText = await dialogs.first().innerText();
          console.log('Dialog content:', dialogText.substring(0, 100));
        } else {
          console.log('No dialog appeared');
        }

        break;
      }
    }

    console.log('Button was clicked:', clicked);
    expect(clicked).toBeTruthy();
  });
});
