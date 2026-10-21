# Git et livraison

- **Une branche par lot**, nommée `type/sujet-court` : `feat/partage-url`, `fix/carte-tronquee`,
  `docs/harness`, `design/contraste-cartes`.
- **Jamais de commit direct sur `main`** pour une fonctionnalité : branche, vérifications, puis merge.
  Une correction de documentation d'une ligne peut aller sur `main`.
- **Message** : `type(scope): impératif court` (≤ 72 caractères) puis un corps qui explique le
  pourquoi, les compromis, et ce qui n'a pas été fait. En français.
- **Un commit doit passer les quatre vérifications** (`npm test`, `npm run lint`, `npm run build`,
  `npm run docs:check`). Ne pas commiter un état intermédiaire cassé ; utiliser `git stash` pour
  changer de sujet.
- **Ne jamais** : `git push --force` sur `main`, `git reset --hard` sur du travail non poussé,
  réécrire l'historique partagé, commiter un secret, commiter `dist/` ou `*.tsbuildinfo`.
- **Avant de pousser** : `git diff --staged` relu, puis `/revue`. Après avoir poussé : vérifier que
  la CI est verte (le run GitHub Actions, pas seulement la commande `git push`).
- **Documentation** : une fonctionnalité livrée sans mise à jour de `docs/FEATURES.md` est une
  fonctionnalité incomplète.
