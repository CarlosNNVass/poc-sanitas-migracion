export default function decorate(block) {
  block.querySelectorAll('a.button').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary');
    if (a.parentElement?.classList.contains('button-container')) {
      a.parentElement.classList.remove('button-container');
    }
  });

  [...block.children].forEach((row) => {
    row.classList.add('featured-card');
    const [imgCell, tagCell, titleCell, descCell, linkCell] = [...row.children];

    if (imgCell) {
      imgCell.classList.add('featured-card__media');
      const img = imgCell.querySelector('img');
      if (img) img.loading = 'lazy';

      if (tagCell) {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'featured-card__tag';
        tagSpan.textContent = tagCell.textContent.trim();
        imgCell.appendChild(tagSpan);
      }
    }

    if (tagCell) tagCell.classList.add('featured-card__tag-cell');
    if (titleCell) titleCell.classList.add('featured-card__title');
    if (descCell) descCell.classList.add('featured-card__desc');
    if (linkCell) {
      linkCell.classList.add('featured-card__footer');
      const a = linkCell.querySelector('a');
      if (a) {
        a.classList.add('featured-card__link')
        const span = document.createElement('span')
        span.textContent = 'Más información'
        a.textContent = null
        a.appendChild(span)
      };
    }
  });
}
