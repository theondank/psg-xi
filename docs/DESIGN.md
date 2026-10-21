# Design system

Un seul écran, au niveau de finition des apps sport officielles : une barre de marque, la scène du
terrain, et une **feuille de match** en panneau d'outil pleine hauteur. Thème clair ou sombre selon
l'OS (`prefers-color-scheme`). Le terrain domine, l'interface est un outil neutre autour de lui.

Ce qu'on refuse (anciennes dérives) : fond bleu nuit avec halo lumineux, boîtes arrondies imbriquées,
typo sans voix, barre d'actions où tout se dispute l'attention.

## Principes

1. **Le terrain est le contenu.** Tout le reste est un contrôle. Si un élément n'aide pas à composer
   ou à comprendre le onze, il n'a pas sa place sur l'écran.
2. **Deux palettes, deux rôles.** Le SVG porte ses propres couleurs (`COLORS` dans `Pitch.tsx`) parce
   qu'il doit survivre à l'export PNG ; l'interface utilise les variables CSS de `styles.css`.
   Ne pas mélanger : une couleur de carte joueur ne se règle pas dans `styles.css`.
3. **Neutres + un accent.** L'interface est en gris froids ; le rouge PSG (`#da291c`) marque
   uniquement l'action principale (export) et la sélection (poste en cours). Jamais une action
   destructrice : celle-ci est bordée neutre, texte `--danger-text`.
4. **Chaque action près de ce qu'elle modifie.** Export dans la barre de marque ; schéma tactique
   au-dessus du terrain ; progression et réinitialisation dans la feuille de match.
5. **Filets et aplats plutôt que cartes.** Les zones se séparent par une bordure de 1 px et un
   changement de surface, pas par des panneaux flottants. Aucune carte dans une carte.
6. **Aucune couleur littérale dans un `.tsx`** (hors `COLORS` et `AVATAR_PALETTE`) et aucune dans
   `styles.css` hors `:root` et dégradés. Une nouvelle couleur solide devient un token.

## Tokens

### Interface (`:root` de `styles.css`)

Les tokens existent en deux jeux : `:root` (clair) et `@media (prefers-color-scheme: dark)`.

| Token                             | Clair      | Sombre      | Usage                                                           |
| --------------------------------- | ---------- | ----------- | --------------------------------------------------------------- |
| `--bg`                            | `#f3f4f6`  | `#0e0f11`   | fond de la scène du terrain                                     |
| `--surface`                       | `#ffffff`  | `#16171a`   | barre de marque, panneau, champ de recherche                    |
| `--surface-2`                     | `#f5f6f8`  | `#1d1f22`   | survol d'une ligne ou d'un bouton discret                       |
| `--surface-3`                     | `#eceef1`  | `#25272b`   | pastilles de poste, rail du sélecteur de schéma, segments vides |
| `--border`                        | `#e3e5e9`  | `#2a2c31`   | filets, séparateurs, bordures de contrôles                      |
| `--border-strong`                 | `#cdd1d8`  | `#3b3e45`   | survol de bordure, avatar vide en pointillés                    |
| `--text`                          | `#101215`  | `#f2f3f5`   | texte principal, segments de progression remplis                |
| `--text-2`                        | `#3b4049`  | `#c8cbd1`   | texte de contrôle secondaire                                    |
| `--muted`                         | `#626873`  | `#9297a1`   | métadonnées, libellés, placeholders                             |
| `--accent`                        | `#da291c`  | `#da291c`   | rouge PSG : export, poste sélectionné                           |
| `--accent-hover`                  | `#c02014`  | `#ea3a2c`   | survol du bouton principal                                      |
| `--accent-soft` / `--accent-line` | 8 % / 35 % | 16 % / 45 % | fond et bordure d'alerte, joueur titulaire dans la liste        |
| `--danger-text`                   | `#b42318`  | `#ff8b80`   | texte du bouton « Retirer »                                     |
| `--navy`                          | `#004170`  | `#004170`   | bleu PSG, uniquement dans la marque                             |
| `--focus` / `--focus-soft`        | `#1f5fc4`  | `#7aa7ff`   | anneau de focus clavier                                         |
| `--ok`                            | `#12804a`  | `#3fcf83`   | état « XI complet »                                             |
| `--seg-on`                        | `#ffffff`  | `#34373d`   | segment actif du sélecteur de schéma                            |

