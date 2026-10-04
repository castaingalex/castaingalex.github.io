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
  images WebP, CV en PDF, image de partage `og.png`, vidéo de démonstration de l'assistant IA
  (`assets/video/`, lecteur natif du navigateur, sans YouTube ; sources du montage hors dépôt).
  Contenu en français.
- **`v1/`** est l'ancien portfolio, gardé en archive et atteignable par URL directe. Ne plus y toucher.
- **`carte-pdf/`, `portrait-eco/`, `portrait-finances/`, `milestone/`** sont des **démos déposées**,
  pas du code source. Ne jamais y corriger quoi que ce soit : la source vit dans `coban_products`
  (`app_portrait_eco`, `app_retro_financiere`), `coban_processing` (`tool_carte_pdf`) et
  `experiments` (`milestone`, commande de dépôt dans son README). On corrige là-bas, puis on
  redépose ici.

`carte-pdf` est liée depuis la fiche 05, `portrait-finances` depuis la fiche 02 (étape 1 « Rétrospective », avant le Sankey en étape 2,
étape 2 et textes de la fiche regroupés sur un fond commun). `portrait-eco` et `milestone` sont
publiées et atteignables par URL directe, sans être exposées : ne pas ajouter de lien vers elles
sans demande explicite. `milestone` porte en plus `noindex`.

## Registre

Français, pas de tiret cadratin en incise. C'est un écrit adressé à des lecteurs extérieurs, dont
des recruteurs : la doctrine de travail (`~/.claude/CLAUDE.md`) s'applique au mot près, en
particulier l'interdiction de la posture haute.
