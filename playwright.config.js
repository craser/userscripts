// ABOUTME: Playwright configuration for the userscripts test suites.
// ABOUTME: Defines unit, integration and end-to-end projects, each reading tests from its own __tests__ subdirectory.

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './__tests__',
    projects: [
        { name: 'unit', testDir: './__tests__/unit' },
        { name: 'integration', testDir: './__tests__/integration' },
        // Runs against real Gmail, so it needs a Chrome profile signed in via `npm run e2e:sign-in`.
        { name: 'e2e', testDir: './__tests__/e2e', timeout: 120000 },
    ],
});
