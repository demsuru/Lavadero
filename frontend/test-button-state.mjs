import { chromium } from 'playwright';

const APP_URL = 'http://localhost:5174';

async function testButtonState() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const requests = [];
  const responses = [];

  page.on('request', req => {
    if (req.url().includes('/vehicles')) {
      const time = new Date().toLocaleTimeString();
      console.log(`[${time}] → ${req.method()} ${req.url().split('/api/')[1]}`);
      requests.push({ method: req.method(), time });
    }
  });

  page.on('response', resp => {
    if (resp.url().includes('/vehicles')) {
      const time = new Date().toLocaleTimeString();
      console.log(`[${time}] ← ${resp.status()} ${resp.url().split('/api/')[1]}`);
      responses.push({ status: resp.status(), time });
    }
  });

  console.log('📡 Monitoring API + Button State\n');

  try {
    // Setup
    await page.goto(APP_URL);
    await page.reload();
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible()) {
      await page.waitForTimeout(500);
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
      await page.locator('input[placeholder="ABC123"]').fill('TEST' + Date.now().toString().slice(-3));
      await page.locator('input[placeholder="Toyota"]').fill('Ford');
      await page.locator('input[placeholder="Juan Pérez"]').fill('CustomerName');

      const empSelect = page.locator('select').first();
      const washSelect = page.locator('select').nth(1);

      await empSelect.selectOption({ index: 1 });
      await washSelect.selectOption({ index: 1 });
      await page.waitForTimeout(300);

      console.log('1️⃣  Submit button state BEFORE click:\n');

      let btnStateBefore = await page.evaluate(() => {
        const allBtns = document.querySelectorAll('button');
        const btn = Array.from(allBtns).find(b => b.textContent?.includes('Registrar entrada'));
        if (!btn) return { found: false };

        return {
          found: true,
          text: btn.textContent?.substring(0, 20),
          disabled: btn.disabled,
          classes: btn.className.substring(0, 100),
          innerHTML: btn.innerHTML.substring(0, 100),
        };
      });

      console.log(`   Button found: ${btnStateBefore.found}`);
      if (btnStateBefore.found) {
        console.log(`   Disabled: ${btnStateBefore.disabled}`);
        console.log(`   Classes include "disabled": ${btnStateBefore.classes.includes('disabled')}`);
        console.log(`   Has loading spinner: ${btnStateBefore.innerHTML.includes('animate')}\n`);
      }

      // Click
      console.log('2️⃣  Clicking button...\n');

      await page.evaluate(() => {
        const allBtns = document.querySelectorAll('button');
        const btn = Array.from(allBtns).find(b => b.textContent?.includes('Registrar entrada'));
        if (btn) btn.click();
      });

      // Monitor state changes
      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);

        const btnStateAfter = await page.evaluate(() => {
          const allBtns = document.querySelectorAll('button');
          const btn = Array.from(allBtns).find(b => b.textContent?.includes('Registrar entrada'));
          if (!btn) return { found: false };

          return {
            found: true,
            disabled: btn.disabled,
            hasLoadingClass: btn.className.includes('disabled'),
            visible: btn.offsetHeight > 0,
          };
        });

        console.log(`   After ${(i + 1) * 500}ms:`);
        if (btnStateAfter.found) {
          console.log(`     Disabled: ${btnStateAfter.disabled} | Has loading: ${btnStateAfter.hasLoadingClass} | Visible: ${btnStateAfter.visible}`);
        } else {
          console.log('     Button not found (drawer may have closed)');
          break;
        }
      }

      console.log('\n3️⃣  Final state:\n');

      const finalState = await page.evaluate(() => {
        const drawerExists = document.querySelector('[class*="translate-x"]') !== null;
        const drawerOpen = document.body.innerHTML.includes('Cancelar');
        return { drawerExists, drawerOpen };
      });

      console.log(`   Drawer exists: ${finalState.drawerExists}`);
      console.log(`   Drawer content visible: ${finalState.drawerOpen}`);

      // Check requests/responses
      console.log(`\n   API POST requests: ${requests.filter(r => r.method === 'POST').length}`);
      console.log(`   API responses: ${responses.length}`);

      if (requests.filter(r => r.method === 'POST').length > 0 && responses.length === 0) {
        console.log('\n   ⚠️  POST sent but no response received (API may be hanging!)');
      }
    }

    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testButtonState();
