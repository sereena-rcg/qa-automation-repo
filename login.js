// login.js
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Show browser for manual login
  const page = await browser.newPage();

  // Step 1: Go to login page
  await page.goto('https://staging2.royalx.rccl.com/iTravel/production/static/7.0.303/en_US/base/pages/index.html')

  // Step 2: Wait for user to manually log in (including MFA)
  console.log(' Please complete login manually, including MFA...');
  await page.waitForTimeout(60000); // Gives you 60 seconds to log in

  // Step 3: Save authenticated session
  await page.context().storageState({ path: 'auth.json' });
  console.log('Session saved to auth.json');

  await browser.close();
})();