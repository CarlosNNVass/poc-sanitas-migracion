export default function decorate(block) {
  const rows = [...block.children];

  const card = document.createElement('div');
  card.className = 'pricing-table-card';

  const tableEl = document.createElement('div');
  tableEl.className = 'pricing-table-rows';

  const footnotesEl = document.createElement('div');
  footnotesEl.className = 'pricing-table-footnotes';

  let titleDone = false;
  let parsingFootnotes = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const valueCell = cells[1];
    const labelText = labelCell?.textContent?.trim() || '';
    const valueText = valueCell?.textContent?.trim() || '';

    if (!titleDone && !valueText) {
      // Title row
      titleDone = true;
      row.className = 'pricing-table-title-row';
      if (labelCell) labelCell.className = 'pricing-table-title';
      card.append(row);
      return;
    }

    if (labelText.startsWith('*') || parsingFootnotes) {
      // Footnote row
      parsingFootnotes = true;
      row.className = 'pricing-table-footnote-row';
      if (labelCell) labelCell.className = 'pricing-table-footnote-text';
      footnotesEl.append(row);
      return;
    }

    if (labelText && valueText) {
      // Data row
      titleDone = true;
      row.className = 'pricing-table-row';
      if (labelCell) labelCell.className = 'pricing-table-label';
      if (valueCell) valueCell.className = 'pricing-table-value';
      tableEl.append(row);
    }
  });

  card.append(tableEl);
  if (footnotesEl.children.length > 0) {
    card.append(footnotesEl);
  }

  block.innerHTML = '';
  block.append(card);
}
