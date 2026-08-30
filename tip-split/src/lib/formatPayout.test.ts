import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatPayoutText } from './formatPayout';

describe('formatPayoutText', () => {
  it('builds a plain-text payout that names each share', () => {
    const text = formatPayoutText({
      envelopeCents: 10000,
      people: [
        { name: 'Alex', cents: 5000 },
        { name: 'Jordan', cents: 5000 },
      ],
    });

    assert.equal(
      text,
      [
        'Tip Split',
        'Envelope: $100.00',
        '',
        'Alex — $50.00',
        'Jordan — $50.00',
        '',
        'Shares add up to $100.00',
      ].join('\n'),
    );
  });
});
