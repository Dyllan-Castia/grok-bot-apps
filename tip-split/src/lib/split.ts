export const HOURS_SCALE = 100;

export type SplitErrorCode = 'NO_HOURS' | 'INVALID_CENTS' | 'INVALID_HOURS';

export class SplitError extends Error {
  readonly code: SplitErrorCode;

  constructor(code: SplitErrorCode) {
    super(code);
    this.name = 'SplitError';
    this.code = code;
  }
}

export type SplitEntry = {
  id: string;
  hours: number;
};

export type SplitShare = {
  id: string;
  cents: number;
};

/**
 * Split an envelope of integer cents in proportion to hours.
 * Uses the largest-remainder (Hamilton) method so shares always
 * sum exactly to the envelope. Zero hours always receive $0.
 */
export function splitTips(envelopeCents: number, entries: SplitEntry[]): SplitShare[] {
  if (!Number.isInteger(envelopeCents) || envelopeCents < 0) {
    throw new SplitError('INVALID_CENTS');
  }

  const units = entries.map((entry, index) => {
    if (!Number.isFinite(entry.hours) || entry.hours < 0) {
      throw new SplitError('INVALID_HOURS');
    }
    return {
      id: entry.id,
      index,
      units: Math.round(entry.hours * HOURS_SCALE),
    };
  });

  const totalUnits = units.reduce((sum, row) => sum + row.units, 0);
  if (totalUnits === 0) {
    throw new SplitError('NO_HOURS');
  }

  const rows = units.map((row) => {
    const product = envelopeCents * row.units;
    return {
      id: row.id,
      index: row.index,
      cents: Math.floor(product / totalUnits),
      remainder: product % totalUnits,
    };
  });

  const leftover = envelopeCents - rows.reduce((sum, row) => sum + row.cents, 0);
  const ranked = [...rows].sort((a, b) => {
    if (b.remainder !== a.remainder) {
      return b.remainder - a.remainder;
    }
    return a.index - b.index;
  });

  for (let i = 0; i < leftover; i += 1) {
    ranked[i].cents += 1;
  }

  return rows.map((row) => ({ id: row.id, cents: row.cents }));
}
