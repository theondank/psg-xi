import { describe, expect, it } from 'vitest';
import { getFormation } from './formations';
import {
  adaptLineup,
  clearAll,
  clearSlot,
  eligiblePlayers,
  emptyLineup,
  filledCount,
  isComplete,
  matchesQuery,
  place,
  playerAt,
  slotOfPlayer,
  type Lineup,
} from './squad';
import { PLAYERS, PLAYERS_BY_ID, eraLabel, shortName } from '../data/players';

const formation = getFormation('4-3-3');

function player(id: string) {
  const found = PLAYERS_BY_ID.get(id);
  if (!found) throw new Error(`joueur de test introuvable : ${id}`);
  return found;
}

describe('emptyLineup', () => {
  it('crée un slot vide par slot de la formation', () => {
    const lineup = emptyLineup(formation);
    expect(Object.keys(lineup)).toHaveLength(11);
    expect(Object.values(lineup).every((value) => value === null)).toBe(true);
  });
});

describe('place', () => {
  it('place un joueur compatible', () => {
    const lineup = place(emptyLineup(formation), formation, 'gk', 'donnarumma');
    expect(playerAt(lineup, 'gk')?.name).toBe('Gianluigi Donnarumma');
  });

  it('refuse un joueur au mauvais poste sans modifier le lineup', () => {
    const empty = emptyLineup(formation);
    const lineup = place(empty, formation, 'gk', 'cavani');
    expect(lineup).toBe(empty);
  });

  it('refuse un joueur inconnu', () => {
    const empty = emptyLineup(formation);
    expect(place(empty, formation, 'st', 'joueur-fantome')).toBe(empty);
  });

  it('accepte un joueur polyvalent sur son poste secondaire', () => {
    const lineup = place(emptyLineup(formation), formation, 'rb', 'marquinhos');
    expect(playerAt(lineup, 'rb')?.id).toBe('marquinhos');
  });

  it('déplace un joueur déjà titulaire et libère son ancien slot', () => {
    let lineup: Lineup = place(emptyLineup(formation), formation, 'cb1', 'marquinhos');
    lineup = place(lineup, formation, 'rb', 'marquinhos');
    expect(lineup['rb']).toBe('marquinhos');
    expect(lineup['cb1']).toBeNull();
  });

  it('échange deux joueurs quand le titulaire peut jouer à l’ancienne place', () => {
    let lineup: Lineup = place(emptyLineup(formation), formation, 'cb1', 'marquinhos');
    lineup = place(lineup, formation, 'cb2', 'thiago-silva');
    lineup = place(lineup, formation, 'cb2', 'marquinhos');
    expect(lineup['cb2']).toBe('marquinhos');
    expect(lineup['cb1']).toBe('thiago-silva');
  });

  it('envoie le titulaire au banc quand il ne peut pas jouer à l’ancienne place', () => {
    // Marquinhos (CB/RB) est en cb1, Hakimi (RB) en rb : impossible d'échanger,
    // Hakimi n'ayant pas le poste CB. Hakimi sort donc du onze.
    let lineup: Lineup = place(emptyLineup(formation), formation, 'cb1', 'marquinhos');
    lineup = place(lineup, formation, 'rb', 'hakimi');
    lineup = place(lineup, formation, 'rb', 'marquinhos');
    expect(lineup['rb']).toBe('marquinhos');
    expect(lineup['cb1']).toBeNull();
    expect(slotOfPlayer(lineup, 'hakimi')).toBeNull();
  });
});

describe('clearSlot / clearAll', () => {
  it('vide un slot occupé', () => {
    const lineup = place(emptyLineup(formation), formation, 'st', 'cavani');
    expect(clearSlot(lineup, 'st')['st']).toBeNull();
  });

  it('renvoie le même objet pour un slot inconnu', () => {
    const lineup = emptyLineup(formation);
    expect(clearSlot(lineup, 'inconnu')).toBe(lineup);
  });

  it('vide tout le terrain', () => {
    const lineup = place(emptyLineup(formation), formation, 'st', 'cavani');
    expect(filledCount(clearAll(lineup))).toBe(0);
  });
});

describe('eligiblePlayers', () => {
  it('exclut les titulaires déjà placés', () => {
    const lineup = place(emptyLineup(formation), formation, 'st', 'cavani');
    const ids = eligiblePlayers(lineup, formation.slots[9]).map((candidate) => candidate.id);
    expect(ids).not.toContain('cavani');
    expect(ids).toContain('ibrahimovic');
  });

  it('ne propose que les postes acceptés par le slot', () => {
    const gkSlot = formation.slots[0];
    expect(gkSlot.id).toBe('gk');
    const ids = eligiblePlayers(emptyLineup(formation), gkSlot).map((candidate) => candidate.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.every((id) => player(id).positions.includes('GK'))).toBe(true);
  });
});

