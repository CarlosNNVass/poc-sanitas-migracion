export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const titleText = rows[0]?.querySelector('div:last-child')?.textContent?.trim() || rows[0]?.textContent?.trim() || '';
  const bodyText = rows[1]?.querySelector('div:last-child')?.textContent?.trim() || rows[1]?.textContent?.trim() || '';
  const promoText = rows[2]?.querySelector('div:last-child')?.textContent?.trim() || rows[2]?.textContent?.trim() || '';

  if (titleText) {
    const titleEl = document.createElement('div');
    titleEl.className = 'promotion-banner-v2-title';
    titleEl.textContent = titleText;
    block.append(titleEl);
  }

  const container = document.createElement('div');
  container.className = 'promotion-banner-v2-container';

  if (bodyText) {
    const bodyEl = document.createElement('div');
    bodyEl.className = 'promotion-banner-v2-body';
    bodyEl.textContent = bodyText;
    container.append(bodyEl);
  }

  if (promoText) {
    const promoEl = document.createElement('div');
    promoEl.className = 'promotion-banner-v2-promo';
    const icon = document.createElement('span');
    icon.className = 'promotion-banner-v2-promo-icon';
    icon.textContent = 'ℹ';
    const text = document.createElement('span');
    text.className = 'promotion-banner-v2-promo-text';
    text.textContent = promoText;
    promoEl.append(icon, text);
    container.append(promoEl);
  }

  block.append(container);
}
