export default function decorate(block) {
  block.classList.add('infocards');

  const items = [...block.children];
  if (!items.length) return;

  const isGradient = block.classList.contains('gradient');

  items.forEach((item, index) => {
    item.classList.add('infocards-item');

    if (isGradient) {
      item.classList.add(`infocards-item-tone-${(index % 3) + 1}`);
    }

    const cells = [...item.children];
    if (!cells.length) return;

    // Orden real del DOM: title, description, link (con texto incluido), icon
    const [titleCell, descriptionCell, linkCell, iconCell] = cells;

    const titleText = titleCell ? titleCell.textContent.trim() : '';
    const descriptionHTML = descriptionCell ? descriptionCell.innerHTML : '';
    const iconValue = (iconCell?.textContent || '').trim();

    // Extraer URL y texto del anchor existente
    let linkUrl = '';
    let linkText = 'Más información';
    if (linkCell) {
      const anchor = linkCell.querySelector('a');
      if (anchor) {
        linkUrl = anchor.getAttribute('href') || '';
        linkText = anchor.textContent.trim() || 'Más información';
      }
    }

    // ----- Construcción -----
    const header = document.createElement('div');
    header.classList.add('infocards-header');
    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('infocards-title');
    const h3 = document.createElement('h3');
    h3.textContent = titleText;
    titleWrapper.append(h3);
    header.append(titleWrapper);

    const body = document.createElement('div');
    body.classList.add('infocards-body');
    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('infocards-description');
    descriptionWrapper.innerHTML = descriptionHTML;
    body.append(descriptionWrapper);

    const footer = document.createElement('div');
    footer.classList.add('infocards-footer');

    if (linkUrl) {
      const link = document.createElement('a');
      link.classList.add('infocards-link');
      link.href = linkUrl;
      link.textContent = linkText;

      const arrow = document.createElement('span');
      arrow.classList.add('infocards-link-arrow');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '›';
      link.append(arrow);

      footer.append(link);
    }

    if (!isGradient && iconValue) {
      const iconWrapper = document.createElement('div');
      iconWrapper.classList.add('infocards-icon', iconValue);
      footer.append(iconWrapper);
    }

    item.replaceChildren(header, body, footer);
  });
}