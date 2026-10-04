// Rendu de la frise : un fil rouge vertical, une section par année, tes
// moments posés sur le fil, l'Histoire en marge au crayon.

import { esc } from './ui.js';
import { fmt, fmtShort, fmtInYear, weekday, parts, ts } from './dates.js';
import { buildYears, birthFact, echoOf, CLOSENESS_LABEL } from './frise.js';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function ageLabel(age) {
  if (age == null) return '';
  if (age === 0) return 'naissance';
  return age === 1 ? '1 an' : `${age} ans`;
}

export function duration(e) {
  const a = parts(e.startDate);
  const b = parts(e.endDate);
  if (e.startPrecision === 'year' || e.endPrecision === 'year') {
    const y = b.y - a.y;
    return y <= 0 ? '' : y === 1 ? '1 an' : `${y} ans`;
  }
  const months = (b.y - a.y) * 12 + (b.m - a.m);
  if (months < 1) return '';
  if (months < 12) return `${months} mois`;
  const y = Math.floor(months / 12);
  const rest = (months % 12) / 12;
  const unit = (n) => (n === 1 ? '1 an' : `${n} ans`);
  if (rest < 0.25) return unit(y);
  if (rest > 0.75) return `près de ${unit(y + 1)}`;
  return `${unit(y)} et demi`;
}

function metaLine(e) {
  const bits = [];
  if (e.endDate) {
    bits.push(`${fmtShort(e.startDate, e.startPrecision)} → ${fmtShort(e.endDate, e.endPrecision)}`);
    const d = duration(e);
    if (d) bits.push(d);
  } else if (e.startPrecision !== 'year') {
    bits.push(fmtInYear(e.startDate, e.startPrecision));
  }
  if (e.place) bits.push(esc(e.place));
  return bits.join(' · ');
}

function momentHtml(e, newId) {
  if (e.status === 'proposed') {
    return `<li class="postit${e.id === newId ? ' new' : ''}" data-id="${esc(e.id)}">
      <span class="bead" aria-hidden="true"></span>
      <p class="from">${esc(e.proposerName ?? 'Un proche')} te propose :</p>
      <h3 class="title">${esc(e.title)}</h3>
      <p class="meta">${metaLine(e)}</p>
      ${e.note ? `<p class="note">${esc(e.note)}</p>` : ''}
      <div class="postit-actions">
        <button class="btn red small" data-act="accept" data-id="${esc(e.id)}">Je le garde</button>
        <button class="btn quiet small" data-act="decline" data-id="${esc(e.id)}">Non merci</button>
      </div>
    </li>`;
  }
  const cls = ['moment', e.highlighted && 'star', e.endDate && 'period', e.id === newId && 'new'].filter(Boolean).join(' ');
  const meta = metaLine(e);
  return `<li class="${cls}" data-act="moment" data-id="${esc(e.id)}" tabindex="0">
    <span class="bead" aria-hidden="true"></span>
    <h3 class="title">${esc(e.title)}${e.highlighted ? '<span class="sr"> (temps fort)</span>' : ''}</h3>
    ${meta ? `<p class="meta">${meta}</p>` : ''}
    ${e.note ? `<p class="note">${esc(e.note)}</p>` : ''}
  </li>`;
}

function captions(landmarks, max) {
  if (!landmarks.length) return '';
  const shown = landmarks.slice(0, max).map((l) => esc(l.title)).join(' · ');
  const more = landmarks.length - max;
  return shown + (more > 0 ? ` <span class="more">+${more}</span>` : '');
}

function yearHtml(y, newId) {
  const full = y.events.length > 0;
  const cls = ['year', full ? 'full' : 'empty', y.isCurrent && 'current', y.isBirthYear && 'birth-year'].filter(Boolean).join(' ');
  const age = ageLabel(y.age);
  const label = `${y.year}${age ? `, ${age === 'naissance' ? 'année de naissance' : `l’année de tes ${age}`}` : ''}`;
  if (!full) {
    return `<section class="${cls}" data-year="${y.year}">
      <button class="year-head" data-act="year" data-year="${y.year}" aria-label="${esc(label)}">
        <span class="y">${y.year}</span>
        <span class="year-hist-inline">${captions(y.landmarks, 2)}</span>
        <span class="age">${age}</span>
      </button>
    </section>`;
  }
  return `<section class="${cls}" data-year="${y.year}">
    <button class="year-head" data-act="year" data-year="${y.year}" aria-label="${esc(label)}">
      <span class="y">${y.year}</span>
      <span class="age">${age}</span>
    </button>
    ${y.landmarks.length ? `<p class="year-hist" data-act="year" data-year="${y.year}">${captions(y.landmarks, 2)}</p>` : ''}
    <ol class="moments">${y.events.map((e) => momentHtml(e, newId)).join('')}</ol>
  </section>`;
}

const EMPTY_STARTERS = ['Mon bac ', 'Mon premier appart ', 'Un voyage qui a compté : ', 'Une rencontre : '];

