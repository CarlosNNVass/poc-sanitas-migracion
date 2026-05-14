const ICONS = {
  medico: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="7" cy="3" r="1" fill="currentColor" stroke="none"/>
    <circle cx="17" cy="3" r="1" fill="currentColor" stroke="none"/>
    <path d="M7 4 Q7 12 12 12"/>
    <path d="M17 4 Q17 12 12 12"/>
    <path d="M12 12 L12 17 Q12 21 16 21"/>
    <circle cx="16" cy="21" r="2.5"/>
  </svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="7.5"/>
    <line x1="17.3" y1="17.3" x2="22" y2="22"/>
  </svg>`,
};

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: Background image from DAM
  const imageRow = rows[0];
  const imageEl = imageRow?.querySelector('img');

  // Row 1: Info card text (richtext)
  const infoRow = rows[1];
  const infoText = infoRow?.children[0]?.innerHTML || '';

  // Row 2: Client card — title | button text | link
  const clientRow = rows[2];
  const clientCells = clientRow ? [...clientRow.children] : [];
  const clientTitle = clientCells[0]?.textContent?.trim() || 'Soy cliente';
  const clientBtnText = clientCells[1]?.textContent?.trim() || 'Ver mi cuadro médico';
  const clientHref = clientCells[2]?.querySelector('a')?.href || clientCells[2]?.textContent?.trim() || '#';

  // Row 3: Non-client card — title | button text | link
  const nonClientRow = rows[3];
  const nonClientCells = nonClientRow ? [...nonClientRow.children] : [];
  const nonClientTitle = nonClientCells[0]?.textContent?.trim() || 'No soy cliente';
  const nonClientBtnText = nonClientCells[1]?.textContent?.trim() || 'Cuadro médico general';
  const nonClientHref = nonClientCells[2]?.querySelector('a')?.href || nonClientCells[2]?.textContent?.trim() || '#';

  const wrapper = document.createElement('div');
  wrapper.className = 'clients-data__wrapper';

  // Image background
  const mapEl = document.createElement('div');
  mapEl.className = 'clients-data__map';
  if (imageEl) {
    imageEl.loading = 'lazy';
    imageEl.removeAttribute('width');
    imageEl.removeAttribute('height');
    mapEl.appendChild(imageEl);
  }
  wrapper.appendChild(mapEl);

  // Cards container
  const cards = document.createElement('div');
  cards.className = 'clients-data__cards';

  // — Info card —
  const infoCard = document.createElement('div');
  infoCard.className = 'clients-data__card clients-data__card--info';

  const iconWrap = document.createElement('span');
  iconWrap.className = 'clients-data__card-icon';
  iconWrap.innerHTML = ICONS.medico;

  const textWrap = document.createElement('div');
  textWrap.className = 'clients-data__card-text';
  textWrap.innerHTML = infoText;

  infoCard.append(iconWrap, textWrap);
  cards.appendChild(infoCard);

  // — Client card —
  const clientCard = document.createElement('div');
  clientCard.className = 'clients-data__card clients-data__card--client';

  const clientTitleEl = document.createElement('h3');
  clientTitleEl.className = 'clients-data__card-title';
  clientTitleEl.textContent = clientTitle;

  const clientBtn = document.createElement('a');
  clientBtn.className = 'clients-data__card-btn';
  clientBtn.href = clientHref;

  const clientIconSpan = document.createElement('span');
  clientIconSpan.className = 'clients-data__btn-icon';
  clientIconSpan.innerHTML = ICONS.user;

  const clientBtnTextSpan = document.createElement('span');
  clientBtnTextSpan.textContent = clientBtnText;

  clientBtn.append(clientIconSpan, clientBtnTextSpan);
  clientCard.append(clientTitleEl, clientBtn);
  cards.appendChild(clientCard);

  // — Non-client card —
  const nonClientCard = document.createElement('div');
  nonClientCard.className = 'clients-data__card clients-data__card--nonclient';

  const nonClientTitleEl = document.createElement('h3');
  nonClientTitleEl.className = 'clients-data__card-title';
  nonClientTitleEl.textContent = nonClientTitle;

  const nonClientBtn = document.createElement('a');
  nonClientBtn.className = 'clients-data__card-btn';
  nonClientBtn.href = nonClientHref;

  const nonClientIconSpan = document.createElement('span');
  nonClientIconSpan.className = 'clients-data__btn-icon';
  nonClientIconSpan.innerHTML = ICONS.search;

  const nonClientBtnTextSpan = document.createElement('span');
  nonClientBtnTextSpan.textContent = nonClientBtnText;

  nonClientBtn.append(nonClientIconSpan, nonClientBtnTextSpan);
  nonClientCard.append(nonClientTitleEl, nonClientBtn);
  cards.appendChild(nonClientCard);

  wrapper.appendChild(cards);
  block.replaceChildren(wrapper);
}
