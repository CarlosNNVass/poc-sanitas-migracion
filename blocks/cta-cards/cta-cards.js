export default function decorate(block) {
  const rows = [...block.children];

  const grid = document.createElement('div');
  grid.className = 'cta-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const titleCell = cells[0];
    const descCell = cells[1];
    const linkCell = cells[2];
    const linkTextCell = cells[3];
    const styleCell = cells[4];

    const style = styleCell?.textContent?.trim() || '';

    row.className = 'cta-cards-card';

    if (titleCell) titleCell.className = 'cta-cards-title';
    if (descCell) descCell.className = 'cta-cards-desc';

    // Build the button from link + linkText + style
    if (linkCell) {
      const linkEl = linkCell.querySelector('a');
      const href = linkEl?.getAttribute('href') || linkCell.textContent?.trim() || '#';
      const linkText = linkTextCell?.textContent?.trim() || linkEl?.textContent?.trim() || '';

      const btn = document.createElement('a');
      btn.href = href;
      btn.textContent = linkText;

      if (style === 'primary') {
        btn.className = 'cta-cards-btn cta-cards-btn-primary';
      } else {
        btn.className = 'cta-cards-btn cta-cards-btn-outline';
      }

      if (href.endsWith('.pdf')) btn.target = '_blank';

      linkCell.className = 'cta-cards-link-cell';
      linkCell.style.display = 'none';
      if (linkTextCell) {
        linkTextCell.className = 'cta-cards-linktext-cell';
        linkTextCell.style.display = 'none';
      }
      if (styleCell) {
        styleCell.className = 'cta-cards-style-cell';
        styleCell.style.display = 'none';
      }

      row.innerHTML = '';
      row.append(titleCell, descCell, btn, linkCell, linkTextCell, styleCell);
    } else {
      row.innerHTML = '';
      row.append(titleCell, descCell);
    }

    grid.append(row);
  });

  block.innerHTML = '';
  block.append(grid);
}
