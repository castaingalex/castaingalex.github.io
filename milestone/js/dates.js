// Dates : format ISO tronqué selon la précision, formats français, et lecture
// d'une phrase libre (« mariage de Léa juin 2019 ») en titre + date.
// Aucune dépendance : tourne tel quel dans le navigateur et sous `node --test`.
//
// Une date est une chaîne 'AAAA', 'AAAA-MM' ou 'AAAA-MM-JJ' ; sa précision
// ('year' | 'month' | 'day') se lit dans sa longueur. Tous les calculs se font
// en UTC pour qu'un même moment tombe au même endroit quel que soit le fuseau.

export const MOIS_COURT = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
export const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const DAY = 24 * 3600 * 1000;
const ISO_RE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

export function isIso(s) {
  if (typeof s !== 'string' || !ISO_RE.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  if (m != null && (m < 1 || m > 12)) return false;
  if (d != null && (d < 1 || d > new Date(Date.UTC(y, m, 0)).getUTCDate())) return false;
  return true;
}

export function precisionOf(s) {
  const n = s.split('-').length;
  return n === 3 ? 'day' : n === 2 ? 'month' : 'year';
}

/** Construit une date tronquée. `m` est 0-11, `d` 1-31 ; omis = précision plus grosse. */
export function iso(y, m, d) {
  let s = String(y).padStart(4, '0');
  if (m != null) s += '-' + String(m + 1).padStart(2, '0');
  if (m != null && d != null) s += '-' + String(d).padStart(2, '0');
  return s;
}

/** Composants d'une date tronquée (mois 0-11) ; les parties absentes valent janvier / le 1er. */
export function parts(s) {
  const [y, m, d] = s.split('-').map(Number);
  return { y, m: (m || 1) - 1, d: d || 1 };
}

/** Horodatage UTC normalisé : 'AAAA' → 1er janvier, 'AAAA-MM' → 1er du mois. */
export function ts(s) {
  const { y, m, d } = parts(s);
  return Date.UTC(y, m, d);
}

function fromTs(t) {
  const x = new Date(t);
  return { y: x.getUTCFullYear(), m: x.getUTCMonth(), d: x.getUTCDate() };
}

/** Aujourd'hui en heure locale, au jour près. */
export function todayIso(now = new Date()) {
  return iso(now.getFullYear(), now.getMonth(), now.getDate());
}

export function truncate(s, precision) {
  const { y, m, d } = parts(s);
  if (precision === 'year') return iso(y);
  if (precision === 'month') return iso(y, m);
  return iso(y, m, d);
}

/** Avance ou recule d'un cran dans l'unité de la précision. */
export function step(s, precision, delta) {
  const { y, m, d } = parts(s);
  if (precision === 'year') return iso(y + delta);
  if (precision === 'month') {
    const t = fromTs(Date.UTC(y, m + delta, 1));
    return iso(t.y, t.m);
  }
  const t = fromTs(Date.UTC(y, m, d + delta));
  return iso(t.y, t.m, t.d);
}

/* ------------------------------------------------------------------ */
/* Formats                                                             */
/* ------------------------------------------------------------------ */

/** « 14 juin 2019 », « juin 2019 », « 2019 ». */
export function fmt(s, precision = precisionOf(s)) {
  const { y, m, d } = parts(s);
  if (precision === 'year') return String(y);
  if (precision === 'month') return `${MOIS[m]} ${y}`;
  return `${d === 1 ? '1er' : d} ${MOIS[m]} ${y}`;
}

/** « 14 juin 2019 », « juin 2019 », « 2019 » avec le mois abrégé : pour les lignes serrées. */
export function fmtShort(s, precision = precisionOf(s)) {
  const { y, m, d } = parts(s);
  if (precision === 'year') return String(y);
  if (precision === 'month') return `${MOIS_COURT[m]} ${y}`;
  return `${d === 1 ? '1er' : d} ${MOIS_COURT[m]} ${y}`;
}

/** « de juin 2009 à mars 2011 », « du 14 au 16 mai 2005 », « de 2018 à 2022 ». */
export function fmtSpan(s, sp, e, ep) {
  if (sp === 'day') return `du ${fmt(s, sp)} au ${fmt(e, ep)}`;
  const a = fmt(s, sp);
  return `${/^[aeiouyéèh]/i.test(a) ? 'd’' : 'de '}${a} à ${fmt(e, ep)}`;
}

/** Même chose sans l'année, quand l'année est déjà affichée au-dessus. */
export function fmtInYear(s, precision = precisionOf(s)) {
  const { m, d } = parts(s);
  if (precision === 'year') return 'dans l’année';
  if (precision === 'month') return MOIS[m];
  return `${d === 1 ? '1er' : d} ${MOIS[m]}`;
}

export function weekday(s) {
  return JOURS[new Date(ts(s)).getUTCDay()];
}

/** Années pleines écoulées entre deux dates jour. */
export function fullYears(fromIso, toIso) {
  const a = parts(fromIso);
  const b = parts(toIso);
  let n = b.y - a.y;
  if (b.m < a.m || (b.m === a.m && b.d < a.d)) n--;
  return n;
}

/** « il y a 3 ans », « il y a 5 mois », « cette année », « à venir ». */
export function ago(s, today) {
  const t = ts(s);
  const now = ts(today);
  if (t > now) return 'à venir';
  const years = fullYears(truncate(s, 'day'), today);
  if (years >= 1) return years === 1 ? 'il y a 1 an' : `il y a ${years} ans`;
  const { y, m } = parts(s);
  const n = parts(today);
  const months = (n.y - y) * 12 + (n.m - m);
  if (precisionOf(s) === 'year') return 'cette année';
  if (months >= 1) return `il y a ${months} mois`;
  if (precisionOf(s) === 'month') return 'ce mois-ci';
  const days = Math.round((now - t) / DAY);
  if (days === 0) return 'aujourd’hui';
  if (days === 1) return 'hier';
  return `il y a ${days} jours`;
}

/**
 * L'âge qu'on avait à cette date. Au jour ou au mois, c'est un âge exact
 * (« tu avais 27 ans ») ; à l'année seule, c'est l'âge atteint dans l'année
 * (« l'année de tes 18 ans »), le seul qu'on puisse affirmer.
 */
export function ageAt(birth, s, precision = precisionOf(s)) {
  if (!birth) return null;
  if (precision === 'year') return { age: parts(s).y - parts(birth).y, exact: false };
  const at = precision === 'month' ? iso(parts(s).y, parts(s).m, 15) : s;
  return { age: fullYears(birth, at), exact: true };
}

/* ------------------------------------------------------------------ */
/* Lecture d'une phrase libre                                          */
/* ------------------------------------------------------------------ */

// Repli sur l'ASCII caractère pour caractère : la chaîne repliée garde la même
// longueur que l'originale, donc les positions trouvées dans l'une valent pour
// l'autre (on découpe le titre dans le texte d'origine).
const FOLD = { à: 'a', â: 'a', ä: 'a', á: 'a', é: 'e', è: 'e', ê: 'e', ë: 'e', î: 'i', ï: 'i', í: 'i', ô: 'o', ö: 'o', ó: 'o', ù: 'u', û: 'u', ü: 'u', ú: 'u', ç: 'c', ÿ: 'y', œ: 'o', æ: 'a', '’': "'", 'ʼ': "'", '–': '-', '—': '-' };
function foldSameLength(s) {
  let out = '';
  for (const ch of s) {
    const low = ch.toLowerCase();
    const f = FOLD[low] ?? low;
    out += f.length === ch.length ? f : '?'.repeat(ch.length);
  }
  return out;
}

const MONTHS = { janvier: 0, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5, juillet: 6, aout: 7, septembre: 8, octobre: 9, novembre: 10, decembre: 11 };
// Abréviations : « sept », « oct »… ne valent mois qu'à côté d'un jour ou d'une année
// (sinon « les sept ans de Léa » deviendrait septembre).
const ABBR = { janv: 0, fev: 1, fevr: 1, avr: 3, juil: 6, sept: 8, oct: 9, nov: 10, dec: 11 };
const FULL_RE = Object.keys(MONTHS).join('|');
const ANY_MONTH_RE = [...Object.keys(MONTHS), ...Object.keys(ABBR)].sort((a, b) => b.length - a.length).join('|');
const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const NUMBERS = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, quinze: 15, vingt: 20, trente: 30 };
const SEASONS = { printemps: 3, ete: 6, automne: 9, hiver: 0 }; // avril, juillet, octobre, janvier

