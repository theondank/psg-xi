import { describe, expect, it } from 'vitest';
import { AVATAR_PALETTE, avatarColor, initials } from './avatar';

describe('initials', () => {
  it('prend la première lettre du prénom et du nom', () => {
    expect(initials('Kylian Mbappé')).toBe('KM');
    expect(initials('Thiago Silva')).toBe('TS');
    expect(initials('Gianluigi Donnarumma')).toBe('GD');
  });

  it('garde la particule dans les initiales du nom', () => {
    expect(initials('Ángel Di María')).toBe('AM');
    expect(initials('Nuno Mendes')).toBe('NM');
  });

  it('prend les deux premières lettres pour un nom unique', () => {
    expect(initials('Ronaldinho')).toBe('RO');
    expect(initials('Neymar')).toBe('NE');
    expect(initials('Raí')).toBe('RA');
  });

  it('gère les cas dégénérés sans planter', () => {
    expect(initials('')).toBe('?');
    expect(initials('   ')).toBe('?');
  });
});

describe('avatarColor', () => {
  it('est déterministe : même id, même couleur', () => {
    expect(avatarColor('mbappe')).toBe(avatarColor('mbappe'));
    expect(avatarColor('mbappe')).toBe(avatarColor('mbappe'));
  });

  it('renvoie toujours une couleur de la palette', () => {
    const ids = ['mbappe', 'neymar', 'cavani', 'rai', 'okocha', 'bats', 'kvaratskhelia'];
    for (const id of ids) {
      expect(AVATAR_PALETTE).toContain(avatarColor(id));
    }
  });

  it('ne dépend pas de l’ordre d’appel', () => {
    const first = avatarColor('donnarumma');
    avatarColor('cavani');
    avatarColor('neymar');
    expect(avatarColor('donnarumma')).toBe(first);
  });

  it('couvre au moins trois teintes sur un échantillon large', () => {
    // Garde-fou anti-collision : tous les joueurs ne doivent pas partager la même teinte.
    const sample = Array.from({ length: 60 }, (_, index) => avatarColor(`joueur-${String(index)}`));
    expect(new Set(sample).size).toBeGreaterThanOrEqual(3);
  });
});
