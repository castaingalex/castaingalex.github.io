// Les feuilles du bas : raconter un moment, le relire, ouvrir une année, régler.
// Chaque fonction ouvre sa feuille et rappelle `app` pour toute écriture.

import { esc, icon, openSheet, closeSheet, $, tick } from './ui.js';
import { parseMoment, fmt, fmtSpan, fmtInYear, weekday, ago, ageAt, parts, step, truncate, ts, precisionOf } from './dates.js';
import { neighbors, anchorsAround, visibleLandmarks } from './frise.js';
import { decodeMoment, sharedParam } from './share.js';
import { LANDMARKS, PACKS } from './landmarks.js';
import { ageLabel, duration } from './view-frise.js';

const PREC_LABEL = { day: 'Jour', month: 'Mois', year: 'Année' };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function ageText(birth, date, precision) {
  const a = ageAt(birth, date, precision);
  if (!a || a.age < 0) return '';
  if (!a.exact) return a.age === 0 ? 'ton année de naissance' : `l’année de tes ${ageLabel(a.age)}`;
  return a.age === 0 ? 'tu venais de naître' : `tu avais ${ageLabel(a.age)}`;
}

/* ------------------------------------------------------------------ */
/* Raconter un moment (ou le modifier)                                 */
/* ------------------------------------------------------------------ */

/**
 * `initial` : { text, override, place, note, editing } — `override` fixe la date
 * tant que la phrase n'en dit pas une autre (édition, année choisie, repère).
 */
