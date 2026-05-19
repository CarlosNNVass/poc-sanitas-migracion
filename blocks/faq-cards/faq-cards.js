export default function decorate(block) {
  const rows = [...block.children];

  const grid = document.createElement('div');
  grid.className = 'faq-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const titleCell = cells[0];
    const descCell = cells[1];
    const modalCell = cells[2];

    row.className = 'faq-cards-card';
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');

    const header = document.createElement('div');
    header.className = 'faq-cards-header';

    if (titleCell) {
      titleCell.className = 'faq-cards-title';
    }

    const icon = document.createElement('span');
    icon.className = 'faq-cards-icon';
    icon.textContent = '+';

    header.append(titleCell, icon);

    if (descCell) {
      descCell.className = 'faq-cards-desc';
    }

    if (modalCell) {
      modalCell.className = 'faq-cards-modal-content';
      modalCell.style.display = 'none';
    }

    row.innerHTML = '';
    row.append(header, descCell, modalCell);

    row.addEventListener('click', () => {
      const modalHTML = modalCell?.innerHTML?.trim() || '';
      if (!modalHTML) return;

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
      content.className = 'faq-cards-modal-body';
      content.innerHTML = modalHTML;

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

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      }
    });

    grid.append(row);
  });

  block.innerHTML = '';
  block.append(grid);
}
