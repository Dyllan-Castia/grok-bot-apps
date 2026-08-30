export type StaffMember = {
  id: string;
  name: string;
};

export type PayoutPerson = {
  id: string;
  name: string;
  hours: number;
  cents: number;
};

export type PayoutResult = {
  envelopeCents: number;
  people: PayoutPerson[];
};
