#!/usr/bin/env node
/**
 * Génère `src/data/photos.ts` : correspondance joueur → portrait du CDN API-Sports.
 *
 *   APISPORTS_KEY=xxxxx node scripts/fetch-photo-ids.mjs
 *   node scripts/fetch-photo-ids.mjs --dry-run     (aucun réseau, aucune clé)
 *
 * Pourquoi ce script existe : les ids de `media.api-sports.io/football/players/<id>.png`
 * sont internes au fournisseur. On les résout via l'API api-sports.io, qui exige
 * une clé. Aucun id n'est deviné : seules les correspondances de nom certaines
 * sont écrites, le reste est signalé « non résolu » et garde son monogramme.
 *
 * Plan gratuit : ~100 requêtes/jour → 87 joueurs tiennent dans une journée.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PLAYERS_FILE = join(ROOT, 'src', 'data', 'players.ts');
const OUT_FILE = join(ROOT, 'src', 'data', 'photos.ts');
const API = 'https://v3.football.api-sports.io/players';
const CDN = 'https://media.api-sports.io/football/players';
const DRY_RUN = process.argv.includes('--dry-run');

const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[.'’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

function readPlayers() {
  const source = readFileSync(PLAYERS_FILE, 'utf8');
  const players = [];
  for (const match of source.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'/g)) {
    players.push({ id: match[1], name: match[2] });
  }
  return players;
}

/** « K. Mbappé » + « Kylian Mbappé » → même joueur ; on exige un candidat unique. */
function matchPlayer(results, wanted) {
  const target = normalize(wanted);
  const exact = results.filter((result) => normalize(result.player.name) === target);
  if (exact.length === 1) return { id: exact[0].player.id, how: 'exact' };

  const surname = target.split(' ').pop();
  const initial = target.split(' ')[0]?.[0];
  const abbreviated = results.filter((result) => {
    const parts = normalize(result.player.name).split(' ');
    return parts.length === 2 && parts[1] === surname && parts[0]?.[0] === initial;
  });
  if (abbreviated.length === 1) return { id: abbreviated[0].player.id, how: 'initiale' };

  return null;
}

async function searchPlayer(name, key) {
  const url = `${API}?search=${encodeURIComponent(name)}`;
  const response = await fetch(url, { headers: { 'x-apisports-key': key } });
  if (!response.ok) {
    throw new Error(`API-Sports ${String(response.status)} sur « ${name} »`);
  }
  const payload = await response.json();
  const results = Array.isArray(payload.response) ? payload.response : [];
  return results;
}

async function main() {
  const players = readPlayers();
  if (players.length !== 87) {
    console.error(
      `Attendu 87 joueurs dans ${PLAYERS_FILE}, trouvé ${String(players.length)}. ` +
        'Le format du fichier a changé : adapter la regex avant de continuer.',
    );
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log(`--dry-run : ${String(players.length)} joueurs lus, aucun appel réseau.`);
    console.log('Exemple de sortie :');
    console.log(
      [
        'export const PLAYER_PHOTOS: Readonly<Record<string, string>> = {',
        `  'mbappe': '${CDN}/276.png',`,
        `  'cavani': '${CDN}/299.png',`,
        '};',
      ].join('\n'),
    );
    return;
  }

  const key = process.env.APISPORTS_KEY;
  if (!key) {
    console.error('APISPORTS_KEY manquant. Créer un compte sur api-sports.io puis :');
    console.error('  APISPORTS_KEY=xxxxx node scripts/fetch-photo-ids.mjs');
    process.exit(1);
  }

  const photos = {};
  const unresolved = [];
  const failures = [];

  for (const player of players) {
    try {
      const results = await searchPlayer(player.name, key);
      const match = matchPlayer(results, player.name);
      if (match === null) {
        unresolved.push(player);
        console.log(`  ? ${player.name} — ${String(results.length)} résultat(s), aucun certain`);
      } else {
        photos[player.id] = `${CDN}/${String(match.id)}.png`;
        console.log(`  ✓ ${player.name} → ${String(match.id)} (${match.how})`);
      }
    } catch (error) {
      failures.push({ player, error: String(error) });
      console.log(`  ✗ ${player.name} — ${String(error)}`);
      await new Promise((done) => setTimeout(done, 2000));
    }
    // Respecte le débit du plan gratuit.
    await new Promise((done) => setTimeout(done, 700));
  }

  const entries = Object.entries(photos)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, url]) => `  '${id}':\n    '${url}',`)
    .join('\n');

  const header = `/**
 * Correspondance joueur → portrait (CDN API-Sports).
 * Généré par scripts/fetch-photo-ids.mjs le ${new Date().toISOString().slice(0, 10)}.
 * ${String(Object.keys(photos).length)} correspondances certaines sur ${String(players.length)} joueurs.
${
  unresolved.length > 0
    ? ` * Non résolus (monogramme conservé) : ${unresolved.map((player) => player.name).join(', ')}.\n`
    : ''
} * Les ids viennent de l'API api-sports.io ; ne jamais en inventer un.
 */
`;

  writeFileSync(
    OUT_FILE,
    `${header}\nexport const PLAYER_PHOTOS: Readonly<Record<string, string>> = {\n${entries}\n};\n\n` +
      '/** URL du portrait d\'un joueur, ou null s\'il n\'y en a pas. */\n' +
      'export function photoUrlFor(playerId: string): string | null {\n' +
      '  return PLAYER_PHOTOS[playerId] ?? null;\n' +
      '}\n',
    'utf8',
  );

  console.log(
    `\n${String(Object.keys(photos).length)}/${String(players.length)} correspondances écrites dans src/data/photos.ts`,
  );
  if (unresolved.length > 0) {
    console.log(`${String(unresolved.length)} non résolu(s), ${String(failures.length)} erreur(s).`);
  }
}

await main();
