import { PLAYERS, PLAYERS_BY_ID, type Player } from '../data/players';
import { findSlot, type Formation, type Slot } from './formations';

/** Association slotId → playerId (ou null si le slot est vide). */
export type Lineup = Readonly<Record<string, string | null>>;

export function emptyLineup(formation: Formation): Lineup {
  return Object.fromEntries(formation.slots.map((formationSlot) => [formationSlot.id, null]));
}

export function isEligible(slot: Slot, player: Player): boolean {
  return player.positions.some((position) => slot.accepts.includes(position));
}

/** Joueur placé sur ce slot, ou null. */
export function playerAt(lineup: Lineup, slotId: string): Player | null {
  const playerId = lineup[slotId];
  if (!playerId) return null;
  return PLAYERS_BY_ID.get(playerId) ?? null;
}

export function slotOfPlayer(lineup: Lineup, playerId: string): string | null {
  const entry = Object.entries(lineup).find(([, occupant]) => occupant === playerId);
  return entry ? entry[0] : null;
}

/**
 * Place un joueur sur un slot.
 * - refuse si le joueur n'existe pas ou n'a pas le poste requis ;
 * - si le joueur occupait déjà un autre slot : échange avec le titulaire du
 *   slot cible quand celui-ci peut jouer à l'ancienne place, sinon il part sur
 *   le banc (le titulaire reste en place et le joueur libéré redevient
 *   sélectionnable) ;
 * - renvoie le lineup inchangé si l'opération est invalide (pas d'exception :
 *   l'UI ne peut pas casser l'état).
 */
export function place(lineup: Lineup, formation: Formation, slotId: string, playerId: string): Lineup {
  const targetSlot = findSlot(formation, slotId);
  const player = PLAYERS_BY_ID.get(playerId);
  if (!targetSlot || !player || !isEligible(targetSlot, player)) return lineup;

  const next: Record<string, string | null> = { ...lineup };
  const previousSlotId = slotOfPlayer(lineup, playerId);
  const occupantId = next[slotId] ?? null;

  next[slotId] = playerId;
  if (previousSlotId !== null && previousSlotId !== slotId) {
    const previousSlot = findSlot(formation, previousSlotId);
    const occupant = occupantId === null ? undefined : PLAYERS_BY_ID.get(occupantId);
    const canSwap =
      previousSlot !== undefined && occupant !== undefined && isEligible(previousSlot, occupant);
    next[previousSlotId] = canSwap ? occupantId : null;
  }
  return next;
}

export function clearSlot(lineup: Lineup, slotId: string): Lineup {
  if (!(slotId in lineup)) return lineup;
  return { ...lineup, [slotId]: null };
}

export function clearAll(lineup: Lineup): Lineup {
  return Object.fromEntries(Object.keys(lineup).map((slotId) => [slotId, null]));
}

/** Joueurs sélectionnables pour un slot : bon poste et pas déjà titulaire ailleurs. */
export function eligiblePlayers(lineup: Lineup, slot: Slot, roster: readonly Player[] = PLAYERS): Player[] {
  return roster.filter((player) => isEligible(slot, player) && slotOfPlayer(lineup, player.id) === null);
}

export function filledCount(lineup: Lineup): number {
  return Object.values(lineup).filter((playerId) => playerId !== null).length;
}

export function isComplete(lineup: Lineup): boolean {
  return Object.values(lineup).every((playerId) => playerId !== null);
}

/** Recherche insensible à la casse et aux accents approximatifs. */
export function matchesQuery(player: Player, query: string): boolean {
  const needle = query
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (needle === '') return true;
  const haystack = player.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return haystack.includes(needle);
}

/**
 * Réutilise un onze existant après un changement de schéma : chaque slot de la
 * nouvelle formation récupère un titulaire compatible encore libre. Les joueurs
 * sans poste correspondant repartent sur le banc. Aucune perte silencieuse :
 * l'appelant peut comparer les effectifs avant/après.
 */
export function adaptLineup(previous: Lineup, nextFormation: Formation): Lineup {
  const pool = Object.values(previous).filter((playerId): playerId is string => playerId !== null);
  let next = emptyLineup(nextFormation);

  for (const nextSlot of nextFormation.slots) {
    const alreadyPlaced = new Set(
      Object.values(next).filter((playerId): playerId is string => playerId !== null),
    );
    const candidateId = pool.find((playerId) => {
      if (alreadyPlaced.has(playerId)) return false;
      const candidate = PLAYERS_BY_ID.get(playerId);
      return candidate !== undefined && isEligible(nextSlot, candidate);
    });
    if (candidateId !== undefined) {
      next = place(next, nextFormation, nextSlot.id, candidateId);
    }
  }
  return next;
}
