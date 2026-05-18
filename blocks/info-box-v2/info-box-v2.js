export default function decorate(block) {
  const items = [...block.children];
  block.innerHTML = '';

  items.forEach((item) => {
    const cells = [...item.children];
    const iconClass = cells[0]?.textContent?.trim() || '';
    const title = cells[1]?.textContent?.trim() || '';
    const text = cells[2]?.innerHTML?.trim() || cells[2]?.textContent?.trim() || '';

    const card = document.createElement('div');
    card.className = 'info-box-v2-card';

    if (iconClass) {
      const iconEl = document.createElement('i');
      iconEl.className = `info-box-v2-icon ${iconClass}`;
      card.append(iconEl);
    }

    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'info-box-v2-title';
      titleEl.textContent = title;
      card.append(titleEl);
    }

    if (text) {
      const textEl = document.createElement('p');
      textEl.className = 'info-box-v2-text';
      textEl.innerHTML = text;
      card.append(textEl);
    }

    block.append(card);
  });
}