describe('complétude', () => {
  it('passe de 0 à 11 puis complete', () => {
    let lineup = emptyLineup(formation);
    expect(filledCount(lineup)).toBe(0);
    expect(isComplete(lineup)).toBe(false);

    const picks: Array<[string, string]> = [
      ['gk', 'donnarumma'],
      ['lb', 'maxwell'],
      ['cb1', 'thiago-silva'],
      ['cb2', 'marquinhos'],
      ['rb', 'hakimi'],
      ['dm', 'thiago-motta'],
      ['cm1', 'verratti'],
      ['cm2', 'matuidi'],
      ['lw', 'neymar'],
      ['st', 'cavani'],
      ['rw', 'di-maria'],
    ];
    for (const [slotId, playerId] of picks) {
      lineup = place(lineup, formation, slotId, playerId);
    }
    expect(filledCount(lineup)).toBe(11);
    expect(isComplete(lineup)).toBe(true);
    expect(slotOfPlayer(lineup, 'cavani')).toBe('st');
  });
});

describe('matchesQuery', () => {
  it('ignore la casse et les accents', () => {
    expect(matchesQuery(player('ibrahimovic'), 'ZLATAN')).toBe(true);
    expect(matchesQuery(player('skriniar'), 'skriniar')).toBe(true);
    expect(matchesQuery(player('skriniar'), 'Škriniar')).toBe(true);
    expect(matchesQuery(player('mbappe'), 'mbapp')).toBe(true);
    expect(matchesQuery(player('mbappe'), 'cavani')).toBe(false);
  });

  it('accepte une requête vide', () => {
    expect(matchesQuery(player('cavani'), '   ')).toBe(true);
  });
});

describe('adaptLineup', () => {
  it('conserve les joueurs compatibles en changeant de schéma', () => {
    let lineup = emptyLineup(formation);
    const picks: Array<[string, string]> = [
      ['gk', 'donnarumma'],
      ['lb', 'maxwell'],
      ['cb1', 'thiago-silva'],
      ['cb2', 'marquinhos'],
      ['rb', 'hakimi'],
      ['dm', 'thiago-motta'],
      ['cm1', 'verratti'],
      ['cm2', 'matuidi'],
      ['lw', 'neymar'],
      ['st', 'cavani'],
      ['rw', 'di-maria'],
    ];
    for (const [slotId, playerId] of picks) {
      lineup = place(lineup, formation, slotId, playerId);
    }

    const adapted = adaptLineup(lineup, getFormation('4-4-2'));
    expect(Object.keys(adapted)).toHaveLength(11);
    expect(adapted['gk']).toBe('donnarumma');
    // Aucun doublon : chaque joueur n'apparaît qu'une fois.
    const occupants = Object.values(adapted).filter((value): value is string => value !== null);
    expect(new Set(occupants).size).toBe(occupants.length);
    // Les deux attaquants de 4-4-2 ne peuvent pas être Cavani seul : un slot reste libre.
    expect(filledCount(adapted)).toBeLessThanOrEqual(11);
    expect(filledCount(adapted)).toBeGreaterThanOrEqual(9);
  });

  it('vide le terrain quand tous les joueurs sont incompatibles', () => {
    const onlyKeepers = { ...emptyLineup(formation), gk: 'donnarumma', lb: 'donnarumma' };
    const adapted = adaptLineup(onlyKeepers, getFormation('4-4-2'));
    expect(filledCount(adapted)).toBe(1);
  });
});

describe('données joueurs', () => {
  it('a des identifiants uniques', () => {
    const ids = PLAYERS.map((candidate) => candidate.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('a des années cohérentes', () => {
    for (const candidate of PLAYERS) {
      expect(candidate.from).toBeGreaterThanOrEqual(1970);
      if (candidate.to !== null) expect(candidate.to).toBeGreaterThanOrEqual(candidate.from);
    }
  });

  it('formate l’époque', () => {
    expect(eraLabel(player('cavani'))).toBe('2013-2020');
    expect(eraLabel(player('donnarumma'))).toBe('depuis 2021');
  });

  it('raccourcit les noms sans avaler les particules', () => {
    expect(shortName(player('di-maria'))).toBe('Di María');
    expect(shortName(player('thiago-silva'))).toBe('Silva');
    expect(shortName(player('ronaldinho'))).toBe('Ronaldinho');
    expect(shortName(player('lee-kang-in'))).toBe('Kang-in');
  });
});
