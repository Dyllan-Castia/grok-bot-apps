const USD_PATTERN = /^\d+(\.\d{0,2})?$/;

export function parseUsdToCents(raw: string): number | null {
  const trimmed = raw.trim().replace(/^\$/, '').replace(/,/g, '').trim();
  if (trimmed === '') {
    return null;
  }
  if (!USD_PATTERN.test(trimmed)) {
    return null;
  }

  const [dollarPart, fractionPart = ''] = trimmed.split('.');
  const centsPart = `${fractionPart}00`.slice(0, 2);
  const cents = Number(dollarPart) * 100 + Number(centsPart);

  if (!Number.isSafeInteger(cents) || cents < 0) {
    return null;
  }
  return cents;
}

export function formatUsd(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(Math.trunc(cents));
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  return `${sign}$${dollars.toLocaleString('en-US')}.${remainder.toString().padStart(2, '0')}`;
}

export function parseHours(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') {
    return 0;
  }
  if (!USD_PATTERN.test(trimmed)) {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.round(value * 100) / 100;
}
