# Design system

Interface sombre, un seul écran, trois zones : barre d'actions, terrain, panneau latéral. L'objectif
visuel n'est pas « site de club » mais **tableau tactique** : le terrain domine, le reste s'efface.

## Principes

1. **Le terrain est le contenu.** Tout le reste est un contrôle. Si un élément n'aide pas à composer
   ou à comprendre le onze, il n'a pas sa place sur l'écran.
2. **Deux palettes, deux rôles.** Le SVG porte ses propres couleurs (`COLORS` dans `Pitch.tsx`) parce
   qu'il doit survivre à l'export PNG ; l'interface utilise les variables CSS de `styles.css`.
   Ne pas mélanger : une couleur de carte joueur ne se règle pas dans `styles.css`.
3. **Le rouge est un accent, pas une action.** Le rouge PSG (`#da291c`) marque la sélection et
   l'export, jamais une action destructrice (celle-ci est grise + texte clair : `--danger-text`).
4. **Aucune couleur littérale dans un `.tsx`** (hors `COLORS`) et aucune dans `styles.css` hors
   `:root` et dégradés. Une nouvelle couleur solide devient un token.

## Tokens

### Interface (`:root` de `styles.css`)

| Token | Valeur | Usage |
| --- | --- | --- |
| `--bg` | `#030a1a` | fond de page (avec un halo radial `#0a2450`) |
| `--bg-elevated` | `#071228` | surfaces : barre, panneaux, cartes d'UI |
| `--bg-input` | `#040c1e` | champs de saisie (recherche) |
| `--border` | `#1d3563` | bordures, séparateurs |
| `--text` | `#f2f6ff` | texte principal |
| `--muted` | `#8ba3cf` | texte secondaire, libellés de poste, métadonnées |
| `--accent` | `#da291c` | rouge PSG : sélection, bouton d'export |
| `--accent-soft` | `rgba(218,41,28,.14)` | fond d'alerte / de rappel |
| `--blue` | `#1b4b9c` | bleu PSG : état actif, focus |
| `--ok` | `#2fbf71` | état « XI complet » |

