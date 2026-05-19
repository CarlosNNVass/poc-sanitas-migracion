export default function decorate(block) {
  const rows = [...block.children];

  const grid = document.createElement('div');
  grid.className = 'cta-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const titleCell = cells[0];
    const descCell = cells[1];
    const linkCell = cells[2];
    const styleCell = cells[3];

    const style = styleCell?.textContent?.trim() || '';
    const linkEl = linkCell?.querySelector('a');
    const href = linkEl?.getAttribute('href') || '#';
    const linkText = linkEl?.textContent?.trim() || '';

    row.className = 'cta-cards-card';

    if (titleCell) titleCell.className = 'cta-cards-title';
    if (descCell) descCell.className = 'cta-cards-desc';

    // Build button
    const btn = document.createElement('a');
    btn.href = href;
    btn.textContent = linkText;
    if (style === 'primary') {
      btn.className = 'cta-cards-btn cta-cards-btn-primary';
    } else {
      btn.className = 'cta-cards-btn cta-cards-btn-outline';
    }
    if (href.endsWith('.pdf')) btn.target = '_blank';

    // Hide raw data cells but keep in DOM for UE
    if (linkCell) linkCell.className = 'cta-cards-hidden';
    if (styleCell) styleCell.className = 'cta-cards-hidden';

    row.innerHTML = '';
    row.append(titleCell, descCell, btn);
    if (linkCell) row.append(linkCell);
    if (styleCell) row.append(styleCell);

    grid.append(row);
  });

  block.innerHTML = '';
  block.append(grid);
}
