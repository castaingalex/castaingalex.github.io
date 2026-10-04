// Où vivent les données : dans le navigateur du téléphone (localStorage), et
// nulle part ailleurs. D'où la sauvegarde en fichier, seul filet de sécurité.

import { isIso, precisionOf } from './dates.js';
import { PACKS } from './landmarks.js';

const KEY = 'milestone';
export const VERSION = 1;

export function emptyState() {
  return {
    version: VERSION,
    birth: null,
    demo: false,
    name: null,
    packs: PACKS.filter((p) => p.defaultOn && !p.locked).map((p) => p.id),
    events: [],
  };
}

const str = (v, n) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, n) : null);

/** Remet d'aplomb un moment venu d'ailleurs (fichier, ancienne version) ; null s'il est inutilisable. */
export function cleanEvent(e) {
  if (!e || typeof e !== 'object') return null;
  const title = str(e.title, 140);
  if (!title || !isIso(e.startDate)) return null;
  const end = isIso(e.endDate) && e.endDate >= e.startDate ? e.endDate : null;
  const now = new Date().toISOString();
  return {
    id: str(e.id, 64) ?? newId(),
    title,
    startDate: e.startDate,
    startPrecision: precisionOf(e.startDate),
    endDate: end,
    endPrecision: end ? precisionOf(end) : null,
    place: str(e.place, 80),
    note: str(e.note, 600),
    status: e.status === 'proposed' ? 'proposed' : 'confirmed',
    proposerName: str(e.proposerName, 40),
    highlighted: e.highlighted === true,
    createdAt: str(e.createdAt, 40) ?? now,
    updatedAt: str(e.updatedAt, 40) ?? now,
  };
}

export function cleanState(raw) {
  const s = emptyState();
  if (!raw || typeof raw !== 'object') return s;
  s.birth = isIso(raw.birth) && precisionOf(raw.birth) === 'day' ? raw.birth : null;
  s.demo = raw.demo === true;
  s.name = str(raw.name, 40);
  if (Array.isArray(raw.packs)) s.packs = raw.packs.filter((p) => PACKS.some((x) => x.id === p && !x.locked));
  s.events = (Array.isArray(raw.events) ? raw.events : []).map(cleanEvent).filter(Boolean);
  return s;
}

export function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function load(storage = globalThis.localStorage) {
  const raw = storage.getItem(KEY);
  return raw ? cleanState(JSON.parse(raw)) : emptyState();
}

/** Lève une erreur si le navigateur refuse d'écrire : l'appelant doit le dire à l'écran. */
export function save(state, storage = globalThis.localStorage) {
  storage.setItem(KEY, JSON.stringify(state));
}

export function exportJson(state) {
  const { demo, ...rest } = state;
  return JSON.stringify({ app: 'milestone', exportedAt: new Date().toISOString(), ...rest }, null, 2);
}

/** Relit une sauvegarde. Lève une erreur lisible si le fichier n'en est pas une. */
export function importJson(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('Ce fichier n’est pas une sauvegarde Milestone.');
  }
  if (raw?.app !== 'milestone' || !Array.isArray(raw.events)) throw new Error('Ce fichier n’est pas une sauvegarde Milestone.');
  return cleanState(raw);
}
