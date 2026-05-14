
async function getInsurances() {
  const response = await fetch('/seguros-medicos.json');
  const json = await response.json();
  return json;
}

function createCard(insurance) {
  const card = document.createElement('a');
  card.className = 'insurance-card';
  card.href = insurance.Page;
  card.dataset.copago = insurance.Copago;

  const img = document.createElement('img');
  img.src = insurance.Image;
  img.alt = insurance.Title;
  img.loading = 'lazy';

  const content = document.createElement('div');
  content.className = 'insurance-card-content';

  const title = document.createElement('h3');
  title.textContent = insurance.Title;

  const desc = document.createElement('p');
  desc.textContent = insurance.Description;

  const cta = document.createElement('span');
  cta.className = 'insurance-card-cta';
  cta.textContent = 'Saber más >';

  const button = document.createElement('a')
  button.textContent = 'Calcular seguro'
  button.href = '#'
  button.classList.add('button')


  content.append(title, desc, cta, button);
  card.append(img, content);

  return card;
}

function applyFilter(block, filterValue) {
  block.querySelectorAll('.insurance-card').forEach((card) => {
    const copago = card.dataset.copago;
    let visible = false;
    if (filterValue === 'all') {
      visible = true;
    } else if (filterValue === 'copago') {
      visible = copago === 'Si' || copago === 'all';
    } else if (filterValue === 'no-copago') {
      visible = copago === 'No' || copago === 'all';
    }
    card.classList.toggle('hidden', !visible);
  });

  block.querySelectorAll('.cards-group').forEach((group) => {
    const hasVisible = group.querySelector('.insurance-card:not(.hidden)');
    group.classList.toggle('hidden', !hasVisible);
  });
}

export default async function decorate(block) {
  block.innerHTML = '';

  const insurances = await getInsurances();

  const radioOptions = [
    { value: 'all', label: 'Todos los seguros' },
    { value: 'copago', label: 'Seguros con copago' },
    { value: 'no-copago', label: 'Seguros sin copago' },
  ];

  const filterGroup = document.createElement('div');
  filterGroup.className = 'filtered-insurances-radio-group';

  const filtersTitle = document.createElement('div');
  filtersTitle.textContent = 'Filtrar';
  filterGroup.appendChild(filtersTitle);

  const filtersBox = document.createElement('div');
  radioOptions.forEach(({ value, label }, i) => {
    const radioLabel = document.createElement('label');
    radioLabel.className = 'filtered-insurances-radio-label';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'copago-filter';
    input.value = value;
    if (i === 0) input.checked = true;

    radioLabel.append(input, document.createTextNode(label));
    filtersBox.append(radioLabel);
  });
  filterGroup.append(filtersBox);
  block.append(filterGroup);

  const sectionDefs = [
    { key: 'Cobertura Esencial', title: 'Cobertura Esencial' },
    { key: 'Cobertura Completa', title: 'Cobertura Completa' },
    { key: 'Cobertura Premium', title: 'Cobertura Premium / Con Reembolso' },
  ];

  const sectionContainers = {};

  sectionDefs.forEach(({ key, title }) => {
    const box = document.createElement('div');
    box.classList.add('cards-group');

    const titleEl = document.createElement('div');
    titleEl.textContent = title;

    const grid = document.createElement('div');
    grid.className = 'cards-grid';

    box.append(titleEl, grid);
    block.append(box);
    sectionContainers[key] = grid;
  });

  insurances.data.forEach((insurance) => {
    const container = sectionContainers[insurance.Tipo];
    if (container) container.append(createCard(insurance));
  });

  filterGroup.addEventListener('change', (e) => {
    if (e.target.name === 'copago-filter') {
      applyFilter(block, e.target.value);
    }
  });
}
