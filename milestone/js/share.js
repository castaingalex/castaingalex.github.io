// Partage par lien, sans serveur : un moment voyage dans l'adresse elle-même,
// après le « # », partie qu'un navigateur n'envoie jamais au serveur.
// https://…/milestone/#p=<JSON compact en base64url>

import { isIso, precisionOf } from './dates.js';

function toBase64url(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64url(s) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

const clip = (v, n) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, n) : null);

/** Ce qu'on envoie : le strict nécessaire, signé du prénom de l'expéditeur. */
export function encodeMoment(event, by) {
  const p = { t: event.title, s: event.startDate };
  if (event.endDate) p.e = event.endDate;
  if (event.place) p.p = event.place;
  if (event.note) p.n = event.note;
  if (by) p.by = by;
  return toBase64url(JSON.stringify(p));
}

/** Ce qu'on reçoit : décodé et vérifié champ par champ, ou null s'il est illisible. */
export function decodeMoment(s) {
  try {
    const p = JSON.parse(fromBase64url(s));
    const title = clip(p.t, 140);
    if (!title || !isIso(p.s)) return null;
    const end = isIso(p.e) && p.e >= p.s ? p.e : null;
    return {
      title,
      startDate: p.s,
      startPrecision: precisionOf(p.s),
      endDate: end,
      endPrecision: end ? precisionOf(end) : null,
      place: clip(p.p, 80),
      note: clip(p.n, 600),
      proposerName: clip(p.by, 40),
    };
  } catch {
    return null;
  }
}

export function shareUrl(base, event, by) {
  return `${base.split('#')[0]}#p=${encodeMoment(event, by)}`;
}

/** Le paramètre partagé dans une adresse ou un texte collé (« Tiens : https://…#p=… »). */
export function sharedParam(text) {
  const m = String(text ?? '').match(/[#&?]p=([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}
