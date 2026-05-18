import { createModal } from '../../scripts/modal.js';

export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'faq-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent?.trim() || '';
    const description = cells[1]?.textContent?.trim() || '';
    const modalContent = cells[2]?.innerHTML?.trim() || cells[2]?.textContent?.trim() || '';

    const card = document.createElement('div');
    card.className = 'faq-cards-card';

    const header = document.createElement('div');
    header.className = 'faq-cards-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'faq-cards-title';
    titleEl.textContent = title;

    const icon = document.createElement('span');
    icon.className = 'faq-cards-icon';
    icon.textContent = '+';

    header.append(titleEl, icon);

    const desc = document.createElement('p');
    desc.className = 'faq-cards-desc';
    desc.textContent = description;

    card.append(header, desc);

    if (modalContent) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        createModal(title, modalContent);
      });
    }

    grid.append(card);
  });

  block.append(grid);
}
