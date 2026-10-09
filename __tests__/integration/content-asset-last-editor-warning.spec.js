// ABOUTME: Integration tests for sfcc/content-asset-last-editor-warning.user.js running in a real browser page.
// ABOUTME: Serves Business Manager-shaped markup and checks whether the userscript turns the page background red.

const path = require('path');
const { test, expect } = require('@playwright/test');

const SCRIPT_PATH = path.join(__dirname, '../../sfcc/content-asset-last-editor-warning.user.js');
const EDITOR_URL = 'https://bm.example.com/on/demandware.store/Sites-Site/default/ViewLibraryContent-Edit';
const WARNING_COLOR = 'rgb(255, 0, 0)';

// The selectors here must match the ones in the userscript.
function buildEditorHtml({ signedInUser, lastEditor }) {
    const signedIn = signedInUser === undefined ? '' : `<span data-placeholder="sfcc-signed-in-user">${signedInUser}</span>`;
    const editor = lastEditor === undefined ? '' : `<span data-placeholder="sfcc-last-editor">${lastEditor}</span>`;
    return `<html><body style="background-color: white">${signedIn}${editor}</body></html>`;
}

async function openEditor(page, html) {
    const warnings = [];
    page.on('console', (message) => {
        if (message.type() === 'warning') {
            warnings.push(message.text());
        }
    });
    await page.route(EDITOR_URL, (route) => route.fulfill({ contentType: 'text/html', body: html }));
    await page.goto(EDITOR_URL);
    await page.addScriptTag({ path: SCRIPT_PATH });
    return warnings;
}

function backgroundColor(page) {
    return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

test('turns the background red when someone else edited the asset last', async ({ page }) => {
    const warnings = await openEditor(page, buildEditorHtml({ signedInUser: 'Chris Raser', lastEditor: 'Someone Else' }));

    expect(await backgroundColor(page)).toBe(WARNING_COLOR);
    expect(warnings).toEqual([]);
});

test('leaves the background alone when the signed-in user edited the asset last', async ({ page }) => {
    const warnings = await openEditor(page, buildEditorHtml({ signedInUser: 'Chris Raser', lastEditor: ' chris  raser ' }));

    expect(await backgroundColor(page)).toBe('rgb(255, 255, 255)');
    expect(warnings).toEqual([]);
});

test('warns in the console when the last editor cannot be found', async ({ page }) => {
    const warnings = await openEditor(page, buildEditorHtml({ signedInUser: 'Chris Raser' }));

    expect(await backgroundColor(page)).toBe('rgb(255, 255, 255)');
    expect(warnings).toEqual(['SFCC Content Asset Last Editor Warning: could not find the last editor or the signed-in user.']);
});

test('warns in the console when the signed-in user cannot be found', async ({ page }) => {
    const warnings = await openEditor(page, buildEditorHtml({ lastEditor: 'Someone Else' }));

    expect(await backgroundColor(page)).toBe('rgb(255, 255, 255)');
    expect(warnings).toEqual(['SFCC Content Asset Last Editor Warning: could not find the last editor or the signed-in user.']);
});
