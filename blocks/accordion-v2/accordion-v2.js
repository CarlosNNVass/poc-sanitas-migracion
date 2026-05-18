export default function decorate(block) {
  const items = [...block.children];
  block.innerHTML = '';

  items.forEach((item, index) => {
    const cells = [...item.children];
    const icon = cells[0]?.textContent?.trim() || '';
    const title = cells[1]?.textContent?.trim() || '';
    const content = cells[2]?.innerHTML?.trim() || cells[2]?.textContent?.trim() || '';

    const details = document.createElement('div');
    details.className = 'accordion-v2-item';
    if (index === 0) details.classList.add('is-open');

    const header = document.createElement('div');
    header.className = 'accordion-v2-header';

    if (icon) {
      const iconEl = document.createElement('span');
      iconEl.className = `accordion-v2-icon ${icon}`;
      header.append(iconEl);
    }

    const titleEl = document.createElement('span');
    titleEl.className = 'accordion-v2-title';
    titleEl.textContent = title;
    header.append(titleEl);

    const chevron = document.createElement('span');
    chevron.className = 'accordion-v2-chevron';
    header.append(chevron);

    const panel = document.createElement('div');
    panel.className = 'accordion-v2-panel';
    panel.innerHTML = content;

    header.addEventListener('click', () => {
      const wasOpen = details.classList.contains('is-open');
      block.querySelectorAll('.accordion-v2-item').forEach((i) => i.classList.remove('is-open'));
      if (!wasOpen) details.classList.add('is-open');
    });

    details.append(header, panel);
    block.append(details);
  });
}
