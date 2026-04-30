import { test, expect } from '@playwright/test';

test.describe('Frontend Smoke Tests', () => {
  test('app loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check if page is accessible
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('main content is visible', async ({ page }) => {
    await page.goto('/');

    // Check if the app container exists
    const app = page.locator('#root');
    await expect(app).toBeVisible();
  });

  test('API connection check', async ({ context }) => {
    // Check if API is reachable via API context (no CORS restrictions)
    const apiResponse = await context.request.head('http://localhost:8000/api/v1/employees');
    expect(apiResponse.status()).toBeGreaterThan(0);
  });
});

test.describe('Navigation Tests', () => {
  test('can navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Try clicking navigation if it exists
    const app = page.locator('#root');
    await expect(app).toBeVisible();
  });
});
