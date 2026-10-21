import { describe, expect, it } from 'vitest';
import { PLAYERS_BY_ID } from '../data/players';
import { PLAYER_PHOTOS, photoUrlFor } from '../data/photos';

describe('photoUrlFor', () => {
  it('renvoie null pour un joueur sans portrait', () => {
    expect(photoUrlFor('joueur-inexistant')).toBeNull();
  });

  it("ne renvoie jamais autre chose qu'une URL ou null", () => {
    for (const url of Object.values(PLAYER_PHOTOS)) {
      expect(typeof url).toBe('string');
      expect(url.startsWith('https://') || url.startsWith('data:image/')).toBe(true);
    }
  });
});

describe('intégrité de la correspondance portraits', () => {
  it('ne référence que des joueurs réels', () => {
    for (const playerId of Object.keys(PLAYER_PHOTOS)) {
      expect(PLAYERS_BY_ID.has(playerId), `id inconnu dans photos.ts : ${playerId}`).toBe(true);
    }
  });

  it('ne duplique pas une URL pour deux joueurs', () => {
    const urls = Object.values(PLAYER_PHOTOS);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
