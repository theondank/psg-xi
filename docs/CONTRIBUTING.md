# Contribuer

## Prérequis

- Node 22+ (le projet est testé sur Node 22, cf. la CI) et npm 10+.
- Aucun compte, aucune clé, aucune base de données.

## Installation

**Windows (PowerShell)**

```powershell
cd psg-xi
npm install
npm run dev
```

**Linux / macOS**

```bash
cd psg-xi
npm ci
npm run dev
```

`npm ci` est préféré en CI et sur une machine fraîche (installe exactement le lockfile) ; `npm
install` est acceptable en développement quand on ajoute une dépendance — ce qui doit rester
exceptionnel.

## Branches et commits

- `main` doit toujours être verte (CI + build local).
- Une branche par lot : `feat/partage-url`, `fix/export-nom-coupe`, `docs/harness-claude`,
  `design/cartes-contraste`.
- Message : `type(scope): résumé à l'impératif` + corps qui explique le **pourquoi**.

```
feat(share): sérialise le onze dans l'URL

Permet d'envoyer une compo sans capture d'écran. Le paramètre p est une liste
slot:joueur ; les entrées inconnues sont ignorées plutôt que de casser la page.
```

Types : `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `design`.

## Definition of done

1. La règle métier est dans `src/lib/` et un test la couvre.
2. `npm test` (37+ tests, 0 échec), `npm run lint`, `npm run build`, `npm run docs:check` verts.
3. Parcours navigateur refait si l'écran a changé (voir `docs/TESTING.md`).
4. Documentation à jour dans le même commit : `docs/FEATURES.md` au minimum.
5. Pas de fichier généré dans le diff (`dist/`, `*.tsbuildinfo`, `node_modules`).

## Le harness Claude Code

Le dépôt est équipé pour qu'un agent (Claude Code) travaille sans redécouvrir les règles à chaque
session. Tout est versionné dans `.claude/` et `CLAUDE.md`.

### Ce qui est chargé automatiquement

| Fichier | Rôle |
| --- | --- |
| `CLAUDE.md` | contexte projet : commandes, carte du code, invariants, pièges |
| `.claude/settings.json` | permissions (ce qui est autorisé, ce qui demande confirmation, ce qui est interdit) + hook de formatage |
| `.claude/rules/*.md` | règles détaillées chargées en complément |

### Commandes (`.claude/commands/`)

| Commande | Usage |
| --- | --- |
| `/verifier` | passe les quatre vérifications et rapporte les sorties réelles |
| `/feature <description>` | déroule le parcours logique → test → UI → doc |
| `/design <objectif>` | passe de design avec les contraintes d'export |
| `/revue` | relecture du diff contre les invariants avant commit |

### Sous-agents (`.claude/agents/`)

| Agent | Périmètre |
| --- | --- |
| `logic-tester` | tests Vitest et logique de `src/lib` |
| `ui-polisher` | design, CSS, SVG, responsive |
| `data-auditor` | exactitude des 87 fiches joueurs, sans invention |

Invocation : `@logic-tester écris les tests du partage par URL`.

### Permissions et hook

- **Autorisé sans confirmation** : lire, éditer, écrire, `npm test/build/lint/dev/preview`,
  `npm run docs:check`, `git status/diff/log/add/commit`.
- **Demande confirmation** : `npm install`, `npm ci`, `git push`, création de branche.
- **Interdit** : `rm -rf`, `git push --force`, `git reset --hard`, lecture de `.env`.
- **Hook `PostToolUse`** : après chaque édition, `prettier --write` sur le fichier touché (ignoré
  silencieusement si Prettier n'est pas installé). Pour le désactiver localement, supprimer le bloc
  `hooks` dans `.claude/settings.local.json`.

### Surcharges personnelles

`.claude/settings.local.json` et `CLAUDE.local.md` sont gitignorés : c'est là qu'on met ses
préférences (modèle, permissions supplémentaires) sans les imposer aux autres.

### Ajouter une règle ou une commande

- Une règle stable et courte → `.claude/rules/<sujet>.md`, puis la référencer dans `CLAUDE.md`.
- Une procédure répétitive → `.claude/commands/<nom>.md` avec `description:` en frontmatter et
  `$ARGUMENTS` pour l'entrée libre.
- Un rôle spécialisé → `.claude/agents/<nom>.md` avec `name`, `description`, `model`, `tools`, et
  une consigne d'honnêteté (ne rien inventer, citer les fichiers).

`CLAUDE.md` doit rester **court** : c'est du contexte payé à chaque session. Le détail va dans
`docs/`.

## Où documenter quoi

| Question | Fichier |
| --- | --- |
| Comment lancer, à quoi ça sert | `README.md` |
| Pourquoi le code est ainsi | `docs/ARCHITECTURE.md` |
| Couleurs, espacements, composants | `docs/DESIGN.md` |
| Schéma joueur, postes, ajouter un schéma | `docs/DATA.md` |
| Ce qui existe, backlog, arbitrages produit | `docs/FEATURES.md` |
| Tests, recette navigateur, CI | `docs/TESTING.md` |
| Workflow, harness agent | `docs/CONTRIBUTING.md` |

`npm run docs:check` vérifie que les liens relatifs pointent vers des fichiers existants, que les
`npm run <script>` cités existent dans `package.json` et que les chemins de fichiers mentionnés
existent. Lancer après toute modification de documentation.
