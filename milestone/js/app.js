// Milestone : ta vie sur un fil, à côté de l'Histoire.
// Point d'entrée : l'état, les actions, l'accueil, la frise et ses gestes.

import { load, save, emptyState, cleanEvent, cleanState, exportJson, importJson, newId } from './store.js';
import { todayIso, fmt, parts } from './dates.js';
import { visibleLandmarks, matches, birthFact, CLOSENESS_LABEL, fold } from './frise.js';
import { decodeMoment, shareUrl, sharedParam } from './share.js';
import { LANDMARKS } from './landmarks.js';
import { DEMO_BIRTH, demoEvents } from './demo.js';
import { $, $$, esc, icon, tick, toast, closeSheet, sheetIsOpen, reducedMotion } from './ui.js';
import { friseHtml, layoutPeriods, indexHtml, ageLabel } from './view-frise.js';
import { openCapture, openDetail, openYear, openSettings } from './sheets.js';

const root = document.getElementById('app');
let state;
const view = { query: null, newId: null };
let pendingShare = null;

/* ------------------------------------------------------------------ */
/* État et écriture                                                    */
/* ------------------------------------------------------------------ */

function persist() {
  try {
    save(state);
    navigator.storage?.persist?.();
  } catch (err) {
    toast('Impossible d’enregistrer sur ce téléphone. Fais une sauvegarde avant de fermer.');
    console.error(err);
  }
}

function commit(mutate, { rerender = true } = {}) {
  mutate(state);
  persist();
  if (rerender) render();
}

const stamp = () => new Date().toISOString();

const app = {
  get state() {
    return state;
  },
  today: () => todayIso(),

  saveMoment(input, editingId) {
    closeSheet();
    let id = editingId;
    commit((s) => {
      if (editingId) {
        const e = s.events.find((x) => x.id === editingId);
        Object.assign(e, cleanEvent({ ...e, ...input, updatedAt: stamp() }));
      } else {
        const e = cleanEvent({ ...input, id: newId(), status: 'confirmed', createdAt: stamp(), updatedAt: stamp() });
        id = e.id;
        s.events.push(e);
      }
    }, { rerender: false });
    view.query = null;
    showNew(id, editingId ? 'Modifié.' : 'Posé sur ta frise.');
  },
  toggleStar(id) {
    let on = false;
    commit((s) => {
      const e = s.events.find((x) => x.id === id);
      e.highlighted = on = !e.highlighted;
      e.updatedAt = stamp();
    }, { rerender: false });
    tick();
    render({ pop: id });
    toast(on ? 'Temps fort.' : 'Retiré des temps forts.');
  },
  accept(id) {
    commit((s) => {
      const e = s.events.find((x) => x.id === id);
      e.status = 'confirmed';
      e.updatedAt = stamp();
    }, { rerender: false });
    tick();
    showNew(id, 'Gardé sur ta frise.');
  },
  decline(id) {
    commit((s) => {
      s.events = s.events.filter((x) => x.id !== id);
    });
    toast('Proposition écartée.');
  },
  remove(id) {
    commit((s) => {
      s.events = s.events.filter((x) => x.id !== id);
    });
    toast('Supprimé.');
  },
  setName(name) {
    commit((s) => {
      s.name = name;
    }, { rerender: false });
  },
  setBirth(birth) {
    commit((s) => {
      s.birth = birth;
    });
  },
  setPack(pack, on) {
    commit((s) => {
      s.packs = on ? [...new Set([...s.packs, pack])] : s.packs.filter((p) => p !== pack);
    });
  },
  async send(e) {
    const url = shareUrl(location.href, e, state.name);
    const text = `Un moment pour ta frise : ${e.title}, ${fmt(e.startDate, e.startPrecision)}.`;
    try {
      if (navigator.share) await navigator.share({ title: e.title, text, url });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast('Lien copié : colle-le dans un message.');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') toast('Partage impossible ici. Réessaie depuis le téléphone.');
    }
  },
  async exportBackup() {
    const name = `milestone-sauvegarde-${todayIso()}.json`;
    const file = new File([exportJson(state)], name, { type: 'application/json' });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Sauvegarde Milestone' });
        return;
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('Sauvegarde téléchargée.');
  },
  async readBackup(file) {
    return importJson(await file.text());
  },
  restore(next) {
    state = next;
    persist();
    render();
    toast(`${state.events.length} moments restaurés.`);
  },
  leaveDemo() {
    state = emptyState();
    persist();
    render();
  },
  wipe() {
    state = emptyState();
    persist();
    render();
    toast('Frise effacée.');
  },
};

