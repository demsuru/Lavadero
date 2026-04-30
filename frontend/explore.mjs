import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    console.log('📱 FRONTEND EXPLORATION\n');
    
    // Login
    console.log('1️⃣  LOGIN PAGE');
    await page.goto('http://localhost:5174/login', { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.fill('input[type="email"]', 'admin@example.com').catch(() => {});
    await page.fill('input[type="password"]', 'admin123').catch(() => {});
    await page.click('button[type="submit"]').catch(() => {});
    await page.waitForTimeout(3000);
    
    // Dashboard
    console.log('2️⃣  DASHBOARD');
    const dashCards = await page.$$('[class*="stat"], [class*="card"]').catch(() => []);
    console.log(`   Cards: ${dashCards.length}`);
    
    // Reports
    console.log('3️⃣  REPORTS');
    await page.goto('http://localhost:5174/reports', { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.waitForTimeout(1000);
    const charts = await page.$$('svg').catch(() => []);
    console.log(`   Charts: ${charts.length}`);
    
    // Vehicles
    console.log('4️⃣  VEHICLES');
    await page.goto('http://localhost:5174/vehicles', { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.waitForTimeout(1000);
    const rows = await page.$$('tr').catch(() => []);
    console.log(`   Table rows: ${rows.length}`);
    
    // Shifts
    console.log('5️⃣  SHIFTS');
    await page.goto('http://localhost:5174/shifts', { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.waitForTimeout(1000);
    const cells = await page.$$('[class*="cell"], [class*="grid"]').catch(() => []);
    console.log(`   Grid elements: ${cells.length}`);
    
    console.log('\n✅ Exploration complete');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
