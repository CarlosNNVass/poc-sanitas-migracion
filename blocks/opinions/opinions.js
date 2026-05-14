import { createModal } from '../../scripts/modal.js';

function openOpinionModal(item) {
  const name = item.querySelector('.opinions-name')?.textContent || '';
  const starsClone = item.querySelector('.opinions-stars')?.cloneNode(true);
  const dateText = item.querySelector('.opinions-date')?.textContent || '';
  const bodyClone = item.querySelector('.opinions-body')?.cloneNode(true);

  if (bodyClone) {
    bodyClone.style.cssText = '-webkit-line-clamp: unset; overflow: visible; display: block;';
  }

  const dateEl = document.createElement('div');
  dateEl.className = 'opinions-date';
  dateEl.textContent = dateText;

  const content = document.createElement('div');
  content.className = 'opinions-modal-body';
  content.append(dateEl);
  if (starsClone) content.append(starsClone);
  if (bodyClone) content.append(bodyClone);

  const dialog = createModal(name || 'Opinión', content);
  dialog.addEventListener('close', () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
}

export default function decorate(block) {
  block.classList.add('opinions');

  const items = [...block.children];
  if (!items.length) return;

  const wrapper = document.createElement('div');
  wrapper.classList.add('opinions-wrapper');

  const track = document.createElement('div');
  track.classList.add('opinions-track');

  items.forEach((item) => {
    item.classList.add('opinions-item');

    const cells = [...item.children];
    if (!cells.length) return;

    let nameCell = null;
    let dateCell;
    let starsCell;
    let textCell;

    if (cells.length >= 4) {
      [nameCell, dateCell, starsCell, textCell] = cells;
    } else {
      [dateCell, starsCell, textCell] = cells;
    }

    const header = document.createElement('div');
    header.classList.add('opinions-header');

    const name = document.createElement('div');
    name.classList.add('opinions-name');
    name.textContent = nameCell ? nameCell.textContent.trim() : '';

    const date = document.createElement('div');
    date.classList.add('opinions-date');
    date.textContent = dateCell ? dateCell.textContent.trim() : '';

    header.append(name, date);

    const stars = document.createElement('div');
    stars.classList.add('opinions-stars');
    const rawStars = starsCell ? starsCell.textContent.trim() : '0';
    const starsValue = parseInt(rawStars, 10);
    const starCount = Number.isNaN(starsValue) ? 0 : Math.max(0, Math.min(5, starsValue));
    stars.setAttribute('aria-label', `${starCount} de 5 estrellas`);

    for (let i = 1; i <= 5; i += 1) {
      const star = document.createElement('span');
      star.classList.add('opinions-star');
      star.classList.add(i <= starCount ? 'is-filled' : 'is-empty');
      star.textContent = '★';
      star.setAttribute('aria-hidden', 'true');
      stars.append(star);
    }

    const body = document.createElement('div');
    body.classList.add('opinions-body');
    if (textCell) {
      body.innerHTML = textCell.innerHTML;
    }

    item.replaceChildren(header, stars, body);

    item.addEventListener('click', () => {
      if (body.scrollHeight > body.clientHeight) {
        openOpinionModal(item);
      }
    });

    track.append(item);
  });

  wrapper.append(track);

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.classList.add('opinions-arrow', 'opinions-arrow-prev');
  prevBtn.setAttribute('aria-label', 'Anterior');
  prevBtn.innerHTML = '<span aria-hidden="true">‹</span>';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.classList.add('opinions-arrow', 'opinions-arrow-next');
  nextBtn.setAttribute('aria-label', 'Siguiente');
  nextBtn.innerHTML = '<span aria-hidden="true">›</span>';

  const dotsContainer = document.createElement('div');
  dotsContainer.classList.add('opinions-dots');
  dotsContainer.setAttribute('role', 'tablist');

  wrapper.append(prevBtn, nextBtn, dotsContainer);
  block.replaceChildren(wrapper);

  const itemsArray = [...track.children];
  let currentPage = 0;
  let dotButtons = [];

  const getItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1100) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  const getTotalPages = () => Math.ceil(itemsArray.length / getItemsPerPage());

  const updateControls = () => {
    const needsNav = getTotalPages() > 1;
    prevBtn.hidden = !needsNav;
    nextBtn.hidden = !needsNav;
    dotsContainer.hidden = !needsNav;
  };

  const checkExpandable = () => {
    itemsArray.forEach((item) => {
      const body = item.querySelector('.opinions-body');
      item.classList.toggle('is-expandable', !!body && body.scrollHeight > body.clientHeight);
    });
  };

  const buildDots = () => {
    dotsContainer.replaceChildren();
    const totalPages = getTotalPages();
    dotButtons = [];

    for (let i = 0; i < totalPages; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.classList.add('opinions-dot');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ir a la página ${i + 1}`);
      if (i === currentPage) {
        dot.classList.add('is-active');
        dot.setAttribute('aria-selected', 'true');
      }
      dot.addEventListener('click', () => goToPage(i));
      dotsContainer.append(dot);
      dotButtons.push(dot);
    }

    updateControls();
  };

  const updateActivePage = (pageIndex) => {
    currentPage = pageIndex;
    dotButtons.forEach((dot, i) => {
      const isActive = i === pageIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  // eslint-disable-next-line no-use-before-define
  const goToPage = (pageIndex) => {
    const totalPages = getTotalPages();
    const safePage = ((pageIndex % totalPages) + totalPages) % totalPages;
    const itemsPerPage = getItemsPerPage();
    const targetItem = itemsArray[safePage * itemsPerPage];
    if (!targetItem) return;

    track.scrollTo({
      left: targetItem.offsetLeft - track.offsetLeft,
      behavior: 'smooth',
    });
    updateActivePage(safePage);
  };

  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  let scrollTimeout = null;
  track.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const itemsPerPage = getItemsPerPage();
      const itemWidth = itemsArray[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).columnGap || '0');
      const pageWidth = (itemWidth + gap) * itemsPerPage;
      const newPage = Math.round(track.scrollLeft / pageWidth);
      if (newPage !== currentPage) updateActivePage(newPage);
    }, 100);
  });

  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPage(currentPage - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToPage(currentPage + 1);
    }
  });

  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const totalPages = getTotalPages();
      if (currentPage >= totalPages) currentPage = totalPages - 1;
      buildDots();
      goToPage(currentPage);
      checkExpandable();
    }, 150);
  });

  buildDots();
  requestAnimationFrame(checkExpandable);
}