/* ------------------------------------------------------------------ */
/* Rendu                                                               */
/* ------------------------------------------------------------------ */

function render(opts = {}) {
  if (!state.birth && !state.demo) return renderWelcome();
  if (!$('.frise', root)) renderShell();
  renderFrise(opts);
}

function renderWelcome() {
  document.documentElement.classList.add('welcome-mode');
  root.innerHTML = `
    <main class="welcome">
      <div class="welcome-thread" aria-hidden="true"><span class="bead"></span></div>
      <p class="kicker">Milestone</p>
      <h1>Ta vie, à côté de l’Histoire.</h1>
      <p class="lead">Pose tes moments sur un fil, en trois secondes, comme tu les racontes. En marge, les grands événements du monde t’aident à retrouver les dates qui t’échappent.</p>
      <form class="welcome-form">
        <label for="birth">Ta date de naissance, pour que le fil parte de toi</label>
        <input class="field" id="birth" type="date" required max="${todayIso()}" min="1920-01-01">
        <button class="btn red block" type="submit">Commencer ma frise</button>
      </form>
      <button class="link" data-act="demo">Voir d’abord une vie d’exemple</button>
      <p class="fine">Tout reste dans ce téléphone. Pas de compte, rien n’est envoyé.</p>
    </main>`;
  $('.welcome-form', root).addEventListener('submit', (e) => {
    e.preventDefault();
    const birth = $('#birth', root).value;
    if (!birth) return;
    state = { ...emptyState(), birth };
    persist();
    document.documentElement.classList.remove('welcome-mode');
    render();
    const fact = birthFact(birth, LANDMARKS);
    // Une vraie coïncidence fait un bon accueil ; « la même année » reste au pied du fil.
    toast(fact && fact.closeness !== 'year' ? `${CLOSENESS_LABEL[fact.closeness]} que ta naissance : ${fact.landmark.title}.` : 'Ta frise est prête.');
    receivePending();
  });
}

function startDemo() {
  const now = stamp();
  state = cleanState({ birth: DEMO_BIRTH, demo: true, events: demoEvents(todayIso()).map((e) => ({ ...e, id: newId(), createdAt: now, updatedAt: now })) });
  persist();
  document.documentElement.classList.remove('welcome-mode');
  render();
  receivePending();
}

function renderShell() {
  document.documentElement.classList.remove('welcome-mode');
  root.innerHTML = `
    <header class="top">
      <div class="brand"><span class="brand-bead" aria-hidden="true"></span>Milestone</div>
      <div class="search-box" hidden>
        <input class="field search-input" type="search" placeholder="Chercher un moment, un lieu…" aria-label="Chercher un moment" enterkeyhint="search">
      </div>
      <button class="icon-btn" data-act="search" aria-label="Chercher">${icon.search}</button>
      <button class="icon-btn" data-act="menu" aria-label="Réglages">${icon.menu}</button>
    </header>
    <div class="demo-ribbon" hidden><span>Vie d’exemple</span><button class="link" data-act="menu">Commencer la mienne</button></div>
    <main class="frise"></main>
    <nav class="index" aria-label="Voler vers une époque"></nav>
    <div class="bubble" aria-hidden="true"></div>
    <button class="add" data-act="capture" aria-label="Raconter un moment">
      <span>Un moment à poser…</span><span class="plus">${icon.plus}</span>
    </button>`;
  const input = $('.search-input', root);
  input.addEventListener('input', () => {
    view.query = input.value;
    renderFrise();
  });
  bindIndex($('.index', root));
}