export function openCapture(app, initial = {}) {
  const ctx = { today: app.today(), birth: app.state.birth };
  const st = {
    text: initial.text ?? '',
    override: initial.override ?? null,
    overrideSig: initial.override ? 'guessed' : null,
    anchor: null,
    place: initial.place ?? '',
    note: initial.note ?? '',
    editing: initial.editing ?? null,
  };

  function current() {
    const param = sharedParam(st.text);
    const shared = param && decodeMoment(param);
    if (shared) return { ...shared, guessed: false, shared: true };
    const p = parseMoment(st.text, ctx);
    if (!p) return st.override ? { title: '', ...st.override, guessed: false } : null;
    const sig = p.guessed ? 'guessed' : `${p.startDate}|${p.endDate}`;
    if (st.override && sig === st.overrideSig) return { ...p, ...st.override, guessed: false };
    if (st.override) {
      st.override = null;
      st.anchor = null;
    }
    return p;
  }

  function setOverride(o) {
    const p = parseMoment(st.text, ctx);
    st.overrideSig = !p || p.guessed ? 'guessed' : `${p.startDate}|${p.endDate}`;
    st.override = o;
    tick();
    render();
  }

  const html = `
    <div class="sheet-head">
      <h2>${st.editing ? 'Modifier le moment' : 'Un moment'}</h2>
      <button class="icon-btn" data-sheet-close aria-label="Fermer">${icon.close}</button>
    </div>
    <textarea class="cap-input" rows="1" enterkeyhint="done" autocapitalize="sentences" autocomplete="off"
      placeholder="Écris-le comme tu le dirais :&#10;road trip en Espagne l’été 2003" aria-label="Ton moment, avec sa date si tu l’as"></textarea>
    <div class="cap-live"></div>
    <div class="cap-more">
      <button class="link" data-cap="details" aria-expanded="false">+ Un lieu, une note</button>
      <div class="cap-details" hidden>
        <input class="field" name="place" placeholder="Lieu" autocomplete="off" maxlength="80">
        <textarea class="field" name="note" rows="2" placeholder="Une note, un détail qui fait revenir le souvenir" maxlength="600"></textarea>
      </div>
    </div>
    <button class="btn red block cap-save" disabled>${st.editing ? 'Enregistrer' : 'Ajouter à ma frise'}</button>`;

  let body;
  const render = () => {
    const eff = current();
    const live = $('.cap-live', body);
    $('.cap-save', body).disabled = !eff || !eff.title;
    if (!eff) {
      live.innerHTML = `<p class="cap-hint">Une date dans la phrase et elle se place toute seule : « 14/09/2021 », « juin 2019 », « l’été 2003 », « à 18 ans », « hier soir »…</p>`;
      return;
    }
    const where = eff.endDate
      ? cap(fmtSpan(eff.startDate, eff.startPrecision, eff.endDate, eff.endPrecision))
      : eff.guessed
        ? 'Aujourd’hui, faute de date dans la phrase'
        : cap(fmt(eff.startDate, eff.startPrecision));
    const age = ageText(app.state.birth, eff.startDate, eff.startPrecision);
    const anchors = !eff.shared && !eff.endDate && !eff.guessed && eff.startPrecision !== 'day'
      ? anchorsAround(eff.startDate, LANDMARKS, app.state.birth)
      : [];
    live.innerHTML = `
      ${eff.shared ? `<p class="cap-shared">Un moment envoyé par ${esc(eff.proposerName ?? 'un proche')}.</p>` : ''}
      <div class="pv">
        <span class="bead" aria-hidden="true"></span>
        <p class="pv-title">${esc(eff.title) || '<span class="ghost">Ton moment</span>'}</p>
        <p class="pv-when">${where}${age ? ` · <span class="pv-age">${age}</span>` : ''}</p>
        ${st.anchor ? `<p class="pv-anchor">Calé sur : ${esc(st.anchor)}</p>` : ''}
      </div>
      ${eff.shared ? '' : dateControls(eff)}
      ${anchors.length ? `<div class="anchors">
        <p class="anchors-title">Pas sûr de la date ? C’était l’époque de…</p>
        ${anchors.map((l) => `<button class="anchor" data-anchor="${esc(l.id)}"><span>${esc(l.title)}</span><span class="anchor-date">${fmt(l.date)}</span></button>`).join('')}
      </div>` : ''}`;
  };

  function dateControls(eff) {
    const chip = (date, precision, which) => {
      if (precision === 'year') {
        const by = app.state.birth ? parts(app.state.birth).y - 10 : 1940;
        const ty = parts(ctx.today).y + 5;
        const opts = [];
        for (let y = ty; y >= by; y--) opts.push(`<option${y === parts(date).y ? ' selected' : ''}>${y}</option>`);
        return `<label class="date-chip">${parts(date).y}<select data-cap-input="${which}" aria-label="Année">${opts.join('')}</select></label>`;
      }
      const type = precision === 'day' ? 'date' : 'month';
      return `<label class="date-chip">${fmt(date, precision)}<input type="${type}" value="${date}" data-cap-input="${which}" aria-label="Date"></label>`;
    };
    const prec = eff.startPrecision;
    const seg = `<div class="seg" role="group" aria-label="Précision de la date">${['day', 'month', 'year']
      .map((p) => `<button data-cap-prec="${p}" aria-pressed="${p === prec}">${PREC_LABEL[p]}</button>`)
      .join('')}</div>`;
    if (eff.endDate) {
      return `<div class="date-ctl">
        <div class="date-row"><span class="date-lbl">du</span>${chip(eff.startDate, prec, 'start')}<span class="date-lbl">au</span>${chip(eff.endDate, eff.endPrecision, 'end')}</div>
        ${seg}
        <button class="link" data-cap="no-end">Ce n’est pas une période</button>
      </div>`;
    }
    return `<div class="date-ctl">
      <div class="date-row">
        <button class="step" data-cap="prev" aria-label="Plus tôt">${icon.left}</button>
        ${chip(eff.startDate, prec, 'start')}
        <button class="step" data-cap="next" aria-label="Plus tard">${icon.right}</button>
      </div>
      ${seg}
      <button class="link" data-cap="add-end">+ Jusqu’à… (une période)</button>
    </div>`;
  }

  const datesOf = (eff) => ({ startDate: eff.startDate, startPrecision: eff.startPrecision, endDate: eff.endDate ?? null, endPrecision: eff.endPrecision ?? null });

  function save() {
    const eff = current();
    if (!eff || !eff.title) return;
    app.saveMoment(
      { title: eff.title, ...datesOf(eff), place: st.place.trim() || eff.place || null, note: st.note.trim() || eff.note || null, proposerName: eff.proposerName ?? null },
      st.editing,
    );
  }

  body = openSheet(html, {
    label: 'Raconter un moment',
    mount(b) {
      body = b;
      const input = $('.cap-input', b);
      input.value = st.text;
      const grow = () => {
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
      };
      input.addEventListener('input', () => {
        st.text = input.value.replace(/\n/g, ' ');
        input.classList.toggle('has-link', /https?:\/\//.test(st.text));
        grow();
        render();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          save();
        }
      });
      $('[name=place]', b).value = st.place;
      $('[name=note]', b).value = st.note;
      if (st.place || st.note) toggleDetails(b, true);
      b.addEventListener('input', (e) => {
        if (e.target.name === 'place') st.place = e.target.value;
        if (e.target.name === 'note') st.note = e.target.value;
      });
      b.addEventListener('click', (e) => {
        const t = e.target.closest('[data-cap], [data-cap-prec], [data-anchor], .date-chip');
        if (!t) return;
        const eff = current();
        if (t.matches('.date-chip')) {
          t.querySelector('input, select')?.showPicker?.();
          return;
        }
        if (t.dataset.cap === 'details') return toggleDetails(b);
        if (!eff) return;
        const d = datesOf(eff);
        if (t.dataset.cap === 'prev' || t.dataset.cap === 'next') {
          setOverride({ ...d, startDate: step(d.startDate, d.startPrecision, t.dataset.cap === 'prev' ? -1 : 1) });
        } else if (t.dataset.cap === 'add-end') {
          setOverride({ ...d, endDate: step(d.startDate, d.startPrecision, 1), endPrecision: d.startPrecision });
        } else if (t.dataset.cap === 'no-end') {
          setOverride({ ...d, endDate: null, endPrecision: null });
        } else if (t.dataset.capPrec) {
          const p = t.dataset.capPrec;
          setOverride({
            startDate: truncate(d.startDate, p),
            startPrecision: p,
            endDate: d.endDate ? truncate(d.endDate, p) : null,
            endPrecision: d.endDate ? p : null,
          });
        } else if (t.dataset.anchor) {
          const l = LANDMARKS.find((x) => x.id === t.dataset.anchor);
          setOverride({ startDate: l.date, startPrecision: precisionOf(l.date), endDate: null, endPrecision: null });
          st.anchor = l.title;
          render();
        }
      });
      b.addEventListener('change', (e) => {
        const which = e.target.dataset.capInput;
        if (!which || !e.target.value) return;
        const eff = current();
        const d = datesOf(eff);
        const v = e.target.value;
        const precision = v.length === 4 ? 'year' : v.length === 7 ? 'month' : 'day';
        const next = which === 'start' ? { ...d, startDate: v, startPrecision: precision } : { ...d, endDate: v, endPrecision: precision };
        if (next.endDate && ts(next.endDate) < ts(next.startDate)) [next.startDate, next.endDate] = [next.endDate, next.startDate];
        setOverride(next);
      });
      $('.cap-save', b).addEventListener('click', save);
      render();
      grow();
      // L'iPhone n'ouvre le clavier que pendant le geste qui a ouvert la feuille.
      input.focus({ preventScroll: true });
      input.setSelectionRange(input.value.length, input.value.length);
    },
  });
}

