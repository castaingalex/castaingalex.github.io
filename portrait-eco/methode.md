# Methode

Document genere par `pipeline/transform.py`. Ne pas modifier a la main.

## Sources utilisees

| Cle | Titre | Editeur | Licence | Verifiee |
|---|---|---|---|---|
| `sirene_etablissements` | Base Sirene des entreprises et de leurs établissements | INSEE | Licence Ouverte 2.0 | oui |
| `sirene_unites_legales` | Base Sirene, stock des unités légales | INSEE | Licence Ouverte 2.0 | oui |
| `sirene_geolocalisation` | Géolocalisation des établissements du répertoire Sirene pour les études statistiques | INSEE | Licence Ouverte 2.0 | oui |
| `naf_rev2` | Nomenclature d'activités française, révision 2 | INSEE | Licence Ouverte 2.0 | oui |
| `api_geo` | API Géo, communes et contours | DINUM / Etalab | Licence Ouverte 2.0 | oui |
| `dvf` | Demandes de valeurs foncières | DGFiP | Licence Ouverte 2.0 | oui |
| `dvf_geolocalisees` | Demandes de valeurs foncières géolocalisées | Etalab, à partir des données DGFiP | Licence Ouverte 2.0 | oui |
| `fpm` | Fichier des locaux des personnes morales | DGFiP | Licence Ouverte 2.0 | oui |
| `cadastre` | Plan cadastral informatisé, parcelles | DGFiP, diffusion Etalab | Licence Ouverte 2.0 | oui |
| `bpe` | Base permanente des équipements 2025 | INSEE | Licence Ouverte 2.0 | oui |
| `ofgl_strates` | Comptes consolidés des groupements à fiscalité propre | Observatoire des finances et de la gestion publique locales | Licence Ouverte 2.0 | oui |
| `urssaf` | Nombre d'établissements employeurs et effectifs salariés du secteur privé, par commune et activité | URSSAF Caisse nationale | ODbL | oui |
| `ban` | Base Adresse Nationale, service de geocodage | IGN / DINUM, Géoplateforme | ODbL | oui |
| `iris` | Contours... IRIS® | IGN, d'après le zonage de l'INSEE | Licence Ouverte 2.0 | oui |
| `insee_population_iris` | Population en 2022, base infracommunale à l'IRIS | INSEE, recensement de la population | Licence Ouverte 2.0 | oui |
| `insee_revenus_iris` | Revenus, pauvreté et niveau de vie en 2021, à l'IRIS | INSEE, dispositif Filosofi | Licence Ouverte 2.0 | oui |
| `insee_recensement` | Série historique du recensement de la population | INSEE, recensement de la population | Licence Ouverte 2.0 | oui |
| `openstreetmap` | OpenStreetMap, occupation du sol | Contributeurs OpenStreetMap | ODbL 1.0 | oui |
| `bdtopo_zones_activite` | BD TOPO®, zones d'activité ou d'intérêt | IGN | Licence Ouverte 2.0 | oui |
| `bourges_plus_parcs` | Parcs d'activités de l'agglomération de Bourges | CA Bourges Plus | non déclarée | oui |
| `gpu_zonage` | Zonage des documents d'urbanisme | Géoportail de l'urbanisme | Licence Ouverte | oui |
| `ecosystemes_declares` | Écosystèmes économiques du territoire, inventaire déclaré | CA Bourges Plus, service développement économique | usage interne | oui |
| `ign_geoplateforme` | Plan IGN, tuiles vectorielles | IGN | Licence Ouverte 2.0 | oui |

## Indicateurs produits a ce jour

| Indicateur | Statut de preuve | Passe |
|---|---|---|
| Commerces en activité | constate | passe 1, produit |
| Commerces pour 1 000 habitants | constate | passe 1, produit |
| Équipements de proximité pour 1 000 habitants | constate | passe 9, produit |
| Établissements employeurs | constate | passe 11, produit |
| Établissements de l'économie réelle | constate | passe 11, produit |
| Activités à forte intensité de connaissance | constate | passe 11, produit |
| Établissements des écosystèmes déclarés | croise | passe 11, produit |
| Commerces créés sur 12 mois | constate | passe 4, produit |
| Commerces fermés sur 12 mois | constate | passe 4, produit |
| Solde des mouvements | constate | passe 4, produit |
| Solde rapporté au stock | constate | passe 17, produit |
| Survie à 5 ans | constate | passe 4, produit |
| Emploi salarié privé | constate | passe 5, produit |
| Emploi salarié dans le commerce | constate | passe 5, produit |
| Établissements en zone d'activité | croise | passe 5, produit |
| Prix médian au m² d'un local commercial | constate | passe 6, produit |
| Commerces dont le détenteur des murs est identifié | croise | passe 6, produit |
| Commerces de linéaire en polarité | estime | passe 7, produit |
| Adresses à vérifier sur le terrain | estime | passe 7, produit |

### Ce que chaque indicateur mesure

**Commerces en activité**  
Nombre d'établissements en activité dont l'activité principale relève d'une famille de commerce. Les établissements de vente à distance, déclarés au domicile de leur créateur, sont comptés à part.

**Commerces pour 1 000 habitants**  
Nombre de commerces en activité rapporté à la population légale du territoire. Le repère est la médiane des groupements de même nature et de même tranche de population, calculée sur le répertoire SIRENE France entière avec exactement la même définition du commerce. Il situe, il ne juge pas, et aucun rang n'est publié.

**Équipements de proximité pour 1 000 habitants**  
Équipements et services de la gamme de proximité de l'INSEE, rapportés à la population. La gamme de proximité rassemble ce dont l'absence se remarque au quotidien : l'école élémentaire, le médecin généraliste, la boulangerie, l'épicerie, le bureau de poste, le coiffeur, le restaurant. Ce n'est pas un comptage de commerces et il ne s'y compare pas : la base permanente des équipements observe des points de vente et des services quand le répertoire enregistre des établissements.

