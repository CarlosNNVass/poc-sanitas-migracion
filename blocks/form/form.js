// ===============================
// Detectar modo Author (Universal Editor)
// ===============================
function isAuthoring() {
  return (
    document.getElementById('editor-app') ||
    window.location.href.includes('universal-editor') ||
    document.querySelector('[data-aue-resource]')
  );
}


// ===============================
// Helpers name
// ===============================
const usedNames = new Set();

function normalizeName(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getUniqueName(base) {
  let name = base;
  let i = 1;
  while (usedNames.has(name)) {
    name = `${base}-${i++}`;
  }
  usedNames.add(name);
  return name;
}

// ===============================
// Parse options select (label:value)
// ===============================
function parseSelectOptions(container) {
  if (!container) return [];

  const text = container.textContent || '';

  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [labelText, value] = line.split(':').map((s) => s.trim());
      return {
        label: labelText || value,
        value: value || labelText,
      };
    });
}

// ===============================
// Crear campo
// ===============================
function createField({ label, name, type, width, options, modalPath, modalTitle }) {

  const wrapper = document.createElement('div');
  wrapper.className = 'form-field';
  wrapper.classList.add(width === '50' ? 'form-field--half' : 'form-field--full');

  let input;

  switch (type) {
    case 'select': {
      input = document.createElement('select');
      options.forEach((opt) => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        input.appendChild(o);
      });
      wrapper.appendChild(input);
      break;
    }

    case 'checkbox': {
      input = document.createElement('input');
      input.type = 'checkbox';

      const checkboxLabel = document.createElement('label');
      const checkboxIcon = document.createElement('span');
      checkboxIcon.className = 'icon-rp-Check';
      checkboxLabel.className = 'checkbox-label';
      checkboxLabel.htmlFor = name;

      // options = cells[0], contiene el enlace/texto del checkbox
      if (options && options.querySelector('a')) {
        const link = options.querySelector('a').cloneNode(true);
        checkboxLabel.appendChild(link);
      } else if (options && options.innerHTML.trim().length) {
        checkboxLabel.innerHTML = options.innerHTML;
      } else if (label) {
        checkboxLabel.textContent = label;
      }

      checkboxLabel.appendChild(input);
      checkboxLabel.appendChild(checkboxIcon);


      wrapper.appendChild(checkboxLabel);
      break;
    }

    case 'email':
    case 'tel':
    default: {
      const inputBox = document.createElement('div');
      inputBox.className = 'input_box';

      const labelTag = document.createElement('label');
      labelTag.className = 'rds-caption-02';
      labelTag.htmlFor = name;

      if (label) {
        const labelText = document.createElement('span');
        labelText.className = 'input-label-text rds-caption-02';
        labelText.textContent = label;
        labelTag.appendChild(labelText);
      }

      input = document.createElement('input');
      input.className = `${name} rds-body-01`;

      if (type === 'email') {
        input.type = 'email';
      } else if (type === 'tel') {
        input.type = 'tel';
        input.maxLength = 9;
      } else {
        input.type = 'text';
      }

      labelTag.appendChild(input);

      const validationIcon = document.createElement('span');
      validationIcon.className = 'validation_icon';
      validationIcon.setAttribute('role', 'img');
      validationIcon.setAttribute('aria-label', 'Error:');

      const msgError = document.createElement('span');
      msgError.className = 'msg_error rds-caption-02';
      msgError.setAttribute('role', 'alert');
      msgError.setAttribute('aria-live', 'assertive');

      inputBox.appendChild(labelTag);
      inputBox.appendChild(validationIcon);
      inputBox.appendChild(msgError);

      wrapper.appendChild(inputBox);
      break;
    }
  }
  input.name = name;
  input.id = name;
  if(input.type !== 'checkbox'){
  input.required = true;

  }
  input.setAttribute('aria-required', 'true');

  return wrapper;
}

// ===============================
// Render runtime
// ===============================
function renderRuntimeForm(block) {
  const rows = [...block.children];

  const singleCellRows = [];
  const fieldRows = [];
  rows.forEach((row) => {
    const cellCount = row.querySelectorAll(':scope > div').length;
    if (cellCount === 1) singleCellRows.push(row);
    else if (cellCount > 1) fieldRows.push(row);
  });

  const submitLabel = singleCellRows[3]?.textContent?.trim() || 'Enviar';

  const fieldsData = fieldRows.map((row, index) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const label = cells[0]?.textContent?.trim();
    const type = cells[1]?.textContent?.trim();
    const width = cells[2]?.textContent?.trim();
    const optionsCell = cells[3];
    const modalPath = cells[4];
    const modalTitle = cells[5];
    const labelCell = cells[0];

    let options = null;
    if (type === 'select') {
      options = parseSelectOptions(optionsCell);
    } else if (type === 'checkbox') {
      options = labelCell;
    }

    const rawName = row.getAttribute('data-aue-label') || label || `field-${index}`;
    const name = getUniqueName(normalizeName(rawName) || `field-${index}`);

    return { label, name, type, width, options, modalPath, modalTitle };
  });

  const container = document.createElement('div');
  container.className = 'form-runtime';

  const form = document.createElement('form');
  const fragment = document.createDocumentFragment();

  fieldsData.forEach((fieldConfig) => {
    fragment.appendChild(createField(fieldConfig));
  });

  form.appendChild(fragment);
  container.appendChild(form);

  block.replaceChildren(container);
}
// ===============================
// Render Author
// ===============================
function renderAuthor(block) {
  const container = document.createElement('div');
  container.className = 'form-runtime';

  const rows = [...block.children];

  // 1. Clasificar filas
  const singleCellRows = rows.filter(
    (row) => row.querySelectorAll(':scope > div').length === 1
  );
  const fieldRows = rows.filter(
    (row) => row.querySelectorAll(':scope > div').length > 1
  );

  // 3. FORM: Contenedor para los campos y el botón
  const form = document.createElement('form');
  form.className = 'form-author-preview';

  fieldRows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    const type = cells[1]?.innerText?.trim().toLowerCase() || 'text';
    const width = cells[2]?.innerText?.trim();
    cells.forEach((item, indx) => {
      if (indx !== 0) {
        item.style.display = 'none';
      }
    });

    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'form-field';
    fieldWrapper.className = 'form-field--author';

    fieldWrapper.classList.add(`type-${type}`);
    fieldWrapper.classList.add(width === '50' ? 'form-field--half' : 'form-field--full');

    fieldWrapper.appendChild(row);

    form.appendChild(fieldWrapper);
  });

  container.appendChild(form);

  // 5. RENDER FINAL
  block.innerHTML = '';
  block.appendChild(container);
}


// ===============================
// Decorate
// ===============================
export default function decorate(block) {
  if (isAuthoring()) {
    renderAuthor(block);
  } else {
    renderRuntimeForm(block);
  }
}