# Frontend Testing Guide

## Quick Start

### 1. Dev Server (Already Running)
The frontend dev server is running on **http://localhost:5174**

### 2. Backend API (Already Running)
The API is available at **http://localhost:8000/api/v1/**

## Testing Commands

### Automated Tests (Playwright)
```bash
# Run all tests (headless mode)
npm test

# Run tests with UI (interactive dashboard)
npm run test:ui

# Run tests with browser visible
npm run test:headed

# Debug mode (step through tests)
npm run test:debug
```

### Manual Testing
Open your browser and navigate to:
- **http://localhost:5174** - Main app
- **http://localhost:8000/api/v1/employees** - Backend API endpoint

## Test Structure

Tests are located in `tests/` directory:
- **smoke.spec.ts** - Basic functionality tests (page loads, API connection)

### Running Specific Tests
```bash
# Run a specific file
npx playwright test tests/smoke.spec.ts

# Run a specific test by name
npx playwright test -g "app loads successfully"

# Run with specific browser
npx playwright test --project=chromium
```

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Screenshots and traces are saved in `test-results/` for failed tests.

## Development Workflow

### While Developing:
1. Keep the dev server running (`npm run dev`)
2. Make code changes - they auto-reload at http://localhost:5174
3. Test manually first
4. Run `npm test` before committing

### Adding New Tests:
1. Create a new file in `tests/` (e.g., `tests/dashboard.spec.ts`)
2. Write tests following the pattern in `smoke.spec.ts`
3. Run `npm run test:ui` to debug

## Test Patterns

### Basic Test Template
```typescript
import { test, expect } from '@playwright/test';

test('should perform action', async ({ page }) => {
  await page.goto('/');
  
  const button = page.locator('button:has-text("Click me")');
  await button.click();
  
  const result = page.locator('.result');
  await expect(result).toBeVisible();
});
```

### Checking API Response
```typescript
test('should fetch data from API', async ({ context }) => {
  const response = await context.request.get('http://localhost:8000/api/v1/employees');
  expect(response.status()).toBe(200);
  
  const body = await response.json();
  expect(body).toBeDefined();
});
```

## Debugging Tips

1. **Add screenshots**: Auto-captured on failure in `test-results/`
2. **Use UI mode**: `npm run test:ui` - step through tests
3. **Debug mode**: `npm run test:debug` - open debugger
4. **Console logs**: Use `console.log()` in tests to debug

## CI/CD Integration

For GitHub Actions, tests run automatically. See `.github/workflows/` for configuration.

## Troubleshooting

### Port 5174 already in use
```bash
lsof -i :5174  # Find process
kill -9 <PID>   # Kill it
npm run dev     # Restart
```

### API connection issues
- Verify backend is running: `curl http://localhost:8000/api/v1/employees`
- Check `.env` if API URL is configured

### Test timeouts
- Increase timeout in `playwright.config.ts`
- Check if components are loading correctly (network tab)
