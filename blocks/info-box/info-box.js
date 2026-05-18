export default function decorate(block) {
  const items = [...block.children];
  block.innerHTML = '';

  items.forEach((item) => {
    const cells = [...item.children];
    const icon = cells[0]?.querySelector('picture') || cells[0]?.querySelector('img');
    const title = cells[1]?.textContent?.trim() || '';
    const text = cells[2]?.textContent?.trim() || '';

    const card = document.createElement('div');
    card.className = 'info-box-card';

    if (icon) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'info-box-icon';
      iconWrapper.append(icon.cloneNode(true));
      card.append(iconWrapper);
    }

    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'info-box-title';
      titleEl.textContent = title;
      card.append(titleEl);
    }

    if (text) {
      const textEl = document.createElement('p');
      textEl.className = 'info-box-text';
      textEl.textContent = text;
      card.append(textEl);
    }

    block.append(card);
  });
}
