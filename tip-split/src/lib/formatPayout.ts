import { formatUsd } from './money';

export function formatPayoutText(params: {
  envelopeCents: number;
  people: { name: string; cents: number }[];
}): string {
  const lines = [
    'Tip Split',
    `Envelope: ${formatUsd(params.envelopeCents)}`,
    '',
    ...params.people.map((person) => `${person.name} — ${formatUsd(person.cents)}`),
    '',
    `Shares add up to ${formatUsd(params.envelopeCents)}`,
  ];
  return lines.join('\n');
}
