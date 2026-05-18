export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'conditions-table-card';

  let title = '';
  let subtitle = '';
  const items = [];
  let callout = '';
  let titleDone = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const first = cells[0]?.innerHTML?.trim() || '';
    const firstText = cells[0]?.textContent?.trim() || '';
    const second = cells[1]?.textContent?.trim() || '';

    if (!titleDone && !second && !firstText.startsWith('[callout]')) {
      if (!title) {
        title = firstText;
      } else if (!subtitle) {
        subtitle = firstText;
        titleDone = true;
      }
    } else if (firstText.startsWith('[callout]')) {
      callout = firstText.replace('[callout]', '').trim();
    } else {
      titleDone = true;
      items.push({ label: first, value: second });
    }
  });

  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.className = 'conditions-table-title';
    titleEl.textContent = title;
    card.append(titleEl);
  }

  if (subtitle) {
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'conditions-table-subtitle';
    subtitleEl.textContent = subtitle;
    card.append(subtitleEl);
  }

  if (items.length > 0) {
    const table = document.createElement('div');
    table.className = 'conditions-table-rows';

    items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'conditions-table-row';

      const label = document.createElement('span');
      label.className = 'conditions-table-label';
      label.innerHTML = item.label;

      row.append(label);

      if (item.value) {
        const value = document.createElement('span');
        value.className = 'conditions-table-value';
        value.textContent = item.value;
        row.append(value);
      }

      table.append(row);
    });

    card.append(table);
  }

  if (callout) {
    const calloutEl = document.createElement('div');
    calloutEl.className = 'conditions-table-callout';
    calloutEl.textContent = callout;
    card.append(calloutEl);
  }

  block.append(card);
}
