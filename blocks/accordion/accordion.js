export default function decorate(block) {
  // No cambiamos la estructura generada por EDS, solo añadimos clases y comportamiento.

  // El contenedor del block actúa como raíz del accordion.
  block.classList.add('accordion');

  // Cada hijo directo del block se considera un item.
  const rows = [...block.children];

  rows.forEach((row) => {
    row.classList.add('accordion-item');

    // Suponemos que la primera celda/columna es el título y la segunda el contenido.
    const cells = [...row.children];
    const header = cells[0];
    const panel = cells[1];

    if (!header || !panel) {
      return;
    }

    header.classList.add('accordion-header');
    panel.classList.add('accordion-panel');

    // Hacemos clicable todo el header sin envolverlo en un button nuevo.
    header.addEventListener('click', () => {
      const isOpen = row.classList.contains('is-open');

      // Cerramos todos los items del mismo block.
      rows.forEach((r) => r.classList.remove('is-open'));

      if (!isOpen) {
        row.classList.add('is-open');
      }
    });
  });
}