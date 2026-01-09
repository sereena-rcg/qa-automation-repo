
const { test, expect } = require('@playwright/test');
test.setTimeout(100000); // 2 minutes
 
test('Retrieve Booking, validate Total Received, then navigate to Booking Funds Transfer and fill fields', async ({ page }) => {
  // Step 1: Navigate to the Selling App page
  await page.goto('https://staging2.royalx.rccl.com/iTravel/shopping/static/7.0.296/en_US/A5/pages/peacoc-index.html#/', {
    waitUntil: 'domcontentloaded'
  });
  console.log('✓ Selling App page loaded');
 
  // Step 2: Click on Retrieve Bookings tab
  const retrieveBookingsTab = page.locator('a.mt_ret', { hasText: 'Retrieve Bookings' });
  await expect(retrieveBookingsTab).toBeVisible({ timeout: 10000 });
  await retrieveBookingsTab.click();
  console.log('✓ Clicked on Retrieve Bookings tab');
 
  // Step 3: Fill in the Booking ID
  const bookingId = '10000322';
  const bookingIdInput = page.locator('input[placeholder="Booking Ref No/CartID"]');
  await expect(bookingIdInput).toBeVisible({ timeout: 10000 });
  await bookingIdInput.fill(bookingId);
  console.log('✓ Booking ID entered');
 
  // Step 4: Click the Search button
  const searchButton = page.locator('button.btn-primary.pull-right', { hasText: 'Search' });
  await expect(searchButton).toBeVisible({ timeout: 10000 });
  await searchButton.click();
  console.log('✓ Search button clicked');
 
  // Step 5: Wait for network to be idle
  await expect(page.locator('div.pass_item >> span.pass_value').nth(3)).toBeVisible({ timeout: 20000 });
  console.log('✓ Network idle, results should be loaded');
 
  // Step 6: Capture the Total Amount Paid
  const totalAmountElement = page.locator('div.pass_item >> span.pass_value').nth(3);
  await expect(totalAmountElement).toBeVisible({ timeout: 10000 });
  const totalAmountPaid = (await totalAmountElement.textContent()).trim();
  console.log('✓ Total Amount Paid (Selling App):', totalAmountPaid);
  
  // Step 7: Navigate to Accounting module
await page.goto('https://staging2.royalx.rccl.com/iTravel/production/static/7.0.300/en_US/base/pages/index.html', {
  waitUntil: 'domcontentloaded'
});
console.log('✓ Finance &amp; Accounting page loaded');
await page.waitForTimeout(2000);
 
const hamburge = page.locator('span.trigger');
await expect(hamburger).toBeVisible({ timeout: 10000 });
await hamburger.click();
console.log('✓ Hamburger menu clicked');
await page.waitForTimeout(2000);
 
const financeMenuItem = page.locator('li:has(span.financial)');
await expect(financeMenuItem).toBeVisible({ timeout: 10000 });
await financeMenuItem.click();
console.log('✓ Clicked Finance &amp; Accounting');
await page.waitForTimeout(2000);
 
const bookingEnquiriesLink = page.locator('a.financeandaccounts\\.bookingEnquiries');
await expect(bookingEnquiriesLink).toBeVisible({ timeout: 10000 });
await bookingEnquiriesLink.click();
console.log('✓ Clicked Booking Enquiries');
 
const bookingFinancialEnquiryLink = page.locator('a.financeandaccounts\\.bookingEnquiries\\.bookingFinancialEnquiry');
await expect(bookingFinancialEnquiryLink).toBeVisible({ timeout: 10000 });
await bookingFinancialEnquiryLink.click();
console.log('✓ Clicked Booking Financial Enquiry');
 
const bookingSearchInput = page.locator('input#bookingNumber');
await expect(bookingSearchInput).toBeVisible({ timeout: 10000 });
await bookingSearchInput.fill(bookingId);
console.log('✓ Booking Number entered in Accounting module');
 
await bookingSearchInput.blur();
console.log('✓ Triggered blur event to load financial details');
 
await page.waitForLoadState('networkidle');
 
const viewDetailsButton = page.locator('input.btn.blue[value="View Details"]');
await expect(viewDetailsButton).toBeVisible({ timeout: 10000 });
await viewDetailsButton.click();
console.log('✓ Clicked View Details');
 
await page.waitForLoadState('networkidle');
 
const totalReceivedInput = page.locator('input[name="widgetmodel_billingVO_totalReceivedFormat"]');
await expect(totalReceivedInput).toBeVisible({ timeout: 10000 });
const accountingAmountPaid = await totalReceivedInput.inputValue();
console.log('✓ Total Received (Accounting summary):', accountingAmountPaid);
 
const normalizedSellingAmount = totalAmountPaid.replace(/[^0-9.]/g, '');
const normalizedAccountingAmount = accountingAmountPaid.replace(/[^0-9.]/g, '');
expect(normalizedAccountingAmount).toBe(normalizedSellingAmount);
 
 
  });
