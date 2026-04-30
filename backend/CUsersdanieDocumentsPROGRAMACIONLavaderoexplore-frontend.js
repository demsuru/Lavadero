import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    console.log('📱 STARTING FRONTEND EXPLORATION...\n');
    
    console.log('1️⃣  VISITING LOGIN PAGE');
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle2', timeout: 10000 });
    const loginExists = await page.$('input[type="email"]') !== null;
    console.log(`   ✓ Login form found: ${loginExists}\n`);
    
    console.log('2️⃣  ATTEMPTING LOGIN');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2000);
    const loggedIn = !page.url().includes('login');
    console.log(`   ✓ Logged in: ${loggedIn}`);
    console.log(`   ✓ Current URL: ${page.url()}\n`);
    
    // Dashboard
    console.log('3️⃣  ANALYZING DASHBOARD');
    const dashH1 = await page.$eval('h1', el => el.textContent).catch(() => 'N/A');
    const cardCount = await page.$$('[class*="card"]').then(els => els.length);
    console.log(`   ✓ Title: ${dashH1}`);
    console.log(`   ✓ Card components: ${cardCount}\n`);
    
    // Reports
    console.log('4️⃣  ANALYZING REPORTS PAGE');
    await page.goto('http://localhost:5174/reports', { waitUntil: 'networkidle2', timeout: 10000 });
    await page.waitForTimeout(1500);
    const reportH1 = await page.$eval('h1', el => el.textContent).catch(() => 'N/A');
    const chartExists = await page.$('svg') !== null;
    const filterExists = await page.$('[class*="filter"]') !== null;
    console.log(`   ✓ Title: ${reportH1}`);
    console.log(`   ✓ Charts present: ${chartExists}`);
    console.log(`   ✓ Filters present: ${filterExists}\n`);
    
    // Vehicles
    console.log('5️⃣  ANALYZING VEHICLES PAGE');
    await page.goto('http://localhost:5174/vehicles', { waitUntil: 'networkidle2', timeout: 10000 });
    await page.waitForTimeout(1500);
    const vehicleH1 = await page.$eval('h1', el => el.textContent).catch(() => 'N/A');
    const tableExists = await page.$('table') !== null;
    const addBtnExists = await page.$('[class*="add"], [class*="new"]') !== null;
    console.log(`   ✓ Title: ${vehicleH1}`);
    console.log(`   ✓ Table present: ${tableExists}`);
    console.log(`   ✓ Add button: ${addBtnExists}\n`);
    
    // Shifts
    console.log('6️⃣  ANALYZING SHIFTS PAGE');
    await page.goto('http://localhost:5174/shifts', { waitUntil: 'networkidle2', timeout: 10000 });
    await page.waitForTimeout(1500);
    const shiftH1 = await page.$eval('h1', el => el.textContent).catch(() => 'N/A');
    const gridExists = await page.$('[class*="grid"]') !== null;
    console.log(`   ✓ Title: ${shiftH1}`);
    console.log(`   ✓ Grid layout: ${gridExists}\n`);
    
    // Employees
    console.log('7️⃣  ANALYZING EMPLOYEES PAGE');
    await page.goto('http://localhost:5174/employees', { waitUntil: 'networkidle2', timeout: 10000 });
    await page.waitForTimeout(1500);
    const empH1 = await page.$eval('h1', el => el.textContent).catch(() => 'N/A');
    console.log(`   ✓ Title: ${empH1}\n`);
    
    console.log('✅ EXPLORATION COMPLETE');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
