export default function decorate(block) {
  const rows = [...block.children];

  const card = document.createElement('div');
  card.className = 'conditions-table-card';

  const tableEl = document.createElement('div');
  tableEl.className = 'conditions-table-rows';

  let titleDone = false;
  let subtitleDone = false;
  let calloutRow = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const valueCell = cells[1];
    const labelText = labelCell?.textContent?.trim() || '';
    const valueText = valueCell?.textContent?.trim() || '';

    if (labelText.startsWith('[callout]')) {
      // Callout row
      row.className = 'conditions-table-callout-row';
      if (labelCell) {
        labelCell.className = 'conditions-table-callout';
        const text = labelCell.textContent.replace('[callout]', '').trim();
        labelCell.textContent = text;
      }
      calloutRow = row;
      return;
    }

    if (!titleDone && !valueText) {
      // Title row
      titleDone = true;
      row.className = 'conditions-table-title-row';
      if (labelCell) labelCell.className = 'conditions-table-title';
      card.append(row);
      return;
    }

    if (titleDone && !subtitleDone && !valueText && !labelCell?.querySelector('strong')) {
      // Subtitle row
      subtitleDone = true;
      row.className = 'conditions-table-subtitle-row';
      if (labelCell) labelCell.className = 'conditions-table-subtitle';
      card.append(row);
      return;
    }

    // Data row (with or without value)
    titleDone = true;
    subtitleDone = true;
    row.className = 'conditions-table-row';
    if (labelCell) labelCell.className = 'conditions-table-label';
    if (valueCell && valueText) {
      valueCell.className = 'conditions-table-value';
    } else if (valueCell) {
      valueCell.style.display = 'none';
    }
    tableEl.append(row);
  });

  if (tableEl.children.length > 0) {
    card.append(tableEl);
  }

  if (calloutRow) {
    card.append(calloutRow);
  }

  block.innerHTML = '';
  block.append(card);
}
