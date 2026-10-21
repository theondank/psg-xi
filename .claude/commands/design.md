---
description: Passe de design sur l'interface, avec contraintes d'export PNG
---

Objectif : **$ARGUMENTS** (par défaut : audit visuel complet et corrections ciblées).

1. Lis `docs/DESIGN.md` et ouvre l'app (`npm run dev`). Remplis un onze complet avant de juger :
   une interface vide ne montre ni les longueurs de noms ni les collisions de cartes.
2. Audite dans cet ordre, du plus grave au plus cosmétique :
   - **Lisibilité** : le nom du joueur tient-il dans sa carte (Kvaratskhelia, Donnarumma,
     Ibrahimović) ? Les textes d'époque restent lisibles ?
   - **Hiérarchie** : le terrain domine-t-il, le panneau aide-t-il, le bouton d'export est-il
     l'action principale évidente ?
   - **Densité** : espacements cohérents avec les tokens (`--space-*`), pas de padding improvisé.
   - **États** : slot vide, slot sélectionné, slot rempli, XI complet, erreur d'export.
   - **Responsive** : 1440, 900, 390 px. Rien ne doit déborder horizontalement.
3. Contraintes à ne pas casser : terrain `1000 × 1480` visible en entier au-dessus de la ligne de
   flottaison ; styles SVG en attributs ; aucune dépendance ajoutée ; texte français.
4. Applique des changements **ciblés** (une intention par commit), puis `npm run build` et une
   vérification navigateur.

Rends : la liste des défauts constatés avec leur gravité, ce que tu as changé, ce que tu as
volontairement laissé, et une capture ou une description de l'avant/après.
