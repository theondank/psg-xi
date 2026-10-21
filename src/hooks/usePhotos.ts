import { useEffect, useState } from 'react';
import { loadPhoto, type PhotoMap } from '../lib/photos';
import type { Lineup } from '../lib/squad';

/**
 * Charge les portraits des titulaires dès qu'ils changent.
 * Les photos déjà chargées restent en mémoire (le onze change souvent) et un
 * joueur sans portrait est simplement absent de la map : le monogramme reste.
 */
export function usePhotos(lineup: Lineup): PhotoMap {
  const [photos, setPhotos] = useState<PhotoMap>({});

  useEffect(() => {
    const playerIds = Object.values(lineup).filter((playerId): playerId is string => playerId !== null);
    if (playerIds.length === 0) return;

    let cancelled = false;
    void Promise.all(
      playerIds.map(async (playerId) => ({ playerId, dataUrl: await loadPhoto(playerId) })),
    )
      .then((loaded) => {
        if (cancelled) return;
        const found = loaded.filter(
          (entry): entry is { playerId: string; dataUrl: string } => entry.dataUrl !== null,
        );
        if (found.length === 0) return;
        setPhotos((previous) => {
          const next: Record<string, string | undefined> = { ...previous };
          for (const entry of found) next[entry.playerId] = entry.dataUrl;
          return next;
        });
      })
      .catch(() => {
        // Chargement best-effort : l'absence de portrait n'est jamais une erreur visible.
      });

    return () => {
      cancelled = true;
    };
  }, [lineup]);

  return photos;
}
