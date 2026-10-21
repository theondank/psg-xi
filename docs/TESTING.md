# Tests

## Philosophie

On teste **la logique**, pas le rendu. Toute règle produit vit dans `src/lib/` et se vérifie sans
DOM, sans navigateur, sans mock de React. Les composants sont volontairement bêtes : s'ils cassent,
c'est un problème de props, et la vérification navigateur (plus bas) le montre en 30 secondes.

Corollaire : une fonctionnalité qui n'a pas de test dans `src/lib/` doit avoir une bonne raison de ne
pas en avoir (l'UI pure, par exemple). Les deux bugs de la v1 — un déréférencement de `null` dans
`place()` et « María » au lieu de « Di María » — ont été trouvés par ces tests, pas à l'œil.

## État actuel

`npm test` → **37 tests, 2 fichiers, 0 échec**.

### `src/lib/squad.test.ts` (22)

| Groupe | Ce qui est verrouillé |
| --- | --- |
| `emptyLineup` | 11 clés, toutes `null` |
| `place` (7 tests) | placement valide, refus mauvais poste (même objet renvoyé), refus id inconnu, poste secondaire accepté, déplacement qui libère l'ancien slot, échange quand l'occupant est compatible, sortie au banc quand il ne l'est pas |
| `clearSlot` / `clearAll` | vidage d'un slot, slot inconnu → même objet, vidage complet |
| `eligiblePlayers` | exclusion des titulaires, filtrage par postes acceptés |
| Complétude | 0 → 11, `isComplete` vrai seulement à 11, dernier joueur bien localisé |
| `matchesQuery` | casse, accents, requête vide, non-correspondance |
| `adaptLineup` | conservation des joueurs compatibles au changement de schéma, dédoublonnage |
| Données joueurs | ids uniques, années cohérentes, `eraLabel`, `shortName` avec particules |

### `src/lib/formations.test.ts` (15)

Paramétré sur les quatre schémas : 11 slots, ids uniques, un seul gardien, coordonnées dans
`[0,100]`, postes acceptés non vides et appartenant à `POSITIONS`. Plus la résolution d'un slot par
id et l'invariant « toujours onze ».

## Ajouter un test

1. Le nommer en français, du point de vue du comportement : `it('refuse un joueur au mauvais poste
   sans modifier le lineup')`, pas `it('test place 2')`.
2. Structurer en trois temps : arrange (construire un lineup via les helpers réels, pas des objets à
   la main), act (appeler la fonction), assert (valeur exacte, pas `toBeTruthy()`).
3. Pour un refus, asserter **l'identité** de l'objet renvoyé (`expect(lineup).toBe(empty)`), pas
   seulement son contenu : c'est le contrat « aucun state modifié ».
4. Utiliser le helper `player(id)` du fichier de test : il échoue bruyamment si l'id n'existe pas,
   ce qui détecte aussi une fiche renommée.

Ce qui n'a pas sa place dans un test unitaire : le rendu, les clics, les timers, le téléchargement.

## Vérification navigateur (manuelle, non automatisée)

```bash
npm run build && npm run preview -- --port 4173 --strictPort
```

Parcours minimum, dans cet ordre :

1. Remplir les 11 slots via la liste de droite → compteur `11/11 XI complet`.
2. Vérifier que les noms longs ne débordent pas (Donnarumma, Kvaratskhelia, Ibrahimović, Di María).
3. Changer de schéma → au moins 9 slots restent remplis, aucun doublon.
4. Cliquer « Exporter en PNG » → un fichier `.png` doit apparaître, **2000 × 2960**.
5. Réduire la fenêtre à 390 px → aucun débordement horizontal.

Automatisable en CDP quand on a un navigateur piloté :

```js
// remplir un slot : la feuille de match est groupée par ligne (gardien → attaque)
document.querySelectorAll('.row')[i].click();
[...document.querySelectorAll('.option')].find(b => b.textContent.includes('Cavani')).click();
// assertions utiles
document.querySelector('.progress__count').textContent; // "11/11XI complet"
document.documentElement.scrollWidth > window.innerWidth; // doit être false
```

## Vérifier un export (sans œil humain)

Un PNG valide commence par `89 50 4E 47 0D 0A 1A 0A`, et ses dimensions sont les octets 16 à 24
(big-endian). Un fichier de moins de ~50 Ko pour ce terrain signale un rendu vide.

```python
head = open(path, 'rb').read(33)
assert head[:8] == b'\x89PNG\r\n\x1a\n'
w = int.from_bytes(head[16:20], 'big'); h = int.from_bytes(head[20:24], 'big')
```

## CI

`.github/workflows/ci.yml` : `npm ci` → `npm run lint` → `npm test` → `npm run build` →
`npm run docs:check`, sur chaque push et chaque pull request. Node 22, cache npm.

Une CI verte ne vaut que si elle exécute les mêmes commandes que la machine locale : ne pas ajouter
d'étape qui n'existe pas dans `package.json`.

## Ce qui n'est pas testé (assumé)

- Le rendu React et l'interaction (pas de Testing Library, pas de Playwright) : couvert par la
  recette navigateur ci-dessus, à la main.
- L'export PNG de bout en bout (il faudrait un navigateur headless en CI).
- La véracité des fiches joueurs : c'est un travail de source, confié à l'agent `data-auditor`.
