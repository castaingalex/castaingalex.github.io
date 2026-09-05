# AGENTS.md — castaingalex.github.io

Site personnel publié par GitHub Pages sur **castaing.dev**. Pas de build, pas de dépendance : on
édite, on pousse sur `main`, c'est en ligne.

## La règle qui prime : tout est public

Ce dépôt est le seul du poste dont le contenu est **publié sur Internet**. Avant toute écriture :
aucune donnée nominative, aucun identifiant, aucun chemin machine, aucun extrait de base, aucun nom
d'agent ou de service interne. Le doute vaut refus.

## Où écrire, et où ne pas

- **`index.html`** est le portfolio. Un seul fichier de 2 Mo, CSS dans un `<style>`, une quinzaine
  de lignes de JS en bas pour l'accordéon des travaux (`aria-expanded`). Polices Google Fonts
  (`Bricolage Grotesque`, `DM Mono`). Contenu en français. Points de rupture à 680 px et 480 px.
- **`carte-pdf/`, `portrait-eco/`, `portrait-finances/`** sont des **démos déposées**, pas du code
  source. Ne jamais y corriger quoi que ce soit : la source vit dans `coban_products`
  (`app_portrait_eco`, `app_retro_financiere`) et `coban_processing` (`tool_carte_pdf`). On corrige
  là-bas, puis on redépose ici.

Seule `carte-pdf` est liée depuis la page d'accueil. Les deux autres sont publiées et atteignables
par URL directe, sans être exposées : ne pas ajouter de lien vers elles sans demande explicite.

## Registre

Français, pas de tiret cadratin en incise. C'est un écrit adressé à des lecteurs extérieurs, dont
des recruteurs : la doctrine de travail (`~/.claude/CLAUDE.md`) s'applique au mot près, en
particulier l'interdiction de la posture haute.
