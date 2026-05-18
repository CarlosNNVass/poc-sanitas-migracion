export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const layout = document.createElement('div');
  layout.className = 'coverage-section-layout';

  const accordion = document.createElement('div');
  accordion.className = 'coverage-section-accordion';

  const sidebar = document.createElement('div');
  sidebar.className = 'coverage-section-sidebar';

  let isSidebar = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const type = cells[0]?.textContent?.trim().toLowerCase();

    if (type === '---') {
      isSidebar = true;
      return;
    }

    if (!isSidebar) {
      const icon = cells[0]?.textContent?.trim() || '';
      const title = cells[1]?.textContent?.trim() || '';
      const content = cells[2]?.innerHTML?.trim() || cells[2]?.textContent?.trim() || '';

      const item = document.createElement('div');
      item.className = 'coverage-accordion-item';

      const header = document.createElement('div');
      header.className = 'coverage-accordion-header';

      if (icon && icon !== '---') {
        const iconEl = document.createElement('span');
        iconEl.className = `coverage-accordion-icon ${icon}`;
        header.append(iconEl);
      }

      const titleEl = document.createElement('span');
      titleEl.className = 'coverage-accordion-title';
      titleEl.textContent = title;
      header.append(titleEl);

      const chevron = document.createElement('span');
      chevron.className = 'coverage-accordion-chevron';
      header.append(chevron);

      const panel = document.createElement('div');
      panel.className = 'coverage-accordion-panel';
      panel.innerHTML = content;

      header.addEventListener('click', () => {
        const wasOpen = item.classList.contains('is-open');
        accordion.querySelectorAll('.coverage-accordion-item').forEach((i) => i.classList.remove('is-open'));
        if (!wasOpen) item.classList.add('is-open');
      });

      item.append(header, panel);
      accordion.append(item);
    } else {
      const iconImg = cells[0]?.querySelector('picture') || cells[0]?.querySelector('img');
      const title = cells[1]?.textContent?.trim() || '';
      const text = cells[2]?.textContent?.trim() || '';

      const card = document.createElement('div');
      card.className = 'coverage-info-card';

      if (iconImg) {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'coverage-info-icon';
        iconWrapper.append(iconImg.cloneNode(true));
        card.append(iconWrapper);
      }

      if (title) {
        const titleEl = document.createElement('h3');
        titleEl.className = 'coverage-info-title';
        titleEl.textContent = title;
        card.append(titleEl);
      }

      if (text) {
        const textEl = document.createElement('p');
        textEl.className = 'coverage-info-text';
        textEl.textContent = text;
        card.append(textEl);
      }

      sidebar.append(card);
    }
  });

  if (accordion.children.length > 0) {
    accordion.querySelector('.coverage-accordion-item')?.classList.add('is-open');
  }

  layout.append(accordion, sidebar);
  block.append(layout);
}
