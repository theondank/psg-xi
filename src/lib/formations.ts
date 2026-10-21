import type { Position } from '../data/players';

export interface Slot {
  readonly id: string;
  /** Étiquette courte affichée sur le terrain. */
  readonly label: string;
  /** Postes acceptés pour ce slot. */
  readonly accepts: readonly Position[];
  /** Position sur le terrain, en pourcentage (0 = ligne de but adverse). */
  readonly x: number;
  readonly y: number;
}

export const FORMATION_IDS = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'] as const;
export type FormationId = (typeof FORMATION_IDS)[number];

export interface Formation {
  readonly id: FormationId;
  readonly name: string;
  readonly slots: readonly Slot[];
}

function slot(
  id: string,
  label: string,
  accepts: readonly Position[],
  x: number,
  y: number,
): Slot {
  return { id, label, accepts, x, y };
}

export const FORMATIONS: Readonly<Record<FormationId, Formation>> = {
  '4-3-3': {
    id: '4-3-3',
    name: '4-3-3',
    slots: [
      slot('gk', 'GK', ['GK'], 50, 92),
      slot('lb', 'LB', ['LB'], 12, 72),
      slot('cb1', 'CB', ['CB'], 36, 77),
      slot('cb2', 'CB', ['CB'], 64, 77),
      slot('rb', 'RB', ['RB'], 88, 72),
      slot('dm', 'DM', ['DM', 'CM'], 50, 58),
      slot('cm1', 'CM', ['CM', 'DM', 'AM'], 27, 50),
      slot('cm2', 'CM', ['CM', 'DM', 'AM'], 73, 50),
      slot('lw', 'LW', ['LW', 'AM'], 15, 26),
      slot('st', 'ST', ['ST'], 50, 17),
      slot('rw', 'RW', ['RW', 'AM'], 85, 26),
    ],
  },
  '4-4-2': {
    id: '4-4-2',
    name: '4-4-2',
    slots: [
      slot('gk', 'GK', ['GK'], 50, 92),
      slot('lb', 'LB', ['LB'], 12, 73),
      slot('cb1', 'CB', ['CB'], 36, 78),
      slot('cb2', 'CB', ['CB'], 64, 78),
      slot('rb', 'RB', ['RB'], 88, 73),
      slot('lm', 'LM', ['LW', 'AM', 'CM'], 12, 50),
      slot('cm1', 'CM', ['CM', 'DM'], 38, 54),
      slot('cm2', 'CM', ['CM', 'DM'], 62, 54),
      slot('rm', 'RM', ['RW', 'AM', 'CM'], 88, 50),
      slot('st1', 'ST', ['ST'], 37, 20),
      slot('st2', 'ST', ['ST'], 63, 20),
    ],
  },
  '3-5-2': {
    id: '3-5-2',
    name: '3-5-2',
    slots: [
      slot('gk', 'GK', ['GK'], 50, 92),
      slot('cb1', 'CB', ['CB'], 25, 78),
      slot('cb2', 'CB', ['CB'], 50, 81),
      slot('cb3', 'CB', ['CB'], 75, 78),
      slot('lwb', 'LWB', ['LB', 'LW'], 8, 56),
      slot('cm1', 'CM', ['CM', 'DM'], 30, 52),
      slot('dm', 'DM', ['DM'], 50, 58),
      slot('cm2', 'CM', ['CM', 'AM'], 70, 52),
      slot('rwb', 'RWB', ['RB', 'RW'], 92, 56),
      slot('st1', 'ST', ['ST'], 37, 19),
      slot('st2', 'ST', ['ST'], 63, 19),
    ],
  },
  '4-2-3-1': {
    id: '4-2-3-1',
    name: '4-2-3-1',
    slots: [
      slot('gk', 'GK', ['GK'], 50, 92),
      slot('lb', 'LB', ['LB'], 12, 73),
      slot('cb1', 'CB', ['CB'], 36, 78),
      slot('cb2', 'CB', ['CB'], 64, 78),
      slot('rb', 'RB', ['RB'], 88, 73),
      slot('dm1', 'DM', ['DM', 'CM'], 36, 60),
      slot('dm2', 'DM', ['DM', 'CM'], 64, 60),
      slot('lw', 'LW', ['LW', 'AM'], 14, 38),
      slot('am', 'AM', ['AM', 'CM'], 50, 41),
      slot('rw', 'RW', ['RW', 'AM'], 86, 38),
      slot('st', 'ST', ['ST'], 50, 16),
    ],
  },
};

export function getFormation(id: FormationId): Formation {
  return FORMATIONS[id];
}

export function findSlot(formation: Formation, slotId: string): Slot | undefined {
  return formation.slots.find((candidate) => candidate.id === slotId);
}