const monthIndex = (w) => MONTHS[w] ?? ABBR[w.replace('.', '')];
const dayNum = (w) => (w === '1er' ? 1 : Number(w));

function yearOf(w, today) {
  const n = Number(w);
  if (w.length === 4) return n;
  const cur = parts(today).y % 100;
  return n <= cur ? 2000 + n : 1900 + n;
}

/** La dernière occurrence passée (ou aujourd'hui) d'un mois / d'un jour sans année. */
function pastYear(m, d, today) {
  const t = parts(today);
  return m < t.m || (m === t.m && (d ?? 1) <= t.d) ? t.y : t.y - 1;
}

function validDay(y, m, d) {
  return m >= 0 && m <= 11 && d >= 1 && d <= new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
}

/**
 * Un fragment de date isolé, tel qu'il apparaît dans une période
 * (« mai », « 3 », « 10 juin 2019 », « 2018 », « 14/09/2021 »).
 * Les parties manquantes restent `undefined` : la période les complète.
 */
function readFragment(f) {
  let m;
  if ((m = f.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{2}|\d{4})$/))) return { d: +m[1], m: +m[2] - 1, yRaw: m[3] };
  if ((m = f.match(new RegExp(`^(?:(\\d{1,2}|1er)\\s+)?(${ANY_MONTH_RE})\\.?(?:\\s+(\\d{4}))?$`)))) {
    return { d: m[1] ? dayNum(m[1]) : undefined, m: monthIndex(m[2]), yRaw: m[3] };
  }
  if ((m = f.match(/^((?:19|20)\d{2})$/))) return { yRaw: m[1] };
  if ((m = f.match(/^(\d{1,2}|1er)$/))) return { d: dayNum(m[1]) };
  return null;
}