function toggleDetails(b, force) {
  const box = $('.cap-details', b);
  const btn = $('[data-cap="details"]', b);
  const open = force ?? box.hidden;
  box.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
  btn.hidden = open;
  if (open && force == null) $('[name=place]', b).focus();
}

/* ------------------------------------------------------------------ */
/* Relire un moment                                                    */
/* ------------------------------------------------------------------ */

function kickerOf(e) {
  if (e.endDate) return cap(fmtSpan(e.startDate, e.startPrecision, e.endDate, e.endPrecision));
  if (e.startPrecision === 'day') return `${cap(weekday(e.startDate))} ${fmt(e.startDate)}`;
  if (e.startPrecision === 'month') return cap(fmt(e.startDate, 'month'));
  return `En ${fmt(e.startDate, 'year')}`;
}

function aroundHtml(groups, max = 8) {
  return groups
    .map(
      (g) => `<div class="around-group">
        <p class="around-label">${g.label}</p>
        <ul class="around">${g.items
          .slice(0, max)
          .map((it) =>
            it.kind === 'event'
              ? `<li><button class="nb mine" data-open="${esc(it.event.id)}"><span class="dot"></span><span class="t">${esc(it.title)}</span><span class="d">${g.closeness === 'year' ? fmtInYear(it.date, it.precision) : fmt(it.date, it.precision)}</span></button></li>`
              : `<li class="nb hist"><span class="dot"></span><span class="t">${esc(it.title)}</span><span class="d">${g.closeness === 'year' ? fmtInYear(it.date, it.precision) : fmt(it.date, it.precision)}</span></li>`,
          )
          .join('')}</ul>
      </div>`,
    )
    .join('');
}

