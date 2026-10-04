// Socle commun aux trois maquettes : la vie d'exemple habillée (émoji, couleur
// de décennie), un ressort, le tic tactile, la lecture de phrase de la vraie app.

import { parseMoment, fmt, fmtInYear, parts, ts, ageAt, ago, weekday } from '../js/dates.js';
import { DEMO_BIRTH, demoEvents } from '../js/demo.js';
import { LANDMARKS } from '../js/landmarks.js';
import { visibleLandmarks, neighbors, echoOf, fold } from '../js/frise.js';

export { parseMoment, fmt, fmtInYear, parts, ts, ageAt, ago, weekday, LANDMARKS, neighbors, echoOf, fold };

export const TODAY = '2026-10-04';
export const BIRTH = DEMO_BIRTH;

/* ------------------------------------------------------------------ */
/* Le temps qui colore la vie : une couleur franche par décennie        */
/* ------------------------------------------------------------------ */

const DECADES = {
  1950: { c: '#00B5D8', ink: '#141414', name: 'cyan' },
  1960: { c: '#16C47F', ink: '#141414', name: 'vert' },
  1970: { c: '#7C4DFF', ink: '#FFFFFF', name: 'violet' },
  1980: { c: '#FF3B8B', ink: '#141414', name: 'rose' },
  1990: { c: '#FF7A1A', ink: '#141414', name: 'orange' },
  2000: { c: '#FFC21A', ink: '#141414', name: 'jaune' },
  2010: { c: '#16C47F', ink: '#141414', name: 'vert' },
  2020: { c: '#3366FF', ink: '#FFFFFF', name: 'bleu' },
  2030: { c: '#7C4DFF', ink: '#FFFFFF', name: 'violet' },
};
export const decade = (year) => DECADES[Math.floor(year / 10) * 10] ?? DECADES[2020];
export const SOBER = { c: '#8E8A85', ink: '#FFFFFF', name: 'gris' };

