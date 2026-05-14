export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const iconValue = rows[0]?.textContent?.trim() || '';
  const textCell  = rows[1];
  const buttonText = rows[2]?.textContent?.trim() || '';
  const linkCell  = rows[3];
  const linkHref  = linkCell?.querySelector('a')?.href || linkCell?.textContent?.trim() || '';

  // Contenedor principal
  const container = document.createElement('div');
  container.className = 'alert-inner';

  // Icono
  if (iconValue) {
    const iconEl = document.createElement('span');
    iconEl.className = `alert-icon alert-icon--${iconValue}`;
    iconEl.setAttribute('aria-hidden', 'true');
    container.appendChild(iconEl);
  }

  // Contenido (texto + botón)
  const content = document.createElement('div');
  content.className = 'alert-content';

  if (textCell) {
    const text = document.createElement('div');
    text.className = 'alert-text';
    text.innerHTML = textCell.querySelector('div')?.innerHTML ?? textCell.innerHTML;
    content.appendChild(text);
  }

  if (buttonText) {
    const btn = document.createElement('a');
    btn.className = 'button primary';
    if (linkHref) btn.href = linkHref;
    btn.textContent = buttonText;
    content.appendChild(btn);
  }

  container.appendChild(content);
  block.replaceChildren(container);
}