Ombres : `--shadow-sm` (segment actif), `--shadow-pitch` (le terrain, seul objet en relief),
`--shadow-sheet` (bottom sheet mobile). Toutes ont un décalage vertical, aucune lueur colorée.

### Terrain (`COLORS` de `Pitch.tsx`)

Le terrain **suit le thème** : `COLORS.light` (pelouse de jour, cartes blanches façon habillage TV)
et `COLORS.dark` (pelouse de nocturne, cartes marine). Le thème arrive en prop depuis
`hooks/useColorScheme.ts` : les couleurs du SVG sont des attributs, les variables CSS ne
l'atteignent pas. **Le PNG exporté suit donc le thème de l'OS au moment du clic.**

| Clé | Clair | Sombre | Usage |
| --- | --- | --- | --- |
| `grass` / `grassAlt` | `#3d8b3d` / `#47974a` | `#1d5427` / `#246631` | bandes de tonte (12 sur le tracé, débordent hors des lignes) |
| `edge` | noir vert 38 % | noir 50 % | assombrissement des bords (`radialGradient`, transparent au centre) |
| `line` | `#ffffff` (92 %) | `#e9f2ea` (80 %) | tracé, épaisseur 3 ; cadre des buts 4 |
| `net` | blanc 55 % | blanc cassé 45 % | quadrillage des filets |
| `shadow` | vert sombre 32 % | noir 45 % | ombre portée des cartes (rect décalé de 5, pas de `filter`) |
| `cardFill` / `cardStroke` | `#ffffff` / encre 10 % | `#0f1b30` / blanc 14 % | carte d'un joueur placé |
| `pill` / `pillText` | `#eceef1` / `#3b4049` | `#1f2c44` / `#c8d2e6` | pastille de poste |
| `text` / `muted` | `#101215` / `#5d636e` | `#f4f7ff` / `#9aa6bd` | nom / époque |
| `emptyFill` / `emptyStroke` / `emptyText` | blanc 16 % / blanc 85 % / `#ffffff` | noir 22 % / blanc cassé 70 % / `#e9f2ea` | slot libre |
| `accent` | `#da291c` | `#da291c` | slot sélectionné (bordure + pastille) |

Ces clés sont la seule source de couleur du terrain (plus `AVATAR_PALETTE` pour les médaillons).

### Tracé (cotes FIFA)

Le tracé est dessiné à l'échelle d'un terrain de 105 × 68 m sur la hauteur disponible
(`M = 1320 / 105` unités par mètre, largeur ≈ 855) : surfaces de réparation 40,32 × 16,5 m, surfaces
de but 18,32 × 5,5 m, points de penalty à 11 m, rond central et arcs de surface de 9,15 m (seule la
portion hors de la surface est tracée), quarts de cercle de corner de 1 m, buts de 7,32 m vus de
dessus avec filet. Les coordonnées des slots (`formations.ts`) restent en pourcentage de la largeur
du SVG : les cartes des latéraux débordent légèrement de la ligne de touche, comme sur un habillage TV.

## Typographie

- **Interface : Geist** (Vercel, licence OFL), fichier variable auto-hébergé
  `public/fonts/Geist-Variable.woff2` (69 Ko, graisses 100–900) avec sa licence `public/fonts/OFL.txt`.
  Aucun appel réseau : le fichier est servi avec l'app. Repli : pile système.
- **SVG : pile système obligatoire** (`system-ui, -apple-system, Segoe UI, sans-serif`) : une webfont
  ne serait pas disponible dans le contexte image de l'export.
- Échelle UI (base 14 px, ratio ~1,15) : `1.125rem` titre du sélecteur, chiffre de progression ·
  `1rem` titre de la feuille de match · `0.9375rem` nom de l'app · `0.875rem` texte courant, noms ·
  `0.8125rem` boutons, sélecteur de schéma, méta d'en-tête · `0.75rem` titres de ligne, époques,
  compteurs · `0.6875rem` pastilles de poste, initiales.
- Graisses : 400 texte, 500 noms et contrôles, 600 boutons principaux et états actifs, 650 titres.
  Titres à `letter-spacing: -0.01em`. Aucune capitale espacée en « eyebrow ».
