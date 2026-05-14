export default function decorate(block) {
  block.classList.add('promotion-banner');

  const rows = [...block.children];
  if (!rows.length) return;

  rows.forEach((row) => row.classList.add('promotion-banner-row'));

  // EDS renders each model field as a separate row, each with one cell.
  // Row 0: title, Row 1: body, Row 2: button label text, Row 3: link href
  const getCell = (row) => row && row.firstElementChild;

  const titleCell = getCell(rows[0]);
  const bodyCell = getCell(rows[1]);
  const buttonLabelRow = rows[2];
  const linkRow = rows[3];
  if (titleCell) titleCell.classList.add('promotion-banner-title');
  if (bodyCell) bodyCell.classList.add('promotion-banner-body');

  const link = linkRow && linkRow.querySelector('a');
  if (link) {
    const labelText = buttonLabelRow && buttonLabelRow.textContent.trim();
    if (labelText) {
        const span = document.createElement('span')
        span.textContent = labelText
        link.textContent = null
        link.appendChild(span)
    };
    link.classList.add('promotion-banner-button');
    linkRow.classList.add('promotion-banner-cta');
    if (buttonLabelRow) buttonLabelRow.remove();
  }

  const modalRow = document.createElement('div');
  modalRow.classList.add('promotion-banner-row', 'promotion-banner-cta');
  const modalBtn = document.createElement('button');
  modalBtn.classList.add('open-modal-btn');
  modalBtn.textContent = 'Calcula tu seguro';
  modalRow.appendChild(modalBtn);
  block.appendChild(modalRow);
}
