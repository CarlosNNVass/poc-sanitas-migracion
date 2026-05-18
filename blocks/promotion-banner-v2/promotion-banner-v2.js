export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];
  const titleText = cells[0]?.textContent?.trim() || '';
  const bodyText = cells[1]?.textContent?.trim() || '';
  const promoText = cells[2]?.textContent?.trim() || '';

  block.innerHTML = '';

  if (titleText) {
    const titleEl = document.createElement('div');
    titleEl.className = 'promotion-banner-v2-title';
    titleEl.textContent = titleText;
    block.append(titleEl);
  }

  if (bodyText) {
    const bodyEl = document.createElement('div');
    bodyEl.className = 'promotion-banner-v2-body';
    bodyEl.textContent = bodyText;
    block.append(bodyEl);
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
    block.append(promoEl);
  }
}
