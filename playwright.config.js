// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './playwright-specs',
  timeout: 100000,

  use: {
    headless: false,
    storageState: 'auth.json',
    viewport: { width: 1280, height: 720 },

    // Capture everything
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },

  reporter: [
    ['html', { open: 'always' }],
    ['json', { outputFile: 'pw-results.json' }]
  ],
});
