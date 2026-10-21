/**
 * Avatars de joueurs : monogramme déterministe affiché sur la carte du terrain.
 *
 * Pourquoi un monogramme et pas une photo : aucun droit à l'image, aucun appel
 * réseau, et le PNG exporté reste reproductible (même id → même couleur).
 * Le passage à de vrais portraits est documenté dans docs/FEATURES.md ; cette
 * interface est le point d'insertion prévu (remplacer `avatarColor` par un
 * mapping id → URL d'image, sans toucher au composant).
 */

/** Teintes du design system (cf. docs/DESIGN.md, section terrain). */
export const AVATAR_PALETTE = ['#1b4b9c', '#123468', '#2f4f8f', '#0d2a5c', '#da291c'] as const;

/** Initiales affichées : deux lettres, sans diacritique (« Ángel » → « A »). */
export function initials(name: string): string {
  const bare = (value: string): string =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  const last = bare(parts[parts.length - 1] ?? '');
  if (parts.length === 1) {
    return (last.slice(0, 2) || '?').toUpperCase();
  }
  const first = bare(parts[0] ?? '');
  return ((first.charAt(0) || '?') + (last.charAt(0) || '?')).toUpperCase();
}

/** Couleur d'avatar stable pour un id donné (jamais aléatoire : l'export doit être reproductible). */
export function avatarColor(playerId: string): string {
  let hash = 0;
  for (const character of playerId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}
