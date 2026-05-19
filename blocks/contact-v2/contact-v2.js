export default function decorate(block) {
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'contact-v2-wrapper';

  const header = document.createElement('div');
  header.className = 'contact-v2-header';

  const grid = document.createElement('div');
  grid.className = 'contact-v2-grid';

  let headerDone = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const btnCell = cells[1];
    const linkCell = cells[2];
    const textCell = cells[3];

    const iconContent = iconCell?.querySelector('picture') || iconCell?.querySelector('img');
    const hasIcon = iconContent || (iconCell?.textContent?.trim() && iconCell.textContent.trim().startsWith('/content/dam'));

    // First 2 rows without icon are header (title + subtitle)
    if (!hasIcon && !headerDone) {
      const btnText = btnCell?.textContent?.trim() || '';
      if (btnText && !header.querySelector('.contact-v2-title')) {
        row.className = 'contact-v2-title';
        header.append(row);
      } else {
        row.className = 'contact-v2-subtitle';
        header.append(row);
        headerDone = true;
      }
      return;
    }

    headerDone = true;
    row.className = 'contact-v2-item';

    if (iconCell) iconCell.className = 'contact-v2-icon';

    // Button cell - style the link as a blue button
    if (btnCell) {
      btnCell.className = 'contact-v2-btn';
      const link = btnCell.querySelector('a');
      if (link) {
        link.className = 'contact-v2-btn-link';
      } else {
        // No link - create a button-style span
        const text = btnCell.textContent.trim();
        if (text) {
          const linkHref = linkCell?.querySelector('a')?.getAttribute('href') || linkCell?.textContent?.trim() || '#';
          btnCell.innerHTML = `<a href="${linkHref}" class="contact-v2-btn-link">${text}</a>`;
        }
      }
    }

    // Hide link cell (raw URL) if present
    if (linkCell) {
      linkCell.className = 'contact-v2-hidden';
    }

    if (textCell) textCell.className = 'contact-v2-text';

    grid.append(row);
  });

  wrapper.append(header, grid);
  block.innerHTML = '';
  block.append(wrapper);

  // Apply flex to parent section div for 2-column layout with sidebar
  setTimeout(() => {
    const blockWrapper = block.closest('.contact-v2-wrapper');
    const parent = blockWrapper?.parentElement;
    if (parent && parent.querySelector('.sidebar-links-wrapper')) {
      parent.style.display = 'flex';
      parent.style.gap = '32px';
      parent.style.alignItems = 'start';
      parent.style.maxWidth = '1200px';
      parent.style.margin = 'auto';
    }
  }, 100);
}