export function openDetail(app, id) {
  const e = app.state.events.find((x) => x.id === id);
  if (!e) return;
  const today = app.today();
  const lms = visibleLandmarks(LANDMARKS, app.state.packs, app.state.birth, today);
  const { groups, discovery } = neighbors(e, app.state.events.filter((x) => x.status === 'confirmed'), lms);
  const age = ageText(app.state.birth, e.startDate, e.startPrecision);
  const sub = [e.endDate ? duration(e) : ago(e.startDate, today), age && (e.endDate ? `${age} au début` : age)].filter(Boolean).join(' · ');
  const proposed = e.status === 'proposed';
  const html = `
    <div class="sheet-head">
      <p class="kicker">${kickerOf(e)}</p>
      <button class="icon-btn" data-sheet-close aria-label="Fermer">${icon.close}</button>
    </div>
    <h2 class="d-title${e.highlighted ? ' star' : ''}">${esc(e.title)}</h2>
    <p class="d-sub">${sub}</p>
    ${e.place ? `<p class="d-place">${icon.pin}<span>${esc(e.place)}</span></p>` : ''}
    ${e.note ? `<blockquote class="d-note">${esc(e.note)}</blockquote>` : ''}
    ${proposed ? `<p class="d-from">Proposé par ${esc(e.proposerName ?? 'un proche')}.</p>
      <div class="d-actions two">
        <button class="btn red" data-d="accept">Je le garde</button>
        <button class="btn quiet" data-d="decline">Non merci</button>
      </div>` : `
    <div class="d-actions">
      <button class="act${e.highlighted ? ' on' : ''}" data-d="star" aria-pressed="${e.highlighted}">${icon.star}<span>Temps fort</span></button>
      <button class="act" data-d="edit">${icon.edit}<span>Modifier</span></button>
      <button class="act" data-d="send">${icon.send}<span>Envoyer</span></button>
      <button class="act" data-d="delete">${icon.trash}<span>Supprimer</span></button>
    </div>
    <div class="d-confirm" hidden></div>`}
    ${discovery ? `<p class="discovery"><span class="kicker">Découverte</span>${discovery.closeness === 'day' ? 'Le même jour que' : 'La même semaine que'} : ${esc(discovery.title)}, ${fmt(discovery.date, discovery.precision)}.</p>` : ''}
    ${groups.length ? `<h3 class="d-around">Autour de ce moment</h3>${aroundHtml(groups)}` : ''}
    ${!proposed && !e.highlighted ? '<p class="d-tip">Astuce : touche deux fois un moment sur la frise pour en faire un temps fort.</p>' : ''}`;

  openSheet(html, {
    label: e.title,
    mount(b) {
      b.addEventListener('click', (ev) => {
        const open = ev.target.closest('[data-open]');
        if (open) return openDetail(app, open.dataset.open);
        const t = ev.target.closest('[data-d]');
        if (!t) return;
        const box = $('.d-confirm', b);
        switch (t.dataset.d) {
          case 'star':
            app.toggleStar(e.id);
            return openDetail(app, e.id);
          case 'edit':
            return openCapture(app, {
              text: e.title,
              override: { startDate: e.startDate, startPrecision: e.startPrecision, endDate: e.endDate, endPrecision: e.endPrecision },
              place: e.place ?? '',
              note: e.note ?? '',
              editing: e.id,
            });
          case 'accept':
            closeSheet();
            return app.accept(e.id);
          case 'decline':
            closeSheet();
            return app.decline(e.id);
          case 'delete':
            box.hidden = false;
            box.innerHTML = `<p>Supprimer « ${esc(e.title)} » ? Rien ne pourra le faire revenir, hors sauvegarde.</p>
              <div class="d-actions two"><button class="btn red" data-d="delete-yes">Supprimer</button><button class="btn quiet" data-d="cancel">Garder</button></div>`;
            return;
          case 'delete-yes':
            closeSheet();
            return app.remove(e.id);
          case 'cancel':
            box.hidden = true;
            return;
          case 'send':
            if (app.state.name) return app.send(e);
            box.hidden = false;
            box.innerHTML = `<p>Ton prénom, pour signer le moment chez la personne qui le reçoit :</p>
              <div class="inline-form"><input class="field" name="name" autocomplete="given-name" maxlength="40" placeholder="Prénom"><button class="btn red" data-d="send-named">Envoyer</button></div>`;
            $('[name=name]', box).focus();
            return;
          case 'send-named': {
            const name = $('[name=name]', box).value.trim();
            if (!name) return;
            app.setName(name);
            box.hidden = true;
            return app.send(e);
          }
        }
      });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Une année                                                           */
/* ------------------------------------------------------------------ */

export function openYear(app, year) {
  const mine = app.state.events.filter((e) => parts(e.startDate).y === year && e.status === 'confirmed').sort((a, b) => ts(a.startDate) - ts(b.startDate));
  const from = app.state.birth ? ts(app.state.birth) : -Infinity;
  const hist = LANDMARKS.filter((l) => parts(l.date).y === year && ts(l.date) >= from).sort((a, b) => ts(a.date) - ts(b.date));
  const age = app.state.birth ? year - parts(app.state.birth).y : null;
  const html = `
    <div class="sheet-head">
      <div><h2 class="y-title">${year}</h2>${age != null && age >= 0 ? `<p class="kicker">${age === 0 ? 'Ton année de naissance' : `L’année de tes ${ageLabel(age)}`}</p>` : ''}</div>
      <button class="icon-btn" data-sheet-close aria-label="Fermer">${icon.close}</button>
    </div>
    <h3 class="d-around">Tes moments</h3>
    ${mine.length
      ? `<ul class="around">${mine.map((e) => `<li><button class="nb mine" data-open="${esc(e.id)}"><span class="dot"></span><span class="t">${esc(e.title)}</span><span class="d">${e.startPrecision === 'year' ? '' : fmtInYear(e.startDate, e.startPrecision)}</span></button></li>`).join('')}</ul>`
      : '<p class="muted">Rien pour l’instant. Un souvenir de cette année-là ?</p>'}
    <button class="btn quiet block" data-y="add">Ajouter un moment en ${year}</button>
    ${hist.length ? `<h3 class="d-around">Cette année-là</h3><ul class="around">${hist.map((l) => `<li class="nb hist"><span class="dot"></span><span class="t">${esc(l.title)}</span><span class="d">${fmtInYear(l.date)}</span></li>`).join('')}</ul>` : ''}`;
  openSheet(html, {
    label: String(year),
    mount(b) {
      b.addEventListener('click', (ev) => {
        const open = ev.target.closest('[data-open]');
        if (open) return openDetail(app, open.dataset.open);
        if (ev.target.closest('[data-y="add"]')) openCapture(app, { override: { startDate: String(year), startPrecision: 'year', endDate: null, endPrecision: null } });
      });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Réglages                                                            */
/* ------------------------------------------------------------------ */

export function openSettings(app) {
  const s = app.state;
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const html = `
    <div class="sheet-head">
      <h2>Ta frise</h2>
      <button class="icon-btn" data-sheet-close aria-label="Fermer">${icon.close}</button>
    </div>
    ${s.demo ? `<div class="set-block demo-block">
      <p>Tu parcours une <b>vie d’exemple</b>. Quand tu veux, on la range et tu commences la tienne.</p>
      <button class="btn red block" data-s="leave-demo">Commencer ma frise</button>
    </div>` : ''}
    <div class="set-block">
      <label class="set-label" for="set-birth">Naissance</label>
      <input class="field" id="set-birth" type="date" value="${esc(s.birth ?? '')}" max="${app.today()}">
    </div>
    <div class="set-block">
      <p class="set-label">L’Histoire en marge</p>
      <p class="muted">Des repères pour retrouver tes dates. Ils restent au crayon, à côté de ta vie.</p>
      ${PACKS.map((p) => `<label class="toggle">
        <span><b>${esc(p.label)}</b><small>${esc(p.description)}</small></span>
        <input type="checkbox" data-pack="${p.id}" ${p.locked || s.packs.includes(p.id) ? 'checked' : ''} ${p.locked ? 'disabled' : ''}>
      </label>`).join('')}
    </div>
    <div class="set-block">
      <label class="set-label" for="set-name">Ton prénom</label>
      <p class="muted">Pour signer les moments que tu envoies.</p>
      <input class="field" id="set-name" autocomplete="given-name" maxlength="40" value="${esc(s.name ?? '')}" placeholder="Prénom">
    </div>
    <div class="set-block">
      <p class="set-label">Sauvegarde</p>
      <p class="muted">Tes moments ne quittent jamais ce téléphone. Une sauvegarde de temps en temps, c’est ton filet si tu le perds ou en changes.</p>
      <div class="d-actions two">
        <button class="btn quiet" data-s="export">Sauvegarder</button>
        <label class="btn quiet">Restaurer<input type="file" accept="application/json,.json" data-s="import" hidden></label>
      </div>
      <div class="set-confirm" hidden></div>
    </div>
    ${standalone ? '' : `<div class="set-block">
      <p class="set-label">L’avoir comme une app</p>
      <p class="muted">Sur iPhone, dans Safari : bouton Partager, puis « Sur l’écran d’accueil ». Elle s’ouvrira en plein écran, sans barre d’adresse.</p>
    </div>`}
    ${s.demo ? '' : `<div class="set-block">
      <button class="link danger" data-s="wipe">Tout effacer</button>
      <div class="wipe-confirm" hidden></div>
    </div>`}
    <p class="colophon">Milestone, version de test. Rien n’est envoyé nulle part : pas de compte, pas de serveur, pas de mesure d’audience.</p>`;

  openSheet(html, {
    label: 'Réglages',
    mount(b) {
      b.addEventListener('change', async (ev) => {
        const t = ev.target;
        if (t.id === 'set-birth' && t.value) app.setBirth(t.value);
        if (t.dataset.pack) app.setPack(t.dataset.pack, t.checked);
        if (t.id === 'set-name') app.setName(t.value.trim() || null);
        if (t.dataset.s === 'import' && t.files[0]) {
          const box = $('.set-confirm', b);
          try {
            const next = await app.readBackup(t.files[0]);
            box.hidden = false;
            box.innerHTML = `<p>Cette sauvegarde contient ${next.events.length} moment${next.events.length > 1 ? 's' : ''}. Elle remplacera ce qu’il y a sur ce téléphone (${app.state.events.length}).</p>
              <div class="d-actions two"><button class="btn red" data-s="import-yes">Remplacer</button><button class="btn quiet" data-s="import-no">Annuler</button></div>`;
            box._next = next;
          } catch (err) {
            box.hidden = false;
            box.innerHTML = `<p class="error">${esc(err.message)}</p>`;
          }
          t.value = '';
        }
      });
      b.addEventListener('click', (ev) => {
        const t = ev.target.closest('[data-s]');
        if (!t) return;
        const confirm = $('.set-confirm', b);
        switch (t.dataset.s) {
          case 'export':
            return app.exportBackup();
          case 'import-yes':
            closeSheet();
            return app.restore(confirm._next);
          case 'import-no':
            confirm.hidden = true;
            return;
          case 'leave-demo':
            closeSheet();
            return app.leaveDemo();
          case 'wipe': {
            const box = $('.wipe-confirm', b);
            box.hidden = false;
            box.innerHTML = `<p>Effacer les ${app.state.events.length} moments de ce téléphone ? Sans sauvegarde, ils sont perdus.</p>
              <div class="d-actions two"><button class="btn red" data-s="wipe-yes">Tout effacer</button><button class="btn quiet" data-s="wipe-no">Annuler</button></div>`;
            return;
          }
          case 'wipe-yes':
            closeSheet();
            return app.wipe();
          case 'wipe-no':
            $('.wipe-confirm', b).hidden = true;
        }
      });
    },
  });
}
