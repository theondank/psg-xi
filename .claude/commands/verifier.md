---
description: Vérifie le projet de bout en bout avant de rendre la main
---

Vérifie le dépôt et rapporte **la sortie réelle**, pas une conclusion.

1. `npm test` — attends 37 tests (ou plus) et zéro échec.
2. `npm run lint` — zéro erreur, zéro warning.
3. `npm run build` — `tsc -b` puis `vite build` doivent passer.
4. `npm run docs:check` — liens et commandes de la documentation valides.

Si l'interface a changé, ajoute le parcours navigateur :

5. `npm run preview -- --port 4173` en tâche de fond, puis remplis un onze complet et vérifie le
   compteur `11/11 XI complet`, ouvre le sélecteur sur un slot, change de schéma, et clique
   « Exporter en PNG » : le fichier produit doit faire 2000 × 2960.

Si une étape échoue : corrige, relance l'étape, et ne déclare jamais un succès sans sa sortie.
Termine par un tableau `étape | résultat | preuve` (nombre de tests, code de sortie, dimensions du
PNG) et une ligne sur ce qui n'a **pas** été vérifié.

$ARGUMENTS
