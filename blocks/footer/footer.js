import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com/profile.php?id=61578936104186', label: 'Facebook', icon: 'facebookLinear' },
  { href: '//twitter.com/Sanitas', label: 'Twitter', icon: 'twitterLinear' },
  { href: 'https://www.instagram.com/sanitascampus/', label: 'Instagram', icon: 'instagramLinear' },
  { href: '//www.youtube.com/user/Sanitastv', label: 'YouTube', icon: 'youtubeLinear' },
  { href: 'https://www.linkedin.com/company/sanitas', label: 'LinkedIn', icon: 'linkedinLinear' },
  { href: 'https://www.tiktok.com/@sanitas?lang=es', label: 'TikTok', icon: 'tiktokSolid' },
];

const LEGAL_LINKS = [
  { href: 'https://www.sanitas.es/seguros/accesibilidad', text: 'Accesibilidad' },
  { href: 'https://www.sanitas.es/seguros/aviso-legal', text: 'Aviso legal' },
  { href: 'https://www.sanitas.es/seguros/mapa_web', text: 'Mapa Web' },
  { href: 'https://www.sanitas.es/seguros/politica-de-cookies', text: 'Política de cookies' },
  { href: 'https://www.sanitas.es/seguros/politica-privacidad', text: 'Política de privacidad' },
];

const SPONSORSHIP = [
  {
    href: 'https://corporativo.sanitas.es/quienes-somos/nuestros-aliados/proveedor-medico-real-madrid/',
    src: 'https://www.sanitas.es/empresas/media/sane/imagen/frwk_logorealmadrid/logo-real-madrid.svg',
    alt: 'Logo Real Madrid',
    text: 'Real Madrid Club de Fútbol',
  },
  {
    href: 'https://corporativo.sanitas.es/sanitas-renueva-como-proveedor-medico-oficial-del-comite-olimpico-espanol-y-del-comite-paralimpico-espanol/',
    src: 'https://www.sanitas.es/empresas/media/sane/imagen/frwk_logocomiteparalimpicoesp/logo-comite-paralimpico-espanol.svg',
    alt: 'Logo Comité Paralímpico Español',
    text: 'Comité Paralímpico Español',
  },
  {
    href: 'https://corporativo.sanitas.es/sanitas-renueva-como-proveedor-medico-oficial-del-comite-olimpico-espanol-y-del-comite-paralimpico-espanol/',
    src: 'https://www.sanitas.es/empresas/media/sane/imagen/frwk_logocomiteolimpicoesp/logo-comite-olimpico-espanol-blanco.svg',
    alt: 'Logo Comité Olímpico Español',
    text: 'Comité Olímpico Español',
  },
];

// Builds a nav column <ul> from a fragment section.
// First heading → column title; <a> elements in the section → link items.
function buildNavColumn(section) {
  const col = document.createElement('ul');
  col.className = 'm-list -definitionList u-flex__flexColumn a-colLg__fillAuto';

  const heading = section.querySelector('h2, h3, h4, h5, h6');
  if (heading) {
    const dt = document.createElement('li');
    dt.className = 'm-list__dt';
    dt.textContent = heading.textContent.trim();
    col.append(dt);
  }

  section.querySelectorAll('a').forEach((anchor) => {
    const dd = document.createElement('li');
    dd.className = 'm-list__dd';
    const a = document.createElement('a');
    a.href = anchor.href;
    a.textContent = anchor.textContent.trim();
    a.tabIndex = 0;
    try {
      if (new URL(anchor.href).host !== window.location.host) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    } catch (e) { /* relative URL */ }
    dd.append(a);
    col.append(dd);
  });

  return col;
}

// Row 1: logo + mobile trigger + nav columns (contributable from fragment)
function buildMainRow(fragment) {
  const row = document.createElement('div');
  row.className = 'm-row u-flex__wra u-position__relative';

  // Logo
  const logoCol = document.createElement('div');
  logoCol.className = 'a-colXs__12 a-colLg__2 u-textXs__alignCenter u-textLg__alignLeft';
  logoCol.innerHTML = `
    <a class="a-logo" accesskey="a" href="https://www.sanitas.es">
      <img src="https://www.sanitas.es/media/smay/imagen/svg_logosanitaspie/logo-sanitas-footer.svg"
           alt="Sanitas, parte de Bupa" loading="lazy">
    </a>`;
  row.append(logoCol);

  // Mobile accordion trigger
  const trigger = document.createElement('button');
  trigger.className = 'o-mainFooter__trigger';
  trigger.innerHTML = 'Accesos Directos <i class="a-icon__arrowDownMedium" aria-hidden="true"></i>';
  row.append(trigger);

  // Nav columns container
  const navMenu = document.createElement('div');
  navMenu.className = 'o-mainFooter__mainMenu a-colXs__12 a-colLg__10 u-flexXs__flexColumn u-flexLg__flexRow u-paddingHorizontal__sm u-noPaddingHorizontalLg';
  navMenu.id = 'footerLinks';

  // Each section in the fragment = one nav column
  [...fragment.querySelectorAll('.section')].forEach((section) => {
    navMenu.append(buildNavColumn(section));
  });

  row.append(navMenu);

  trigger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('-open');
    trigger.setAttribute('aria-expanded', open);
  });

  return row;
}

