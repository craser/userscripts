// ABOUTME: Unit tests for the pure helpers in gmail/load-all-mail-accounts.user.js.
// ABOUTME: Covers token extraction, Gmail response parsing, account id discovery, and URL building.

const { test, expect } = require('@playwright/test');
const {
    readCookie,
    parseGmailResponse,
    parseOtherAccountIds,
    getMailboxPath,
    buildGmailUrl,
} = require('../../gmail/load-all-mail-accounts.user.js');

const MASV_RESPONSE = ')]}\'\n\n[[["ub",1],["ama",5,5,[[1,"pop@example.com",[0,"6 minutes ago","1:27 pm"],0,["pop.example.com"],995],[3,"other@example.com",[0,"1 minute ago","1:32 pm"],0,["pop.other.com"],995]]]]]';

test.describe('readCookie', () => {
    test('returns the value of the named cookie', () => {
        expect(readCookie('foo=1; GMAIL_AT=abc123; bar=2', 'GMAIL_AT')).toBe('abc123');
    });

    test('matches the cookie at the start of the string', () => {
        expect(readCookie('GMAIL_AT=abc123; bar=2', 'GMAIL_AT')).toBe('abc123');
    });

    test('does not match a cookie whose name merely ends with the requested name', () => {
        expect(readCookie('XGMAIL_AT=wrong; bar=2', 'GMAIL_AT')).toBeNull();
    });

    test('returns null when the cookie is absent', () => {
        expect(readCookie('foo=1', 'GMAIL_AT')).toBeNull();
    });
});

test.describe('parseGmailResponse', () => {
    test('strips the anti-JSON-hijacking prefix and parses the rest', () => {
        expect(parseGmailResponse(')]}\'\n\n[["a",1]]')).toEqual([['a', 1]]);
    });
});

test.describe('parseOtherAccountIds', () => {
    test('returns the id of every account in the "ama" entry', () => {
        expect(parseOtherAccountIds(MASV_RESPONSE)).toEqual([1, 3]);
    });

    test('returns an empty list when there is no "ama" entry', () => {
        expect(parseOtherAccountIds(')]}\'\n\n[[["ub",1]]]')).toEqual([]);
    });
});

test.describe('getMailboxPath', () => {
    test('returns the signed-in account path from a Gmail pathname', () => {
        expect(getMailboxPath('/mail/u/2/')).toBe('/mail/u/2/');
    });

    test('ignores anything after the account number', () => {
        expect(getMailboxPath('/mail/u/0/popout')).toBe('/mail/u/0/');
    });
});

test.describe('buildGmailUrl', () => {
    test('appends the encoded parameters to the mailbox path', () => {
        expect(buildGmailUrl('/mail/u/0/', { ik: 'k', view: 'up', act: 'cma_1' }))
            .toBe('/mail/u/0/?ik=k&view=up&act=cma_1');
    });
});
