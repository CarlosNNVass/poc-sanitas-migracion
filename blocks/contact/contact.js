export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const [tagRow, titleRow, subtitleRow, ...itemRows] = rows;

  if (tagRow) {
    tagRow.classList.add('contact-tag-row');
    const inner = tagRow.querySelector('div') || tagRow;
    inner.classList.add('contact-tag');
    block.parentElement.appendChild(tagRow)
  }

  if (titleRow) {
    titleRow.classList.add('contact-title-row');
    const inner = titleRow.querySelector('div') || titleRow;
    inner.classList.add('contact-title');
  }

  if (subtitleRow) {
    subtitleRow.classList.add('contact-subtitle-row');
    const inner = subtitleRow.querySelector('div') || subtitleRow;
    inner.classList.add('contact-subtitle');
  }

  itemRows.forEach((row) => {
    row.classList.add('contact-item');
    const [iconCell, btnCell, linkCell, textCell] = [...row.children];

    const iconName = iconCell?.textContent?.trim() || '';
    const linkHref = linkCell?.querySelector('a')?.href || linkCell?.textContent?.trim() || '';

    if (iconCell) {
      iconCell.classList.add('contact-item__icon-cell');
      const iconSpan = document.createElement('span');
      iconSpan.className = `contact-item__icon contact-item__icon--${iconName}`;
      iconSpan.setAttribute('aria-hidden', 'true');
      iconCell.textContent = '';
      iconCell.appendChild(iconSpan);
    }

    if (btnCell) {
      btnCell.classList.add('contact-item__btn-cell');
      const btnText = btnCell.textContent.trim();
      const btn = document.createElement('a');
      btn.className = 'contact-item__btn';
      if (linkHref) btn.href = linkHref;
      const btnIconSpan = document.createElement('span');
      btnIconSpan.className = `contact-item__btn-icon contact-item__btn-icon--${iconName}`;
      btnIconSpan.setAttribute('aria-hidden', 'true');
      const labelSpan = document.createElement('span');
      labelSpan.className = 'contact-item__btn-label';
      labelSpan.textContent = btnText;
      btn.append(btnIconSpan, labelSpan);
      btnCell.textContent = '';
      btnCell.appendChild(btn);
    }

    if (linkCell) linkCell.classList.add('contact-item__link-cell');
    if (textCell) textCell.classList.add('contact-item__text');
  });
}