// Row 2: sponsorship logos
function buildSponsorRow() {
  const row = document.createElement('div');
  row.className = 'm-row u-position__relative';

  const container = document.createElement('div');
  container.className = 'o-mainFooter__sponsorshipLinks a-col__12 u-flex u-flex__wrap u-noPaddingHorizontalLg u-paddingVertical__lg u-marginBottom__sm u-flexLg__justifyContentBetween';
  container.id = 'sponsorshipLinks';

  const label = document.createElement('div');
  label.className = 'm-list -definitionList a-colXs__12 a-colLg__3 u-noPaddingLeft u-flex__justifyContentCenter u-flexLg__justifyContentStart';
  label.innerHTML = '<div class="m-list__dt">Sanitas con el deporte. Proveedor&nbsp;Médico&nbsp;Oficial:</div>';
  container.append(label);

  SPONSORSHIP.forEach(({ href, src, alt, text }) => {
    const col = document.createElement('div');
    col.className = 'm-list -definitionList u-flex__flexColumn a-colXs__6 a-colLg__2 u-paddingBottom__lg u-noPaddingBottomLg';
    col.innerHTML = `
      <a class="u-flex u-flex__flexColumn u-text__alignCenter" href="${href}" target="_blank" rel="noopener noreferrer">
        <div class="u-text__alignCenter u-marginBottom__xs">
          <img alt="${alt}" class="a-image__sponsorshipLinks" loading="lazy" src="${src}">
        </div>
        <span class="a-textSize__xs">${text}</span>
      </a>`;
    container.append(col);
  });

  row.append(container);
  return row;
}

// Row 3: social icons + legal links
function buildBottomRow() {
  const row = document.createElement('div');
  row.className = 'm-row u-flexLg__alignItemsMiddle';

  const socialList = document.createElement('ul');
  socialList.className = 'm-list -horizontalLinksList -socialLinks a-col__12 a-colLg__auto u-flexLg__last u-flexLg__justifySelfEndHorizontal';
  socialList.setAttribute('role', 'menu');
  socialList.setAttribute('aria-label', 'Menú Footer Redes Sociales');

  SOCIAL_LINKS.forEach(({ href, label, icon }) => {
    const li = document.createElement('li');
    li.className = 'm-list__item u-widthAuto';
    li.setAttribute('role', 'menuitem');
    li.innerHTML = `<a href="${href}" tabindex="0" title="Sanitas en ${label} - abre ventana nueva" aria-label="Sanitas en ${label} - abre ventana nueva">
      <i aria-hidden="true" class="o-mainFooter__socialIcon a-icon__${icon}"></i>
    </a>`;
    socialList.append(li);
  });

  const legalList = document.createElement('ul');
  legalList.className = 'm-list -horizontalLinksList -legalLinks a-col__12 a-colLg__auto';
  legalList.setAttribute('role', 'menu');
  legalList.setAttribute('aria-label', 'Menu Footer Legales');

  const copyright = document.createElement('li');
  copyright.className = 'm-list__item u-widthAuto';
  copyright.setAttribute('role', 'menuitem');
  copyright.textContent = `© ${new Date().getFullYear()} Sanitas.es`;
  legalList.append(copyright);

  LEGAL_LINKS.forEach(({ href, text }) => {
    const li = document.createElement('li');
    li.className = 'm-list__item u-widthAuto';
    li.setAttribute('role', 'menuitem');
    li.innerHTML = `<a href="${href}" tabindex="0">${text}</a>`;
    legalList.append(li);
  });

  row.append(socialList, legalList);
  return row;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'o-mainFooter o-container u-bgColorPrimary__navy -uniformColor';

  wrapper.append(buildMainRow(fragment));
  wrapper.append(buildSponsorRow());
  wrapper.append(buildBottomRow());

  block.append(wrapper);
}