/** Mélange deux couleurs hexadécimales, t entre 0 et 1. */
export function mix(a, b, t) {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

/* ------------------------------------------------------------------ */
/* Une identité par moment : un émoji lu dans la phrase                 */
/* ------------------------------------------------------------------ */

// Ce qui appelle la sobriété : pas d'émoji, pas de fête, pas de rebond.
const SENSITIVE = /\b(deces|deuil|mort|morte|enterrement|obseques|funerailles|disparu|disparue|disparition|fausse couche|cancer|maladie|hopital|accident|divorce|separation|rupture|licenciement|avc|infarctus|chimio)\b/;

// Mot lu dans la phrase → émoji. L'ordre compte : le plus précis d'abord.
const EMOJI = [
  [/\b(mariage|marie|mariee|fiancailles|pacs)\b/, '💍'],
  [/\b(bac|diplome|master|licence|these|doctorat|bts|dut)\b/, '🎓'],
  [/\b(etudes|fac|universite|prepa)\b/, '📚'],
  [/\b(ecole|rentree|college|lycee)\b/, '🎒'],
  [/\b(permis)\b/, '🚗'],
  [/\b(velo|roulettes)\b/, '🚲'],
  [/\b(cremaillere)\b/, '🥂'],
  [/\b(premier appart|appart|appartement)\b/, '🔑'],
  [/\b(maison)\b/, '🏡'],
  [/\b(demenagement|emmenagement|retour a)\b/, '📦'],
  [/\b(japon|tokyo|kyoto)\b/, '🇯🇵'],
  [/\b(espagne|barcelone|madrid|seville)\b/, '🇪🇸'],
  [/\b(italie|rome|amalfi|amalfitaine|venise|florence|naples)\b/, '🇮🇹'],
  [/\b(grece|santorin|athenes|crete)\b/, '🇬🇷'],
  [/\b(portugal|lisbonne|porto)\b/, '🇵🇹'],
  [/\b(ecosse|edimbourg)\b/, '🏴󠁧󠁢󠁳󠁣󠁴󠁿'],
  [/\b(londres|angleterre)\b/, '🇬🇧'],
  [/\b(berlin|allemagne|munich)\b/, '🇩🇪'],
  [/\b(amsterdam|pays-bas)\b/, '🇳🇱'],
  [/\b(perou|machu)\b/, '🇵🇪'],
  [/\b(new york|etats-unis|usa|californie)\b/, '🇺🇸'],
  [/\b(canada|quebec|montreal)\b/, '🇨🇦'],
  [/\b(maroc|marrakech)\b/, '🇲🇦'],
  [/\b(islande)\b/, '🇮🇸'],
  [/\b(eurockeennes|festival)\b/, '🎪'],
  [/\b(concert|batteur|guitare)\b/, '🥁'],
  [/\b(karaoke)\b/, '🎤'],
  [/\b(nouvel an|reveillon)\b/, '🎆'],
  [/\b(noel)\b/, '🎄'],
  [/\b(\d+ ans|anniversaire)\b/, '🎂'],
  [/\b(marathon|course|semi)\b/, '🏃'],
  [/\b(surf)\b/, '🏄'],
  [/\b(parachute)\b/, '🪂'],
  [/\b(foot|match|coupe du monde)\b/, '⚽'],
  [/\b(rando|randonnee|trek)\b/, '🥾'],
  [/\b(ski)\b/, '⛷️'],
  [/\b(cabane|chalet|vosges)\b/, '🛖'],
  [/\b(thalasso|spa)\b/, '🧖'],
  [/\b(ile de re|plage|vacances)\b/, '🏖️'],
  [/\b(road ?trip)\b/, '🚐'],
  [/\b(rencontre|coup de foudre)\b/, '💘'],
  [/\b(naissance)\b/, '👶'],
  [/\b(chien|chiot)\b/, '🐶'],
  [/\b(chat|chaton)\b/, '🐱'],
  [/\b(boulot|job|poste|embauche|cdi|travail)\b/, '💼'],
  [/\b(paris)\b/, '🗼'],
  [/\b(nantes|lyon|bordeaux)\b/, '🏙️'],
  [/\b(voyage|vol|avion)\b/, '✈️'],
  [/\b(week-end|weekend)\b/, '🧳'],
];

export const isSensitive = (title) => SENSITIVE.test(fold(title));

/** L'émoji proposé pour une phrase, ou null : sobre par défaut, jamais deviné au hasard. */
export function suggestEmoji(title) {
  const t = fold(title);
  if (!t || SENSITIVE.test(t)) return null;
  return EMOJI.find(([re]) => re.test(t))?.[1] ?? null;
}

/** Quelques autres émojis à proposer d'un toucher, sans en faire une taxonomie. */
export const EMOJI_CHOICES = ['✨', '❤️', '🎉', '✈️', '🏡', '🎓', '💼', '🎵', '⚽', '🌊', '⛰️', '🍷', '📸', '🌱'];

/* ------------------------------------------------------------------ */
/* La vie d'exemple habillée                                           */
/* ------------------------------------------------------------------ */

export function demoLife() {
  return demoEvents(TODAY)
    .filter((e) => e.status !== 'proposed')
    .map((e, i) => decorate({ ...e, id: `m${i}`, startPrecision: precision(e.startDate), endPrecision: e.endDate ? precision(e.endDate) : null, highlighted: !!e.highlighted }))
    .sort((a, b) => ts(b.startDate) - ts(a.startDate));
}

export function decorate(e) {
  const sober = isSensitive(e.title);
  const y = parts(e.startDate).y;
  return { ...e, emoji: e.emoji !== undefined ? e.emoji : suggestEmoji(e.title), sober, color: sober ? SOBER : decade(y), year: y };
}

const precision = (s) => (s.length === 4 ? 'year' : s.length === 7 ? 'month' : 'day');

export const landmarks = () => visibleLandmarks(LANDMARKS, ['actu'], BIRTH, TODAY);

export function ageLabel(age) {
  if (age == null) return '';
  if (age === 0) return 'naissance';
  return age === 1 ? '1 an' : `${age} ans`;
}

export function ageText(date, precision) {
  const a = ageAt(BIRTH, date, precision);
  if (!a || a.age < 0) return '';
  if (!a.exact) return a.age === 0 ? 'ton année de naissance' : `l’année de tes ${ageLabel(a.age)}`;
  return a.age === 0 ? 'tu venais de naître' : `tu avais ${ageLabel(a.age)}`;
}

export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** La date d'un moment, pour l'œil : « juin 2019 », « 14 juin 2019 », « 2019 ». */
export const when = (e) => fmt(e.startDate, e.startPrecision);

/** Initiale d'un titre, pour les moments sans émoji. */
export const initial = (title) => (title.match(/[A-Za-zÀ-ÿ0-9]/)?.[0] ?? '·').toUpperCase();

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/* ------------------------------------------------------------------ */
/* Ressort et mouvement                                                 */
/* ------------------------------------------------------------------ */

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Un ressort sur un objet de nombres : `s.to({ x: 10, scale: 1 })` y amène
 * chaque valeur avec son élan. `onFrame(values)` est appelé à chaque image.
 * Raideur et amortissement à la manière d'iOS (k, c pour une masse de 1).
 */
export function springs(initial, onFrame, { k = 260, c = 24 } = {}) {
  const val = { ...initial };
  const vel = Object.fromEntries(Object.keys(initial).map((key) => [key, 0]));
  let target = { ...initial };
  let raf = 0;
  let last = 0;
  let params = { k, c };
  let done = null;
  const step = (now) => {
    const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
    last = now;
    let moving = false;
    for (const key of Object.keys(target)) {
      // Sous-pas fixes : stable même quand le téléphone saute une image.
      for (let i = 0; i < 4; i++) {
        const h = dt / 4;
        const a = -params.k * (val[key] - target[key]) - params.c * vel[key];
        vel[key] += a * h;
        val[key] += vel[key] * h;
      }
      if (Math.abs(vel[key]) > 0.01 || Math.abs(val[key] - target[key]) > 0.005) moving = true;
      else {
        val[key] = target[key];
        vel[key] = 0;
      }
    }
    onFrame(val);
    if (moving) raf = requestAnimationFrame(step);
    else {
      raf = 0;
      const cb = done;
      done = null;
      cb?.();
    }
  };
  const api = {
    val,
    vel,
    to(next, opts = {}) {
      Object.assign(target, next);
      if (opts.k || opts.c) params = { k: opts.k ?? k, c: opts.c ?? c };
      else params = { k, c };
      if (opts.v) Object.assign(vel, opts.v);
      done = opts.done ?? null;
      if (reduced()) {
        Object.assign(val, target);
        onFrame(val);
        const cb = done;
        done = null;
        cb?.();
        return api;
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
      return api;
    },
    set(next) {
      Object.assign(val, next);
      Object.assign(target, next);
      for (const key of Object.keys(next)) vel[key] = 0;
      onFrame(val);
      return api;
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
  onFrame(val);
  return api;
}

/** Le clavier de l'iPhone recouvre le bas de l'écran : --kb dit de combien remonter. */
export function followKeyboard() {
  const vv = window.visualViewport;
  if (!vv) return;
  const fit = () => document.documentElement.style.setProperty('--kb', `${Math.max(0, innerHeight - vv.height - vv.offsetTop)}px`);
  vv.addEventListener('resize', fit);
  vv.addEventListener('scroll', fit);
}
if (typeof window !== 'undefined') followKeyboard();

/** Attendre, pour enchaîner les temps d'une animation. */
export const wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));

/*
 * Retour tactile. iPhone (iOS 18 et plus) : basculer un interrupteur natif caché
 * déclenche le tic du système, pendant un geste. Android : l'API de vibration.
 */
let hapticLabel = null;
export function tick(strong = false) {
  if (navigator.vibrate) {
    navigator.vibrate(strong ? 18 : 8);
    return;
  }
  if (!hapticLabel) {
    hapticLabel = document.createElement('label');
    hapticLabel.setAttribute('aria-hidden', 'true');
    hapticLabel.style.cssText = 'position:fixed;left:-99px;width:1px;height:1px;overflow:hidden;opacity:0';
    hapticLabel.innerHTML = '<input type="checkbox" switch tabindex="-1">';
    document.body.append(hapticLabel);
  }
  // Le clic sur l'interrupteur vole le focus : on le rend aussitôt (sinon le clavier se ferme).
  const keep = document.activeElement;
  hapticLabel.click();
  keep?.focus?.({ preventScroll: true });
  if (strong) setTimeout(() => hapticLabel.click(), 70);
}

/** Petite gerbe de particules (formes, pas d'émoji) partant d'un point. */
export function burst(x, y, color, { n = 14, spread = 90, parent = document.body } = {}) {
  if (reduced()) return;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    const size = 6 + Math.random() * 8;
    const round = Math.random() > 0.5;
    p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;margin:${-size / 2}px;background:${color};border-radius:${round ? '50%' : '2px'};pointer-events:none;z-index:99;will-change:transform,opacity`;
    parent.append(p);
    const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const dist = spread * (0.6 + Math.random() * 0.6);
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist;
    p.animate(
      [
        { transform: 'translate(0,0) scale(.4) rotate(0)', opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx * 1.1}px,${dy * 1.1 + 40}px) scale(.6) rotate(${Math.random() * 540}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.3,1)' },
    ).onfinish = () => p.remove();
  }
}

/** Suit la vitesse d'un doigt (px/s) sur les 100 dernières millisecondes. */
export function velocityTracker() {
  let pts = [];
  return {
    add(x, y) {
      const t = performance.now();
      pts.push({ x, y, t });
      pts = pts.filter((p) => t - p.t < 100);
    },
    get() {
      if (pts.length < 2) return { x: 0, y: 0 };
      const a = pts[0];
      const b = pts.at(-1);
      const dt = Math.max(1, b.t - a.t) / 1000;
      return { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt };
    },
    reset() {
      pts = [];
    },
  };
}
