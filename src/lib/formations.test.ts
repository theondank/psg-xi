import { describe, expect, it } from 'vitest';
import { FORMATION_IDS, FORMATIONS, LINES, findSlot, slotsByLine } from './formations';
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

describe('slotsByLine', () => {
  it.each(FORMATION_IDS)('%s : chaque slot apparaît une fois, lignes dans l’ordre du jeu', (id) => {
    const lines = slotsByLine(FORMATIONS[id]);
    const ids = lines.flatMap((line) => line.slots.map((slot) => slot.id));
    expect(ids).toHaveLength(11);
    expect(new Set(ids).size).toBe(11);
    const order = lines.map((line) => line.line);
    expect(order).toEqual([...LINES].filter((line) => order.includes(line)));
    expect(lines.every((line) => line.slots.length > 0)).toBe(true);
  });

  it('suit le nom du schéma : 4-3-3 → 1 + 4 + 3 + 3', () => {
    const counts = slotsByLine(FORMATIONS['4-3-3']).map((line) => line.slots.length);
    expect(counts).toEqual([1, 4, 3, 3]);
  });

  it('range les pistons du 3-5-2 au milieu', () => {
    const counts = slotsByLine(FORMATIONS['3-5-2']).map((line) => line.slots.length);
    expect(counts).toEqual([1, 3, 5, 2]);
  });

  it('ordonne chaque ligne de gauche à droite', () => {
    const defense = slotsByLine(FORMATIONS['4-3-3']).find((group) => group.line === 'defense');
    expect(defense?.slots.map((slot) => slot.id)).toEqual(['lb', 'cb1', 'cb2', 'rb']);
  });
});
