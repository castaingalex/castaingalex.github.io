// La vie d'exemple : de quoi parcourir la frise avant d'y mettre la sienne.
// Une personne fictive née le 27 août 1980. Aucune référence à un enfant de
// l'utilisateur : Jules est un neveu, Alice, Gabriel et Martin sont les enfants
// de potes. Les deuils y ont leur place, ce sont des moments de vie.

import { parts, iso } from './dates.js';

export const DEMO_BIRTH = '1980-08-27';

export const DEMO_EVENTS = [
  { title: 'Vélo sans les roulettes', startDate: '1986-08-11', note: '6 ans. Trois mètres, puis la gloire.' },
  { title: 'Déménagement à Nantes', startDate: '1991-09', place: 'Nantes' },
  { title: 'Bac en poche', startDate: '1998-07-03' },
  { title: 'Études à Lyon', startDate: '1998-09', endDate: '2001-06', place: 'Lyon' },
  { title: 'Permis de conduire', startDate: '1999-02-19' },
  { title: 'Premier appart à Lyon', startDate: '2001-09', place: 'Lyon' },
  { title: 'Road trip en Espagne', startDate: '2003-07', place: 'Espagne', note: 'Trois potes, une vieille Twingo, zéro clim.' },
  { title: 'Studio Nord', startDate: '2004-02', endDate: '2011-11' },
  { title: 'Déménagement à Bordeaux', startDate: '2005-01-15', place: 'Bordeaux' },
  { title: 'Week-end à Rome', startDate: '2005-05-14', place: 'Rome', note: 'En amoureux.' },
  { title: 'Rencontre avec Camille', startDate: '2006-09-21', note: 'Sous la pluie, un soir de septembre.', highlighted: true },
  { title: 'Décès de mon grand-père', startDate: '2007-03-14', note: 'Le dernier à m’appeler « fiston ».' },
  { title: 'Rando solo dans les Cévennes', startDate: '2008-06', place: 'Cévennes', note: 'Cinq jours sans réseau. Le luxe.' },
  { title: 'Week-end à Amsterdam', startDate: '2009-03-20', place: 'Amsterdam', note: 'Entre potes.' },
  { title: 'Voyage au Japon', startDate: '2010-04', place: 'Japon', note: 'En amoureux.' },
  { title: 'Week-end entre potes à Berlin', startDate: '2011-10-08', place: 'Berlin' },
  { title: 'Emménagement à Paris', startDate: '2012-07', place: 'Paris' },
  { title: 'Cabane dans les Vosges', startDate: '2013-02-09', place: 'Vosges', note: 'En amoureux.' },
  { title: 'Trek au Pérou', startDate: '2014-08', place: 'Pérou', note: 'Le Machu Picchu au lever du jour.' },
  { title: 'Mariage de Léa', startDate: '2015-06-15' },
  { title: 'Nouvel An chez Thomas', startDate: '2015-12-31', note: 'Raclette, feux d’artifice, résolutions oubliées.' },
  { title: 'Emménagement rue des Martyrs', startDate: '2016-02', place: 'Paris' },
  { title: 'Thalasso en solo', startDate: '2016-11-19' },
  { title: 'Naissance de Jules, mon neveu', startDate: '2017-04-03', note: 'Tonton, officiellement.' },
  { title: 'Roadtrip en Écosse', startDate: '2017-08', place: 'Écosse', note: 'En amoureux.' },
  { title: 'Vacances en Grèce', startDate: '2018-07', place: 'Santorin', note: 'Santorin, un carnet, rien d’autre.', highlighted: true },
  { title: 'Décès de ma grand-mère', startDate: '2018-11-02' },
  { title: 'Mes 40 ans', startDate: '2020-08-29', note: 'Tous les potes réunis. Un karaoké mémorable.', highlighted: true },
  { title: 'Retour à Nantes', startDate: '2021-09', place: 'Nantes' },
  { title: 'Week-end chez Juliette à l’île de Ré', startDate: '2022-06-11', place: 'Île de Ré', note: 'Vélo, huîtres, rien à faire.' },
  { title: 'Week-end surf entre potes', startDate: '2022-09-10', note: 'Beaucoup de vagues ratées, zéro regret.' },
  { title: 'Les 15 ans d’Alice', startDate: '2022-09-30', note: 'La fille de Marion. Hier elle avait 3 ans.' },
  { title: 'Côte amalfitaine', startDate: '2023-06', place: 'Italie', note: 'En amoureux.' },
  { title: 'Marathon de Paris', startDate: '2024-04-07', place: 'Paris', note: '3 h 58. Les jambes s’en souviennent encore.' },
  { title: 'Le premier concert de Gabriel', startDate: '2024-11-10', note: 'Batteur à 16 ans, déjà le rythme.' },
  { title: 'Les 18 ans de Martin', startDate: '2025-05-18', note: 'Le fils de Théo, déjà majeur.' },
  // Deux potes ont glissé un moment dans la frise : en attente de réponse.
  { title: 'Festival aux Eurockéennes', startDate: '2017-07-08', status: 'proposed', proposerName: 'Théo' },
  { title: 'Week-end à Lisbonne', startDate: '2013-10-11', place: 'Lisbonne', status: 'proposed', proposerName: 'Tom' },
];

/** La vie d'exemple, plus un souvenir tombé il y a dix ans jour pour jour : l'écho se voit dès l'ouverture. */
export function demoEvents(today) {
  const t = parts(today);
  const echo = { title: 'Crémaillère dans le premier appart à deux', startDate: iso(t.y - 10, t.m, Math.min(t.d, 28)), note: 'Quarante personnes dans 38 m².' };
  return [...DEMO_EVENTS, echo];
}
