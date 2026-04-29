import { chromium } from 'playwright';

const APP_URL = 'http://localhost:5174';

async function testWithErrorCapture() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log(`[ERROR] ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });

  console.log('🧪 Testing Vehicle Entry with Error Capture\n');

  try {
    // Setup
    await page.goto(APP_URL);
    await page.reload();
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@lavadero.com');
      await page.locator('input[type="password"]').fill('password123');
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(2000);
    }

    // Go to Vehicles
    await page.locator('text=Vehículos').first().click();
    await page.waitForTimeout(1500);

    console.log('1️⃣  Opening form...\n');

    // Open form
    const newEntryBtn = page.locator('button').filter({ hasText: /Nueva entrada/ }).first();
    if (await newEntryBtn.isVisible()) {
      await newEntryBtn.click();
      await page.waitForTimeout(800);

      // Fill
      console.log('2️⃣  Filling form...');
      await page.locator('input[placeholder="ABC123"]').fill('ENTRY999');
      await page.locator('input[placeholder="Toyota"]').fill('TestBrand');
      await page.locator('input[placeholder="Juan Pérez"]').fill('TestCustomer');

      const empSelect = page.locator('select').first();
      const washSelect = page.locator('select').nth(1);

      await empSelect.selectOption({ index: 1 });
      await washSelect.selectOption({ index: 1 });

      console.log('   ✓ Form filled\n');

      // Submit
      console.log('3️⃣  Submitting form...\n');

      await page.evaluate(() => {
        const allBtns = document.querySelectorAll('button');
        const submitBtn = Array.from(allBtns).find(btn =>
          btn.textContent?.includes('Registrar entrada')
        );
        if (submitBtn) submitBtn.click();
      });

      // Wait and monitor
      await page.waitForTimeout(3000);

      console.log('\n4️⃣  Checking results:\n');

      if (errors.length > 0) {
        console.log('❌ ERRORS FOUND:');
        errors.forEach((err, i) => {
          console.log(`  ${i + 1}. ${err}`);
        });
      } else {
        console.log('✓ No errors in console');
      }

      // Check drawer state
      const drawerOpen = await page.locator('button').filter({ hasText: /Cancelar/ }).isVisible().catch(() => false);
      console.log(`   Drawer open: ${drawerOpen}`);

      // Try to see what the issue is
      if (drawerOpen) {
        const formState = await page.evaluate(() => {
          const inputs = document.querySelectorAll('input');
          const selects = document.querySelectorAll('select');
          return {
            inputCount: inputs.length,
            selectCount: selects.length,
            formHTML: document.querySelector('form')?.innerHTML?.substring(0, 100) || 'no form',
          };
        });
        console.log(`   Form still exists: ${formState.inputCount > 0}`);
      }

      // Check vehicle count
      const vehicleCount = await page.locator('[class*="glass-card"]').count();
      console.log(`   Vehicles visible: ${vehicleCount}`);

      if (errors.length === 0 && vehicleCount === 0 && drawerOpen) {
        console.log('\n❌ Issue: Form submitted but no errors shown and vehicle not created');
        console.log('   Possible causes:');
        console.log('   1. API call is hanging');
        console.log('   2. API call succeeded but list not refreshing');
        console.log('   3. Form state is stuck');
      }
    }

    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testWithErrorCapture();
