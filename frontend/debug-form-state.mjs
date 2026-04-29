import { chromium } from 'playwright';

const APP_URL = 'http://localhost:5174';

async function debugFormState() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Debugging Form State\n');

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

      // Fill form
      await page.locator('input[placeholder="ABC123"]').fill('TEST123');
      await page.locator('input[placeholder="Toyota"]').fill('Toyota');
      await page.locator('input[placeholder="Juan Pérez"]').fill('Test Customer');

      const empSelect = page.locator('select').first();
      if (await empSelect.isVisible()) {
        await empSelect.selectOption({ index: 1 });
      }

      const washSelect = page.locator('select').nth(1);
      if (await washSelect.isVisible()) {
        await washSelect.selectOption({ index: 1 });
      }

      await page.waitForTimeout(500);

      // Check form state
      console.log('📋 Form State Check:\n');

      const formData = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input');
        const selects = document.querySelectorAll('select');

        const data = {
          inputs: Array.from(inputs).map(inp => ({
            type: inp.type,
            placeholder: inp.placeholder,
            value: inp.value,
            visible: inp.offsetHeight > 0,
          })),
          selects: Array.from(selects).map(sel => ({
            value: sel.value,
            selectedText: sel.options[sel.selectedIndex]?.textContent,
            visible: sel.offsetHeight > 0,
          })),
          backdrop: document.querySelector('.fixed.inset-0.z-40') !== null,
          drawer: document.querySelector('[class*="translate-x-0"]') !== null,
        };
        return data;
      });

      console.log('Inputs:');
      formData.inputs.forEach((inp, i) => {
        console.log(`  ${i}: ${inp.placeholder || inp.type} = "${inp.value}"`);
      });

      console.log('\nSelects:');
      formData.selects.forEach((sel, i) => {
        console.log(`  ${i}: "${sel.selectedText}" (value: ${sel.value})`);
      });

      console.log(`\nBackdrop present: ${formData.backdrop}`);
      console.log(`Drawer visible: ${formData.drawer}\n`);

      // Try to find what's blocking the button
      console.log('🔍 Checking button context:\n');

      const buttonState = await page.evaluate(() => {
        const btn = document.querySelector('button[class*="bg-blue-primary"]');
        if (!btn) return { found: false };

        const backdrop = document.querySelector('.fixed.inset-0.z-40');
        const rect = btn.getBoundingClientRect();

        return {
          found: true,
          text: btn.textContent,
          disabled: btn.disabled,
          pointerEvents: window.getComputedStyle(btn).pointerEvents,
          zIndex: window.getComputedStyle(btn).zIndex,
          visible: rect.height > 0,
          backdropZIndex: backdrop ? window.getComputedStyle(backdrop).zIndex : null,
          backdropPointerEvents: backdrop ? window.getComputedStyle(backdrop).pointerEvents : null,
        };
      });

      console.log('Button state:');
      console.log(`  Text: ${buttonState.text || 'not found'}`);
      console.log(`  Disabled: ${buttonState.disabled}`);
      console.log(`  Pointer events: ${buttonState.pointerEvents}`);
      console.log(`  Z-index: ${buttonState.zIndex}`);
      console.log(`  Visible: ${buttonState.visible}`);
      console.log(`\nBackdrop:
  Z-index: ${buttonState.backdropZIndex}`);
      console.log(`  Pointer events: ${buttonState.backdropPointerEvents}`);

      // Try clicking via evaluate instead
      console.log('\n5️⃣  Trying alternative click method...');
      const clicked = await page.evaluate(() => {
        const btn = document.querySelector('button[class*="bg-blue-primary"]');
        if (!btn) return false;
        btn.click();
        return true;
      });

      console.log(`  JavaScript click executed: ${clicked}`);
      await page.waitForTimeout(2000);

      const drawerOpen = await page.locator('button').filter({ hasText: /Registrar entrada/ }).isVisible().catch(() => false);
      console.log(`  Drawer still open: ${drawerOpen}`);
    }

    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugFormState();
