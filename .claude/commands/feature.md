---
description: Ajoute une fonctionnalité en suivant l'ordre logique → test → UI → doc
---

Fonctionnalité demandée : **$ARGUMENTS**

Procède dans cet ordre, sans sauter d'étape.

1. **Cadre.** Lis `docs/ARCHITECTURE.md` et `docs/FEATURES.md`. Réponds en 3 lignes : quelle règle
   métier est concernée, quels fichiers vont changer, quel test va prouver que ça marche.
   Si la demande contient une ambiguïté produit (ex. que faire d'un joueur déjà titulaire ?), pose
   la question au lieu de choisir à ma place.

2. **Logique d'abord.** Écris le test dans `src/lib/*.test.ts`, lance `npm test`, constate l'échec,
   puis implémente dans `src/lib/`. Relance jusqu'au vert.

3. **État et UI.** Branche la logique dans `src/App.tsx` (état + handlers uniquement), puis le
   composant. Aucun calcul métier dans un `.tsx`. Si l'UI a besoin d'une nouvelle couleur, d'un
   nouvel espacement ou d'un nouveau composant, mets `docs/DESIGN.md` à jour dans le même lot.

4. **Vérifie.** `npm test`, `npm run lint`, `npm run build`, `npm run docs:check`, puis le parcours
   navigateur si l'écran a changé.

5. **Documente.** `docs/FEATURES.md` (la fonctionnalité et son critère d'acceptation),
   `docs/ARCHITECTURE.md` si une règle ou un flux change, `README.md` si l'usage change.

Livre ensuite : les fichiers touchés, la sortie réelle des vérifications, et une ligne sur les
limites restantes. Ne commite qu'après le point 4 vert.
