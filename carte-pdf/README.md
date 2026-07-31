# Générateur de cartes PDF — démo

Fichier produit, déposé ici pour être servi à `https://castaing.dev/carte-pdf/`. **Ne pas modifier à
la main** : il est reconstruit à chaque mise à jour du code.

Le code source vit dans le dépôt de traitements (privé), sous-projet `tool_carte_pdf`. Republier :

```bash
uv run src/main.py build --sortie ~/git/castaingalex.github.io/carte-pdf/index.html --modeles generique
cd ~/git/castaingalex.github.io && git commit -am "maj du générateur de cartes PDF" && git push
```

`--modeles generique` livre l'outil **sans aucune marque** : les chartes des collectivités
(couleurs, logos) restent dans le dépôt privé et ne sont pas diffusées ici.

## Ce que la page fait, et ne fait pas

Un seul fichier HTML, sans serveur applicatif ni clé d'API. Il n'embarque aucune donnée et n'en
transmet aucune : les couches chargées par le visiteur sont lues et dessinées dans son navigateur,
et le PDF y est fabriqué. Les seuls appels sortants sont les fonds de carte (IGN Géoplateforme,
OpenStreetMap) et le géocodeur BAN pour le texte tapé dans le champ de localisation.

**Ce chemin n'est pas couvert par le mot de passe du portfolio** : l'adresse suffit à ouvrir
l'outil. C'est voulu — une démo se montre — mais c'est à savoir avant de diffuser le lien.

## Licences des bibliothèques incluses

Leaflet 1.9.4 (BSD-2-Clause) · proj4js 2.11.0 (MIT) · jsPDF 2.5.2 (MIT) ·
Montserrat, Google Fonts v31 (SIL Open Font License 1.1). Leurs mentions de copyright sont
conservées dans le fichier, comme ces licences l'exigent.

Fonds de carte : © IGN — Géoplateforme ; © les contributeurs OpenStreetMap.
