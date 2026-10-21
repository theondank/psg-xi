import { photoUrlFor } from '../data/photos';

/**
 * Chargement des portraits en data URL.
 *
 * Pourquoi des data URL et pas l'URL distante directement dans le SVG :
 * le PNG est produit en chargeant le SVG sérialisé comme image, et une image
 * SVG **ne charge aucune ressource externe**. Une `<image href="https://…">`
 * s'afficherait à l'écran mais serait absente du PNG. En convertissant l'image
 * en data URL avant le rendu, le SVG cloné est autonome et l'export est fidèle.
 *
 * Le CDN API-Sports envoie `Access-Control-Allow-Origin: *`, donc le fetch
 * aboutit ; un autre hébergeur sans CORS casserait cette étape silencieusement.
 */

const cache = new Map<string, string>();

/** playerId → data URL du portrait. Un joueur sans portrait est absent de la map. */
export type PhotoMap = Readonly<Record<string, string | undefined>>;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Lecture du portrait impossible.'));
    };
    reader.onerror = () => {
      reject(new Error('Lecture du portrait impossible.'));
    };
    reader.readAsDataURL(blob);
  });
}

/** Renvoie la data URL du portrait, ou null si le joueur n'en a pas (ou en cas d'échec réseau). */
export async function loadPhoto(playerId: string): Promise<string | null> {
  const cached = cache.get(playerId);
  if (cached !== undefined) return cached;

  const url = photoUrlFor(playerId);
  if (url === null) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const dataUrl = await blobToDataUrl(await response.blob());
    cache.set(playerId, dataUrl);
    return dataUrl;
  } catch {
    // Réseau coupé ou CORS refusé : on garde le monogramme, l'app reste utilisable.
    return null;
  }
}

/** Vide le cache mémoire (utile pour tester un changement de source). */
export function clearPhotoCache(): void {
  cache.clear();
}
