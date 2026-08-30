import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatUsd, parseHours, parseUsdToCents } from './money';

describe('parseUsdToCents', () => {
  it('parses dollars, cents, and a leading $', () => {
    assert.equal(parseUsdToCents('247.50'), 24750);
    assert.equal(parseUsdToCents('$247.50'), 24750);
    assert.equal(parseUsdToCents('247'), 24700);
    assert.equal(parseUsdToCents('0.99'), 99);
    assert.equal(parseUsdToCents('1,234.56'), 123456);
  });

  it('rejects blank and invalid amounts', () => {
    assert.equal(parseUsdToCents(''), null);
    assert.equal(parseUsdToCents('  '), null);
    assert.equal(parseUsdToCents('12.345'), null);
    assert.equal(parseUsdToCents('abc'), null);
    assert.equal(parseUsdToCents('-5'), null);
  });
});

describe('formatUsd', () => {
  it('formats integer cents as USD', () => {
    assert.equal(formatUsd(0), '$0.00');
    assert.equal(formatUsd(99), '$0.99');
    assert.equal(formatUsd(24750), '$247.50');
    assert.equal(formatUsd(123456), '$1,234.56');
  });
});

describe('parseHours', () => {
  it('treats a blank field as zero hours', () => {
    assert.equal(parseHours(''), 0);
  });

  it('accepts whole and decimal hours', () => {
    assert.equal(parseHours('32'), 32);
    assert.equal(parseHours('32.5'), 32.5);
    assert.equal(parseHours('21.75'), 21.75);
  });

  it('rejects invalid hours', () => {
    assert.equal(parseHours('nope'), null);
    assert.equal(parseHours('-1'), null);
    assert.equal(parseHours('1.234'), null);
  });
});