**Établissements employeurs**  
Établissements en activité qui déclarent au moins un salarié. C'est le chiffre le plus proche de ce qu'on entend par entreprise : le répertoire compte 19 719 inscriptions actives sur le territoire, dont 8 612 entrepreneurs individuels sans salarié et 5 231 sociétés immobilières. Le critère est le caractère employeur publié par l'INSEE, et non la tranche d'effectif, qui n'est pas renseignée partout.

**Établissements de l'économie réelle**  
Établissements du secteur marchand ou employeurs, hors sociétés civiles, hors entrepreneurs individuels sans salarié, hors associations et organismes publics sans salarié, et hors codes de location immobilière. La règle est celle de l'atlas des parcs d'activités de l'agence d'urbanisme de l'Orléanais, et elle est déclarée dans config/filieres.yml parce qu'elle est discutable : elle retire les trois quarts du répertoire. Le détail de la cascade est affiché sous le chiffre, ligne à ligne.

**Activités à forte intensité de connaissance**  
Établissements dont l'activité principale relève de la conception, de la recherche, de l'ingénierie, du numérique, de la finance ou de l'enseignement supérieur. La liste des activités retenues est dans config/filieres.yml. Elle porte sur l'activité PRINCIPALE de l'établissement : un bureau d'études de vingt personnes à l'intérieur d'une usine de mécanique n'y figure pas, et le chiffre est donc un minimum.

**Établissements des écosystèmes déclarés**  
Établissements en activité appartenant aux acteurs qu'un écosystème déclare. La liste est relevée à la main dans config/ecosystemes.yml, avec sa source et sa date, parce qu'aucune source ouverte ne la donne : il n'existe aucune liste nominative des entreprises de la base industrielle et technologique de défense, et le NAF ne la reconstitue pas. Sur ce territoire, six acteurs identifiés se répartissent sur quatre codes d'activité dont aucun ne s'appelle défense.
Taux de rapprochement porte sur des acteurs déclarés par le service, retrouvés au répertoire, seuil de publication 70 %.

**Commerces créés sur 12 mois**  
Établissements de commerce inscrits au répertoire SIRENE pendant la période. Une création au répertoire n'est pas toujours une ouverture de boutique : un changement de forme juridique, une reprise de fonds ou un déménagement ferment un numéro et en ouvrent un autre.

**Commerces fermés sur 12 mois**  
Établissements de commerce dont l'état administratif est passé à fermé pendant la période. La date retenue est celle du dernier événement du répertoire, vérifiée identique à la date de fermeture publiée par l'annuaire des entreprises. Le détail isole les radiations du 31 décembre, qui sont des fermetures administratives de fin d'année et non des rideaux baissés.

**Solde des mouvements**  
Créations moins fermetures sur la période. Les deux chiffres qui le composent sont affichés à côté : un solde nul peut recouvrir vingt créations et vingt fermetures, ce qui ne dit pas la même chose qu'un territoire immobile. Le repère est le solde moyen des mêmes douze mois des années précédentes, à fenêtre glissante et non par année civile, pour que la saisonnalité des inscriptions ne soit pas ce qu'on lit.

**Solde rapporté au stock**  
Solde des mouvements de douze mois divisé par le nombre de commerces en activité. Un solde brut ne se lit pas : « + 108 » ne dit pas si c'est beaucoup, et ne se compare à aucun autre territoire. C'est le rapport de deux agrégats tirés de la même source, rien n'y est rapproché. Le repère est la médiane des groupements de même nature et de même tranche de population, calculée France entière sur exactement la même définition et sur exactement la même fenêtre de douze mois.

**Survie à 5 ans**  
Part des commerces d'une génération qui ont franchi leur cinquième anniversaire, qu'ils soient encore ouverts ou fermés depuis. La génération affichée est la plus récente entièrement observable : une génération plus jeune compterait comme survivants des commerces qui n'ont pas encore eu cinq ans.

**Emploi salarié privé**  
Effectifs salariés du secteur privé au 31 décembre, déclarés aux URSSAF. Ne compte ni les agents publics, ni les non-salariés : la commune, le département, l'hôpital et l'éducation nationale sont hors de ce chiffre alors qu'ils sont parmi les premiers employeurs du territoire. La trajectoire depuis 2006 se lit sur l'écran des parcs d'activité.

**Emploi salarié dans le commerce**  
Part de l'emploi salarié privé dont le code d'activité relève d'une famille de commerce, selon la même nomenclature que le reste de l'outil. Elle ne compte que les salariés : un commerce tenu par son propriétaire seul pèse pour un établissement dans les comptages et pour zéro ici.

**Établissements en zone d'activité**  
Établissements en activité dont la position tombe dans le périmètre d'un parc d'activité. Un établissement sans position ne peut pas y tomber : le chiffre porte donc sur la part cartographiable du tissu, affichée à côté. Les périmètres sont allés chercher dans la BD TOPO de l'IGN puis dans OpenStreetMap, à partir de l'inventaire que la collectivité publie.
Taux de rapprochement porte sur des établissements en activité, ceux qui portent une position, seuil de publication 80 %.

**Prix médian au m² d'un local commercial**  
Médiane du prix au mètre carré des ventes ne portant qu'un seul local, de type commercial. Le nombre de mutations sur lequel elle porte est affiché à côté : une médiane sur six ventes ne se lit pas comme une médiane sur deux cents. La source ne distingue pas une boutique d'un entrepôt, et un local vendu avec son terrain ne se compare pas à une boutique en copropriété : l'écran affiche les deux médianes qui composent celle-ci.

**Commerces dont le détenteur des murs est identifié**  
Commerces en activité pour lesquels le fichier des locaux des personnes morales de la DGFiP désigne au moins un détenteur à la même adresse. Le complément n'est pas « détenu par des particuliers » mais « non identifié » : ce fichier ne couvre que les personnes morales, et une large part des murs de centre-ville appartient à des particuliers, qui n'y figurent pas. Le détenteur n'est nommé que lorsqu'il est seul à l'adresse.
Taux de rapprochement porte sur des commerces dont l'INSEE publie l'adresse, seuil de publication 85 %.

