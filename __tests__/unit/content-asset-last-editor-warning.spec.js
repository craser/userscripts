// ABOUTME: Unit tests for the pure helpers in sfcc/content-asset-last-editor-warning.user.js.
// ABOUTME: Covers user name normalization and deciding whether someone else edited the asset last.

const { test, expect } = require('@playwright/test');
const {
    normalizeUserName,
    isSameUser,
} = require('../../sfcc/content-asset-last-editor-warning.user.js');

test.describe('normalizeUserName', () => {
    test('trims surrounding whitespace', () => {
        expect(normalizeUserName('  Chris Raser \n')).toBe('chris raser');
    });

    test('collapses runs of inner whitespace to a single space', () => {
        expect(normalizeUserName('Chris \n\t Raser')).toBe('chris raser');
    });

    test('ignores letter case', () => {
        expect(normalizeUserName('CHRIS@Raser.io')).toBe('chris@raser.io');
    });
});

test.describe('isSameUser', () => {
    test('treats names that differ only in case and whitespace as the same user', () => {
        expect(isSameUser(' Chris  Raser', 'chris raser')).toBe(true);
    });

    test('treats different names as different users', () => {
        expect(isSameUser('Chris Raser', 'Someone Else')).toBe(false);
    });
});
