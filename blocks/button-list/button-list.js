export default function decorate(block) {
  block.classList.add('button-list');

  const items = [...block.children];
  if (!items.length) return;

  items.forEach((item) => {
    item.classList.add('button-list-item');

    const link = item.querySelector('a');
    if (!link) return;

    // EDS ya añade "primary" o "secondary" según <strong>/<em>.
    // Reflejamos eso en clases empresa-primary / empresa-secondary
    if (link.classList.contains('primary')) {
      link.classList.add('empresa-primary');
    } else if (link.classList.contains('secondary')) {
      link.classList.add('empresa-secondary');
    }

    link.classList.add('button-list-button');

    // Buscar el icono: la celda que NO contiene el link
    const cells = [...item.children];
    const iconCell = cells.find((cell) => !cell.contains(link));
    const iconValue = iconCell ? iconCell.textContent.trim() : '';

    if (iconValue) {
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('button-list-icon', iconValue);
      iconSpan.setAttribute('aria-hidden', 'true');
      link.prepend(iconSpan);
    }

    // Dejar solo el link en el item
    item.replaceChildren(link);
  });
}