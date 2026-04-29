import { chromium } from 'playwright';

const APP_URL = 'http://localhost:5174';

async function testVehicleEntry() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🚗 Testing Vehicle Entry Flow\n');

  try {
    // Navigate and login
    console.log('1️⃣  Navigating and logging in...');
    await page.goto(APP_URL);
    await page.reload();
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@lavadero.com');
      await page.locator('input[type="password"]').fill('password123');
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(2000);
      console.log('   ✓ Logged in\n');
    }

    // Navigate to Vehicles page
    console.log('2️⃣  Navigating to Vehicles page...');
    const vehiclesLink = page.locator('text=Vehículos').first();
    if (await vehiclesLink.isVisible()) {
      await vehiclesLink.click();
      await page.waitForTimeout(1500);
      console.log('   ✓ On Vehicles page\n');
    }

    // Click "Nueva entrada"
    console.log('3️⃣  Opening vehicle entry form...');
    const newEntryBtn = page.locator('button').filter({ hasText: /Nueva entrada/ }).first();
    const btnVisible = await newEntryBtn.isVisible();
    console.log(`   Button visible: ${btnVisible}`);

    if (btnVisible) {
      await newEntryBtn.click();
      await page.waitForTimeout(800);
      console.log('   ✓ Form opened\n');

      // Fill form
      console.log('4️⃣  Filling form fields...');

      // Get all inputs in the drawer
      const allInputs = page.locator('input, select, textarea');
      const inputCount = await allInputs.count();
      console.log(`   Found ${inputCount} form elements\n`);

      // Try to fill plate field with placeholder "ABC123"
      const plateInput = page.locator('input[placeholder="ABC123"]');
      if (await plateInput.isVisible()) {
        await plateInput.fill('TEST123');
        console.log('   ✓ Plate: TEST123');
      } else {
        console.log('   ❌ Plate input not found');
      }

      // Fill brand
      const brandInput = page.locator('input[placeholder="Toyota"]');
      if (await brandInput.isVisible()) {
        await brandInput.fill('Toyota');
        console.log('   ✓ Brand: Toyota');
      } else {
        console.log('   ❌ Brand input not found');
      }

      // Fill customer name
      const customerInput = page.locator('input[placeholder="Juan Pérez"]');
      if (await customerInput.isVisible()) {
        await customerInput.fill('Test Customer');
        console.log('   ✓ Customer: Test Customer');
      } else {
        console.log('   ❌ Customer input not found');
      }

      // Fill phone (optional)
      const phoneInput = page.locator('input[placeholder*="54 9 11"]');
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('1234567890');
        console.log('   ✓ Phone: 1234567890');
      }

      // Select employee
      const employeeSelect = page.locator('select').first();
      if (await employeeSelect.isVisible()) {
        const options = await employeeSelect.locator('option').count();
        console.log(`   ✓ Employee select has ${options} options`);
        if (options > 1) {
          await employeeSelect.selectOption({ index: 1 });
          console.log('   ✓ Employee selected');
        }
      }

      // Select wash type
      const washTypeSelect = page.locator('select').nth(1);
      if (await washTypeSelect.isVisible()) {
        const options = await washTypeSelect.locator('option').count();
        console.log(`   ✓ Wash type select has ${options} options`);
        if (options > 1) {
          await washTypeSelect.selectOption({ index: 1 });
          console.log('   ✓ Wash type selected\n');
        }
      }

      // Try to submit
      console.log('5️⃣  Submitting form...');
      const submitBtn = page.locator('button').filter({ hasText: /Registrar entrada/ }).first();
      const submitVisible = await submitBtn.isVisible();
      console.log(`   Submit button visible: ${submitVisible}`);

      if (submitVisible) {
        console.log('   Clicking submit button...');
        await submitBtn.click();
        await page.waitForTimeout(2000);

        // Check if drawer closed (form submitted)
        const drawerStillOpen = await newEntryBtn.isVisible().catch(() => false);
        console.log(`   Drawer still open after submit: ${drawerStillOpen}\n`);

        if (!drawerStillOpen) {
          console.log('✅ Form submitted successfully!');
          const vehicles = await page.locator('[class*="glass-card"]').count();
          console.log(`   Vehicles visible: ${vehicles}`);
        } else {
          console.log('❌ Form not submitted - drawer still open');

          // Check for error messages
          const errorText = page.locator('[class*="error"], [class*="text-red"], [class*="text-status-red"]');
          const errorCount = await errorText.count();
          if (errorCount > 0) {
            console.log(`   Found ${errorCount} error elements`);
          }
        }
      }
    }

    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n✓ Test complete');
  }
}

testVehicleEntry();
