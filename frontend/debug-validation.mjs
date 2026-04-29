import { chromium } from 'playwright';

const APP_URL = 'http://localhost:5174';

async function debugValidation() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Checking Form Validation\n');

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

    // Open form
    const newEntryBtn = page.locator('button').filter({ hasText: /Nueva entrada/ }).first();
    if (await newEntryBtn.isVisible()) {
      await newEntryBtn.click();
      await page.waitForTimeout(800);

      // Fill with exact values
      const plate = 'TEST123';
      const brand = 'Toyota';
      const customer = 'John Doe';

      console.log('1️⃣  Filling form with:');
      console.log(`   Plate: "${plate}"`);
      console.log(`   Brand: "${brand}"`);
      console.log(`   Customer: "${customer}"\n`);

      await page.locator('input[placeholder="ABC123"]').fill(plate);
      await page.locator('input[placeholder="Toyota"]').fill(brand);
      await page.locator('input[placeholder="Juan Pérez"]').fill(customer);

      // Check selects
      const empSelect = page.locator('select').first();
      const washSelect = page.locator('select').nth(1);

      const empValue = await empSelect.inputValue();
      const washValue = await washSelect.inputValue();

      console.log('2️⃣  Checking select values:\n');
      console.log(`   Employee value: "${empValue}" ${empValue ? '✓' : '❌'}`);
      console.log(`   Wash type value: "${washValue}" ${washValue ? '✓' : '❌'}\n`);

      if (!empValue) {
        console.log('   ⚠️  Employee not selected, selecting now...');
        await empSelect.selectOption({ index: 1 });
        const newEmpValue = await empSelect.inputValue();
        console.log(`   New employee value: "${newEmpValue}"\n`);
      }

      if (!washValue) {
        console.log('   ⚠️  Wash type not selected, selecting now...');
        await washSelect.selectOption({ index: 1 });
        const newWashValue = await washSelect.inputValue();
        console.log(`   New wash type value: "${newWashValue}"\n`);
      }

      // Now check what would be validated
      console.log('3️⃣  Validation check (what the form validates):\n');

      const validation = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input');
        const selects = document.querySelectorAll('select');

        const plate = inputs[0]?.value || '';
        const brand = inputs[1]?.value || '';
        const customer = inputs[2]?.value || '';
        const empId = selects[0]?.value || '';
        const washId = selects[1]?.value || '';

        const errors = {};
        if (!plate.trim()) errors.plate = 'Required';
        if (!brand.trim()) errors.brand = 'Required';
        if (!customer.trim()) errors.customer = 'Required';
        if (!empId) errors.empId = 'Required';
        if (!washId) errors.washId = 'Required';

        return {
          values: { plate, brand, customer, empId, washId },
          errors: errors,
          isValid: Object.keys(errors).length === 0,
        };
      });

      console.log('Values:');
      console.log(`  plate: "${validation.values.plate}"`);
      console.log(`  brand: "${validation.values.brand}"`);
      console.log(`  customer: "${validation.values.customer}"`);
      console.log(`  empId: "${validation.values.empId}"`);
      console.log(`  washId: "${validation.values.washId}"`);

      console.log(`\nValidation result: ${validation.isValid ? '✅ PASS' : '❌ FAIL'}`);

      if (!validation.isValid) {
        console.log('\nErrors:');
        Object.entries(validation.errors).forEach(([key, msg]) => {
          console.log(`  ${key}: ${msg}`);
        });
      }

      // Try to submit anyway
      console.log('\n4️⃣  Attempting submit...');
      const result = await page.evaluate(() => {
        const btn = document.querySelector('button[class*="bg-blue-primary"]');
        if (!btn) return { found: false };
        btn.click();
        return { found: true, clicked: true };
      });

      if (result.found) {
        await page.waitForTimeout(2000);
        const drawerOpen = await newEntryBtn.isVisible().catch(() => false);
        console.log(`   Drawer closed after submit: ${!drawerOpen}`);

        if (!drawerOpen) {
          console.log('   ✓ Form processed');
        }
      }
    }

    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugValidation();
