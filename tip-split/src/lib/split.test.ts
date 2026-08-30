import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { SplitError, splitTips } from './split';

function byId(shares: { id: string; cents: number }[]): Record<string, number> {
  return Object.fromEntries(shares.map((share) => [share.id, share.cents]));
}

function assertSumsToEnvelope(
  envelopeCents: number,
  entries: { id: string; hours: number }[],
): { id: string; cents: number }[] {
  const shares = splitTips(envelopeCents, entries);
  const total = shares.reduce((sum, share) => sum + share.cents, 0);
  assert.equal(total, envelopeCents);
  return shares;
}

describe('splitTips', () => {
  it('splits an even envelope across equal hours', () => {
    const shares = assertSumsToEnvelope(10000, [
      { id: 'alex', hours: 8 },
      { id: 'jordan', hours: 8 },
    ]);
    assert.deepEqual(byId(shares), { alex: 5000, jordan: 5000 });
  });

  it('splits uneven hours in proportion', () => {
    const shares = assertSumsToEnvelope(10000, [
      { id: 'alex', hours: 10 },
      { id: 'jordan', hours: 30 },
    ]);
    assert.deepEqual(byId(shares), { alex: 2500, jordan: 7500 });
  });

  it('hands leftover odd cents to the largest remainders', () => {
    const shares = assertSumsToEnvelope(1000, [
      { id: 'a', hours: 1 },
      { id: 'b', hours: 1 },
      { id: 'c', hours: 1 },
    ]);
    assert.deepEqual(byId(shares), { a: 334, b: 333, c: 333 });
  });

  it('gives the whole envelope to one person', () => {
    const shares = assertSumsToEnvelope(12345, [{ id: 'solo', hours: 5.25 }]);
    assert.deepEqual(byId(shares), { solo: 12345 });
  });

  it('pays $0 to anyone with zero hours', () => {
    const shares = assertSumsToEnvelope(1001, [
      { id: 'a', hours: 10 },
      { id: 'b', hours: 0 },
      { id: 'c', hours: 10 },
    ]);
    assert.deepEqual(byId(shares), { a: 501, b: 0, c: 500 });
  });

  it('throws when every person has zero hours', () => {
    assert.throws(
      () =>
        splitTips(5000, [
          { id: 'a', hours: 0 },
          { id: 'b', hours: 0 },
        ]),
      (error: unknown) => error instanceof SplitError && error.code === 'NO_HOURS',
    );
  });

  it('throws when there are no people', () => {
    assert.throws(
      () => splitTips(5000, []),
      (error: unknown) => error instanceof SplitError && error.code === 'NO_HOURS',
    );
  });

  it('splits decimal hours exactly', () => {
    const shares = assertSumsToEnvelope(100, [
      { id: 'a', hours: 1.5 },
      { id: 'b', hours: 0.5 },
    ]);
    assert.deepEqual(byId(shares), { a: 75, b: 25 });
  });

  it('gives a single leftover cent to the first tied remainder', () => {
    const shares = assertSumsToEnvelope(1, [
      { id: 'a', hours: 1 },
      { id: 'b', hours: 1 },
    ]);
    assert.deepEqual(byId(shares), { a: 1, b: 0 });
  });

  it('keeps mixed-hour kitchen payouts adding up to the envelope', () => {
    const shares = assertSumsToEnvelope(24750, [
      { id: 'alex', hours: 32.5 },
      { id: 'jordan', hours: 18 },
      { id: 'sam', hours: 0 },
      { id: 'riley', hours: 21.75 },
    ]);
    assert.equal(
      shares.reduce((sum, share) => sum + share.cents, 0),
      24750,
    );
    assert.equal(byId(shares).sam, 0);
  });
});
