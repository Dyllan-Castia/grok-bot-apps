import type { PayoutResult } from '@/types';

let current: PayoutResult | null = null;

export function setPayoutResult(result: PayoutResult): void {
  current = result;
}

export function getPayoutResult(): PayoutResult | null {
  return current;
}

export function clearPayoutResult(): void {
  current = null;
}
