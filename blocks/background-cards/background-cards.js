import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children];

  items.forEach((item) => {
    item.classList.add('background-cards-item');

    const cells = [...item.children];
    const [imageCell, dateCell, titleCell, descriptionCell, linkCell] = cells;

    const imgEl = imageCell?.querySelector('img');
    const dateText = dateCell?.textContent.trim() || '';
    const titleText = titleCell?.textContent.trim() || '';
    const descriptionHTML = descriptionCell?.innerHTML || '';

    let linkUrl = '';
    let linkText = 'Leer más';
    if (linkCell) {
      const anchor = linkCell.querySelector('a');
      if (anchor) {
        linkUrl = anchor.getAttribute('href') || '';
        linkText = anchor.textContent.trim() || 'Leer más';
      } else {
        linkUrl = linkCell.textContent.trim();
      }
    }

    const bgImage = document.createElement('div');
    bgImage.classList.add('background-cards-bg');
    if (imgEl) {
      const optimizedPic = createOptimizedPicture(imgEl.src, imgEl.alt || '', false, [{ width: '800' }]);
      moveInstrumentation(imgEl, optimizedPic.querySelector('img'));
      bgImage.append(optimizedPic);
    }

    const overlay = document.createElement('div');
    overlay.classList.add('background-cards-overlay');

    if (dateText) {
      const date = document.createElement('span');
      date.classList.add('background-cards-date');
      date.textContent = dateText;
      overlay.append(date);
    }

    if (titleText) {
      const title = document.createElement('h3');
      title.classList.add('background-cards-title');
      title.textContent = titleText;
      overlay.append(title);
    }

    if (descriptionHTML) {
      const description = document.createElement('div');
      description.classList.add('background-cards-description');
      description.innerHTML = descriptionHTML;
      overlay.append(description);
    }

    if (linkUrl) {
      const link = document.createElement('a');
      link.classList.add('button', 'background-cards-btn');
      link.href = linkUrl;
      link.textContent = linkText;
      overlay.append(link);
    }

    item.replaceChildren(bgImage, overlay);
  });
}
