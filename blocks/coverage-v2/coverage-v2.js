export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const layout = document.createElement('div');
  layout.className = 'coverage-v2-layout';

  const accordionCol = document.createElement('div');
  accordionCol.className = 'coverage-v2-accordion';

  const cardsCol = document.createElement('div');
  cardsCol.className = 'coverage-v2-cards';

  let isSidebar = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const col1 = cells[0]?.textContent?.trim() || '';
    const col2 = cells[1]?.textContent?.trim() || '';
    const col3 = cells[2]?.innerHTML?.trim() || cells[2]?.textContent?.trim() || '';

    if (col1 === '---') {
      isSidebar = true;
      return;
    }

    if (!isSidebar) {
      const item = document.createElement('div');
      item.className = 'coverage-v2-item';

      const header = document.createElement('div');
      header.className = 'coverage-v2-header';

      if (col1) {
        const iconEl = document.createElement('span');
        iconEl.className = `coverage-v2-icon ${col1}`;
        header.append(iconEl);
      }

      const titleEl = document.createElement('span');
      titleEl.className = 'coverage-v2-title';
      titleEl.textContent = col2;
      header.append(titleEl);

      const chevron = document.createElement('span');
      chevron.className = 'coverage-v2-chevron';
      header.append(chevron);

      const panel = document.createElement('div');
      panel.className = 'coverage-v2-panel';
      panel.innerHTML = col3;

      header.addEventListener('click', () => {
        const wasOpen = item.classList.contains('is-open');
        accordionCol.querySelectorAll('.coverage-v2-item').forEach((i) => i.classList.remove('is-open'));
        if (!wasOpen) item.classList.add('is-open');
      });

      item.append(header, panel);
      accordionCol.append(item);
    } else {
      const card = document.createElement('div');
      card.className = 'coverage-v2-card';

      if (col1) {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'coverage-v2-card-icon';
        const img = cells[0]?.querySelector('picture') || cells[0]?.querySelector('img');
        if (img) {
          iconWrapper.append(img.cloneNode(true));
        } else {
          const iconEl = document.createElement('span');
          iconEl.className = col1;
          iconWrapper.append(iconEl);
        }
        card.append(iconWrapper);
      }

      if (col2) {
        const titleEl = document.createElement('h3');
        titleEl.className = 'coverage-v2-card-title';
        titleEl.textContent = col2;
        card.append(titleEl);
      }

      if (col3) {
        const textEl = document.createElement('p');
        textEl.className = 'coverage-v2-card-text';
        textEl.innerHTML = col3;
        card.append(textEl);
      }

      cardsCol.append(card);
    }
  });

  if (accordionCol.children.length > 0) {
    accordionCol.querySelector('.coverage-v2-item')?.classList.add('is-open');
  }

  layout.append(accordionCol, cardsCol);
  block.append(layout);
}
