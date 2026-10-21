/**
 * Correspondance joueur → portrait.
 *
 * Source : CDN API-Sports (`media.api-sports.io`), qui sert les images par id
 * interne (HTTP 200, image/png, CORS `*` — donc embarquable dans l'export PNG).
 *
 * ⚠️ Les identifiants ne sont pas devinables : ils s'obtiennent via l'API
 * api-sports.io, qui exige une clé. Générer ce fichier avec :
 *
 *   APISPORTS_KEY=xxx node scripts/fetch-photo-ids.mjs
 *
 * Le script n'écrit que les correspondances exactes (nom complet identique) et
 * liste les joueurs non résolus. Ne jamais saisir un id « au hasard » : un
 * visage faux est pire qu'un monogramme.
 *
 * Aucune URL n'est une donnée de test : ce fichier est vide tant que la clé
 * n'a pas été fournie, et l'interface retombe alors sur les monogrammes.
 */

export const PLAYER_PHOTOS: Readonly<Record<string, string>> = {};

/** URL du portrait d'un joueur, ou null s'il n'y en a pas. */
export function photoUrlFor(playerId: string): string | null {
  return PLAYER_PHOTOS[playerId] ?? null;
}
