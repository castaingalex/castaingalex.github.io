// La frise vue comme une suite d'années : ce qu'on y range, ce qu'on y lit.
// Logique pure, sans DOM : testée sous `node --test`.

import { ts, parts, precisionOf } from './dates.js';

const DAY = 24 * 3600 * 1000;
const PACK_ORDER = ['main', 'actu', 'sport', 'tech', 'culture'];

/** Minuscules sans accents, pour chercher « noel » et trouver « Noël ». */
export function fold(s) {
  return (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function matches(event, query) {
  const q = fold(query.trim());
  if (!q) return true;
  return [event.title, event.place, event.note].some((f) => fold(f).includes(q));
}

/** Les repères à montrer : packs actifs (`main` toujours), entre la naissance et aujourd'hui. */
export function visibleLandmarks(landmarks, packs, birth, today) {
  const from = birth ? ts(birth) : -Infinity;
  const to = ts(today);
  return landmarks.filter((l) => (l.pack === 'main' || packs.includes(l.pack)) && ts(l.date) >= from && ts(l.date) <= to);
}

const byRecent = (a, b) => ts(b.startDate) - ts(a.startDate) || (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
const byImportance = (a, b) => PACK_ORDER.indexOf(a.pack) - PACK_ORDER.indexOf(b.pack) || ts(a.date) - ts(b.date);

/**
 * Les années de la frise, de la plus récente à la naissance. Une année vide
 * reste présente (elle est fine à l'écran) : c'est ce contraste entre années
 * pleines et années minces qui donne la forme d'une vie.
 */
export function buildYears({ events, birth, today, landmarks }) {
  const ty = parts(today).y;
  const starts = events.map((e) => parts(e.startDate).y);
  const top = Math.max(ty, ...starts);
  const bottom = Math.min(birth ? parts(birth).y : ty, ...starts);
  const byYear = new Map();
  for (const e of events) {
    const y = parts(e.startDate).y;
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(e);
  }
  const lmByYear = new Map();
  for (const l of landmarks) {
    const y = parts(l.date).y;
    if (!lmByYear.has(y)) lmByYear.set(y, []);
    lmByYear.get(y).push(l);
  }
  const by = birth ? parts(birth).y : null;
  const years = [];
  for (let y = top; y >= bottom; y--) {
    years.push({
      year: y,
      age: by != null && y >= by ? y - by : null,
      events: (byYear.get(y) ?? []).sort(byRecent),
      landmarks: (lmByYear.get(y) ?? []).sort(byImportance),
      isBirthYear: y === by,
      isCurrent: y === ty,
    });
  }
  return years;
}

/** Proximité entre deux dates, à la granularité la plus fine que leurs précisions permettent. */
export function closeness(a, pa, b, pb) {
  const A = parts(a);
  const B = parts(b);
  if (A.y !== B.y) return null;
  if (pa === 'year' || pb === 'year') return 'year';
  if (pa === 'day' && pb === 'day') {
    const d = Math.abs(ts(a) - ts(b)) / DAY;
    if (d === 0) return 'day';
    if (d <= 6) return 'week';
  }
  return A.m === B.m ? 'month' : 'year';
}

export const CLOSENESS_LABEL = { day: 'Le même jour', week: 'La même semaine', month: 'Le même mois', year: 'La même année' };
const RANK = { day: 0, week: 1, month: 2, year: 3 };

/**
 * Ce qui entoure un moment dans le temps : tes autres moments et les repères
 * de la même année, groupés du plus serré au plus lâche. Une coïncidence
 * serrée avec l'Histoire (même jour, même semaine) est la « découverte ».
 */
export function neighbors(target, events, landmarks) {
  const tp = target.startPrecision;
  const items = [];
  for (const e of events) {
    if (e.id === target.id) continue;
    const c = closeness(target.startDate, tp, e.startDate, e.startPrecision);
    if (c) items.push({ kind: 'event', closeness: c, title: e.title, date: e.startDate, precision: e.startPrecision, event: e });
  }
  for (const l of landmarks) {
    const c = closeness(target.startDate, tp, l.date, precisionOf(l.date));
    if (c) items.push({ kind: 'landmark', closeness: c, title: l.title, date: l.date, precision: precisionOf(l.date), landmark: l });
  }
  const dist = (x) => Math.abs(ts(x.date) - ts(target.startDate));
  items.sort((a, b) => RANK[a.closeness] - RANK[b.closeness] || dist(a) - dist(b));
  const groups = [];
  for (const it of items) {
    let g = groups.find((x) => x.closeness === it.closeness);
    if (!g) groups.push((g = { closeness: it.closeness, label: CLOSENESS_LABEL[it.closeness], items: [] }));
    g.items.push(it);
  }
  const discovery = items.find((x) => x.kind === 'landmark' && (x.closeness === 'day' || x.closeness === 'week')) ?? null;
  return { groups, discovery };
}

/** La coïncidence la plus serrée entre la naissance et l'Histoire (tous packs confondus). */
export function birthFact(birth, landmarks) {
  if (!birth) return null;
  let best = null;
  for (const l of landmarks) {
    const c = closeness(birth, 'day', l.date, precisionOf(l.date));
    if (!c) continue;
    const d = Math.abs(ts(l.date) - ts(birth));
    if (!best || RANK[c] < RANK[best.closeness] || (c === best.closeness && d < best.d)) best = { landmark: l, closeness: c, d };
  }
  return best && { landmark: best.landmark, closeness: best.closeness };
}

/** Des repères proches d'une date floue, pour la caler (« c'était l'époque de… »). */
export function anchorsAround(date, landmarks, birth, n = 4) {
  const t = ts(date);
  const from = birth ? ts(birth) : -Infinity;
  return landmarks
    .filter((l) => ts(l.date) >= from && Math.abs(ts(l.date) - t) <= 2.5 * 365.25 * DAY)
    .map((l) => ({ l, d: Math.abs(ts(l.date) - t) + PACK_ORDER.indexOf(l.pack) * 20 * DAY }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((x) => x.l);
}

/**
 * L'écho du jour : un de tes moments qui a son anniversaire aujourd'hui
 * (au jour près, ou dans le mois pour un moment daté au mois). Les dizaines
 * et les demi-dizaines passent devant.
 */
export function echoOf(events, today) {
  const t = parts(today);
  const found = [];
  for (const e of events) {
    if (e.status !== 'confirmed') continue;
    const p = parts(e.startDate);
    const years = t.y - p.y;
    if (years < 1) continue;
    if (e.startPrecision === 'day' && p.m === t.m && p.d === t.d) found.push({ event: e, years, exact: true });
    else if (e.startPrecision === 'month' && p.m === t.m) found.push({ event: e, years, exact: false });
  }
  const round = (y) => (y % 10 === 0 ? 2 : y % 5 === 0 ? 1 : 0);
  found.sort((a, b) => Number(b.exact) - Number(a.exact) || Number(b.event.highlighted) - Number(a.event.highlighted) || round(b.years) - round(a.years) || b.years - a.years);
  return found[0] ?? null;
}
