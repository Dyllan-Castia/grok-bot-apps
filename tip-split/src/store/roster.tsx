import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { createId } from '@/lib/ids';
import type { StaffMember } from '@/types';

const STORAGE_KEY = 'tip-split/roster/v1';
const SEED_NAMES = ['Alex', 'Jordan', 'Sam', 'Riley'];

type RosterContextValue = {
  staff: StaffMember[];
  ready: boolean;
  addStaff: (name: string) => Promise<StaffMember | null>;
  renameStaff: (id: string, name: string) => Promise<boolean>;
  removeStaff: (id: string) => Promise<void>;
};

const RosterContext = createContext<RosterContextValue | null>(null);

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

function seedRoster(): StaffMember[] {
  return SEED_NAMES.map((name) => ({ id: createId('staff'), name }));
}

async function persist(staff: StaffMember[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
}

export function RosterProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) {
          return;
        }
        if (!raw) {
          const seeded = seedRoster();
          setStaff(seeded);
          await persist(seeded);
          return;
        }
        const parsed = JSON.parse(raw) as StaffMember[];
        if (!Array.isArray(parsed)) {
          throw new Error('bad roster');
        }
        const cleaned = parsed.filter(
          (row) => row && typeof row.id === 'string' && typeof row.name === 'string' && row.name.trim(),
        );
        if (cleaned.length === 0) {
          const seeded = seedRoster();
          setStaff(seeded);
          await persist(seeded);
          return;
        }
        setStaff(cleaned);
      } catch {
        const seeded = seedRoster();
        if (!cancelled) {
          setStaff(seeded);
        }
        await persist(seeded);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const addStaff = useCallback(async (rawName: string) => {
    const name = normalizeName(rawName);
    if (!name) {
      return null;
    }
    const member = { id: createId('staff'), name };
    setStaff((current) => {
      const next = [...current, member];
      void persist(next);
      return next;
    });
    return member;
  }, []);

  const renameStaff = useCallback(async (id: string, rawName: string) => {
    const name = normalizeName(rawName);
    if (!name) {
      return false;
    }
    setStaff((current) => {
      const next = current.map((row) => (row.id === id ? { ...row, name } : row));
      void persist(next);
      return next;
    });
    return true;
  }, []);

  const removeStaff = useCallback(async (id: string) => {
    setStaff((current) => {
      const next = current.filter((row) => row.id !== id);
      void persist(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ staff, ready, addStaff, renameStaff, removeStaff }),
    [staff, ready, addStaff, renameStaff, removeStaff],
  );

  return <RosterContext.Provider value={value}>{children}</RosterContext.Provider>;
}

export function useRoster(): RosterContextValue {
  const value = useContext(RosterContext);
  if (!value) {
    throw new Error('useRoster must be used inside RosterProvider');
  }
  return value;
}
