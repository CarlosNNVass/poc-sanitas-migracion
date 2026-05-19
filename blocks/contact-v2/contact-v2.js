export default function decorate(block) {
  const rows = [...block.children];

  // First row is title, second is subtitle, rest are contact items
  const titleRow = rows[0];
  const subtitleRow = rows[1];
  const items = rows.slice(2);

  const wrapper = document.createElement('div');
  wrapper.className = 'contact-v2-wrapper';

  // Header
  const header = document.createElement('div');
  header.className = 'contact-v2-header';

  if (titleRow) {
    titleRow.className = 'contact-v2-title';
    header.append(titleRow);
  }
  if (subtitleRow) {
    subtitleRow.className = 'contact-v2-subtitle';
    header.append(subtitleRow);
  }

  wrapper.append(header);

  // Items grid
  const grid = document.createElement('div');
  grid.className = 'contact-v2-grid';

  items.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const btnCell = cells[1];
    const textCell = cells[2];

    row.className = 'contact-v2-item';

    if (iconCell) iconCell.className = 'contact-v2-icon';
    if (btnCell) {
      btnCell.className = 'contact-v2-btn';
      const link = btnCell.querySelector('a');
      if (link) {
        link.className = 'contact-v2-btn-link';
      }
    }
    if (textCell) textCell.className = 'contact-v2-text';

    grid.append(row);
  });

  wrapper.append(grid);
  block.innerHTML = '';
  block.append(wrapper);
}
