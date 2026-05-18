export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'faq-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent?.trim() || '';
    const description = cells[1]?.textContent?.trim() || '';
    const modalContent = cells[2]?.innerHTML?.trim() || '';

    const card = document.createElement('div');
    card.className = 'faq-cards-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

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

    card.addEventListener('click', () => {
      const dialog = document.createElement('dialog');
      dialog.className = 'faq-cards-modal';

      const closeBtn = document.createElement('button');
      closeBtn.className = 'faq-cards-modal-close';
      closeBtn.textContent = '×';
      closeBtn.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
      });

      const content = document.createElement('div');
      content.className = 'faq-cards-modal-content';
      content.innerHTML = modalContent;

      dialog.append(closeBtn, content);
      document.body.append(dialog);
      dialog.showModal();

      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
          dialog.close();
          dialog.remove();
        }
      });
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    grid.append(card);
  });

  block.append(grid);
}
