import { chromium } from 'playwright';

const APP_URL = 'http://localhost:5174';

async function debugApiCalls() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const apiCalls = [];

  // Intercept all requests
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/')) {
      apiCalls.push({
        method: request.method(),
        url: url.split('/api/')[1],
        time: new Date().toLocaleTimeString(),
      });
    }
  });

  // Intercept responses
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/vehicles')) {
      apiCalls.push({
        event: 'response',
        method: response.request().method(),
        url: url.split('/api/')[1],
        status: response.status(),
        time: new Date().toLocaleTimeString(),
      });
    }
  });

  console.log('📡 Monitoring API Calls\n');

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

    // Clear API calls log (only track from here)
    apiCalls.length = 0;

    // Go to Vehicles
    console.log('1️⃣  Navigating to Vehicles page...');
    await page.locator('text=Vehículos').first().click();
    await page.waitForTimeout(1500);

    console.log('   API calls so far:');
    apiCalls.forEach(call => {
      if (call.event === 'response') {
        console.log(`   ${call.time} ← ${call.method} ${call.url} (${call.status})`);
      }
    });

    // Clear for next step
    apiCalls.length = 0;

    // Open and submit form
    console.log('\n2️⃣  Opening form and submitting...');
    const newEntryBtn = page.locator('button').filter({ hasText: /Nueva entrada/ }).first();
    if (await newEntryBtn.isVisible()) {
      await newEntryBtn.click();
      await page.waitForTimeout(800);

      // Fill
      await page.locator('input[placeholder="ABC123"]').fill('TEST' + Date.now().toString().slice(-3));
      await page.locator('input[placeholder="Toyota"]').fill('Test');
      await page.locator('input[placeholder="Juan Pérez"]').fill('User');

      const empSelect = page.locator('select').first();
      await empSelect.selectOption({ index: 1 });

      const washSelect = page.locator('select').nth(1);
      await washSelect.selectOption({ index: 1 });

      // Submit
      await page.evaluate(() => {
        const btn = document.querySelector('button[class*="bg-blue-primary"]');
        if (btn) btn.click();
      });

      console.log('   ✓ Form submitted, waiting for API...\n');
      await page.waitForTimeout(3000);

      console.log('   API calls during submit:');
      apiCalls.forEach(call => {
        if (call.event === 'response') {
          console.log(`   ${call.time} ← ${call.method} ${call.url} (${call.status})`);
        } else {
          console.log(`   ${call.time} → ${call.method} ${call.url}`);
        }
      });

      // Check if POST /vehicles was successful
      const vehiclesPost = apiCalls.find(c => c.method === 'POST' && c.url.includes('vehicles'));
      if (vehiclesPost) {
        console.log(`\n   ✓ Vehicle creation POST sent`);
        if (vehiclesPost.status === 200 || vehiclesPost.status === 201) {
          console.log(`   ✓ Response: ${vehiclesPost.status} (Success)`);
        } else {
          console.log(`   ❌ Response: ${vehiclesPost.status} (Error)`);
        }
      } else {
        console.log(`\n   ❌ No POST /vehicles call found!`);
      }

      // Check if GET was called to refresh
      const getCall = apiCalls.find(c => c.method === 'GET' && c.url.includes('vehicles'));
      if (getCall) {
        console.log(`   ✓ List refresh GET sent`);
      } else {
        console.log(`   ❌ No GET /vehicles call found (list not refreshed)`);
      }
    }

    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugApiCalls();
