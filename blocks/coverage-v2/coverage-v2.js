export default function decorate(block) {
  const rows = [...block.children];
  const layout = document.createElement('div');
  layout.className = 'coverage-v2-layout';

  const accordionCol = document.createElement('div');
  accordionCol.className = 'coverage-v2-accordion';

  const cardsCol = document.createElement('div');
  cardsCol.className = 'coverage-v2-cards';

  let isSidebar = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const titleCell = cells[1];
    const contentCell = cells[2];

    const iconText = iconCell?.textContent?.trim() || '';

    if (iconText === '---') {
      isSidebar = true;
      row.remove();
      return;
    }

    if (!isSidebar) {
      row.className = 'coverage-v2-item';

      const header = document.createElement('div');
      header.className = 'coverage-v2-header';

      if (iconCell) {
        iconCell.className = `coverage-v2-icon ${iconText}`;
      }

      if (titleCell) {
        titleCell.className = 'coverage-v2-title';
      }

      const chevron = document.createElement('span');
      chevron.className = 'coverage-v2-chevron';

      header.append(iconCell, titleCell, chevron);

      if (contentCell) {
        contentCell.className = 'coverage-v2-panel';
      }

      row.innerHTML = '';
      row.append(header, contentCell);

      header.addEventListener('click', () => {
        const wasOpen = row.classList.contains('is-open');
        accordionCol.querySelectorAll('.coverage-v2-item').forEach((i) => i.classList.remove('is-open'));
        if (!wasOpen) row.classList.add('is-open');
      });

      accordionCol.append(row);
    } else {
      row.className = 'coverage-v2-card';

      if (iconCell) {
        iconCell.className = 'coverage-v2-card-icon';
        const img = iconCell.querySelector('picture') || iconCell.querySelector('img');
        if (!img) {
          const iconEl = document.createElement('span');
          iconEl.className = iconText;
          iconCell.textContent = '';
          iconCell.append(iconEl);
        }
      }

      if (titleCell) {
        titleCell.className = 'coverage-v2-card-title';
      }

      if (contentCell) {
        contentCell.className = 'coverage-v2-card-text';
      }

      cardsCol.append(row);
    }
  });

  if (accordionCol.children.length > 0) {
    accordionCol.querySelector('.coverage-v2-item')?.classList.add('is-open');
  }

  layout.append(accordionCol, cardsCol);
  block.innerHTML = '';
  block.append(layout);
}
