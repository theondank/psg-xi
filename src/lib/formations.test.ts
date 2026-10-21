import { describe, expect, it } from 'vitest';
import { FORMATION_IDS, FORMATIONS, findSlot } from './formations';
import { POSITIONS } from '../data/players';

describe('formations', () => {
  it('expose les quatre formations annoncées', () => {
    expect(FORMATION_IDS).toHaveLength(4);
  });

  it.each(FORMATION_IDS)('%s : onze slots, identifiants uniques, un seul gardien', (id) => {
    const formation = FORMATIONS[id];
    expect(formation.slots).toHaveLength(11);
    expect(new Set(formation.slots.map((slot) => slot.id)).size).toBe(11);
    expect(formation.slots.filter((slot) => slot.accepts.includes('GK'))).toHaveLength(1);
  });

  it.each(FORMATION_IDS)('%s : coordonnées dans le terrain', (id) => {
    for (const slot of FORMATIONS[id].slots) {
      expect(slot.x).toBeGreaterThanOrEqual(0);
      expect(slot.x).toBeLessThanOrEqual(100);
      expect(slot.y).toBeGreaterThanOrEqual(0);
      expect(slot.y).toBeLessThanOrEqual(100);
    }
  });

  it.each(FORMATION_IDS)('%s : postes acceptés valides et non vides', (id) => {
    for (const slot of FORMATIONS[id].slots) {
      expect(slot.accepts.length).toBeGreaterThan(0);
      for (const position of slot.accepts) {
        expect(POSITIONS).toContain(position);
      }
    }
  });

  it('retrouve un slot par identifiant', () => {
    expect(findSlot(FORMATIONS['4-3-3'], 'st')?.label).toBe('ST');
    expect(findSlot(FORMATIONS['4-3-3'], 'inconnu')).toBeUndefined();
  });

  it('alignera toujours onze joueurs, quel que soit le schéma', () => {
    for (const id of FORMATION_IDS) {
      expect(FORMATIONS[id].slots.length).toBe(11);
    }
  });
});
