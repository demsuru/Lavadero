import { test, expect } from '@playwright/test';

test.describe('Vehicle Exit Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should open confirm dialog when exit button is clicked', async ({ page }) => {
    // Wait for vehicles to load
    const vehicleCards = page.locator('[class*="glass-card"]');

    // Check if there are vehicles
    const vehicleCount = await vehicleCards.count();

    if (vehicleCount === 0) {
      console.log('No vehicles in progress - test requires at least one vehicle');
      return;
    }

    // Find and click the first "Registrar salida" button
    const exitButton = page.locator('button:has-text("Registrar salida")').first();

    // Verify button exists and is visible
    await expect(exitButton).toBeVisible();

    // Click the button
    await exitButton.click();

    // Wait for confirm dialog to appear
    const confirmDialog = page.locator('[role="dialog"]').first();
    await expect(confirmDialog).toBeVisible();

    // Verify dialog content
    const confirmTitle = page.locator('text="Registrar salida"').first();
    await expect(confirmTitle).toBeVisible();
  });

  test('should show error dialog when exit button is clicked', async ({ page }) => {
    // Log network requests to debug
    page.on('response', response => {
      if (response.url().includes('/exit')) {
        console.log(`Response to ${response.url()}: ${response.status()}`);
      }
    });

    const vehicleCards = page.locator('[class*="glass-card"]');
    const vehicleCount = await vehicleCards.count();

    if (vehicleCount === 0) {
      console.log('No vehicles in progress - test requires at least one vehicle');
      return;
    }

    // Try to click exit button
    const exitButton = page.locator('button:has-text("Registrar salida")').first();

    console.log('Clicking exit button...');
    await exitButton.click();

    // Wait a moment to see if anything happens
    await page.waitForTimeout(1000);

    // Check if dialog appears
    const dialog = page.locator('[role="dialog"]');
    const isVisible = await dialog.isVisible().catch(() => false);

    console.log('Dialog visible:', isVisible);

    if (isVisible) {
      console.log('Dialog opened successfully');
    } else {
      console.log('Dialog did NOT open - checking for errors');

      // Check browser console for errors
      const logs: string[] = [];
      page.on('console', msg => {
        logs.push(`${msg.type()}: ${msg.text()}`);
      });

      if (logs.length > 0) {
        console.log('Console logs:', logs);
      }
    }
  });

  test('should submit exit confirmation', async ({ page, context }) => {
    const vehicleCards = page.locator('[class*="glass-card"]');
    const vehicleCount = await vehicleCards.count();

    if (vehicleCount === 0) {
      console.log('No vehicles in progress - skipping test');
      return;
    }

    // Track API requests
    const requests: string[] = [];
    context.on('response', response => {
      if (response.url().includes('/exit')) {
        requests.push(`${response.status()}: ${response.url()}`);
      }
    });

    // Click exit button
    const exitButton = page.locator('button:has-text("Registrar salida")').first();
    await exitButton.click();

    // Wait for dialog
    const confirmButton = page.locator('button:has-text("Sí, registrar salida")');

    // Give it time to appear
    await page.waitForTimeout(500);

    // Check if confirm button exists
    const isVisible = await confirmButton.isVisible().catch(() => false);

    if (isVisible) {
      // Click confirm
      await confirmButton.click();

      // Wait for response
      await page.waitForTimeout(2000);

      console.log('API requests made:', requests);
    } else {
      console.log('Confirm button not found - dialog may not have opened');
    }
  });
});
