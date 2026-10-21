# Données joueurs

Source unique : **`src/data/players.ts`**. 87 fiches, saisies à la main, aucune source automatique.
Si une fiche est fausse, c'est ce fichier qu'on corrige — nulle part ailleurs.

## Schéma

```ts
interface Player {
  id: string;                        // slug stable, unique, en kebab-case
  name: string;                      // nom affiché, orthographe complète
  from: number;                      // première saison au club
  to: number | null;                 // dernière saison ; null = encore au club
  positions: readonly Position[];    // 1 à 3 postes, le principal en premier
  nationality: string;               // sélection nationale, en français
}
```

L'`id` est une **clé de persistance et de test** : il ne change jamais, même si le nom affiché
change (`alex`, `rai`, `mbappe`). Les tests référencent des ids en dur — renommer un id casse les
tests, volontairement.

## Vocabulaire des postes

`GK` gardien · `CB` défenseur central · `LB` latéral gauche · `RB` latéral droit · `DM` sentinelle ·
`CM` milieu central · `AM` meneur · `LW` ailier gauche · `RW` ailier droit · `ST` avant-centre.

Un poste secondaire n'est légitime que si le joueur a **réellement** évolué à ce poste au PSG
(ex. Marquinhos `CB` + `RB`, Lucas Hernández `CB` + `LB`). Ne pas élargir un poste « pour que le
joueur soit sélectionnable » : c'est le schéma qui doit être changé, pas la fiche.

## Qui accepte quoi

| Schéma | Slot | Postes acceptés |
| --- | --- | --- |
| 4-3-3 | `gk` | GK |
| | `lb` / `rb` | LB / RB |
| | `cb1`, `cb2` | CB |
| | `dm` | DM, CM |
| | `cm1`, `cm2` | CM, DM, AM |
| | `lw` / `rw` | LW, AM / RW, AM |
| | `st` | ST |
| 4-4-2 | `lm` / `rm` | LW, AM, CM / RW, AM, CM |
| | `cm1`, `cm2` | CM, DM |
| | `st1`, `st2` | ST |
| 3-5-2 | `lwb` / `rwb` | LB, LW / RB, RW |
| | `cb1`, `cb2`, `cb3` | CB |
| | `cm1` / `cm2` | CM, DM / CM, AM |
| | `dm` | DM |
| 4-2-3-1 | `dm1`, `dm2` | DM, CM |
| | `am` | AM, CM |
| | `lw` / `rw` | LW, AM / RW, AM |

Table générée à partir de `src/lib/formations.ts` : en cas de divergence, **le code fait foi** et ce
tableau doit être corrigé dans le même commit. `src/lib/formations.test.ts` vérifie l'invariant
« 11 slots, ids uniques, un seul gardien, coordonnées dans le terrain, postes valides ».

## Règles d'intégrité (testées)

- `id` unique sur les 87 fiches (`squad.test.ts`).
- `from >= 1970` et `to >= from` quand `to` n'est pas `null`.
- Tout `Position` utilisé appartient au tuple `POSITIONS` (`formations.test.ts`).
- Un joueur ne peut être placé que sur un slot qui accepte un de ses postes.

## Libellés dérivés

- `eraLabel(player)` → `"2013-2020"` ou `"depuis 2021"` si `to === null`.
- `shortName(player)` → dernier mot du nom, **avec la particule** si elle précède :
  `Ángel Di María` → `Di María`, `Thiago Silva` → `Silva`, `Lee Kang-in` → `Kang-in`,
  `Ronaldinho` → `Ronaldinho`. Les particules reconnues sont dans `PARTICLES`.

Toute modification de ces deux fonctions est visible sur le terrain **et** dans le PNG exporté :
vérifier les noms longs (Kvaratskhelia, Ibrahimović, Donnarumma) après changement.

## Ajouter un joueur

1. Choisir un `id` kebab-case stable, sans accent (`kvaratskhelia`, `joao-neves`).
2. Renseigner `from` / `to` (dernière saison jouée, pas la fin du contrat), `positions` (principal
   d'abord), `nationality` au féminin singulier (« Argentine », « Pays-Bas », « Côte d’Ivoire »).
3. Insérer dans le bon bloc commenté (gardiens, centraux, latéraux, milieux, meneurs/ailiers,
   attaquants) — l'ordre n'a pas d'effet fonctionnel, mais il rend les diffs lisibles.
4. `npm test` : les tests d'intégrité doivent rester verts.
5. Vérifier visuellement que le nom court tient dans la carte (`docs/DESIGN.md`, largeur 220 unités).

## Ajouter un schéma

1. Ajouter l'id à `FORMATION_IDS` puis l'entrée dans `FORMATIONS` (11 slots, ids uniques).
2. Chaque slot : `label` court (3-4 caractères), `accepts` non vide, `x`/`y` en pourcentage
   (`y = 0` = but adverse, `y = 100` = but défendu).
3. `npm test` — `formations.test.ts` vérifie automatiquement les invariants.
4. Mettre à jour le tableau ci-dessus, `docs/FEATURES.md` et le compteur du README s'il y en a un.

## Ce que les données ne disent pas

Aucune note, aucun classement, aucune stat (buts, matchs, trophées). C'est volontaire : ce sont des
opinions ou des chiffres à sourcer, et l'app doit rester un objet de composition, pas un palmarès.
Si une fonctionnalité de notation arrive, elle devra afficher **qui** note et **sur quelle base**.