**Commerces de linéaire en polarité**  
Commerces tenant une vitrine sur rue qui appartiennent à un groupe d'au moins cinq commerces distants de moins de cinquante mètres de proche en proche. Ce groupe n'est pas un périmètre de centre-ville : aucune source ouverte n'en publie, et l'outil ne dessine aucun contour. Il dit seulement quels commerces se suivent. Les deux seuils sont dans config/centralites.yml, avec la mesure de leur sensibilité.
Taux de couverture porte sur des commerces de linéaire, ceux qui portent une position, seuil de publication 80 %.

**Adresses à vérifier sur le terrain**  
Adresses où un commerce tenant vitrine a fermé depuis trois ans sans qu'aucun autre ne s'y soit installé depuis. C'est une présomption de cellule vide, pas un constat : l'adresse est plus grossière qu'une cellule, et un immeuble dont la boutique ferme mais dont les bureaux restent occupés figure dans la liste avec le nombre d'établissements encore en activité à côté. Aucune source ouverte ne mesure la vacance commerciale et l'outil n'en publie donc aucun taux.
Taux de couverture porte sur des commerces de linéaire fermés, ceux qui portent une adresse exploitable, seuil de publication 80 %.


### Le tronc de la fiche de territoire

Sept chiffres, presents a l'EPCI comme a chacune de ses communes, avec la
meme definition et la meme source. La fiche du groupement est la SOMME de
celles de ses communes, jamais un second comptage, et un controle bloquant
verifie que cette somme retrouve le comptage direct de l'extraction.

**Habitants** (constate)  
Population légale publiée par l'INSEE et servie par l'API Géo. Au niveau du groupement, c'est la SOMME de ses communes membres et non la population que l'API publie au niveau du groupement : les deux diffèrent de quarante-deux habitants sur Bourges Plus, et toutes les densités de l'outil se calculent sur la première.

**Établissements en activité** (constate)  
Établissements inscrits au répertoire SIRENE et non radiés, toutes activités confondues. Les établissements à diffusion partielle y sont comptés : l'INSEE les publie délibérément, seuls leurs champs identifiants sont masqués. Ils ne sont jamais nommés ni cartographiés.

**Commerces en activité** (constate)  
Établissements en activité dont l'activité principale relève d'une famille de commerce, au sens de config/familles.yml. Le détail donne ceux qui tiennent une vitrine sur rue, seuls concernés par la lecture de centre-ville. La nomenclature se lit code par code sur l'écran des définitions.

**Commerces créés moins commerces fermés, sur douze mois** (constate)  
Créations moins fermetures de commerces sur les douze mois de la fenêtre, qui recule de deux crans par rapport au millésime du stock : un cran mécanique, un cran de retard de déclaration. Ce sont des inscriptions et des radiations au répertoire, jamais des ouvertures et des fermetures de boutique constatées sur le trottoir.

**Salariés du secteur privé** (constate)  
Effectifs salariés du secteur privé au 31 décembre du dernier millésime déclaré aux URSSAF. Ne compte ni les agents publics ni les non-salariés : la commune, le département, l'hôpital et l'éducation nationale sont hors de ce chiffre alors qu'ils sont parmi les premiers employeurs du territoire.

**Commerces pour 1 000 habitants** (constate)  
Nombre de commerces en activité rapporté à la population. C'est un rapport entre deux agrégats publiés, donc un constat et non un rapprochement. Une densité élevée n'est pas un bon résultat en soi : elle situe, elle ne juge pas.

**Équipements et services de proximité** (constate)  
Équipements et services de la gamme de proximité de l'INSEE : l'école élémentaire, le médecin généraliste, la boulangerie, l'épicerie, le bureau de poste, le coiffeur, le restaurant. CE N'EST PAS UN COMPTAGE DE COMMERCES et il ne s'y soustrait pas : la base permanente des équipements observe des points de vente et des services quand le répertoire enregistre des établissements immatriculés.


## Ou lire ce que l'outil compte

L'ecran DEFINITIONS porte deux choses que l'interface employait sans les dire.

La nomenclature du commerce, code par code : les familles avec leurs codes
d'activite, ce qui est range en hors champ commerce avec les effectifs, et les
codes sortis du denominateur des densites. `config/familles.yml` est en statut
BROUILLON et doit etre soumis au service developpement economique : personne ne
peut le valider sans voir ce qu'il contient.

Le glossaire, une entree par terme avec sa definition, sa source et son mode de
calcul. Il vit dans `config/glossaire.yml` et AUCUNE DEFINITION N'EST ECRITE
DANS LE CODE : le front pose un 'i' sur chaque en-tete de colonne dont le terme
y figure, et un test verifie que toute cle appelee par un ecran existe bien.

## Comment se lisent les zones d'activite

L'INVENTAIRE DE LA COLLECTIVITE FAIT FOI, et les perimetres sont alles
chercher. Le sens de lecture a ete inverse le 15/08/2026 : jusque-la, l'outil
partait de la couche de l'IGN et la filtrait par nature, en esperant que le
resultat ressemble a l'inventaire du service. Il n'y ressemblait pas et ne
pouvait pas : la BD TOPO range la ZAC Lahitolle et les Quatre Vents en
'Usine', ignore la Route de Dun, et dessine en revanche des usines isolees
qu'aucun service ne compte comme une zone.

La liste des 30 parcs est donc relevee a la main dans
`config/zones_activite.yml`, depuis la publication de la collectivite, et
datee du 2026-08-15. Le nombre de parcs du territoire ne depend
plus de la qualite d'un filtre : c'est celui que la collectivite publie.