function renderFrise({ pop } = {}) {
  const main = $('.frise', root);
  const today = todayIso();
  const searching = view.query != null && view.query.trim() !== '';
  const events = searching ? state.events.filter((e) => matches(e, view.query)) : state.events;
  const landmarks = visibleLandmarks(LANDMARKS, state.packs, state.birth, today);
  keepScroll(main, () => {
    main.innerHTML = friseHtml({ state, events, searching, today, landmarks, allLandmarks: LANDMARKS, newId: view.newId });
  });
  if (pop) main.querySelector(`[data-id="${CSS.escape(pop)}"]`)?.classList.add('pop');
  view.newId = null;
  layoutPeriods(main, events);
  $('.demo-ribbon', root).hidden = !state.demo;
  document.documentElement.classList.toggle('has-ribbon', state.demo);
  const years = $$('.year', main).map((s) => Number(s.dataset.year));
  const index = $('.index', root);
  index.hidden = searching || years.length < 8;
  if (years.length) index.innerHTML = indexHtml(years[0], years.at(-1));
  placeHere();
}

/** La perle rouge de l'index suit l'année qu'on regarde. */
function placeHere() {
  const here = $('.index-here', root);
  const sections = $$('.frise .year', root);
  if (!here || !sections.length) return;
  const top = headerHeight() + 40;
  const cur = sections.find((s) => s.getBoundingClientRect().bottom > top) ?? sections.at(-1);
  const first = Number(sections[0].dataset.year);
  const last = Number(sections.at(-1).dataset.year);
  here.style.top = `${((first - Number(cur.dataset.year)) / Math.max(1, first - last)) * 100}%`;
}
let herePending = false;
window.addEventListener('scroll', () => {
  if (herePending) return;
  herePending = true;
  requestAnimationFrame(() => {
    herePending = false;
    placeHere();
  });
}, { passive: true });

/** Re-rendre sans faire sauter l'écran : on garde en place l'élément qu'on regardait. */
function keepScroll(main, fn) {
  const top = headerHeight();
  const anchor = $$('[data-id], .year', main).find((el) => el.getBoundingClientRect().bottom > top);
  const key = anchor && (anchor.dataset.id ? `[data-id="${CSS.escape(anchor.dataset.id)}"]` : `.year[data-year="${anchor.dataset.year}"]`);
  const before = anchor?.getBoundingClientRect().top;
  fn();
  const after = key && main.querySelector(key);
  if (after && before != null) window.scrollBy(0, after.getBoundingClientRect().top - before);
}

const headerHeight = () => $('.top', root)?.getBoundingClientRect().bottom ?? 0;

/** Amène un moment au tiers de l'écran, avec sa petite entrée en scène. */
function showNew(id, message) {
  view.newId = id;
  render();
  const el = $(`[data-id="${CSS.escape(id)}"]`, root);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.33;
    window.scrollTo({ top: Math.max(0, y), behavior: reducedMotion() ? 'auto' : 'smooth' });
  }
  if (message) toast(message);
}

/* ------------------------------------------------------------------ */
/* Gestes                                                              */
/* ------------------------------------------------------------------ */

// Toucher un moment l'ouvre ; le toucher deux fois en fait un temps fort.
let lastTap = { id: null, at: 0, timer: 0 };
function tapMoment(id) {
  const now = performance.now();
  if (lastTap.id === id && now - lastTap.at < 300) {
    clearTimeout(lastTap.timer);
    lastTap = { id: null, at: 0, timer: 0 };
    app.toggleStar(id);
    return;
  }
  clearTimeout(lastTap.timer);
  lastTap = { id, at: now, timer: setTimeout(() => openDetail(app, id), 260) };
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]');
  if (!t || !root.contains(t)) return;
  const act = t.dataset.act;
  if (act === 'moment') return tapMoment(t.dataset.id);
  if (act === 'capture') {
    tick();
    return openCapture(app, { text: t.dataset.text ?? '' });
  }
  if (act === 'year') return openYear(app, Number(t.dataset.year));
  if (act === 'menu') return openSettings(app);
  if (act === 'accept') return app.accept(t.dataset.id);
  if (act === 'decline') return app.decline(t.dataset.id);
  if (act === 'demo') return startDemo();
  if (act === 'search') return toggleSearch();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (sheetIsOpen()) closeSheet();
    else if (view.query != null) toggleSearch(false);
  }
  if (e.key === 'Enter' && e.target.matches?.('.moment')) openDetail(app, e.target.dataset.id);
});

