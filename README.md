# Mon XI PSG — all-time

Compose le onze historique du Paris Saint-Germain sur un terrain, puis exporte-le en PNG.
100 % client, aucune API, aucune clé, aucun back-end.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
```

Autres scripts :

```bash
npm test         # Vitest (logique pure)
npm run lint     # ESLint (typescript-eslint strict)
npm run build    # tsc -b + vite build → dist/
npm run preview  # sert le build de production
```

## Ce que fait l'app

- 4 schémas : `4-3-3`, `4-4-2`, `3-5-2`, `4-2-3-1`, chacun avec ses slots et ses postes acceptés.
- 87 joueurs du PSG, de 1974 à aujourd'hui : postes, nationalité, période au club.
- Un slot n'accepte que les joueurs dont un poste correspond (un CB ne peut pas finir en ST).
- Un joueur déjà titulaire peut être déplacé : échange automatique si le titulaire du slot cible
  peut jouer à l'ancienne place, sinon il repart sur le banc.
- Changement de schéma sans perdre la compo : `adaptLineup` replace les joueurs compatibles.
- Export PNG en 2× par sérialisation SVG → canvas (pas de librairie de screenshot).
- Recherche insensible à la casse et aux accents.

## Structure

```
src/
  data/players.ts       effectif (données statiques, source unique de vérité)
  lib/formations.ts     schémas, slots, postes acceptés, coordonnées
  lib/squad.ts          logique pure : place, clear, eligibilité, adaptLineup
  lib/exportPng.ts      SVG → PNG (Blob + canvas, sans dépendance)
  components/Pitch.tsx  terrain SVG (styles en attributs → export fidèle)
  components/Picker.tsx panneau de sélection
  App.tsx               état + orchestration
```

## Choix techniques

- **Logique pure séparée du rendu** : tout ce qui décide (placement, éligibilité, réadaptation)
  vit dans `lib/squad.ts` et est testé sans DOM. Les composants ne font que de l'affichage.
- **Pas de `throw` dans `place`** : une opération invalide renvoie le lineup inchangé, l'UI ne peut
  pas casser l'état.
- **Styles SVG en attributs**, pas en classes CSS : l'export PNG clone le SVG dans un Blob, où les
  feuilles de style de l'app ne s'appliquent pas.
- **TypeScript strict** + `noUnusedLocals`, ESLint `strictTypeChecked`, Prettier.

## Données

Les joueurs, années et nationalités sont saisis à la main : c'est la seule source de vérité, donc
la seule chose à corriger si une fiche est fausse. Pas de scraping, pas de dépendance à une API
qui casse. Ajouter un joueur = une ligne dans `src/data/players.ts` (+ un test si le poste est
ambigu).

## Pistes pour la suite

- Partager la compo via l'URL (`?f=4-3-3&p=gk:donnarumma,...`) — sérialisation pure, testable.
- Mode « draft » : deux joueurs tirent au sort depuis un pool commun.
- Notation par pair (notes de la rédaction) — attention, ça devient une opinion à assumer.
- Export en story 1080×1920 : un deuxième viewBox suffit.
