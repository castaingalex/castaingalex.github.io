# castaingalex.github.io

Site personnel d'Alexandre Castaing, publié par GitHub Pages sur le domaine **castaing.dev**
(cf. `CNAME`). Contenu **public** : tout ce qui est poussé ici est en ligne.

Pas de build, pas de dépendance, pas de gestionnaire de paquets. On édite, on pousse sur `main`,
GitHub Pages sert le résultat.

## Ce que contient le dépôt

| | Rôle |
|---|---|
| `index.html` | le portfolio lui-même, CSS et JS embarqués |
| `assets/` | polices, images, CV en PDF et image de partage du portfolio |
| `v1/` | ancien portfolio, gardé en archive, non lié |
| `carte-pdf/` | démo publiée de l'outil de carte PDF, **liée depuis la page d'accueil** |
| `portrait-eco/` | démo du portrait économique, publiée mais **non liée** |
| `portrait-finances/` | démo de la rétrospective financière, **liée depuis la fiche 02** |
| `milestone/` | Milestone, frise de vie personnelle en app web, publiée mais **non liée** |
| `portee-bus/` | À portée de bus, temps de trajet en bus (Bourges Plus, COBAN Atlantique), publiée mais **non liée** |

Les démos non liées sont atteignables par URL directe. Elles sont publiées volontairement,
sans être exposées depuis l'accueil.

## D'où viennent les démos

Elles sont **construites ailleurs** et déposées ici pour publication. Leur source vit dans
`coban_products` (`app_portrait_eco`, `app_retro_financiere`, `map_portee_bus`), `coban_processing`
(`tool_carte_pdf`) et `experiments` (`milestone`). Ne jamais corriger une démo ici : la correction se fait dans son sous-projet
d'origine, puis on redépose.

## Avant de pousser

**C'est public.** Aucune donnée nominative, aucun identifiant, aucun chemin machine, aucun extrait
de base. Les règles de travail dans ce dépôt sont dans `AGENTS.md`, la convention des dépôts dans
`../dotfiles/docs/convention_repos.md`.
