# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Supporter du Paris Saint-Germain qui compose son onze all-time **pour le partager** : réseaux
sociaux, groupe d'amis, discussion de forum. Il connaît l'histoire du club, a des avis tranchés et
veut une image qui porte son choix et lance le débat. Usage ponctuel, desktop ou mobile, sans
compte.

## Product Purpose

Composer le onze historique du PSG sur un terrain, avec des règles de poste crédibles, puis
l'exporter en PNG. **Une session réussie se termine par un PNG exporté et posté** : l'image est la
finalité, elle doit être belle et lisible hors de l'app, sans contexte autour.

## Positioning

Ce qu'un générateur générique de type « build your XI » ne peut pas revendiquer :

- **Effectif PSG curaté** : 87 joueurs saisis à la main, de 1974 à aujourd'hui, postes,
  nationalités et périodes au club vérifiés. La donnée est la valeur, et la seule source de vérité.
- **Règles de poste réelles** : un slot n'accepte que les postes listés pour lui ; déplacer un
  titulaire déclenche un échange ou un retour au banc. Pas de défenseur central en pointe.
- **Export soigné, hors ligne** : PNG 2000 × 2960 fidèle à l'écran, sans compte, sans publicité ;
  seuls les portraits (F14) passent par le réseau, avec repli monogramme.

## Operating Context

- Parcours : choisir un schéma → cliquer un slot → choisir un joueur éligible → 11/11 · XI complet
  → « Exporter en PNG » → publication hors de l'app.
- L'image exportée vit seule, dans un fil social ou une conversation : elle doit se comprendre sans
  l'interface.
- Recherche de joueurs insensible à la casse et aux accents (noms brésiliens, argentins, etc.).

## Capabilities and Constraints

- Application 100 % client : pas de back-end, pas de compte. Seule exception réseau : les portraits
  chargés depuis le CDN API-Sports (F14) ; sans eux, l'app fonctionne entièrement hors ligne.
- Stack : Vite + React + TypeScript strict ; dépendances runtime limitées à `react` et `react-dom`.
- Quatre schémas (`4-3-3`, `4-4-2`, `3-5-2`, `4-2-3-1`) ; changement de schéma sans perte des
  joueurs compatibles.
- Export : le SVG du terrain est cloné dans un Blob puis rasterisé. Styles en attributs de
  présentation, aucune ressource externe, aucune webfont, aucun filtre, aucune animation sur le
  terrain. viewBox 1000 × 1480.
- Interface et documentation en français ; identifiants de code en anglais.
- Non-objectifs : vote en ligne, base de données, données live, contenu généré par LLM au runtime.
- **Décisions ouvertes** (voir `docs/FEATURES.md`) : notation des joueurs, vraies photos (droits
  d'usage non tranchés), comparaison avec un onze réel.
- Thème : l'interface suit le thème de l'OS (clair / sombre) ; le terrain et le PNG le suivront aussi
  (décision du 2026-10-21, mise en œuvre lors de la passe terrain).

## Brand Commitments

- Nom : « Mon XI PSG ».
- Couleurs du club : rouge PSG en accent de sélection et d'action principale, bleu nuit du club.
- Aucun logo ou écusson officiel n'est embarqué : ne pas en ajouter sans arbitrage sur les droits.
- Registre visuel : « moderne classique », au niveau de finition des apps sport officielles (app du
  club, Ligue 1+, FotMob, Sofascore). Le standard de la catégorie exécuté proprement, pas un concept
  décalé ; refus explicite des tics « IA » (fond nuit + halo, cartes imbriquées, typo sans voix).

## Evidence on Hand

- Effectif réel : `src/data/players.ts` (87 fiches).
- Schémas et postes acceptés : `src/lib/formations.ts`.
- Pipeline de portraits en place (`src/data/photos.ts`), table vide tant que la clé API-Sports
  n'est pas fournie : ne jamais deviner un id. Aucun témoignage, aucune statistique d'usage, aucun partenariat : ne rien
  inventer de tel.

## Product Principles

1. **L'image exportée est le produit.** Toute décision se juge à ce qu'elle produit dans le PNG
   posté.
2. **La donnée fait autorité.** Une fiche fausse est un bug ; jamais d'approximation ni de donnée
   inventée.
3. **Des règles crédibles pour un supporter.** Le terrain refuse ce qu'un connaisseur jugerait
   absurde, sans jamais bloquer ni casser l'état.
4. **Zéro friction, zéro dépendance.** Pas de compte, aucun réseau requis : ouvrir, composer, exporter.

## Accessibility & Inclusion

Navigation clavier complète (cartes focusables, Entrée/Espace, `aria-label` explicites), focus
visible, aucun débordement horizontal à 390 px.
