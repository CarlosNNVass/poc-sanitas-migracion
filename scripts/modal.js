import { loadBlock, decorateBlock, getMetadata } from './aem.js';

if (!window.__modalCache) {
  window.__modalCache = {};
}
export const modalSizes = {
  xs: 'extra-small-modal',
  s: 'small-modal'
}
export function createModal(title, content, size) {
  const dialog = document.createElement('dialog');
  dialog.className = 'modal-dialog';
  dialog.innerHTML = `
    <div class="modal-dialog-content">
      <div class="modal-dialog-header">
        <p></p>
        <button class="modal-dialog-close" aria-label="Cerrar">
          x
        </button>
      </div>
      <div class="modal-dialog-body"></div>
    </div>
  `;
    dialog.querySelector('.modal-dialog-close').addEventListener('click', () => {
          dialog.close()

    });
 dialog.addEventListener('click', (e) => {
  const rect = dialog.getBoundingClientRect()

  const isInDialog =
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width

  if (!isInDialog) {
    dialog.close()
  }
})
 
  const titleEl = dialog.querySelector('.modal-dialog-header p');
  if (title instanceof HTMLElement) {
    titleEl.replaceWith(title);
  } else {
    titleEl.textContent = title;
  }

  if(size){
    dialog.classList.add(size)
  }

  dialog.querySelector('.modal-dialog-close').addEventListener('click', () => {
    dialog.classList.add('closing');
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.classList.add('closing');
  });

  dialog.addEventListener('transitionend', () => {
    if (dialog.classList.contains('closing')) {
      dialog.classList.remove('closing');
      dialog.close();
    }
  });
  if(content){
    dialog.querySelector('.modal-dialog-body').appendChild(content)
  }

  return dialog;
}

/**
 * Opens a modal for the given path.
 * If the modal for that path was already created, reuses the same dialog element.
 * window.__modalCache[path] stores the rendered dialog to avoid duplicate fetches.
 * @param {string} path
 * @param {string} title
 */



export async function openModal(path, title) {
  if (window.__modalCache[path]) {
    window.__modalCache[path].showModal();
    return;
  }

  const dialog = createModal(title);
  document.body.appendChild(dialog);

  const resp = await fetch(`${path}.plain.html`);
  if (!resp.ok) throw new Error(`Error cargando modal: ${resp.status}`);
  getMetadata

  const html = await resp.text();
  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  const body = dialog.querySelector('.modal-dialog-body');
  const blocks = fragment.querySelectorAll('div[class]');
  if (blocks.length > 0) {
    for (const fragmentBlock of blocks) {
      body.appendChild(fragmentBlock);
      decorateBlock(fragmentBlock);
      await loadBlock(fragmentBlock);
    }
  } else {
    body.innerHTML = html;
  }

  window.__modalCache[path] = dialog;
  dialog.showModal();
}

