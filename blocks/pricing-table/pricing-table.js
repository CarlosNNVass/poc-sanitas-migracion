export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  let title = '';
  const items = [];
  const footnotes = [];
  let parsingFootnotes = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const first = cells[0]?.textContent?.trim() || '';
    const second = cells[1]?.textContent?.trim() || '';

    if (!title && !second) {
      title = first;
    } else if (first.startsWith('*') || first.startsWith('**') || parsingFootnotes) {
      parsingFootnotes = true;
      footnotes.push(first);
    } else if (first && second) {
      items.push({ label: first, value: second });
    }
  });

  const card = document.createElement('div');
  card.className = 'pricing-table-card';

  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.className = 'pricing-table-title';
    titleEl.textContent = title;
    card.append(titleEl);
  }

  const table = document.createElement('div');
  table.className = 'pricing-table-rows';

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'pricing-table-row';

    const label = document.createElement('span');
    label.className = 'pricing-table-label';
    label.textContent = item.label;

    const value = document.createElement('span');
    value.className = 'pricing-table-value';
    value.textContent = item.value;

    row.append(label, value);
    table.append(row);
  });

  card.append(table);

  if (footnotes.length > 0) {
    const footnotesEl = document.createElement('div');
    footnotesEl.className = 'pricing-table-footnotes';
    footnotes.forEach((note) => {
      const p = document.createElement('p');
      p.textContent = note;
      footnotesEl.append(p);
    });
    card.append(footnotesEl);
  }

  block.append(card);
}
