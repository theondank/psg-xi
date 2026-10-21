# Règles UI et export

Détail complet : `docs/DESIGN.md`. Ici, ce qui ne se négocie pas.

1. **Le SVG doit rester autonome.** Couleurs, polices et épaisseurs en attributs de présentation.
   Une classe CSS ne survit pas à l'export : le SVG est cloné dans un Blob puis chargé comme image.
2. **Pas de ressource externe dans le SVG** : pas d'`<image>`, pas de webfont, pas de `filter`.
   Police obligatoire : `system-ui, -apple-system, Segoe UI, sans-serif`.
3. **viewBox `1000 × 1480`.** Le conteneur garde
   `max-width: min(580px, calc((100vh - 230px) * 0.676))`. Changer le viewBox impose de recalculer
   ce facteur, sinon le gardien passe sous la ligne de flottaison.
4. **Largeur de carte : 220 × 72.** Le nom affiché est `shortName()` (dernier mot + particule).
   Après modification de la taille ou de la police, contrôler Kvaratskhelia, Donnarumma,
   Ibrahimović, Di María.
5. **Couleurs** : `COLORS` (dans `Pitch.tsx`) pour le terrain, variables CSS de `:root` pour
   l'interface. Aucune couleur littérale dans un `.tsx`.
6. **Le rouge `#da291c` signale la sélection et l'action principale.** Pas de rouge pour une action
   destructrice : utiliser le style `btn--danger`.
7. **Accessibilité** : tout élément cliquable est un `<button>` ou un `<g role="button" tabIndex={0}>`
   avec gestion Entrée/Espace, `aria-label`, et focus visible. Ne jamais supprimer un outline sans le
   remplacer.
8. **Un seul breakpoint : 900 px.** À 390 px de large, aucun débordement horizontal n'est toléré.
9. **Pas d'animation sur le terrain** : le SVG est sérialisé, une animation CSS n'existera pas dans
   le PNG. Les transitions d'interface (hover, active) restent autorisées.
10. **Vérifier l'export après toute retouche visuelle** : `npm run build`, `npm run preview`, clic
    sur « Exporter en PNG », contrôle des dimensions (2000 × 2960) et de la présence des noms.
