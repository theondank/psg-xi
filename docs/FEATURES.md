# Fonctionnalités

## Ce qui existe aujourd'hui

| # | Fonctionnalité | Critère d'acceptation |
| --- | --- | --- |
| F1 | Quatre schémas tactiques | Le clic sur un chip change le terrain en gardant les joueurs compatibles, sans doublon |
| F2 | Effectif de 87 joueurs (1974 → aujourd'hui) | Chaque fiche a un id unique, une période cohérente, au moins un poste valide |
| F3 | Éligibilité par poste | Un slot n'affiche que les joueurs dont un poste est accepté par ce slot |
| F4 | Placement avec échange | Déplacer un titulaire libère son slot ; l'occupant échange s'il peut jouer à l'ancienne place, sinon il repart au banc |
| F5 | Changement de schéma sans perte | 11/11 en 4-3-3 → au moins 9/11 en 4-4-2, aucun joueur dupliqué, aucun joueur incompatible conservé |
| F6 | Panneau de sélection | Clic sur une carte → liste des éligibles, recherche insensible à la casse et aux accents, compteur de disponibilité |
| F7 | Retrait et réinitialisation | « Retirer » vide le slot courant ; « Réinitialiser » vide les 11 et ferme le panneau |
| F8 | Progression | Badge `n/11`, état vert `11/11 · XI complet`, message « prêt à exporter » |
| F9 | Export PNG | Le clic produit un fichier 2000 × 2960 nommé `mon-xi-psg-<schéma>.png`, avec tous les noms lisibles |
| F10 | Clavier | Chaque carte est focusable, Entrée/Espace ouvre le sélecteur, `aria-label` explicite |
| F11 | Responsive | Aucun débordement horizontal à 1440, 900 et 390 px ; le terrain tient au-dessus de la ligne de flottaison en desktop |
| F12 | Erreur d'export | Un échec de conversion affiche un bandeau `role="alert"` au lieu d'échouer en silence |
| F13 | Avatars monogrammes | Chaque carte porte un médaillon : initiales sans diacritique + couleur déterministe issue de l'id ; identique à l'écran et dans le PNG |
| F14 | Pipeline portraits | Si un joueur a une URL dans `src/data/photos.ts`, son portrait s'affiche dans le médaillon et se retrouve dans le PNG exporté ; en cas d'absence, d'échec réseau ou de CORS refusé, le monogramme reste (aucune image cassée) |

Sauf F14 (portraits chargés à la demande depuis le CDN), rien de tout cela ne dépend du réseau :
l'app démarre et fonctionne hors ligne après chargement.

## Backlog priorisé

Effort : **S** ≈ moins d'une heure, **M** ≈ une demi-journée, **L** ≈ une journée ou plus.

### À fort effet, effort faible

| Priorité | Fonctionnalité | Objectif | Critère d'acceptation | Effort |
| --- | --- | --- | --- | --- |
| P0 | Compléter les portraits | Vrais visages sur les 87 fiches | `APISPORTS_KEY=… node scripts/fetch-photo-ids.mjs` puis contrôle visuel d'un échantillon ; aucun joueur ne doit afficher un visage d'un autre joueur | S (bloqué : clé API-Sports) |
| P1 | Partage par URL | Envoyer sa compo sans capture d'écran | `?f=4-3-3&p=gk:donnarumma,lb:maxwell,…` recharge exactement le même onze ; paramètre invalide ignoré sans casser la page ; test unitaire de `encodeLineup`/`decodeLineup` (aller-retour + entrées malformées) | S |
| P2 | Persistance locale | Retrouver sa compo après un rafraîchissement | Le state est sauvegardé sous une clé versionnée (`psg-xi:v1`), restauré au chargement, et un schéma obsolète ne bloque pas l'app | S |
| P3 | XI aléatoire | Démarrer en un clic, contenu de démo | Remplit 11 slots avec des joueurs éligibles, jamais deux fois le même ; un test vérifie qu'aucun slot n'est incompatible | S |
| P4 | Lien « copier » | Partager sans passer par la barre d'adresse | Bouton qui copie l'URL de partage et confirme visuellement (état `copié` 2 s) | S |

### Effort moyen, valeur réelle

| Priorité | Fonctionnalité | Objectif | Critère d'acceptation | Effort |
| --- | --- | --- | --- | --- |
| P5 | Export story 1080 × 1920 | Format Instagram | Second rendu (viewBox dédié) réutilisant le même arbre SVG ; deux boutons d'export distincts | M |
| P6 | Banc visible | Comprendre qui a été écarté | Les joueurs non titulaires apparaissent dans une liste « banc » triée par poste ; un clic les remet sur le terrain | M |
| P7 | Glisser-déposer | Gestuelle naturelle sur desktop | Déplacer une carte vers un slot compatible ; refus visuel (curseur interdit) si incompatible ; le clic simple continue de fonctionner | M |
| P8 | `ErrorBoundary` | Ne jamais afficher un écran blanc | Une exception de rendu affiche un message et un bouton de rechargement | S |
| P9 | Histoire du club | Contexte sur chaque fiche | Une ligne factuelle par joueur, sans note ni classement | L |

### À trancher avant de coder (décisions produit)

| Sujet | La question | Pourquoi ce n'est pas à l'agent de décider |
| --- | --- | --- |
| Notation des joueurs | Note par poste ? Par siècle ? Par utilisateur ? | C'est une opinion : il faut dire qui note et sur quelle base, sinon l'app invente une vérité |
| Photos de joueurs | Remplacer le monogramme par de vrais portraits | **Tranché** : CDN API-Sports. Le pipeline est en place (F14) ; il ne manque que la clé api-sports.io pour générer la table des ids (`scripts/fetch-photo-ids.mjs`) |
| Comparaison avec un onze réel | Confronter la compo à un onze aligné une saison donnée | Demande une source de compositions officielles : périmètre et effort à valider |
| Thème clair | Proposer deux thèmes | L'export est sombre : un thème clair crée deux rendus à maintenir pour un gain discutable |

## Non-objectifs assumés

- Pas de compte utilisateur, pas de vote en ligne, pas de base de données.
- Pas de données live (résultats, transferts) : le projet est un objet de composition, pas un
  tracker.
- Pas de contenu généré à la volée par un LLM dans l'app : le runtime reste déterministe.

## Définition de « terminé » pour une fonctionnalité

1. La règle métier est dans `src/lib/` et couverte par un test qui échouait avant.
2. `npm test`, `npm run lint`, `npm run build` et `npm run docs:check` sont verts.
3. Le parcours réel a été fait dans un navigateur, avec la vérification de l'export si l'écran a
   changé.
4. `docs/FEATURES.md` (cette table) et, si nécessaire, `docs/ARCHITECTURE.md` / `docs/DESIGN.md`
   sont à jour dans le même lot.