function toggleSearch(force) {
  const box = $('.search-box', root);
  const open = force ?? box.hidden;
  box.hidden = !open;
  $('.top', root).classList.toggle('searching', open);
  const btn = $('[data-act="search"]', root);
  btn.innerHTML = open ? icon.close : icon.search;
  btn.setAttribute('aria-label', open ? 'Fermer la recherche' : 'Chercher');
  const input = $('.search-input', root);
  if (open) {
    view.query = '';
    input.value = '';
    input.focus();
  } else {
    view.query = null;
    renderFrise();
  }
}

/**
 * L'index des décennies : glisser le doigt dessus fait voler la frise d'année
 * en année, avec une bulle et un tic à chaque année franchie.
 */
function bindIndex(nav) {
  const bubble = $('.bubble', root);
  let active = false;
  let lastYear = null;
  const yearAt = (clientY) => {
    const r = nav.getBoundingClientRect();
    const years = $$('.frise .year', root).map((s) => Number(s.dataset.year));
    if (!years.length) return null;
    const f = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    return Math.round(years[0] - f * (years[0] - years.at(-1)));
  };
  const go = (clientY) => {
    const year = yearAt(clientY);
    if (year == null) return;
    bubble.style.top = `${clientY}px`;
    if (year === lastYear) return;
    lastYear = year;
    const sec = $(`.frise .year[data-year="${year}"]`, root);
    if (sec) window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - headerHeight() + 1 });
    const age = state.birth ? year - parts(state.birth).y : null;
    bubble.innerHTML = `<b>${year}</b>${age != null && age >= 0 ? `<span>${ageLabel(age)}</span>` : ''}`;
    tick();
  };
  nav.addEventListener('pointerdown', (e) => {
    active = true;
    lastYear = null;
    nav.setPointerCapture(e.pointerId);
    nav.classList.add('active');
    bubble.classList.add('show');
    go(e.clientY);
  });
  nav.addEventListener('pointermove', (e) => active && go(e.clientY));
  const end = () => {
    active = false;
    nav.classList.remove('active');
    bubble.classList.remove('show');
  };
  nav.addEventListener('pointerup', end);
  nav.addEventListener('pointercancel', end);
}

/* ------------------------------------------------------------------ */
/* Lien reçu : un moment proposé par un proche                         */
/* ------------------------------------------------------------------ */

function readHash() {
  const param = sharedParam(location.hash);
  if (!param) return;
  history.replaceState(null, '', location.pathname + location.search);
  const m = decodeMoment(param);
  if (!m) return toast('Ce lien est illisible : rien n’a été ajouté.');
  pendingShare = m;
  if (state.birth || state.demo) receivePending();
  else toast(`${m.proposerName ?? 'Un proche'} t’envoie un moment. Commence ta frise pour le recevoir.`);
}

function receivePending() {
  const m = pendingShare;
  pendingShare = null;
  if (!m) return;
  const dup = state.events.find((e) => fold(e.title) === fold(m.title) && e.startDate === m.startDate);
  if (dup) {
    showNew(dup.id, 'Ce moment est déjà sur ta frise.');
    return;
  }
  const e = cleanEvent({ ...m, id: newId(), status: 'proposed', createdAt: stamp(), updatedAt: stamp() });
  commit((s) => s.events.push(e), { rerender: false });
  tick();
  showNew(e.id, `${m.proposerName ?? 'Un proche'} te propose un moment.`);
}

/* ------------------------------------------------------------------ */
/* Démarrage                                                           */
/* ------------------------------------------------------------------ */

try {
  state = load();
} catch (err) {
  console.error(err);
  root.innerHTML = `<main class="welcome"><h1>Tes moments n’ont pas pu être relus.</h1>
    <p class="lead">Les données enregistrées dans ce navigateur sont abîmées. Rien n’a été effacé.</p>
    <details><summary>Voir les données brutes</summary><textarea class="field" rows="8" readonly>${esc(localStorage.getItem('milestone') ?? '')}</textarea></details></main>`;
  throw err;
}
render();
readHash();
window.addEventListener('hashchange', readHash);
window.addEventListener('resize', () => $('.frise', root) && layoutPeriods($('.frise', root), state.events));