- Chiffres : `font-variant-numeric: tabular-nums` sur la progression, les époques et les schémas.
- Échelle SVG (unités du viewBox) : `21` nom de joueur (600) · `20` poste d'un slot libre ·
  `18` initiales · `15` « Libre » · `14` époque · `13` pastille de poste (700) · `26` légende de bas
  de terrain (600, letter-spacing 3).

## Espacement, rayons, largeurs

- Espacements : multiples de 2, en pratique 4, 6, 8, 10, 12, 14, 16, 20, 24. Gouttière du panneau :
  20 px (16 px sur mobile).
- Rayons : `--radius-sm` 4 px (pastilles, segments), `--radius` 6 px (boutons, champs, terrain),
  3 px (tags de poste), 12 px uniquement pour le haut de la bottom sheet mobile. `14` reste le rayon
  des cartes SVG.
- Coquille : grille `minmax(0, 1fr) 400px` × `56px 1fr` (`--topbar-h`, `--panel-w`), pleine largeur,
  sans conteneur centré. Barre de marque collante ; panneau collant sous la barre, pleine hauteur,
  défilement interne.
- Terrain : viewBox `1000 × 1480`, conteneur `max-width: min(580px, calc((100vh - 230px) * 0.676))`.
  Cette formule garantit que le gardien et la légende restent au-dessus de la ligne de flottaison.
  **Ne pas la remplacer par une simple `max-width`** : c'est ce qui casse l'aperçu en 1440×900. Le
  sélecteur de schéma et le bandeau d'erreur partagent cette largeur pour s'aligner sur le terrain.
- Breakpoint unique : `900px`. En dessous : une colonne (barre, terrain, feuille de match), le terrain
  reprend `max-width: 100%`, le sélecteur de joueurs devient une bottom sheet.

## Composants

### Barre de marque

