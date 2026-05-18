export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'cta-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent?.trim() || '';
    const description = cells[1]?.textContent?.trim() || '';
    const linkEl = cells[2]?.querySelector('a');
    const linkText = linkEl?.textContent?.trim() || cells[2]?.textContent?.trim() || '';
    const linkHref = linkEl?.getAttribute('href') || '#';
    const style = cells[3]?.textContent?.trim() || '';

    const card = document.createElement('div');
    card.className = 'cta-cards-card';

    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'cta-cards-title';
      titleEl.textContent = title;
      card.append(titleEl);
    }

    if (description) {
      const descEl = document.createElement('p');
      descEl.className = 'cta-cards-desc';
      descEl.textContent = description;
      card.append(descEl);
    }

    if (linkText) {
      const btn = document.createElement('a');
      btn.href = linkHref;
      btn.textContent = linkText;

      if (style === 'primary') {
        btn.className = 'cta-cards-btn cta-cards-btn-primary';
      } else {
        btn.className = 'cta-cards-btn cta-cards-btn-outline';
      }

      if (linkHref.endsWith('.pdf')) btn.target = '_blank';
      card.append(btn);
    }

    grid.append(card);
  });

  block.append(grid);
}
