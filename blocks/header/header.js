import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const LOGO_SRC = 'https://www.sanitas.es/media/smay/imagen/svg_logosanitas_2023/logo-container.svg';
const LOGO_ALT = 'Sanitas, parte de Bupa';

const isDesktop = window.matchMedia('(min-width: 1024px)');

// Section 0 → masthead tabs (ul of links)
function buildMasthead(section) {
  const masthead = document.createElement('div');
  masthead.className = 'o-mainHeader__mastHead';

  const tabs = document.createElement('ul');
  tabs.className = 'm-mastHead__tabs';
  tabs.setAttribute('role', 'menubar');

  [...(section?.querySelectorAll('a') ?? [])].forEach((a, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'menuitem');
    if (i === 0) li.classList.add('-isActive');
    const link = document.createElement('a');
    link.href = a.href;
    link.textContent = a.textContent.trim();
    li.append(link);
    tabs.append(li);
  });

  const actions = document.createElement('div');
  actions.className = 'm-mastHead__actions';
  actions.innerHTML = `
    <a class="m-mastHead__call" href="/mi-sanitas"></a>
    <a class="m-mastHead__search" href="/mi-sanitas"></a>
    <a class="m-mastHead__login" href="/mi-sanitas">
      <i class="a-icon__userSolid" aria-hidden="true"></i>
      <span>Mi Sanitas</span>
    </a>`;

  masthead.append(tabs, actions);
  return masthead;
}

// Section 1 → logo (a link, text replaced with SVG)
function buildLogo(section) {
  const href = section?.querySelector('a')?.href || '/';
  const a = document.createElement('a');
  a.className = 'a-logo';
  a.href = href;
  a.setAttribute('accesskey', 'a');
  a.setAttribute('aria-label', LOGO_ALT);
  a.innerHTML = `<img src="${LOGO_SRC}" alt="${LOGO_ALT}" loading="eager" width="120" height="40">`;
  return a;
}

// Submenu built from a nested <ul>
function buildSubMenu(ul) {
  const subNav = document.createElement('div');
  subNav.className = 'm-subNavMenu';

  const inner = document.createElement('ul');
  inner.className = 'm-subNavMenu__ul';
  inner.setAttribute('role', 'menu');

  [...ul.querySelectorAll(':scope > li')].forEach((li) => {
    const a = li.querySelector('a');
    if (!a) return;
    const item = document.createElement('li');
    item.className = 'm-subNavMenu__item';
    item.setAttribute('role', 'menuitem');
    const link = document.createElement('a');
    link.className = 'm-subNavMenu__link';
    link.href = a.href;
    link.textContent = a.textContent.trim();
    try {
      if (new URL(a.href).host !== window.location.host) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    } catch (e) { /* relative */ }
    item.append(link);
    inner.append(item);
  });

  subNav.append(inner);
  return subNav;
}

// Section 2 → primary nav (top-level ul, nested ul = dropdown)
function buildNav(section) {
  const nav = document.createElement('nav');
  nav.id = 'main-nav';
  nav.className = 'm-primaryNavMenu';
  nav.setAttribute('role', 'menubar');
  nav.setAttribute('aria-label', 'Menú principal');

  const ul = document.createElement('ul');
  ul.className = 'm-primaryNavMenu__ul';
  ul.setAttribute('role', 'menu');

  const topItems = section
    ? [...section.querySelectorAll(':scope .default-content-wrapper > ul > li')]
    : [];

  topItems.forEach((li) => {
    const item = document.createElement('li');
    item.className = 'm-primaryNavMenu__item';
    item.setAttribute('role', 'menuitem');

    // Top-level link: either <a> directly or plain text node
    const srcA = li.querySelector(':scope > a');
    const link = document.createElement('a');
    link.className = 'm-primaryNavMenu__link';
    link.href = srcA?.href || '#';
    link.textContent = (srcA ?? li).childNodes[0]?.textContent?.trim() || '';

    item.append(link);

    const subUl = li.querySelector(':scope > ul');
    if (subUl) {
      item.classList.add('-hasSubmenu');
      item.setAttribute('aria-expanded', 'false');
      item.append(buildSubMenu(subUl));

      item.addEventListener('click', (e) => {
        if (!isDesktop.matches) return;
        e.stopPropagation();
        const open = item.getAttribute('aria-expanded') === 'true';
        ul.querySelectorAll('.-hasSubmenu').forEach((i) => i.setAttribute('aria-expanded', 'false'));
        if (!open) item.setAttribute('aria-expanded', 'true');
      });
    }

    ul.append(item);
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    ul.querySelectorAll('.-hasSubmenu').forEach((i) => i.setAttribute('aria-expanded', 'false'));
  });

  nav.append(ul);
  return nav;
}

// Section 3 → CTA button (first link in section)
function buildCta(section) {
  const a = section?.querySelector('a');
  if (!a) return null;
  const cta = document.createElement('a');
  cta.className = 'a-button insurance';
  cta.href = a.href;
  cta.textContent = a.textContent.trim();
  return cta;
}

function buildHamburger(navEl) {
  const btn = document.createElement('button');
  btn.className = 'a-menuMobile';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'main-nav');
  btn.setAttribute('aria-label', 'Abrir menú');
  btn.innerHTML = `
    <span class="a-menuMobile__bar"></span>
    <span class="a-menuMobile__bar"></span>
    <span class="a-menuMobile__bar"></span>`;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
    navEl.classList.toggle('-open', !open);
    document.body.style.overflowY = open ? '' : 'hidden';
  });

  return btn;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const sections = [...fragment.querySelectorAll('.section')];

  block.textContent = '';

  const header = document.createElement('div');
  header.className = 'o-mainHeader';

  // Masthead top bar
  header.append(buildMasthead(sections[0]));

  // Content row: logo + hamburger + nav + cta
  const contentHeader = document.createElement('div');
  contentHeader.className = 'o-mainHeader__contentHeader';

  const logo = buildLogo(sections[1]);
  const navEl = buildNav(sections[2]);
  const hamburger = buildHamburger(navEl);
  const cta = buildCta(sections[3]);

  contentHeader.append(logo, hamburger, navEl);
  if (cta) contentHeader.append(cta);

  header.append(contentHeader);
  block.append(header);

  // Reset mobile state on desktop
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      navEl.classList.remove('-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflowY = '';
    }
  });
}