56 px, `--surface`, filet bas. À gauche la marque : carré 22 px aux couleurs du maillot « Hechter »
(marine, liseré blanc, bande rouge, en dégradé de tokens — ce n'est pas un logo officiel), le nom en
650 et le sous-titre muted séparé par un filet (masqué sous 900 px). À droite, le seul bouton
principal de l'écran : « Exporter en PNG » avec icône de téléchargement.

### Sélecteur de schéma

Contrôle segmenté : rail `--surface-3`, padding 3, rayon 6 ; segments 30 px de haut, `0.8125rem`
muted ; segment actif `--seg-on` + `--shadow-sm`, texte `--text` 600. `aria-pressed` porte l'état,
`aria-label="Schéma tactique"` sur le groupe.

### Feuille de match (`MatchSheet.tsx`, panneau au repos)

- En-tête : « Feuille de match » + schéma courant ; à droite, progression : chiffre `n` en 650,
  `/11`, libellé « titulaires » puis « XI complet » (vert), et **11 segments** de 8 × 4 px qui se
  remplissent en `--text` puis passent tous en `--ok` à 11/11 (`role="progressbar"`).
- Corps : les slots groupés par ligne — Gardien, Défense, Milieu, Attaque — via `slotsByLine()`
  (`lib/formations.ts`), chaque ligne lue de gauche à droite. Titre de ligne en `0.75rem` 600
  muted + effectif.
- Ligne : grille `36px 28px 1fr auto`, 44 px minimum. Pastille de poste, avatar monogramme 28 px
  (même couleur que sur le terrain, `avatarColor`), nom 500, époque à droite. Vide : avatar en
  pointillés, « Choisir un joueur » muted.
- Pied : consigne ou « XI complet — prêt à exporter. », bouton discret « Réinitialiser ».

### Sélecteur de joueurs (`Picker.tsx`)

Remplace la feuille de match dans le panneau (desktop) ; bottom sheet sur mobile.

- Retour « Feuille de match » (chevron), titre avec le poste en pastille **rouge** (signal de
  sélection) + « Choisir un joueur », postes acceptés en tags.
- Titulaire actuel : bloc bordé, avatar, nom, bouton « Retirer » (`btn--danger`).
- Recherche : champ 36 px avec icône loupe, focus = bordure `--focus` + anneau `--focus-soft`.
- Ligne riche : avatar 32 px, nom, tags de postes + nationalité, époque alignée à droite.
  Titulaire de ce slot surligné en `--accent-soft`. `Échap` ferme le sélecteur.

### Bottom sheet (mobile, < 900 px)

Feuille fixée en bas, `max-height: 85dvh`, haut arrondi 12 px, poignée 36 × 4, `--shadow-sheet`,
voile `--scrim` cliquable pour fermer. Entrée : translation depuis le bas, 240 ms, ease-out
exponentiel. Le défilement de la page est bloqué tant qu'elle est ouverte. La feuille de match reste
rendue sous le terrain pour éviter un saut de mise en page.

### Boutons

- `btn--primary` : fond `--accent`, texte blanc, 600, 34 px, rayon 6. Un seul par écran (l'export).
- `btn--quiet` : bordé `--border`, texte `--text-2` ; survol `--surface-2`.
- `btn--danger` : bordé `--border`, texte `--danger-text` ; survol `--accent-soft`.
- Désactivé : opacité 0,45, curseur `not-allowed`. `active` : translation 1 px.

### Carte de joueur (SVG, `Pitch.tsx`)

Rect 220 × 72, rayon 14, ombre portée simulée (même rect, `shadow`, décalé de 5). À gauche, un
médaillon d'avatar ; à droite, le nom sur toute la largeur, puis l'époque et la pastille de poste sur
la seconde ligne.

```
┌────────────────────────────────┐
│  ╭──╮  Kvaratskhelia           │  initiales 18 px (700), nom 21 px (600)
│  │KK│                          │
│  ╰──╯  depuis 2025      ┌──┐   │  époque 14 px, muted
│                         │LW│   │  pastille 13 px (700), en bas à droite
└────────────────────────────────┘
```

- Pourquoi la pastille est en bas : en haut à droite, elle chevauchait les noms longs (mesuré :
  Donnarumma, Kvaratskhelia, Ibrahimović). L'époque est courte (≤ « depuis 2025 »), la ligne du bas a
  la place. Vérifier par `getBBox` qu'aucun nom ne touche la pastille après toute retouche.
- Médaillon : cercle r=24 centré à 32 unités du bord gauche. Fond = `avatarColor(player.id)`
  (déterministe, cf. ci-dessous), initiales = `initials(player.name)` (18 px, 700, sans diacritique :
  « Ángel Di María » → « AM », « Ronaldinho » → « RO »).
- Palette d'avatar : `AVATAR_PALETTE` dans `lib/avatar.ts` (5 teintes du design system, dont le
  rouge). La couleur est un **hachage de l'id**, jamais un aléatoire : deux exports du même onze
  produisent la même image. Deux joueurs peuvent partager une teinte et des initiales (Maxwell et
  Marquinhos → « MA ») : le nom complet reste la référence.
- Zone de nom : de +64 au bord droit moins 10 (≈146 unités). Nom affiché le plus long :
  « Kvaratskhelia » ≈ 135 unités à 21 px — **ne pas monter au-dessus de 21 px** sans élargir la carte.
- Slot vide : fond `emptyFill`, bordure et médaillon en pointillés (`10 8` et `6 5`), le poste en
  titre et « Libre » dessous, pas d'ombre.
- Slot sélectionné : bordure `accent`, épaisseur 4 (au lieu de 2), sur la carte **et** le médaillon ;
  la pastille de poste passe en `accent`.
- Zone cliquable : le `<g>` entier, `role="button"`, `tabIndex={0}`, `aria-label` explicite
  (« LB : Maxwell, retirer ou remplacer » / « Choisir un CB »), activation Entrée et Espace.
- Le nom est **réduit** par `shortName()` (voir `docs/DATA.md`).

### Portraits réels : état des lieux (2026-10)

Un monogramme n'est pas un visage. Les deux voies vers de vraies photos, avec leurs faits mesurés :

1. **CDN d'API-Sports** (`media.api-sports.io/football/players/<id>.png`) : HTTP 200, `image/png`,
   CORS `*` — **retenu**. L'id est interne au fournisseur et se résout uniquement via l'API
   api-sports.io, qui exige une clé : `scripts/fetch-photo-ids.mjs` génère la table
   (`src/data/photos.ts`) à partir de `APISPORTS_KEY`.
2. **Portraits Wikimedia Commons** (licences CC BY-SA / domaine public, CORS `*`) : aucune clé,
   mais ~87 fichiers à sourcer, licences à tracer (`CREDITS.md`) et attribution à embarquer dans
   l'export PNG. Non retenu pour l'instant.

Ce qui est implémenté : `lib/photos.ts` (fetch → data URL + cache), `hooks/usePhotos.ts`, rendu
`<image>` clippé en cercle dans `Pitch.tsx`, monogramme en repli. **La table est vide tant que la clé
n'est pas fournie** : sans correspondance vérifiée, l'interface affiche le monogramme.

> Règle : ne jamais remplir `PLAYER_PHOTOS` à la main avec un id supposé. Vérifié en practice : l'id
> `276` du CDN API-Sports n'est pas Kylian Mbappé — un visage faux est pire qu'un monogramme.

Régénérer la table :

```bash
APISPORTS_KEY=xxxxx node scripts/fetch-photo-ids.mjs
```

Le script n'écrit que les correspondances de nom certaines (égalité exacte, ou initiale + nom de
famille quand un seul candidat correspond) et liste les joueurs non résolus, qui gardent leur
monogramme.

