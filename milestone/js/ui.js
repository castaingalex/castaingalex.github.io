// Petits outils d'interface partagés : échappement, icônes, retour tactile,
// message éphémère, feuille modale du bas.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Tout texte venu de l'utilisateur ou d'un lien passe par ici avant le HTML. */
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" ${extra}>${d}</svg>`;
export const icon = {
  search: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>'),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h10"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  star: svg('<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>'),
  edit: svg('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>'),
  send: svg('<path d="M4 12 20 4l-6 16-3-7z"/><path d="m11 13 9-9"/>'),
  trash: svg('<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>'),
  left: svg('<path d="m15 5-7 7 7 7"/>'),
  right: svg('<path d="m9 5 7 7-7 7"/>'),
  pin: svg('<path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>'),
};

/*
 * Retour tactile. Android : l'API de vibration. iPhone (iOS 18 et plus) : basculer
 * un interrupteur natif caché déclenche le « tic » du système. Sans effet ailleurs,
 * et seulement pendant un geste de l'utilisateur.
 */
let hapticLabel = null;
export function tick() {
  if (navigator.vibrate) {
    navigator.vibrate(8);
    return;
  }
  if (!hapticLabel) {
    hapticLabel = document.createElement('label');
    hapticLabel.setAttribute('aria-hidden', 'true');
    hapticLabel.style.cssText = 'position:fixed;left:-99px;width:1px;height:1px;overflow:hidden;opacity:0';
    hapticLabel.innerHTML = '<input type="checkbox" switch tabindex="-1">';
    document.body.append(hapticLabel);
  }
  hapticLabel.click();
}

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let toastTimer = 0;
export function toast(text) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.append(el);
  }
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ------------------------------------------------------------------ */
/* Feuille du bas : un seul exemplaire, dont on remplace le contenu.   */
/* ------------------------------------------------------------------ */

let onSheetClose = null;

function sheetRoot() {
  let root = $('.sheet-root');
  if (root) return root;
  root = document.createElement('div');
  root.className = 'sheet-root';
  root.innerHTML = '<div class="scrim" data-sheet-close></div><section class="sheet" role="dialog" aria-modal="true"><div class="grip" aria-hidden="true"></div><div class="sheet-body"></div></section>';
  document.body.append(root);
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-sheet-close]')) closeSheet();
  });
  dragToDismiss(root.querySelector('.sheet'));
  // Le clavier de l'iPhone recouvre le bas de l'écran : la feuille remonte d'autant.
  const vv = window.visualViewport;
  if (vv) {
    const fit = () => document.documentElement.style.setProperty('--kb', `${Math.max(0, window.innerHeight - vv.height - vv.offsetTop)}px`);
    vv.addEventListener('resize', fit);
    vv.addEventListener('scroll', fit);
  }
  return root;
}

/** Ouvre la feuille avec ce HTML ; `mount(body)` branche les écouteurs. */
export function openSheet(html, { mount, onClose, label } = {}) {
  const root = sheetRoot();
  const body = root.querySelector('.sheet-body');
  const sheet = root.querySelector('.sheet');
  if (root.classList.contains('open') && onSheetClose) onSheetClose();
  onSheetClose = onClose ?? null;
  body.innerHTML = html;
  body.scrollTop = 0;
  sheet.setAttribute('aria-label', label ?? '');
  sheet.style.transform = '';
  root.classList.add('open');
  document.documentElement.classList.add('sheet-open');
  mount?.(body);
  return body;
}

export function closeSheet() {
  const root = $('.sheet-root');
  if (!root?.classList.contains('open')) return;
  root.classList.remove('open');
  document.documentElement.classList.remove('sheet-open');
  document.activeElement?.blur?.();
  const cb = onSheetClose;
  onSheetClose = null;
  cb?.();
}

export const sheetIsOpen = () => !!$('.sheet-root.open');

/** Tirer la feuille vers le bas la referme, comme sur iOS. */
function dragToDismiss(sheet) {
  let startY = 0;
  let dy = 0;
  let dragging = false;
  sheet.addEventListener('pointerdown', (e) => {
    const body = sheet.querySelector('.sheet-body');
    const onGrip = e.target.closest('.grip, .sheet-head');
    if (!onGrip && (body.scrollTop > 0 || e.target.closest('input, textarea, button, select, a'))) return;
    dragging = true;
    startY = e.clientY;
    dy = 0;
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dy = Math.max(0, e.clientY - startY);
    if (dy > 4) {
      sheet.classList.add('dragging');
      sheet.style.transform = `translateY(${dy}px)`;
    }
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    sheet.classList.remove('dragging');
    sheet.style.transform = '';
    if (dy > 110) closeSheet();
  };
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
}
