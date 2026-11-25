// ABOUTME: End-to-end test for gmail/load-all-mail-accounts.user.js against real Gmail in a signed-in Chrome profile.
// ABOUTME: Clicks the real Refresh button and checks that Gmail accepted "Check mail now" for every other account.

const path = require('path');
const { test, expect, chromium } = require('@playwright/test');

const SCRIPT_PATH = path.join(__dirname, '../../gmail/load-all-mail-accounts.user.js');
const PROFILE_DIR = path.join(__dirname, '../../.e2e-chrome-profile');
const MAILBOX_URL = 'https://mail.google.com/mail/u/0/';

test('clicking Refresh in real Gmail checks mail on every other account', async () => {
    const context = await chromium.launchPersistentContext(PROFILE_DIR, {
        channel: 'chrome',
        headless: false,
        // Chrome encrypts the profile's cookies with the real macOS Keychain; Playwright's default mock keychain
        // can't decrypt them, so Chrome would discard the Gmail sign-in.
        ignoreDefaultArgs: ['--use-mock-keychain', '--password-store=basic'],
    });
    try {
        await context.addInitScript({ path: SCRIPT_PATH });
        const page = await context.newPage();
        await page.goto(MAILBOX_URL);
        const refreshButton = page.locator('[role="button"][act="20"]');
        await refreshButton.waitFor({ timeout: 60000 });

        const accountsResponse = page.waitForResponse((response) => response.url().includes('view=masv'));
        const checkMailResponse = page.waitForResponse((response) => response.url().includes('act=cma_'));
        await refreshButton.click();

        expect((await accountsResponse).ok()).toBe(true);
        const checkMail = await checkMailResponse;
        expect(checkMail.ok()).toBe(true);
        expect(await checkMail.text()).toContain('"ama"');
    } finally {
        await context.close();
    }
});
