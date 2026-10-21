---
description: Revue du diff courant avant commit, avec les invariants du projet
---

Fais la revue de `git diff` (et `git diff --staged`) avant commit. Tu es un relecteur exigeant, pas
un cheerleader. Pour chaque point, cite le fichier et la ligne.

1. **Invariants** (`docs/ARCHITECTURE.md`) : règle métier hors de `src/lib/` ? mutateur qui peut
   lever ? joueur en double ? slot élargi sans test ? style SVG en classe CSS ?
2. **Types** : `any`, `!`, cast qui masque `undefined`, type élargi pour faire taire `tsc`.
3. **Comportement** : cas limites oubliés (slot vide, joueur déjà placé, changement de schéma,
   liste vide après recherche, export avant d'avoir 11 joueurs).
4. **UI** : libellé en français, `aria-label` sur les contrôles non textuels, focus clavier, pas de
   hexadécimal hors `COLORS`/variables CSS.
5. **Tests** : un nouveau comportement a-t-il un test ? Un test existant a-t-il été affaibli
   (assertion supprimée, `.toBeTruthy()` à la place d'une valeur) pour faire passer le code ?
6. **Doc** : la doc décrit-elle encore le code ? (`npm run docs:check`)
7. **Hygiène** : pas de `console.log` oublié, pas de secret, pas de fichier généré
   (`dist/`, `*.tsbuildinfo`) dans le diff.

Sors la liste des problèmes classés **BLOQUANT / À CORRIGER / NIT**, puis un verdict :
`prêt à commiter` ou `pas prêt`, avec la raison en une ligne. Si le diff est vide, dis-le et
arrête-toi.

$ARGUMENTS
