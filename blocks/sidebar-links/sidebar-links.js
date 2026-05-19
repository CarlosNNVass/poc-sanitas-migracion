export default function decorate(block) {
  const rows = [...block.children];

  const card = document.createElement('div');
  card.className = 'sidebar-links-card';

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const cell = cells[0];

    if (index === 0) {
      row.className = 'sidebar-links-title';
    } else {
      row.className = 'sidebar-links-item';
      if (cell) cell.className = 'sidebar-links-link';
    }

    card.append(row);
  });

  block.innerHTML = '';
  block.append(card);
}
