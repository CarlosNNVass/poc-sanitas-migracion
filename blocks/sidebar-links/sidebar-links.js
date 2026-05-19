export default function decorate(block) {
  const rows = [...block.children];

  const card = document.createElement('div');
  card.className = 'sidebar-links-card';

  rows.forEach((row, index) => {
    if (index === 0) {
      row.className = 'sidebar-links-title';
    } else {
      row.className = 'sidebar-links-item';
      // Remove button class from any decorated links
      row.querySelectorAll('.button-container').forEach((bc) => {
        bc.classList.remove('button-container');
      });
      row.querySelectorAll('.button').forEach((btn) => {
        btn.classList.remove('button');
      });
    }

    card.append(row);
  });

  block.innerHTML = '';
  block.append(card);
}
