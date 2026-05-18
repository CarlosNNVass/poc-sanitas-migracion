export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  rows.forEach((row) => {
    const cells = [...row.children];
    const linkEl = cells[0]?.querySelector('a') || null;
    const text = cells[0]?.textContent?.trim() || '';
    const href = linkEl?.getAttribute('href') || '';

    const item = document.createElement('div');
    item.className = 'download-link-item';

    const icon = document.createElement('span');
    icon.className = 'download-link-icon';
    icon.textContent = '↓';

    const link = document.createElement('a');
    link.className = 'download-link-anchor';
    link.href = href || '#';
    link.textContent = linkEl?.textContent?.trim() || text;
    if (href.endsWith('.pdf')) link.target = '_blank';

    item.append(icon, link);
    block.append(item);
  });
}
