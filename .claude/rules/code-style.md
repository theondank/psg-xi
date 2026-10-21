# Style de code

- **TypeScript strict.** Pas de `any`, pas de `as` pour contourner un type, pas de `!`. Si un type
  ne passe pas, c'est souvent le modèle qui est faux : `Map.get()` rend `undefined`, `find()` aussi —
  traiter le cas plutôt que l'assurer.
- **Un fichier = une responsabilité.** Logique dans `src/lib`, données dans `src/data`, rendu dans
  `src/components`. Un composant qui calcule une règle de jeu est un bug d'architecture.
- **Nommage** : identifiants en anglais (`place`, `lineup`, `eligiblePlayers`), texte utilisateur en
  français. Pas de mélange dans un même identifiant.
- **Fonctions courtes et totales.** Un mutateur renvoie toujours un `Lineup` : soit modifié, soit
  identique. Jamais `void`, jamais `undefined`, jamais d'exception.
- **Commentaires en français, au présent, sur le *pourquoi*.** Un commentaire qui répète le code
  (`// ajoute un joueur`) est du bruit ; un commentaire qui explique une décision (`// l'occupant ne
  peut pas jouer à l'ancienne place : il sort du onze`) a sa place.
- **Imports** : React d'abord, puis les modules du projet, puis les types (`import type`). Pas
  d'import circulaire : `data` ne connaît pas `lib`, `lib` ne connaît pas `components`.
- **Chaînes de caractères** : simple quotes en TS, guillemets français « » dans la doc si besoin.
  Accents obligatoires dans le texte affiché.
- **Pas de `console.log`** laissé dans le code. Pour un diagnostic temporaire, le supprimer avant
  de rendre la main.
- **Dépendances** : `react` et `react-dom` seulement. Toute addition se justifie dans le commit,
  avec le poids et l'alternative déjà présente dans le dépôt.

Formatage : Prettier (`.prettierrc`, 100 colonnes, single quotes, point-virgule, trailing comma).
Ne pas discuter le format : lancer `npm run format` ou laisser le hook le faire.
