import { chromium } from 'playwright';

const APP_URL = 'http://localhost:5174';

async function debugSubmitBtn() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Finding & Testing Submit Button\n');

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

      // Fill
      await page.locator('input[placeholder="ABC123"]').fill('TEST123');
      await page.locator('input[placeholder="Toyota"]').fill('Brand');
      await page.locator('input[placeholder="Juan Pérez"]').fill('Customer');

      // Must select these
      const empSelect = page.locator('select').first();
      await empSelect.selectOption({ index: 1 });
      const washSelect = page.locator('select').nth(1);
      await washSelect.selectOption({ index: 1 });

      await page.waitForTimeout(500);

      // Find the actual submit button
      console.log('1️⃣  Finding submit button...\n');

      const buttons = await page.evaluate(() => {
        const allBtns = document.querySelectorAll('button');
        return Array.from(allBtns).map((btn, idx) => ({
          idx,
          text: btn.textContent?.trim().substring(0, 30),
          classes: btn.className.substring(0, 50),
          visible: btn.offsetHeight > 0,
        }));
      });

      console.log('All visible buttons:');
      buttons.forEach(btn => {
        if (btn.visible) {
          console.log(`  [${btn.idx}] ${btn.text} | ${btn.classes.substring(0, 40)}...`);
        }
      });

      // Find and click the button containing "Registrar"
      console.log('\n2️⃣  Clicking submit button...\n');

      const clicked = await page.evaluate(() => {
        const allBtns = document.querySelectorAll('button');
        const submitBtn = Array.from(allBtns).find(btn =>
          btn.textContent?.includes('Registrar entrada')
        );

        if (!submitBtn) {
          console.log('Button not found');
          return false;
        }

        console.log('Found submit button:', submitBtn.textContent?.trim());
        console.log('Button state:', {
          disabled: submitBtn.disabled,
          pointerEvents: window.getComputedStyle(submitBtn).pointerEvents,
          opacity: window.getComputedStyle(submitBtn).opacity,
        });

        submitBtn.click();
        return true;
      });

      console.log(`   Clicked: ${clicked}`);
      await page.waitForTimeout(2000);

      // Check if drawer closed
      const drawerOpenAfter = await page.locator('button').filter({ hasText: /Cancelar/ }).isVisible().catch(() => false);
      console.log(`\n3️⃣  Drawer still open: ${drawerOpenAfter}`);

      if (!drawerOpenAfter) {
        console.log('   ✓ Drawer closed - form was processed!');

        // Check if vehicle was added
        const vehicleCount = await page.locator('[class*="glass-card"]').count();
        console.log(`   Vehicles visible: ${vehicleCount}`);

        if (vehicleCount > 0) {
          console.log('   ✅ Vehicle added successfully!');
        } else {
          console.log('   ❌ Vehicle added but API may have failed');
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

debugSubmitBtn();
