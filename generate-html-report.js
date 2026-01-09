const fs = require('fs');

/* ===============================
   SAFE READ JSON (BOM FIX)
================================ */
const rawJson = fs.readFileSync('pw-results.json', 'utf8')
  .replace(/^\uFEFF/, '')
  .trim();

const data = JSON.parse(rawJson);

/* ===============================
   CONFIG
================================ */
const TEST_CASE_ID = 'TC001';

/* ===============================
   NAVIGATE TO TEST RESULT
================================ */
const result =
  data.suites[0]
    .specs[0]
    .tests[0]
    .results[0];

/* ===============================
   COLLECT ALL CONSOLE LOGS
================================ */
const logs = result.stdout
  .map(l => l.text)
  .join('\n');

/* ===============================
   EXTRACT AMOUNTS (FINAL FIX)
================================ */

// Matches:
// ✓ Total Amount Paid (Selling App): EUR
//        20,026,998.00
const sellingMatch = logs.match(
  /Total Amount Paid \(Selling App\):\s*EUR\s*\n\s*([0-9,]+\.[0-9]{2})/i
);

const accountingMatch = logs.match(
  /Total Received \(Accounting summary\):\s*([0-9,]+\.[0-9]{2})/i
);

const sellingAmount = sellingMatch
  ? `EUR ${sellingMatch[1]}`
  : 'N/A';

const accountingAmount = accountingMatch
  ? accountingMatch[1]
  : 'N/A';

/* ===============================
   PASSED STEPS (✓ SAFE)
================================ */
const passedSteps = logs
  .split('\n')
  .filter(line => line.includes('✓'))
  .map(line => line.replace('✓', '').trim());

/* ===============================
   EXPECTED STEPS
================================ */
const expectedSteps = [
  'Selling App page loaded',
  'Clicked on Retrieve Bookings tab',
  'Booking ID entered',
  'Search button clicked',
  'Network idle, results should be loaded',
  'Total Amount Paid captured',
  'Finance & Accounting page loaded',
  'Hamburger menu clicked',
  'Clicked Finance & Accounting',
  'Clicked Booking Enquiries',
  'Clicked Booking Financial Enquiry',
  'Booking Number entered in Accounting module',
  'Triggered blur event to load financial details',
  'Clicked View Details',
  'Total Received captured',
  'Amounts validated successfully'
];

/* ===============================
   HTML REPORT
================================ */
const html = `
<!DOCTYPE html>
<html>
<head>
<title>Booking Financial Validation Report</title>
<style>
body {
  font-family: Arial;
  background: #f0f6ff;
  padding: 20px;
}
h1 {
  color: #0b3c91;
}
.section {
  background: white;
  border-left: 6px solid #1e5fd8;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 6px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #d0d7e5;
  padding: 10px;
}
th {
  background: #1e5fd8;
  color: white;
}
.pass {
  color: green;
}
.fail {
  color: red;
}
</style>
</head>

<body>

<h1>Booking Financial Validation Report</h1>

<div class="section">
<b>Test Case ID:</b> ${TEST_CASE_ID}
</div>

<div class="section">
<h3>Captured Amounts</h3>
<table>
<tr><th>Source</th><th>Amount</th></tr>
<tr><td>Selling App</td><td>${sellingAmount}</td></tr>
<tr><td>Accounting Module</td><td>${accountingAmount}</td></tr>
</table>
</div>

<div class="section">
<h3>Expected Outcome</h3>
<ul>
${expectedSteps.map(s => `<li>${s}</li>`).join('')}
</ul>
</div>

<div class="section">
<h3>Actual Outcome (Passed Steps)</h3>
<ul class="${passedSteps.length ? 'pass' : 'fail'}">
${
  passedSteps.length
    ? passedSteps.map(s => `<li>${s}</li>`).join('')
    : '<li>No steps passed</li>'
}
</ul>
</div>

</body>
</html>
`;

/* ===============================
   WRITE FILE
================================ */
fs.writeFileSync('booking-validation-report.html', html);

console.log('✓ HTML report generated: booking-validation-report.html');
