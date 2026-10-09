// ABOUTME: Integration tests for gmail/load-all-mail-accounts.user.js running in a real browser page.
// ABOUTME: Serves Gmail-shaped markup and records the requests the userscript sends when Refresh is clicked.

const path = require('path');
const { test, expect } = require('@playwright/test');

const SCRIPT_PATH = path.join(__dirname, '../../gmail/load-all-mail-accounts.user.js');
const MAILBOX_URL = 'https://mail.google.com/mail/u/0/';
const MASV_RESPONSE = ')]}\'\n\n[[["ama",5,5,[[1,"pop@example.com",[0,"6 minutes ago"]],[3,"other@example.com",[0,"1 minute ago"]]]]]]';
const INBOX_HTML = `
    <script>window.GLOBALS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 'test-ik'];</script>
    <div class="G-tF">
        <div class="G-Ni J-J5-Ji">
            <div class="T-I J-J5-Ji nu T-I-ax7 L3" role="button" act="20" data-tooltip="Refresh" aria-label="Refresh">
                <div class="asa KCRnif"><svg><path></path></svg></div>
            </div>
        </div>
    </div>
`;

async function openInbox(page, html, checkMailStatus = 200) {
    const requests = [];
    await page.context().addCookies([{ name: 'GMAIL_AT', value: 'test-at', url: MAILBOX_URL }]);
    await page.route('https://mail.google.com/**', (route) => {
        const request = route.request();
        if (request.url() === MAILBOX_URL) {
            return route.fulfill({ contentType: 'text/html', body: html });
        }
        requests.push({ method: request.method(), url: request.url() });
        if (new URL(request.url()).searchParams.get('view') === 'masv') {
            return route.fulfill({ contentType: 'application/json', body: MASV_RESPONSE });
        }
        return route.fulfill({ status: checkMailStatus, contentType: 'application/json', body: ')]}\'\n\n[]' });
    });
    await page.goto(MAILBOX_URL);
    await page.addScriptTag({ path: SCRIPT_PATH });
    return requests;
}

test('clicking Refresh checks mail on every other account', async ({ page }) => {
    const requests = await openInbox(page, INBOX_HTML);

    await page.click('[role="button"][act="20"]');

    await expect.poll(() => requests.length).toBe(3);
    expect(requests).toEqual([
        { method: 'POST', url: `${MAILBOX_URL}?ik=test-ik&view=masv&rt=j` },
        { method: 'POST', url: `${MAILBOX_URL}?ik=test-ik&at=test-at&view=up&act=cma_1&rt=c` },
        { method: 'POST', url: `${MAILBOX_URL}?ik=test-ik&at=test-at&view=up&act=cma_3&rt=c` },
    ]);
});

test('clicking the icon inside Refresh also checks mail', async ({ page }) => {
    const requests = await openInbox(page, INBOX_HTML);

    await page.locator('[act="20"] path').dispatchEvent('click');

    await expect.poll(() => requests.length).toBe(3);
});

test('a Refresh button rendered after the script loads still checks mail', async ({ page }) => {
    const requests = await openInbox(page, '<script>window.GLOBALS = [0, 0, 0, 0, 0, 0, 0, 0, 0, "test-ik"];</script>');
    await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', '<div role="button" act="20" aria-label="Refresh">Refresh</div>');
    });

    await page.click('[act="20"]');

    await expect.poll(() => requests.length).toBe(3);
});

test('clicking anything other than Refresh sends nothing', async ({ page }) => {
    const requests = await openInbox(page, `${INBOX_HTML}<div role="button" act="7">Archive</div>`);

    await page.click('[act="7"]');
    await page.waitForTimeout(500);

    expect(requests).toEqual([]);
});

test('a failed check is reported on the console', async ({ page }) => {
    const errors = [];
    page.on('console', (message) => {
        if (message.type() === 'error' && message.text().startsWith('Load All Mail Accounts:')) {
            errors.push(message.text());
        }
    });
    await openInbox(page, INBOX_HTML, 403);

    await page.click('[role="button"][act="20"]');

    await expect.poll(() => errors).toEqual([
        expect.stringContaining('Load All Mail Accounts: Error: Gmail request failed with status 403'),
    ]);
});