## États à couvrir

| État                    | Attendu                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------- |
| Slot vide               | terrain : pointillés, « Libre » ; feuille : avatar pointillé, « Choisir un joueur » |
| Slot sélectionné        | bordure rouge 4 px sur le terrain, sélecteur ouvert, pastille de poste rouge        |
| Slot rempli             | carte pleine, nom + époque, bouton « Retirer » dans le sélecteur                    |
| XI incomplet            | `n/11 titulaires`, segments remplis en `--text`, export possible                    |
| XI complet              | `11/11 XI complet` en vert, 11 segments verts, « XI complet — prêt à exporter. »    |
| Poste sans candidat     | « Aucun joueur disponible pour ce poste. »                                          |
| Recherche sans résultat | « Aucun joueur ne correspond à « … » pour ce poste. »                               |
| Erreur d'export         | bandeau `role="alert"` au-dessus du terrain, message du navigateur                  |

## Accessibilité

- Contraste : `--text` sur `--surface` ≥ 15:1 dans les deux thèmes ; `--muted` sur `--surface`
  ≈ 5,6:1 (clair) et ≈ 6:1 (sombre) ; blanc sur `--accent` ≈ 4,9:1. Texte SVG clair sur `cardFill`
  ≈ 7:1. Toute nouvelle teinte doit rester ≥ 4,5:1 pour du texte.
- Tout contrôle est un `<button>` (sauf les cartes SVG, `<g role="button" tabIndex={0}>` avec
  gestion Entrée/Espace).
- Focus visible : `:focus-visible` global en `outline: 2px solid var(--focus)` ; le champ de
  recherche remplace l'outline par une bordure + un anneau, jamais par rien.
- Progression exposée en `role="progressbar"` (`aria-valuenow`), compteur du sélecteur en
  `aria-live="polite"`.
- `prefers-reduced-motion` ramène animations et transitions à 1 ms.
- Le nom accessible ne dépend jamais de la couleur : le poste est écrit dans la carte et la ligne.

## Contraintes d'export (à relire avant toute retouche du SVG)

1. Styles en **attributs de présentation**, jamais en classes. La feuille de style de l'app ne
   s'applique pas dans l'image créée depuis le Blob.
2. Aucune ressource externe : pas d'image, pas de webfont, pas de `filter` CSS.
3. Le SVG doit rester un arbre autonome : clone + `xmlns` + `width`/`height` suffisent. Un
   `<foreignObject>` ou un `use` vers un `<defs>` supprimé casserait l'export.
4. Rendu à 2× : 2000 × 2960 px. Une police de 15 unités devient 30 px à l'export — c'est lisible.
5. Vérifier après chaque changement visuel : exporter, puis contrôler les dimensions et l'absence de
   texte manquant (les noms doivent apparaître sur le PNG, pas seulement à l'écran).

## À ne pas faire

- Ajouter une librairie d'UI ou d'icônes : les icônes sont trois SVG inline en `currentColor`.
- Utiliser le rouge pour un bouton destructif : le rouge est déjà pris par la sélection.
- Remettre un fond nuit avec halo, des panneaux flottants arrondis ou des capitales espacées en
  sur-titre : c'est le look que cette version a quitté.
- Animer les cartes du terrain : le SVG est sérialisé, une animation CSS n'y existera pas.
- Centrer le terrain dans une colonne plus large que 580 px : le panneau et le terrain doivent
  rester deux blocs lisibles côte à côte.
