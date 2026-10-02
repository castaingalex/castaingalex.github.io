# AGENTS.md — castaingalex.github.io

Site personnel publié par GitHub Pages sur **castaing.dev**. Pas de build, pas de dépendance : on
édite, on pousse sur `main`, c'est en ligne.

## La règle qui prime : tout est public

Ce dépôt est le seul du poste dont le contenu est **publié sur Internet**. Avant toute écriture :
aucune donnée nominative, aucun identifiant, aucun chemin machine, aucun extrait de base, aucun nom
d'agent ou de service interne. Le doute vaut refus.

## Où écrire, et où ne pas

- **`index.html`** est le portfolio (v2, en ligne depuis le 2026-10-02). CSS dans un `<style>`, JS
  en bas de page : porte à mot de passe (empreinte PBKDF2, lien direct `#<mot de passe>`), encart
  « Et chez vous ? » (geo.api.gouv.fr), diagramme compétences → réalisations, onglets des fiches.
  Ressources locales dans **`assets/`** : polices auto-hébergées (`Bricolage Grotesque`, `DM Mono`),
  images WebP, CV en PDF, image de partage `og.png`. Contenu en français.
- **`v1/`** est l'ancien portfolio, gardé en archive et atteignable par URL directe. Ne plus y toucher.
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
