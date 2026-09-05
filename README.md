# castaingalex.github.io

Site personnel d'Alexandre Castaing, publié par GitHub Pages sur le domaine **castaing.dev**
(cf. `CNAME`). Contenu **public** : tout ce qui est poussé ici est en ligne.

Pas de build, pas de dépendance, pas de gestionnaire de paquets. On édite, on pousse sur `main`,
GitHub Pages sert le résultat.

## Ce que contient le dépôt

| | Rôle |
|---|---|
| `index.html` | le portfolio lui-même, un seul fichier de 2 Mo, CSS et JS embarqués |
| `carte-pdf/` | démo publiée de l'outil de carte PDF, **liée depuis la page d'accueil** |
| `portrait-eco/` | démo du portrait économique, publiée mais **non liée** |
| `portrait-finances/` | démo de la rétrospective financière, publiée mais **non liée** |

Les deux démos non liées sont atteignables par URL directe. Elles sont publiées volontairement,
sans être exposées depuis l'accueil.

## D'où viennent les démos

Elles sont **construites ailleurs** et déposées ici pour publication. Leur source vit dans
`coban_products` (`app_portrait_eco`, `app_retro_financiere`) et `coban_processing`
(`tool_carte_pdf`). Ne jamais corriger une démo ici : la correction se fait dans son sous-projet
d'origine, puis on redépose.

## Avant de pousser

**C'est public.** Aucune donnée nominative, aucun identifiant, aucun chemin machine, aucun extrait
de base. Les règles de travail dans ce dépôt sont dans `AGENTS.md`, la convention des dépôts dans
`../dotfiles/docs/convention_repos.md`.