Valeurs dérivées assumées (écrites localement, pas des tokens) : `#ef3a2c` (survol du bouton
principal), `#ff9b92` (texte destructif), `rgba(27,75,156,.25)` (survol d'une ligne de joueur),
`rgba(255,255,255,.05)` (voile de survol), `rgba(47,191,113,.12/.35)` (fond/bordure « complet »).

### Terrain (`COLORS` de `Pitch.tsx`)

| Clé | Valeur | Usage |
| --- | --- | --- |
| `background` | `#040f26` | fond du SVG |
| `stripe` | `#0a1f45` | bandes alternées (5 sur 10) |
| `line` | `#c9d6f2` | lignes du terrain, opacité 0,75 |
| `cardFill` | `#123468` | carte d'un joueur placé |
| `cardStroke` | `#3a63ad` | bordure d'une carte remplie |
| `accent` | `#da291c` | bordure d'un slot sélectionné |
| `text` | `#f4f7ff` | nom du joueur |
| `muted` | `#8ba3cf` | poste, époque, « Libre » |

Ces huit clés sont la seule source de couleur du terrain. Un slot vide utilise `muted` en pointillés
et un fond translucide (`rgba(13,42,92,.35)`).

## Typographie

- Famille unique : `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`. **Obligatoire dans le
  SVG** : une webfont ne serait pas disponible dans le contexte image de l'export.
- Échelle UI : `1.35rem` titre de page · `1.3rem` titre de panneau · `1.05rem` sous-titre ·
  `0.9rem` nom de joueur · `0.85rem` boutons · `0.82rem` badge, méta · `0.72rem` pied de page,
  métadonnées · `0.7rem` libellés d'eyebrow (letter-spacing 1,6 px).
- Échelle SVG (unités du viewBox) : `26` nom de joueur · `20` « Libre » · `15` poste et époque ·
  `26` légende de bas de terrain (letter-spacing 2 px).
- Chiffres : `font-variant-numeric: tabular-nums` sur le badge de progression.

## Espacement, rayons, largeurs

- Espacements : multiples de 4 (4, 7, 9, 10, 12, 14, 16, 18, 20, 22). Pas de valeur arbitraire hors
  de cette échelle.
- Rayons : `8` (chip), `10` (bouton, champ), `12` (conteneur de chips, terrain dans son cadre),
  `14` (carte SVG), `18` (panneaux).
- Layout : `grid-template-columns: minmax(0, 1fr) 380px`, `gap: 22px`, conteneur `1180px`.
- Terrain : viewBox `1000 × 1480`, conteneur `max-width: min(580px, calc((100vh - 230px) * 0.676))`.
  Cette formule garantit que le gardien et la légende restent au-dessus de la ligne de flottaison.
  **Ne pas la remplacer par une simple `max-width`** : c'est ce qui casse l'aperçu en 1440×900.
- Breakpoint unique : `900px`. Le panneau passe sous le terrain, le conteneur du terrain reprend
  `max-width: 100%`.

## Composants

### Carte de joueur (SVG, `Pitch.tsx`)

Rect 220 × 72, rayon 14, 4 lignes de texte :

```
┌──────────────────────────────┐
│ LB                           │  poste, 15 px, muted, letter-spacing 1,2
│          Maxwell             │  nom court, 26 px, 600, centré
│         2012-2017            │  époque, 15 px, muted, centrée
└──────────────────────────────┘
```

- Slot vide : bordure pointillée `10 8`, fond translucide, texte « Libre » en 20 px muted.
- Slot sélectionné : bordure `accent`, épaisseur 4 (au lieu de 2).
- Zone cliquable : le `<g>` entier, `role="button"`, `tabIndex={0}`, `aria-label` explicite
  (« LB : Maxwell, retirer ou remplacer » / « Choisir un CB »), activation Entrée et Espace.
- Le nom est **réduit** par `shortName()` (voir `docs/DATA.md`) : c'est la seule protection contre
  les débordements. Vérifier Kvaratskhelia, Donnarumma, Ibrahimović, Di María après toute
  modification de taille de carte ou de police.

### Chip de schéma

Hauteur ~33 px, rayon 8, texte `0.85rem` muted ; état actif : fond `--blue`, texte clair, 600.
Regroupés dans un conteneur `--bg-elevated` bordé, rayon 12, `aria-label="Schéma tactique"`.

### Badge de progression

`8px 12px`, rayon 10, `0.82rem`, tabular-nums, muted. État complet : texte et bordure `--ok`,
libellé `11/11 · XI complet`.

### Boutons

- `primary` : fond `--accent`, texte clair, 600, `9px 14px`, rayon 10. Un seul par écran
  (l'export). Survol `#ef3a2c`, `active` translate 1 px.
- `ghost` : transparent, bordure `--border`, texte muted. Variante `ghost--danger` : texte
  `#ff9b92`, bordure rouge 40 %.
- Désactivé : opacité 0,45, curseur `not-allowed`.

### Ligne de joueur (panneau de sélection)

Bouton pleine largeur, deux lignes : nom `0.9rem` 600, puis `postes — nationalité — époque` en
`0.72rem` muted. Survol et état actif en bleu translucide. Liste `max-height: 460px` avec scroll
propre, `autoFocus` sur la recherche.

### Ligne de composition (panneau par défaut)

Grille `52px 1fr` : poste en `0.7rem` letter-spacing 1 px muted, nom en `0.86rem`. Slot vide :
« Choisir… » en italique muted.

## États à couvrir

| État | Attendu |
| --- | --- |
| Slot vide | pointillés, « Libre », cliquable |
| Slot sélectionné | bordure rouge 4 px, panneau ouvert sur ce slot |
| Slot rempli | carte pleine, nom + époque, bouton « Retirer » disponible |
| XI incomplet | badge `n/11` muted, export possible |
| XI complet | badge vert `11/11 · XI complet`, message « prêt à exporter » |
| Poste sans candidat | « Aucun joueur disponible pour ce poste. » |
| Recherche sans résultat | même message, la liste se vide sans casser la mise en page |
| Erreur d'export | bandeau `role="alert"` sous le layout, message du navigateur |

## Accessibilité

- Contraste : `--text` sur `--bg` ≈ 15:1 ; `--muted` sur `--bg-elevated` ≈ 6:1 ; texte SVG clair sur
  `cardFill` ≈ 7:1. Toute nouvelle teinte doit rester ≥ 4,5:1 pour du texte.
- Tout contrôle est un `<button>` (sauf les cartes SVG, `<g role="button" tabIndex={0}>` avec
  gestion Entrée/Espace).
- Focus visible : `outline: 2px solid var(--blue)` sur le champ de recherche ; les boutons héritent
  du focus natif — ne pas le supprimer sans le remplacer.
- Le nom accessible ne dépend jamais de la couleur : le poste est écrit dans la carte.

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

- Ajouter une librairie d'UI ou d'icônes : l'interface tient en un fichier CSS et un fichier SVG.
- Utiliser le rouge pour un bouton destructif : le rouge est déjà pris par la sélection.
- Animer les cartes du terrain : le SVG est sérialisé, une animation CSS n'y existera pas.
- Centrer le terrain dans une colonne plus large que 580 px : le panneau et le terrain doivent
  rester deux blocs lisibles côte à côte.
