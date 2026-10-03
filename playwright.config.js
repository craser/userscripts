// ABOUTME: Playwright configuration for the userscripts test suites.
// ABOUTME: Defines unit and integration projects, each reading tests from its own __tests__ subdirectory.

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './__tests__',
    projects: [
        { name: 'unit', testDir: './__tests__/unit' },
        { name: 'integration', testDir: './__tests__/integration' },
    ],
});