Ce qui varie est la part des parcs dont le contour a ete retrouve : 25 sur 30, soit 83.3% (21 par la BD TOPO de l'IGN, 4 par OpenStreetMap).
Le rapprochement se fait sur le NOM, apres retrait des mots que portent tous
les libelles, et il exige tous les mots utiles du nom officiel : une
correspondance approximative donnerait a 'Beaulieu Est' le perimetre de
'Beaulieu Ouest'. Les cas que le nom seul ne resout pas sont declares en alias
dans la configuration. Un perimetre n'est attribue qu'a un seul parc, et un
controle bloquant le verifie : la BD TOPO ne leve qu'une ZAC pour les deux
tranches des Aillis, et l'attribuer aux deux compterait sa surface deux fois.

Le nom affiche est celui de la collectivite, jamais celui de la source. Le nom
de la source est publie a cote, pour que le rapprochement se verifie ligne a
ligne devant quelqu'un qui conteste sa liste.

### Aucune surface de parc n'est publiee

Decide le 16/08/2026, passe 21, et c'est un renoncement documente au sens du
corollaire de tracabilite : un chiffre faux portant un badge `Croise` n'est pas
affiche degrade, il n'est pas affiche du tout.

Les contours retrouves mesurent 732.4 hectares quand la collectivite en annonce 1200.
L'ecart ne tient pas aux seuls parcs sans contour. Il tient a ce que les deux
sources mesurent : la BD TOPO leve l'emprise batie vue au sol, OpenStreetMap
rend ce qu'un contributeur a saisi, et NI L'UNE NI L'AUTRE ne dessine le
perimetre d'amenagement du parc, qui est ce qu'un service compte. Le detail le
montre mieux que l'ecart : des parcs sortaient a quelques hectares pour plus de
cent etablissements, c'est-a-dire au contour d'un batiment.

Le zonage du PLUi a ete verifie comme troisieme source, et ecarte. Il est bien
verse au Geoportail de l'urbanisme, interrogeable en WFS sans compte, et il
porte des zones economiques explicites : 50 polygones pour 2 407 hectares sur
ce territoire. Un zonage EST un perimetre d'amenagement, mais IL NE SEPARE PAS
LES PARCS : un seul polygone de 914 hectares en recouvre neuf d'un coup. La
regle 'un perimetre n'est attribue qu'une fois' le rend inutilisable, et son
total est le double de ce que la collectivite annonce parce qu'il couvre tout
le foncier a vocation economique et non les seuls parcs amenages.

Ce qui reste publie : le nombre de parcs, qui vient de l'inventaire, le nombre
de contours retrouves avec son taux, et le nombre d'etablissements par parc,
qui porte la meme limite ecrite a cote de lui. Les contours restent traces :
ils situent le parc, ce qu'ils font correctement.

5 parcs recenses n'ont de contour
dans aucune source : Route de Dun, Pôle Chancellerie, Pont de Bran, Route d'Orléans, Aillis II.
Ils restent dans la liste et comptent dans le nombre de parcs, sans
etablissement. Publies a zero, ils se liraient comme des parcs vides ;
retires, ils feraient une liste plus courte que celle du service.

Un etablissement est rattache a une zone quand sa position tombe dans le
perimetre. Un etablissement sans position ne peut ni y entrer ni en sortir :
le taux de rapprochement affiche a cote du chiffre est la part des
etablissements en activite qui portent des coordonnees, et c'est la limite
superieure de ce que ce comptage peut voir. Quand deux perimetres se
recouvrent, c'est le plus petit qui l'emporte, pour que la somme des
etablissements par zone reste egale au total en zone.

## Comment se lit l'emploi salarie

Les effectifs sont ceux du secteur prive au 31 decembre, du millesime 2006 au millesime 2025, publies par
l'URSSAF a la maille commune par code d'activite. La famille de commerce leur
est appliquee avec le meme `config/familles.yml` que le repertoire : le
commerce pese donc la meme chose sur les deux ecrans.

Aucune source ne rattache un salarie a une zone d'activite. L'emploi est donc
affiche a la maille communale, a cote des zones et jamais dedans.


## Comment se lisent les prix des locaux commerciaux

Une mutation publiee par la DGFiP est un ACTE, pas un bien : elle porte une
ligne par local et une ligne par parcelle, et la valeur fonciere est repetee a
l'identique sur chacune. Diviser cette valeur par la surface d'un seul local
quand l'acte en portait quatre rend un prix au metre carre plein, plausible et
faux. La regle retenue est donc stricte : seules comptent les ventes ne portant
qu'un local, et de type commercial.

Sur ce territoire, 880 ventes touchent au moins un
local commercial. 271 melangent commerce et logement,
139 portent plusieurs locaux commerciaux et
23 n'ont ni surface ni prix exploitables. Il
reste 447 ventes, et c'est sur elles que porte la
mediane affichee.

Le fichier ne distingue pas une boutique de centre-ville d'un entrepot de zone
d'activite : les deux sont un « local industriel, commercial ou assimile ».
C'est LA TAILLE DU LOCAL qui les separe le mieux, et non la presence de
terrain vendu avec les murs : mesure du 28/08/2026, un local de moins de
50 m2 se vend 1 395 euros le metre carre et un local de plus de 1 000 m2 en
vaut 209, soit un facteur 6,7, quand la decomposition par terrain ne rend que
961 contre 627. L'ecran publie donc les six tranches de surface, et garde le
filtre par terrain comme une lecture approximative de plus.

Aucune mediane n'est publiee sous 10 ventes, a aucune
maille. Une mediane sur trois ventes n'est pas une mediane, c'est la vente du
milieu, et elle serait citee comme le prix de marche d'une commune.

### Le marche du terrain a batir

Deux colonnes de la meme source, la nature de culture de chaque parcelle
vendue, ouvrent une lecture que l'outil n'avait pas : ce qui se vend en
TERRAIN, et a quel rythme. Elles etaient publiees depuis le premier jour et
n'etaient pas lues ; l'outil ne voyait que le bati commercial, et les
2208 mutations du territoire qui ne portent aucun local etaient
invisibles de bout en bout.

La regle est celle du bati, transposee : la mutation ne doit porter QUE du
terrain a batir, et aucun local. Sur ce territoire,
627 mutations portent du terrain a batir ;
70 portent aussi du bati,
66 melangent une autre nature de culture et
4 n'ont ni surface ni prix. Il reste
487 ventes.

La surface est comptee UNE FOIS PAR PARCELLE avant d'etre sommee : elle est
repetee sur chaque ligne de l'acte qui mentionne la parcelle, et un tiers des
couples mutation x parcelle du territoire portent plusieurs lignes. Un
controle bloquant refait cette somme par un autre chemin.

CE MARCHE MELE HABITAT ET ACTIVITE, et la source ne les distingue pas : elle
ne porte aucun zonage. La surface mediane d'un terrain vendu ici est de
741 metres carres, ce sont massivement des lots
pavillonnaires. Le croisement avec le zonage du PLUi a ete mesure le
28/08/2026 puis ecarte : 26 des 471 ventes situees tombent en zone economique,
soit cinq par an, sous le seuil de publication a toute maille annuelle, et le
document d'urbanisme qui les classe est posterieur aux ventes qu'il classerait.

## Comment se lit la detention des murs

Le fichier des locaux des personnes morales de la DGFiP ne porte ni la nature
du local, ni sa surface, ni sa valeur : rien n'y distingue une boutique d'un
appartement. La part des locaux commerciaux detenus par des personnes morales
n'est donc pas calculable, et aucun denominateur ouvert n'existe pour la
calculer autrement.

L'outil prend donc le probleme par l'autre bout : il part des commerces du
repertoire et cherche qui detient a leur adresse. Le rapprochement se fait sur
l'adresse normalisee, commune, numero de voirie et libelle de voie, et non par
la parcelle cadastrale. Ce dernier chemin a ete essaye puis ecarte : il ne
rattache que 71,7 % des commerces situes, et il designe le gestionnaire du
reseau electrique comme premier detenteur de murs de commerce du territoire,
ses postes de distribution etant minuscules et partout.

Un detenteur n'est nomme que s'il est seul a l'adresse. Quand plusieurs
personnes morales y detiennent, le commerce compte comme identifie mais son
detenteur reste sans nom : en choisir un parmi plusieurs donnerait un
proprietaire faux que rien ne distinguerait des autres.

La liste des detenteurs est classee par nombre d'ADRESSES et non de commerces.
Classee par commerces, elle remontait des adresses de domiciliation, ou
beaucoup d'activites sont enregistrees dans un meme immeuble, ce qui fait
passer un batiment pour un portefeuille de murs.

## Comment se lisent les mouvements

La fenetre des douze mois va du 2025-07-01 au 2026-06-30. Elle s'arrete avant la date du stock pour deux
raisons : le stock d'un mois donne ne contient rien de ce mois-la, et les
radiations arrivent au repertoire avec plusieurs semaines de retard. Le
nombre de mois retires est declare dans `config/indicateurs.yml`.

Une creation est une inscription au repertoire Sirene, pas une ouverture de
boutique : un changement de forme juridique, une reprise de fonds ou un
demenagement ferment un numero et en ouvrent un autre. Une fermeture est
symetriquement une radiation, et non un rideau baisse. La date de fermeture
est celle du dernier evenement du repertoire ; elle a ete verifiee identique
a la date de fermeture publiee par l'annuaire des entreprises.

Les radiations du 31 decembre sont des fermetures administratives de fin
d'annee prononcees d'office. Elles comptent, et leur nombre est affiche a
part sur l'ecran Dynamique.

Un taux de survie a n annees n'est publie que pour les generations dont tous
les etablissements ont atteint leur n-ieme anniversaire avant la fin de la
fenetre. Une generation plus jeune compterait comme survivants des
etablissements qui n'ont pas encore eu l'age.

## Comment se lit la population

La serie vient du recensement de l'INSEE, aux neuf millesimes de
1968 a 2023, publiee a la commune et au groupement.
L'outil ne recompose rien : les deux mailles sortent du meme fichier, et un
controle bloquant verifie qu'elles coincident a chaque millesime.

LE DERNIER POINT VAUT EXACTEMENT LA POPULATION AFFICHEE PARTOUT AILLEURS,
celle que l'API Geo publie en somme des communes membres. Deux sources, deux
chemins independants, un seul nombre, et un controle bloquant refuse la
preparation s'ils cessent de coincider : sans lui, l'ecran d'entree
afficherait une population et sa courbe en afficherait une autre, juste en
dessous.

Aucun taux d'evolution annuel moyen n'est calcule. Les intervalles entre
recensements vont de six a neuf ans, et un taux annualise sur des pas inegaux
se compare mal d'une periode a l'autre : l'ecart au sommet est une
soustraction, et le sommet est marque sur la courbe.

Les valeurs sont DECIMALES a partir de 2007 : le recensement se fait par
sondage depuis, et l'INSEE publie des estimations ponderees. L'arrondi se
fait a l'affichage et jamais avant.

La vacance publiee avec cette serie est celle du LOGEMENT et jamais celle du
commerce. Aucune source nationale ne mesure la seconde, et l'outil n'en
publie aucun taux : c'est le renoncement de la passe 7, et il tient. Le total
du parc est celui que la source publie, jamais la somme de ses categories :
recalculer un denominateur donnerait des parts qui somment a cent sur un total
qui n'est pas celui affiche a cote.

## Comment se lisent les quartiers

Le quartier est l'IRIS de l'INSEE, seul decoupage infracommunal officiel,
publie, nomme et stable. C'est la reponse SOURCEE a 'ou est le centre-ville',
et elle a ete branchee le 15/08/2026 : ceux de Bourges s'appellent 'Centre
Ville 1', 'Couronne Centrale 2', 'Gibjoncs 1', 'Val d'Auron 1'. Ce sont les
noms qu'un elu emploie.

Rien n'est croise ici, et le statut est donc `Constate` : le rattachement de
chaque etablissement a son quartier est deja fait par l'INSEE dans son fichier
de geolocalisation. Cette source n'apporte que les contours et les noms.

Sur ce territoire : 34 quartiers, sur 3 communes des 17 du
groupement. L'INSEE ne DECOUPE que les communes d'environ cinq mille habitants
et plus ; les autres recoivent un pseudo-IRIS de type 'Z' qui couvre la commune
entiere, ecarte de l'affichage. Ce n'est pas un defaut de couverture, c'est la
definition du zonage, et la question du centre-ville est de toute facon une
question de ville-centre.

Attention au champ IRIS du fichier de geolocalisation : il n'est jamais vide.
Il porte 'CSZ' pour une commune sans zonage et 'HZ' pour hors zone, qui sont
des sentinelles et non des valeurs, exactement comme le marqueur '[ND]' des
champs identifiants. Comptees naivement, elles font passer les communes non
decoupees pour des communes a un quartier.

Un IRIS n'est pas un perimetre commercial. Il est bati sur la population :
'Centre Ville 1' contient du logement autant que des boutiques. Il situe, il ne
mesure pas, et aucune densite commerciale n'est rapportee a sa surface.

## Comment se lisent les centralites

AUCUN PERIMETRE DE CENTRE-VILLE N'EST TRACE, et ce n'est pas une omission.
La collectivite n'en publie pas, et il n'en existe aucune couche nationale :
ce qui est publie a ce niveau est la liste des communes couvertes par une
operation de revitalisation de territoire, sans le moindre polygone. Le
perimetre de la collectivite prend la place de ce qui suit des qu'il est
declare dans `config/territoires.yml`.

A la place, l'outil groupe les commerces tenant vitrine sur rue qui se
suivent a moins de 50 metres de proche en proche, et appelle POLARITE un groupe d'au moins
5 commerces. Le chainage est transitif : une
rue commercante forme une polarite et non trente. Une polarite n'est pas un
centre-ville, elle est ce que la donnee sait voir d'une continuite de
vitrines, et son statut de preuve est donc `estime`. Les deux seuils sont
declares dans `config/centralites.yml`, avec la mesure de leur sensibilite :
les faire varier ne fait pas apparaitre ou disparaitre une centralite, cela la
fait grossir ou maigrir.

Une polarite ne porte pas de toponyme, personne ne l'ayant baptisee : elle
prend le nom de sa commune et celui de la voie qui porte le plus de ses
commerces. Son rang suit son effectif decroissant et non l'ordre du calcul,
pour qu'un lien envoye a un elu rouvre la meme rue d'une preparation a
l'autre.

Sur ce territoire : 46 polarites.

Un commerce de lineaire situe tombe dans une situation et une seule, et leur
somme egale le nombre de commerces situes. La zone d'activite prime sur la
polarite : le perimetre vient d'une source, le groupe est reconstruit, et quand
les deux se disputent un commerce c'est la source qui gagne. Sans cette
priorite, le chainage traversait la limite d'un parc commercial et fondait un
centre commercial avec les commerces de la rue voisine.

Un commerce sans position ne tombe dans AUCUNE des trois situations, et surtout
pas en diffus : ce serait ranger en commerce isole un commerce dont on ignore
seulement ou il est. Leur nombre est affiche a cote du chiffre.

## Comment se lit la feuille de route de relevé

C'est le livrable de cet ecran, et il remplace un taux de vacance que rien ne
permet de calculer. Une adresse y figure quand un commerce tenant vitrine y a
ete radie depuis moins de 36 mois et qu'aucun autre
commerce de lineaire n'y est en activite aujourd'hui.

C'est une PRESOMPTION de cellule vide, pas un constat, et pour une raison de
maille : l'adresse est plus grossiere qu'une cellule. Un immeuble dont la
boutique ferme mais dont les bureaux restent occupes figure donc dans la liste,
avec le nombre d'etablissements encore en activite a cote, pour que le releveur
priorise sans que l'outil decide a sa place. La presence qui fait sortir une
adresse est celle d'un commerce de lineaire et non de n'importe quel
etablissement : retenir tout etablissement ferait disparaitre exactement ce
qu'un service developpement economique cherche, la cellule commerciale devenue
bureau ou cabinet medical.

Sur ce territoire : 345 adresses a verifier, tirees de 856 fermetures de commerces de lineaire sur
la periode.

La boucle se ferme sur le terrain. Le relevé revient dans un fichier declare
sous `releve_terrain` dans `config/territoires.yml`, et fait basculer les
adresses relevees de presume a constate. C'est ce retour, et lui seul, qui rend
l'indicateur defendable devant quelqu'un qui connait sa rue.

Aucun relevé terrain n'est declare pour ce territoire : toutes les adresses
de la liste sont donc au statut presume.

## Ce qui n'est pas mesure

- **La vacance commerciale.** Aucune source nationale ne la mesure, et aucun
  univers des locaux commerciaux d'un territoire n'existe en donnee ouverte :
  sans denominateur, il n'y a pas de taux. Les trois pistes ont ete mesurees
  plutot que supposees. Le fichier des locaux de la DGFiP ne porte aucune nature
  de local. Le cadastre ne porte que des geometries de parcelle, sans usage. La
  BD TOPO porte bien un usage commercial, mais 16,5 % seulement des commerces de
  lineaire situes tombent dans ces batiments, et 93,1 % de ces batiments ne
  portent aucun commerce : le commerce de centre-ville est en rez-de-chaussee
  d'immeubles classes residentiels. Un taux calcule la-dessus sortirait a 93 %.
  L'outil publie donc une liste d'adresses a verifier, et aucun pourcentage.
- **Le perimetre du centre-ville.** Aucune source ouverte ne le publie. Ce que
  l'outil trace n'est pas un contour mais un groupe de points : les seuls
  polygones affiches restent ceux des zones d'activite, qui viennent d'une source.
- **La cellule commerciale.** La maille la plus fine que la donnee connaisse est
  l'adresse postale. Deux boutiques mitoyennes au meme numero ne se distinguent
  pas, et un batiment n'est pas davantage une cellule : la ou le comptage a ete
  fait, 64 des 264 batiments occupes en portaient de deux a sept.
- **Le motif d'une fermeture.** Le repertoire dit qu'un etablissement a ete
  radie, jamais pourquoi. Une liquidation, un depart a la retraite, une reprise
  sous un autre numero et un demenagement d'une rue a l'autre produisent la meme
  ligne. Seul le terrain fait la difference.
- **Les mouvements par famille avant 2008.** Les etablissements radies avant
  l'entree en vigueur de la NAF rev. 2 gardent un code d'une nomenclature
  anterieure et ne recoivent aucune famille. Les series par famille commencent
  donc en 2008 : les prolonger ferait monter la survie a mesure qu'on remonte
  le temps, faute des disparus.
- **Le nom des etablissements a diffusion partielle.** Ils comptent dans tous
  les totaux, leur activite et leur commune sont connues, mais ni leur nom ni
  leur adresse ne sont publies. L'INSEE les diffuse ainsi volontairement.
- **La position des etablissements a diffusion partielle.** Le fichier de
  geolocalisation de l'INSEE ne les couvre pas, et leur adresse est masquee au
  niveau de la voie : aucun geocodage ne peut les rattraper. Ils sont donc
  comptes mais absents de la carte, et c'est pourquoi le nombre de points
  affiches est inferieur au nombre d'etablissements annonce.
- **La famille des etablissements fermes anciens.** Ceux qui portent une
  nomenclature anterieure a la NAF rev. 2 ne recoivent pas de famille : aucune
  table de correspondance officielle ne les ramene vers la nomenclature actuelle.
- **Les societes civiles immobilieres et supports juridiques**, retires du
  denominateur des densites. Voir `hors_champ_economique` dans config/familles.yml.
- **La surface d'une zone d'activite, et donc son remplissage.** Aucune
  source ouverte ne dessine le perimetre d'amenagement d'un parc : la BD TOPO
  leve l'emprise batie, OpenStreetMap rend une saisie contributive, et le
  zonage du PLUi, verifie en passe 21, ne separe pas les parcs. La surface a
  donc quitte la diffusion le 16/08/2026. Le remplissage reste hors de portee
  pour une autre raison, qui ne se reglera pas avec un meilleur contour :
  aucune source ne publie la surface encore commercialisable ni le parcellaire.
- **L'emploi public.** Les effectifs de l'URSSAF ne couvrent que le secteur
  prive. La commune, le departement, l'hopital et les services de l'Etat sont
  parmi les premiers employeurs du territoire et ne sont pas dans ce chiffre.
  La liste des principaux employeurs les signale un par un.
- **L'emploi par zone d'activite.** L'URSSAF publie a la commune, pas a
  l'adresse : aucun salarie ne peut etre rattache a un perimetre.
- **Le nombre exact de salaries d'un etablissement.** Le repertoire ne publie
  qu'une tranche. Les principaux employeurs sont donc listes au-dessus d'un
  seuil et non classes entre eux.
- **La sous-traitance d'un ecosysteme economique.** Aucune source ouverte ne
  publie de relation client-fournisseur en France : ni le repertoire Sirene,
  ni les greffes, ni le bulletin officiel des annonces civiles et
  commerciales. Ce qui est publie a la place est le socle industriel, c'est a
  dire le nombre d'etablissements des filieres ou un tel ecosysteme recrute
  habituellement ses fournisseurs. Il ne dit pas lesquels travaillent pour lui.
- **L'appartenance d'une entreprise a la base industrielle et technologique de
  defense.** Verifie le 15/08/2026 : aucune liste ouverte et nominative
  n'existe, le seul jeu publie par le ministere des Armees etant une synthese
  statistique agregee de 2014/2015. Et le code d'activite ne la reconstitue
  pas : sur ce territoire, les acteurs identifies se repartissent sur quatre
  codes dont aucun ne s'appelle defense, et aucun etablissement ne porte le
  code 84.22Z. La liste est donc declaree a la main dans
  config/ecosystemes.yml, et le taux d'acteurs retrouves est affiche.
- **Les competences et les metiers exerces dans un etablissement.** Aucune
  source ne les publie. Le recensement donne les categories
  socioprofessionnelles des HABITANTS d'une commune, ce qui est une autre
  question et ne s'y substitue pas.
- **Les investissements des entreprises.** Aucune source ouverte.
- **La clientele d'un quartier.** Le profil des habitants decrit ceux
  qui y DORMENT, pas ceux qui y achetent : un IRIS est bati sur la
  population et non sur l'activite. Aucune source ouverte ne publie de
  zone de chalandise ni de depenses des menages ; celles que citent les
  observatoires d'agglomeration viennent d'enquetes achetees.
- **Le revenu median d'une commune decoupee en quartiers.** La base des
  revenus ne descend pas sous le quartier pour ces communes, et un
  revenu median n'est pas additif : celui de la ville ne se reconstitue
  pas en sommant ses quartiers. Le repere publie est donc la mediane des
  medianes de quartier de France, ce qui est autre chose et l'ecran le dit.
- **Les revenus des communes non decoupees.** La base ne couvre que les
  communes de cinq mille habitants et plus.
- **Les revenus posterieurs a 2021.** Ce n'est pas un retard de
  publication : l'INSEE a renonce au millesime 2022, attendu debut 2025,
  faute d'une qualite suffisante des sources. L'ecart avec le repertoire
  des entreprises est donc structurel.
- **La recherche et developpement faite hors des etablissements dont c'est
  l'activite principale.** La filiere recherche-developpement ne compte que la
  division 72 du NAF : un bureau d'etudes de vingt personnes a l'interieur
  d'une usine de mecanique n'y figure pas, et le chiffre est donc un minimum.
- **La part des locaux commerciaux detenus par des personnes morales.** Le
  fichier de la DGFiP ne dit pas la nature d'un local, et aucune source ouverte
  ne recense les locaux commerciaux d'un territoire. Le denominateur n'existe
  pas, et ce qui est publie a la place est un comptage de commerces, pas une
  part de locaux.
- **Les murs detenus par des particuliers.** Le fichier de la DGFiP ne couvre
  que les personnes morales. Un commerce dont le detenteur n'est pas identifie
  n'est donc pas un commerce dont les murs appartiennent a un particulier : il
  peut l'etre, ou n'avoir pas pu etre rapproche. Les deux cas sont indiscernables
  et ne doivent jamais etre presentes comme un seul.
- **Le lien entre un prix de vente et un detenteur.** Les mutations disent ce
  qui s'est vendu sans dire qui possede aujourd'hui, le fichier des locaux dit
  qui possede sans dire ni surface ni prix. Aucune source ouverte ne relie les
  deux, et le faire donnerait un prix au metre carre attribue a un proprietaire
  qui n'a jamais rien vendu.
- **La distinction entre une boutique et un entrepot dans les prix.** Les deux
  portent le meme code de type de local dans la source.
- **Le rang du territoire dans sa strate.** Il n'est ni publie ni calcule. La
  comparaison rend une mediane et deux quartiles, jamais un classement et jamais
  le nom d'un territoire comparable : une mediane situe, un rang designe.
- **Le nombre d'equipements d'une commune au fil du temps.** A la maille
  communale, l'INSEE ne publie qu'une PRESENCE, zero ou un, et non un comptage.
  Une commune peut avoir quatre boulangeries et n'afficher que 'present'. Le
  comptage n'existe qu'au dernier millesime.
- **La comparaison des equipements entres dans la nomenclature apres le premier
  millesime.** L'INSEE suivait 102 types en 2015, puis 142 types en 2020, puis 143 types en 2025. Un type entre entre-temps ne peut pas
  avoir ete gagne : le compter ainsi ferait lire l'elargissement de la
  nomenclature comme un equipement de plus.
- **L'emploi salarie des territoires comparables.** Le socle national est tire du
  repertoire Sirene ; l'URSSAF publie a la commune et sans rattachement
  intercommunal. La carte de l'emploi n'a donc pas de mediane de strate.

## Avec qui le territoire se compare

Groupe retenu : communautés d'agglomération de 100 000 à 300 000 habitants, 89 territoires. Critere `nature_et_tranche`, effectif minimal declare 10.

La tranche de population n'est pas decoupee par l'outil : elle est publiee par
l'Observatoire des finances et de la gestion publique locales, pour les 1 255
groupements a fiscalite propre. En decouper une soi-meme reviendrait a choisir
avec qui le territoire se compare, ce qui est exactement la decision qu'un
repere ne doit pas porter.

Le groupe le plus precis qui atteint l'effectif minimal est retenu, et l'ecran
dit lequel : meme nature juridique et meme tranche d'abord, meme tranche ensuite.
Sans cette cascade, une communaute de communes de la tranche haute se comparerait
a deux autres, et une mediane sur deux territoires n'est pas une mediane.

Les chiffres du socle sont recalcules France entiere avec exactement la meme
definition du commerce et le meme denominateur de population que le territoire :
la somme des populations des communes membres. Un controle bloquant verifie que
le socle retrouve, sur ce territoire, le comptage de l'extraction locale, et il
porte sur les trois nombres, le stock, les creations et les fermetures.

Le solde des mouvements se compare en TAUX et jamais en valeur : la mediane de
strate porte sur le solde rapporte au nombre de commerces en activite. Une
mediane calculee sur des soldes bruts ne comparerait que des tailles de
territoire. Elle porte sur exactement la meme fenetre de douze mois que le
chiffre affiche, ce qu'un controle bloquant verifie : la fenetre est bornee a
l'extraction, puisqu'elle borne une lecture distante, et la preparation
recalcule la sienne.

## Origine des positions

Le fichier de geolocalisation de l'INSEE prime. La Base Adresse Nationale ne
comble que ses trous, pour les etablissements portant encore une adresse, et
seuls les resultats de type numero ou voie sont retenus : un centroide de
commune dessinerait une concentration commerciale inexistante. L'origine de
chaque position est publiee dans le champ `position_source`.

## Signalements de la derniere preparation

- [dates] 27 etablissements portent une date de creation posterieure au millesime du stock (2026-08-01). Ils sont hors fenetre.
- [dates] 2 etablissements sont fermes avant d'avoir ete crees. Ils comptent dans les deux series, a leurs dates respectives.
- [dates] 5613 etablissements fermes n'ont pas de date de creation. Ils sont hors de toute generation, donc hors des taux de survie.
- [zones] 5 des 30 parcs recenses n'ont de perimetre dans aucune source : ['Route de Dun', 'Pôle Chancellerie', 'Pont de Bran', "Route d'Orléans", 'Aillis II']. Ils sont nommes a l'ecran, absents de la carte.
- [zones] 4 contours portent plus de 5 etablissements a l'hectare : Comitec (29.3 pour 2.8 ha), Esprit 1 (14.0 pour 16.7 ha), L'aéroport (5.1 pour 18.7 ha), Lahitolle (5.3 pour 19.6 ha). A cette densite, le contour mesure un batiment et non un parc.
- [zones] 2 contours mesurent moins de 3 hectares : Comitec (2.8 ha), Les landes (1.8 ha). Un parc amenage n'est pas si petit.
- [zones] Les contours mesurent 732 hectares quand la collectivite en annonce 1200, soit 39% d'ecart. Aucune surface n'est publiee depuis le 16/08/2026 : ni la BD TOPO ni OpenStreetMap ne dessinent un perimetre d'amenagement.
- [mutations] 8 ventes sortent a moins de 10 ou plus de 20 000 euros le metre carre. Elles sont conservees : la mediane y resiste, et retirer des lignes d'une source publiee sans regle ecrite serait un recalcul silencieux.
- [detention] 24322 des 36684 locaux du fichier relevent d'une personne morale de droit public ou d'un bailleur social. Ce fichier decrit tout le parc detenu par des personnes morales, pas un parc commercial.