function fragmentToDate(fr, today) {
  const y = fr.yRaw ? yearOf(fr.yRaw, today) : undefined;
  if (y == null) return null;
  if (fr.m == null) return { date: iso(y), precision: 'year' };
  if (fr.d == null) return { date: iso(y, fr.m), precision: 'month' };
  if (!validDay(y, fr.m, fr.d)) return null;
  return { date: iso(y, fr.m, fr.d), precision: 'day' };
}

const FRAG = `\\d{1,2}[/.]\\d{1,2}[/.](?:\\d{4}|\\d{2})|(?:(?:\\d{1,2}|1er)\\s+)?(?:${ANY_MONTH_RE})\\.?(?:\\s+\\d{4})?|(?:19|20)\\d{2}|\\d{1,2}|1er`;

/*
 * Les règles, dans l'ordre de priorité. Chacune lit le texte replié et rend
 * { start, end?, keepText?, cut? } ou null. Par défaut l'expression trouvée sort
 * du titre ; `keepText` l'y laisse (« Mes 40 ans » est à la fois le titre et la
 * date), `cut` n'en retire qu'une partie, `null` pour ne rien retirer.
 */
const RULES = [
  // Période : « de 2018 à 2022 », « de mai à septembre 2018 », « du 3 au 10 juin 2019 »,
  // « entre 2010 et 2012 », « 2018-2022 ».
  {
    re: new RegExp(`(?:\\b(?:de|du|entre)\\s+)?(${FRAG})\\s*(?:-|\\ba\\b|\\bau\\b|\\bet\\b|\\bjusqu'(?:a|au|en)\\b)\\s*(${FRAG})(?![\\w/])`),
    read(m, ctx) {
      const a = readFragment(m[1]);
      const b = readFragment(m[2]);
      if (!a || !b) return null;
      // Un tiret entre deux nombres courts n'est pas une période (« 3-4 personnes »).
      if (!/\b(?:de|du|entre)\s/.test(m[0]) && !(a.yRaw?.length === 4 && b.yRaw?.length === 4)) return null;
      if (b.yRaw == null) return null;
      // Ce que le second fragment précise vaut pour le premier : « de mai à septembre 2018 ».
      if (a.yRaw == null) a.yRaw = b.yRaw;
      if (a.m == null && a.d != null) a.m = b.m;
      const s = fragmentToDate(a, ctx.today);
      const e = fragmentToDate(b, ctx.today);
      if (!s || !e) return null;
      return ts(s.date) <= ts(e.date) ? { start: s, end: e } : { start: e, end: s };
    },
  },
  // ISO : 2021-09-14
  {
    re: /\b(\d{4})-(\d{2})-(\d{2})\b/,
    read: (m) => (validDay(+m[1], +m[2] - 1, +m[3]) ? { start: { date: iso(+m[1], +m[2] - 1, +m[3]), precision: 'day' } } : null),
  },
  // Numérique : 14/09/2021, 14.09.21, « le 14/07 ». Sans année, il faut le « le »
  // (sinon « 1/2 heure » ou « 3.5 km » deviendraient des dates).
  {
    re: /\b(le\s+)?(\d{1,2})([/.])(\d{1,2})(?:[/.](\d{4}|\d{2}))?(?![\d/.])/,
    read(m, ctx) {
      const [, le, dd, sep, mm, yy] = m;
      if (!yy && (!le || sep === '.')) return null;
      const d = +dd;
      const mo = +mm - 1;
      const y = yy ? yearOf(yy, ctx.today) : pastYear(mo, d, ctx.today);
      return validDay(y, mo, d) ? { start: { date: iso(y, mo, d), precision: 'day' } } : null;
    },
  },
  // Jour + mois [+ année] : « le 3 juin 2019 », « samedi 14 juillet », « 1er mai »
  {
    re: new RegExp(`\\b(?:le\\s+)?(?:(?:${WEEKDAYS.join('|')})\\s+)?(\\d{1,2}|1er)\\s+(${ANY_MONTH_RE})\\.?(?:\\s+(\\d{4}))?\\b`),
    read(m, ctx) {
      const d = dayNum(m[1]);
      const mo = monthIndex(m[2]);
      const y = m[3] ? +m[3] : pastYear(mo, d, ctx.today);
      return validDay(y, mo, d) ? { start: { date: iso(y, mo, d), precision: 'day' } } : null;
    },
  },
  // Fêtes : « Noël 2015 », « réveillon 1999 », « jour de l'an 2000 »
  {
    re: /\b(?:a\s+|pour\s+)?(noel|le reveillon|reveillon|nouvel an|jour de l'an)(?:\s+(\d{4}))?\b/,
    read(m, ctx) {
      const [mo, d] = m[1] === 'noel' ? [11, 25] : m[1].includes('reveillon') ? [11, 31] : [0, 1];
      const y = m[2] ? +m[2] : pastYear(mo, d, ctx.today);
      // La fête reste dans le titre (« Noël chez mamie ») ; seule l'année en sort.
      const cut = m[2] ? [m.index + m[0].lastIndexOf(m[2]), m.index + m[0].length] : null;
      return { start: { date: iso(y, mo, d), precision: 'day' }, cut };
    },
  },
  // Mois [+ année] : « juin 2019 », « en avril », « début septembre 2001 »
  {
    re: new RegExp(`\\b(?:(?:en|au mois de|courant|debut|fin|mi-)\\s*)?(?:(${FULL_RE})|(${Object.keys(ABBR).join('|')})\\.?(?=\\s+\\d{4}))(?:\\s+(\\d{4}))?\\b`),
    read(m, ctx) {
      const mo = monthIndex(m[1] ?? m[2]);
      const y = m[3] ? +m[3] : pastYear(mo, 1, ctx.today);
      return { start: { date: iso(y, mo), precision: 'month' } };
    },
  },
  // Saisons : « l'été 2003 », « à l'automne 2010 », « cet hiver ». Il faut un article
  // ou une année : « j'ai été promu » n'est pas un été.
  {
    re: /(?:\b((?:a\s+|en\s+|cet\s+|au\s+)?l'|\ben\s+|\bcet\s+|\bau\s+)|\b)(printemps|ete|automne|hiver)(?:\s+(?:de\s+)?(\d{4}))?\b/,
    read(m, ctx) {
      if (!m[1] && !m[0].match(/^(en|cet|au)\s/) && !m[3]) return null;
      const mo = SEASONS[m[2]];
      const y = m[3] ? +m[3] : pastYear(mo, 1, ctx.today);
      return { start: { date: iso(y, mo), precision: 'month' } };
    },
  },
  // Relatif au jour : aujourd'hui, ce soir, hier, avant-hier, lundi dernier, la semaine dernière
  {
    re: /\b(aujourd'hui|ce matin|ce midi|cet apres-midi|ce soir|cette nuit|avant-hier|avant hier|hier|la semaine (?:derniere|passee)|(?:(?:ce|le)\s+)?(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)(?:\s+dernier)?)(?:\s+(?:soir|matin|midi|apres-midi))?\b/,
    read(m, ctx) {
      const w = m[1];
      const t = parts(ctx.today);
      let back = 0;
      if (w.startsWith('avant')) back = 2;
      else if (w === 'hier') back = 1;
      else if (w.startsWith('la semaine')) back = 7;
      else {
        const wd = WEEKDAYS.findIndex((x) => w.includes(x));
        if (wd >= 0) back = (new Date(Date.UTC(t.y, t.m, t.d)).getUTCDay() - wd + 7) % 7;
      }
      const d = fromTs(Date.UTC(t.y, t.m, t.d - back));
      return { start: { date: iso(d.y, d.m, d.d), precision: 'day' } };
    },
  },
  // Relatif au mois / à l'année : le mois dernier, l'an dernier, cette année
  {
    re: /\b(le mois (?:dernier|passe)|ce mois-ci|l'annee (?:derniere|passee)|l'an (?:dernier|passe)|cette annee)\b/,
    read(m, ctx) {
      const t = parts(ctx.today);
      if (m[1].startsWith('le mois')) {
        const p = fromTs(Date.UTC(t.y, t.m - 1, 1));
        return { start: { date: iso(p.y, p.m), precision: 'month' } };
      }
      if (m[1] === 'ce mois-ci') return { start: { date: iso(t.y, t.m), precision: 'month' } };
      return { start: { date: iso(m[1] === 'cette annee' ? t.y : t.y - 1), precision: 'year' } };
    },
  },
  // « il y a 3 ans », « il y a deux mois », « il y a 10 jours »
  {
    re: new RegExp(`\\bil y a\\s+(\\d{1,3}|${Object.keys(NUMBERS).join('|')})\\s+(ans?|annees?|mois|semaines?|jours?)\\b`),
    read(m, ctx) {
      const n = NUMBERS[m[1]] ?? +m[1];
      const t = parts(ctx.today);
      if (m[2].startsWith('an')) return { start: { date: iso(t.y - n), precision: 'year' } };
      if (m[2] === 'mois') {
        const p = fromTs(Date.UTC(t.y, t.m - n, 1));
        return { start: { date: iso(p.y, p.m), precision: 'month' } };
      }
      const p = fromTs(Date.UTC(t.y, t.m, t.d - n * (m[2].startsWith('semaine') ? 7 : 1)));
      return { start: { date: iso(p.y, p.m, p.d), precision: 'day' } };
    },
  },
  // « mes 40 ans » : la date d'anniversaire, et l'expression reste le titre
  {
    re: /\b(?:pour\s+)?mes\s+(\d{1,3})\s+ans\b/,
    read(m, ctx) {
      if (!ctx.birth) return null;
      const b = parts(ctx.birth);
      const y = b.y + +m[1];
      const d = validDay(y, b.m, b.d) ? b.d : 28;
      return { start: { date: iso(y, b.m, d), precision: 'day' }, keepText: true };
    },
  },
  // « à 18 ans », « vers 15 ans » : l'année où l'on a eu cet âge, au milieu de l'âge
  {
    re: /\b(?:a|vers|quand j'avais|j'avais)\s+(\d{1,3})\s+ans\b/,
    read(m, ctx) {
      if (!ctx.birth) return null;
      const mid = ts(ctx.birth) + (+m[1] + 0.5) * 365.25 * DAY;
      return { start: { date: iso(fromTs(mid).y), precision: 'year' } };
    },
  },
  // Année seule : « premier appart 2001 », « en 2019 », « vers 1995 »
  {
    re: /\b(?:(?:en|vers|depuis|annee|debut|fin|courant)\s+)?((?:19|20)\d{2})\b(?!\s*(?:km|kg|m|euros?|personnes|metres)\b)(?!\s*€)/,
    read: (m) => ({ start: { date: m[1], precision: 'year' } }),
  },
];

// Mots de liaison qui restent orphelins en fin de titre une fois la date retirée.
const TRAILING = /(?:[\s,;:.\-–—]+|\s+(?:le|la|les|l'|en|du|de|des|d'|a|à|au|aux|vers|depuis|pendant|et|ce|cette|cet))+$/i;

function cleanTitle(s) {
  let t = s.replace(/\s+/g, ' ').trim();
  let prev;
  do {
    prev = t;
    t = t.replace(TRAILING, '').replace(/^[\s,;:.\-–—]+/, '').trim();
  } while (t !== prev);
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
}

/**
 * Lit une phrase libre. Rend null si le texte est vide, sinon
 * { title, startDate, startPrecision, endDate, endPrecision, guessed }
 * où `guessed` vaut true quand aucune date n'a été trouvée (aujourd'hui par défaut).
 *
 * `ctx.today` est la date du jour ('AAAA-MM-JJ') ; `ctx.birth`, si connue, permet
 * « à 18 ans » et « mes 40 ans ». Sans année, un mois ou un jour désigne sa
 * dernière occurrence passée : on raconte surtout ce qui a eu lieu.
 */
export function parseMoment(text, ctx) {
  const raw = (text ?? '').normalize('NFC').trim();
  if (!raw) return null;
  const folded = foldSameLength(raw);
  for (const rule of RULES) {
    const m = folded.match(rule.re);
    if (!m) continue;
    const r = rule.read(m, ctx);
    if (!r) continue;
    const [from, to] = r.keepText ? [0, 0] : (r.cut === undefined ? [m.index, m.index + m[0].length] : r.cut ?? [0, 0]);
    const title = cleanTitle(raw.slice(0, from) + ' ' + raw.slice(to));
    return {
      title,
      startDate: r.start.date,
      startPrecision: r.start.precision,
      endDate: r.end?.date ?? null,
      endPrecision: r.end?.precision ?? null,
      guessed: false,
    };
  }
  return { title: cleanTitle(raw), startDate: ctx.today, startPrecision: 'day', endDate: null, endPrecision: null, guessed: true };
}
