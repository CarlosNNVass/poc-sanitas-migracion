export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('service-card');

    const [imgCell, contentCell] = [...row.children];

    if (imgCell) imgCell.classList.add('service-card__icon');

    if (contentCell) {
      contentCell.classList.add('service-card__content');

      const heading = contentCell.querySelector('h2, h3, h4, h5');
      if (heading) heading.classList.add('service-card__title');

      contentCell.querySelectorAll('p').forEach((p) => {
        if (p.textContent.trim()) p.classList.add('service-card__desc');
      });

      const ul = contentCell.querySelector('ul');
      if (ul) ul.classList.add('service-card__links');
    }
  });
}
