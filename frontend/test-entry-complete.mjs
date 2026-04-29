import { chromium } from 'playwright';

const APP_URL = 'http://localhost:5174';

async function testEntryComplete() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const apiErrors = [];
  const consoleLogs = [];

  // Capture API errors
  page.on('response', response => {
    if (!response.ok() && response.url().includes('/api/')) {
      apiErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      });
    }
  });

  // Capture console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleLogs.push(msg.text());
    }
  });

  console.log('🚗 Testing Complete Vehicle Entry Flow\n');

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

    // Count initial vehicles
    const initialCount = await page.locator('[class*="glass-card"]').count();
    console.log(`1️⃣  Initial vehicle count: ${initialCount}\n`);

    // Open form
    const newEntryBtn = page.locator('button').filter({ hasText: /Nueva entrada/ }).first();
    if (await newEntryBtn.isVisible()) {
      await newEntryBtn.click();
      await page.waitForTimeout(800);
      console.log('2️⃣  Form opened\n');

      // Fill form
      console.log('3️⃣  Filling form...');
      await page.locator('input[placeholder="ABC123"]').fill('ENTRY' + Date.now().toString().slice(-3));
      await page.locator('input[placeholder="Toyota"]').fill('Honda');
      await page.locator('input[placeholder="Juan Pérez"]').fill('Test User');

      const empSelect = page.locator('select').first();
      if (await empSelect.isVisible()) {
        await empSelect.selectOption({ index: 1 });
      }

      const washSelect = page.locator('select').nth(1);
      if (await washSelect.isVisible()) {
        await washSelect.selectOption({ index: 1 });
      }
      console.log('   ✓ Form filled\n');

      // Submit via JavaScript click
      console.log('4️⃣  Submitting form...');
      const submitted = await page.evaluate(() => {
        const btn = document.querySelector('button[class*="bg-blue-primary"]');
        if (!btn) return false;
        btn.click();
        return true;
      });

      console.log(`   Form submitted: ${submitted}`);
      await page.waitForTimeout(3000);
      console.log('   ✓ Wait for API response\n');

      // Check for errors
      if (apiErrors.length > 0) {
        console.log('❌ API Errors:');
        apiErrors.forEach(err => {
          console.log(`   ${err.status} ${err.url.split('/').pop()}`);
        });
      }

      if (consoleLogs.length > 0) {
        console.log('❌ Console Errors:');
        consoleLogs.forEach(log => {
          console.log(`   ${log}`);
        });
      }

      // Count vehicles after
      const finalCount = await page.locator('[class*="glass-card"]').count();
      console.log(`\n5️⃣  Final vehicle count: ${finalCount}`);
      console.log(`   Vehicles added: ${finalCount - initialCount}`);

      if (finalCount > initialCount) {
        console.log('\n✅ SUCCESS! Vehicle entry working correctly!');
      } else {
        console.log('\n❌ Vehicle not added to list');
        console.log('\nTroubleshooting:');
        console.log('   - Check if form validation failed');
        console.log('   - Check if API response was an error');
        console.log('   - Check browser console for errors');
      }
    }

    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testEntryComplete();