/** Le contenu défilant : aujourd'hui en haut, la naissance en bas. */
export function friseHtml({ state, events, searching, today, landmarks, allLandmarks, newId }) {
  let years = buildYears({ events, birth: state.birth, today, landmarks });
  if (searching) years = years.filter((y) => y.events.length);

  const echo = !searching && echoOf(state.events, today);
  const head = searching
    ? `<p class="search-count">${events.length === 0 ? 'Aucun moment ne correspond.' : events.length === 1 ? 'Un moment.' : `${events.length} moments.`}</p>`
    : `<div class="knot now">
        <span class="bead" aria-hidden="true"></span>
        <p class="kicker">Aujourd’hui</p>
        <p class="date">${cap(weekday(today))} ${fmt(today)}</p>
        ${echo ? `<button class="echo" data-act="moment" data-id="${esc(echo.event.id)}">
            <span class="kicker">Il y a ${echo.years} an${echo.years > 1 ? 's' : ''}${echo.exact ? ', jour pour jour' : ', ce mois-ci'}</span>
            <span class="title">${esc(echo.event.title)}</span>
          </button>` : ''}
      </div>
      ${!state.events.some((e) => e.status === 'confirmed') ? `<div class="starter">
        <p class="lead">Ta frise est prête.</p>
        <p>Commence par un moment qui compte, écrit comme tu le dirais. La date, on s’en occupe.</p>
        <div class="chips">${EMPTY_STARTERS.map((t) => `<button class="chip" data-act="capture" data-text="${esc(t)}">${esc(t.replace(/[\s:]+$/, ''))}</button>`).join('')}</div>
      </div>` : ''}`;

  let foot = '';
  if (!searching && state.birth) {
    const fact = birthFact(state.birth, allLandmarks);
    foot = `<div class="knot birth">
      <span class="bead" aria-hidden="true"></span>
      <p class="kicker">Naissance</p>
      <p class="date">${cap(weekday(state.birth))} ${fmt(state.birth)}</p>
      ${fact ? `<p class="fact">${CLOSENESS_LABEL[fact.closeness]} : ${esc(fact.landmark.title)}.</p>` : ''}
    </div>`;
  }
  return `${head}<div class="years">${years.map((y) => yearHtml(y, newId)).join('')}</div>${foot}<div class="periods" aria-hidden="true"></div>`;
}

/**
 * Les périodes deviennent des barres le long du fil, de leur début à leur fin.
 * Positions mesurées après rendu : le début est la perle du moment, la fin est
 * estimée dans la section de l'année de fin, au prorata du mois.
 */
export function layoutPeriods(main, events) {
  const layer = main.querySelector('.periods');
  if (!layer) return;
  const base = main.getBoundingClientRect().top;
  const bars = [];
  for (const e of events) {
    if (!e.endDate || e.status !== 'confirmed') continue;
    const bead = main.querySelector(`.moment[data-id="${CSS.escape(e.id)}"] .bead`);
    const endSection = main.querySelector(`.year[data-year="${parts(e.endDate).y}"]`);
    if (!bead || !endSection) continue;
    const b = bead.getBoundingClientRect();
    const s = endSection.getBoundingClientRect();
    const head = endSection.querySelector('.year-head')?.getBoundingClientRect().height ?? 0;
    const frac = e.endPrecision === 'year' ? 0.5 : 1 - (parts(e.endDate).m + 0.5) / 12;
    const yEnd = s.top - base + head + frac * Math.max(0, s.height - head);
    const yStart = b.top - base + b.height / 2;
    if (yStart - yEnd < 8) continue;
    bars.push({ top: yEnd, bottom: yStart, star: e.highlighted, id: e.id, start: ts(e.startDate) });
  }
  // Des couloirs pour que deux périodes qui se chevauchent restent lisibles.
  bars.sort((a, b) => a.top - b.top);
  const lanes = [];
  layer.innerHTML = bars
    .map((bar) => {
      let lane = lanes.findIndex((end) => end < bar.top - 6);
      if (lane < 0) lane = lanes.length;
      lanes[lane] = bar.bottom;
      return `<span class="bar${bar.star ? ' star' : ''}" style="top:${bar.top}px;height:${bar.bottom - bar.top}px;--lane:${Math.min(lane, 2)}"></span>`;
    })
    .join('');
}

/** L'index des décennies, sur le bord droit, pour voler d'une époque à l'autre. */
export function indexHtml(topYear, bottomYear) {
  const span = Math.max(1, topYear - bottomYear);
  const marks = [];
  for (let d = Math.ceil(bottomYear / 10) * 10; d <= topYear; d += 10) {
    marks.push(`<span class="mark" style="top:${((topYear - d) / span) * 100}%">’${String(d).slice(2)}</span>`);
  }
  return `<span class="index-rail"></span>${marks.join('')}<span class="index-here"></span>`;
}
