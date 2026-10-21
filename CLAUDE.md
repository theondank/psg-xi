# Mon XI PSG — contexte projet

Application web **100 % client** : composer le onze all-time du Paris Saint-Germain sur un terrain
SVG, puis l'exporter en PNG. Pas de back-end, pas d'API, pas de compte utilisateur.

- Stack : Vite 7 + React 19 + TypeScript strict, Vitest, ESLint (typescript-eslint strict), Prettier.
- Dépendances runtime : `react`, `react-dom` uniquement. Toute nouvelle dépendance doit être justifiée
  dans le message de commit.
- Langue : **interface et documentation en français**, identifiants de code en anglais.

## Commandes

| But | Commande |
| --- | --- |
| Développement | `npm run dev` (http://localhost:5173) |
| Tests | `npm test` |
| Tests en boucle | `npm run test:watch` |
| Lint | `npm run lint` |
| Build + typecheck | `npm run build` (`tsc -b && vite build`) |
| Vérifier la doc | `npm run docs:check` |
| Formater | `npm run format` |

`npm run build` est le **seul vrai typecheck** : `vite build` seul ne vérifie pas les types.
Une tâche n'est finie que si `npm test`, `npm run lint`, `npm run build` et `npm run docs:check`
passent tous.

## Carte du code

```
src/data/players.ts        effectif typé (87 joueurs) + eraLabel() + shortName()
src/lib/formations.ts      schémas, slots, postes acceptés, coordonnées terrain
src/lib/squad.ts           LOGIQUE MÉTIER pure : place, clear, éligibilité, adaptLineup
src/lib/exportPng.ts       SVG → PNG (Blob + canvas), sans dépendance
src/components/Pitch.tsx   terrain SVG, cartes de joueurs (styles en attributs)
src/components/Picker.tsx  panneau de sélection d'un slot
src/App.tsx                état + orchestration, aucun calcul métier
src/styles.css             thème (variables CSS), layout, breakpoints
```

Flux : `PLAYERS` → `eligiblePlayers(lineup, slot)` → liste du `Picker` → `onPick(playerId)` →
`place()` → nouveau `Lineup` → re-rendu du `Pitch`.

## Règles non négociables

1. **Toute règle produit vit dans `src/lib/` et est testée sans DOM.** Les composants reçoivent des
   props et remontent des callbacks ; ils ne décident rien.
2. **Aucun mutateur ne lève d'exception.** Une action invalide renvoie le state inchangé (`place`,
   `clearSlot`). L'UI ne doit jamais pouvoir casser l'état.
3. **TypeScript strict, zéro `any`, zéro assertion non-nulle (`!`).** `eslint` est en
   `strictTypeChecked` : un cast qui ment sera refusé. Préférer un type guard ou un `undefined`
   explicite (`Map.get()` rend `undefined`, pas `null`).
4. **Un joueur ne peut occuper qu'un slot.** `place()` gère l'échange (si l'occupant peut jouer à
   l'ancienne place) ou l'envoi au banc. Ne pas réimplémenter cette logique dans un composant.
5. **Un slot n'accepte que les postes listés dans `slot.accepts`.** Élargir un poste = modifier
   `formations.ts`, les tests de `formations.test.ts` et `docs/DATA.md`.
6. **Styles SVG en attributs de présentation, jamais en classes CSS.** Le PNG est produit en
   clonant le SVG dans un Blob : la feuille de style de l'app ne s'y applique pas. Couleurs SVG :
   la constante `COLORS` de `Pitch.tsx`. Couleurs de l'interface : variables CSS de `styles.css`.
   Aucun code hexadécimal ailleurs.
7. **Terrain : viewBox `1000 × 1480`, ratio 0,676.** La largeur du conteneur est plafonnée par la
   hauteur d'écran (`max-width: min(580px, calc((100vh - 230px) * 0.676))`) pour que le gardien
   reste au-dessus de la ligne de flottaison. Toute modification du viewBox impose de recalculer
   cette formule.
8. **Pas d'appel réseau dans l'app.** Les données joueurs sont statiques, saisies à la main :
   c'est la seule source de vérité.

## Méthode de travail

- **Test d'abord** quand la tâche touche une règle métier : écrire le test qui échoue dans
  `src/lib/*.test.ts`, puis le code. Les deux bugs de la première version (déréférence `null`,
  libellé « María ») ont été trouvés par les tests, pas à l'œil.
- **Vérifier dans un vrai navigateur** dès qu'on touche l'UI : `npm run preview -- --port 4173`,
  remplir un onze, vérifier le badge `11/11 · XI complet`, cliquer « Exporter en PNG » et vérifier
  que le fichier produit fait bien 2000 × 2960. Un export qui plante au clic ne se voit pas dans
  les tests.
- **Un commit = un lot cohérent**, message en français au format `type(scope): résumé` + corps
  qui explique le *pourquoi* (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).
- **Ne pas réécrire l'historique**, ne pas `git push --force` sur `main`.

## Où intervenir selon la demande

| Demande | Fichiers |
| --- | --- |
| Ajouter / corriger un joueur | `src/data/players.ts` (+ test si poste ambigu) |
| Nouveau schéma tactique | `src/lib/formations.ts`, `formations.test.ts`, `docs/DATA.md` |
| Changement de règle de placement | `src/lib/squad.ts`, `squad.test.ts`, `docs/ARCHITECTURE.md` |
| Design, couleurs, typo | `src/styles.css`, `COLORS` dans `Pitch.tsx`, `docs/DESIGN.md` |
| Nouvelle fonctionnalité | `src/lib/` (logique + test) puis `src/App.tsx` puis le composant |
| Documentation | `docs/`, `README.md`, `npm run docs:check` |

## Détail des règles

- `docs/ARCHITECTURE.md` — modèle d'état, invariants, décisions techniques.
- `docs/DESIGN.md` — design system, tokens, composants, contraintes d'export.
- `docs/DATA.md` — schéma joueur, vocabulaire des postes, procédure d'ajout.
- `docs/FEATURES.md` — fonctionnalités actuelles, critères d'acceptation, backlog priorisé.
- `docs/TESTING.md` — ce qui est testé, ce qui ne l'est pas, recette navigateur.
- `docs/CONTRIBUTING.md` — workflow de branche, definition of done, revue.

## Pièges connus

- `defineConfig` doit venir de `vitest/config`, pas de `vite`, dès que la config contient un bloc
  `test` — sinon `tsc -b` échoue.
- Le test de `place()` couvre un cas subtil : l'occupant du slot cible **ne peut pas** jouer à
  l'ancienne place (ex. Marquinhos CB→RB avec Hakimi en RB) → Hakimi sort du onze, il n'y a pas
  d'échange. Ne pas « corriger » ça sans changer les tests et la doc.
- `shortName()` garde les particules (`Di María`), sinon on affiche « María ».
- Ne pas lancer `pkill -f "vite preview"` : le motif matche le shell wrapper et le tue lui-même.
