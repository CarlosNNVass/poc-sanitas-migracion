import { createModal } from '../../scripts/modal.js';

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
    .replace(/[̀-ͯ]/g, '')
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
function createField({ label, name, type, width, options, placeholder, icon }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-field';
  wrapper.classList.add(width === '50' ? 'form-field--half' : 'form-field--full');

  let input;

  switch (type) {
    case 'select': {
      const selectBox = document.createElement('div');
      selectBox.className = 'input_box';

      const labelTag = document.createElement('label');
      labelTag.className = 'rds-caption-02';
      labelTag.htmlFor = name;

      if (label) {
        const labelText = document.createElement('span');
        labelText.className = 'input-label-text rds-caption-02';
        labelText.textContent = label;
        labelTag.appendChild(labelText);
      }

      input = document.createElement('select');
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = label || '';
      placeholder.disabled = true;
      placeholder.selected = true;
      input.appendChild(placeholder);

      options.forEach((opt) => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        input.appendChild(o);
      });

      labelTag.appendChild(input);
      selectBox.appendChild(labelTag);

      if (icon) {
        selectBox.classList.add('has-icon', `icon--${icon}`);
        const iconSpan = document.createElement('span');
        iconSpan.className = `form-field-icon form-field-icon--${icon}`;
        iconSpan.setAttribute('aria-hidden', 'true');
        selectBox.appendChild(iconSpan);
      }

      wrapper.appendChild(selectBox);
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

    case 'birthday': {
      wrapper.classList.remove('form-field--half');
      wrapper.classList.add('form-field--full');

      if (label) {
        const bdLabelText = document.createElement('span');
        bdLabelText.className = 'input-label-text rds-caption-02';
        bdLabelText.textContent = label;
        wrapper.appendChild(bdLabelText);
      }

      const bdRow = document.createElement('div');
      bdRow.className = 'birthday-row';

      [
        { key: 'dia', ph: 'Día', min: 1, max: 31 },
        { key: 'mes', ph: 'Mes', min: 1, max: 12 },
        { key: 'anio', ph: 'Año', min: 1900, max: new Date().getFullYear() },
      ].forEach(({ key, ph, min, max }) => {
        const subBox = document.createElement('div');
        subBox.className = 'input_box birthday-subfield';

        const subLabel = document.createElement('label');
        subLabel.className = 'rds-caption-02';
        subLabel.htmlFor = `${name}-${key}`;

        const subInput = document.createElement('input');
        subInput.type = 'number';
        subInput.name = `${name}-${key}`;
        subInput.id = `${name}-${key}`;
        subInput.placeholder = ph;
        subInput.min = min;
        subInput.max = max;
        subInput.required = true;
        subInput.setAttribute('aria-required', 'true');
        subInput.className = 'rds-body-01';

        const validationIcon = document.createElement('span');
        validationIcon.className = 'validation_icon';
        validationIcon.setAttribute('role', 'img');
        validationIcon.setAttribute('aria-label', 'Error:');

        const msgError = document.createElement('span');
        msgError.className = 'msg_error rds-caption-02';
        msgError.setAttribute('role', 'alert');
        msgError.setAttribute('aria-live', 'assertive');

        subLabel.appendChild(subInput);
        subBox.appendChild(subLabel);
        subBox.appendChild(validationIcon);
        subBox.appendChild(msgError);
        bdRow.appendChild(subBox);
      });

      wrapper.appendChild(bdRow);
      return wrapper;
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

      if (placeholder) input.placeholder = placeholder;

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

      if (icon) {
        inputBox.classList.add('has-icon', `icon--${icon}`);
        const iconSpan = document.createElement('span');
        iconSpan.className = `form-field-icon form-field-icon--${icon}`;
        iconSpan.setAttribute('aria-hidden', 'true');
        inputBox.appendChild(iconSpan);
      }

      wrapper.appendChild(inputBox);
      break;
    }
  }

  input.name = name;
  input.id = name;
  if (input.type !== 'checkbox') {
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

  // Block-level fields (orden del modelo: titulo, subtitulo, textbeforesubmit, submit, subtext, subalert)
  const titulo = singleCellRows[0]?.textContent?.trim() || '';
  const subtitulo = singleCellRows[1]?.textContent?.trim() || '';
  const textbeforesubmitCell = singleCellRows[2];
  const submitLabel = singleCellRows[3]?.textContent?.trim() || 'Enviar';
  const subtextCell = singleCellRows[4];
  const subalertCell = singleCellRows[5];

  const fieldsData = fieldRows.map((row, index) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const label = cells[0]?.textContent?.trim();
    const type = cells[1]?.textContent?.trim();
    const width = cells[2]?.textContent?.trim();
    const optionsCell = cells[3];
    const labelCell = cells[0];
    const placeholder = cells[6]?.textContent?.trim() || '';
    const icon = cells[7]?.textContent?.trim() || '';

    let options = null;
    if (type === 'select') {
      options = parseSelectOptions(optionsCell);
    } else if (type === 'checkbox') {
      options = labelCell;
    }

    const rawName = row.getAttribute('data-aue-label') || label || `field-${index}`;
    const name = getUniqueName(normalizeName(rawName) || `field-${index}`);

    return { label, name, type, width, options, placeholder, icon };
  });

  const container = document.createElement('div');
  container.className = 'form-runtime';

  // Header (titulo + subtitulo)
  if (titulo || subtitulo) {
    const header = document.createElement('div');
    header.className = 'form-header';
    if (titulo) {
      const h2 = document.createElement('h2');
      h2.className = 'form-titulo';
      h2.textContent = titulo;
      header.appendChild(h2);
    }
    if (subtitulo) {
      const p = document.createElement('p');
      p.className = 'form-subtitulo';
      p.textContent = subtitulo;
      header.appendChild(p);
    }
    container.appendChild(header);
  }

  const form = document.createElement('form');
  form.noValidate = true;
  const fragment = document.createDocumentFragment();

  fieldsData.forEach((fieldConfig) => {
    fragment.appendChild(createField(fieldConfig));
  });

  // Texto antes del botón
  const textbeforesubmitContent = textbeforesubmitCell?.querySelector('div')?.innerHTML ?? textbeforesubmitCell?.innerHTML ?? '';
  if (textbeforesubmitContent.trim()) {
    const textEl = document.createElement('div');
    textEl.className = 'form-textbeforesubmit form-field--full';
    textEl.innerHTML = textbeforesubmitContent;
    fragment.appendChild(textEl);
  }

  // Botón de envío
  const submitWrapper = document.createElement('div');
  submitWrapper.className = 'form-field form-field--full form-submit-wrapper';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'form-submit-btn';
  submitBtn.textContent = submitLabel;
  submitWrapper.appendChild(submitBtn);
  fragment.appendChild(submitWrapper);

  form.appendChild(fragment);
  container.appendChild(form);

  // Subtext (texto legal / privacidad)
  if (subtextCell) {
    const subtext = document.createElement('div');
    subtext.className = 'form-subtext';
    subtext.innerHTML = subtextCell.querySelector('div')?.innerHTML ?? subtextCell.innerHTML;
    container.appendChild(subtext);
  }

  // Subalert (mensaje de error, oculto por defecto)
  let subalertEl = null;
  const subalertContent = subalertCell?.querySelector('div')?.innerHTML ?? subalertCell?.innerHTML ?? '';
  if (subalertContent.trim()) {
    subalertEl = document.createElement('div');
    subalertEl.className = 'form-subalert';
    subalertEl.innerHTML = subalertContent;
    container.appendChild(subalertEl);
  }

  block.replaceChildren(container);

  // Validación y envío
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    form.querySelectorAll('input[required], select[required]').forEach((input) => {
      const box = input.closest('.input_box');
      const msgError = box?.querySelector('.msg_error');

      let isEmpty = false;
      let formatError = false;
      let errorMsg = '';

      if (input.type === 'select-one') {
        isEmpty = !input.value;
        errorMsg = 'Selecciona una opción';
      } else {
        isEmpty = !input.value.trim();
        if (!isEmpty) {
          if (input.type === 'email') {
            formatError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
            errorMsg = 'Introduce un email válido';
          } else if (input.type === 'tel') {
            formatError = !/^\d{9}$/.test(input.value.trim());
            errorMsg = 'Introduce un teléfono de 9 dígitos';
          }
        } else {
          errorMsg = 'Este campo es obligatorio';
        }
      }

      const hasError = isEmpty || formatError;
      if (hasError) valid = false;

      box?.classList.toggle('error', hasError);
      if (msgError) msgError.textContent = hasError ? errorMsg : '';
    });

    if (!valid) return;

    // Simular envío mostrando modal de confirmación
    const successContent = document.createElement('div');
    successContent.className = 'form-success-modal';
    successContent.innerHTML = `
      <span class="form-success-icon" aria-hidden="true"></span>
      <h3 class="form-success-title">¡Solicitud enviada!</h3>
      <p class="form-success-body">Nos pondremos en contacto contigo en breve.</p>
    `;

    const modal = createModal('', successContent);
    document.body.appendChild(modal);
    modal.showModal();
  });
}

// ===============================
// Render Author
// ===============================
function renderAuthor(block) {
  // Snapshot antes de mutar el DOM
  const rows = [...block.children];

  const singleCellRows = [];
  const fieldRows = [];
  rows.forEach((row) => {
    const cellCount = row.querySelectorAll(':scope > div').length;
    if (cellCount === 1) singleCellRows.push(row);
    else if (cellCount > 1) fieldRows.push(row);
  });

  const titulo = singleCellRows[0]?.textContent?.trim() || '';
  const subtitulo = singleCellRows[1]?.textContent?.trim() || '';
  const textbeforesubmitCell = singleCellRows[2];
  const submitLabel = singleCellRows[3]?.textContent?.trim() || 'Enviar';
  const subtextCell = singleCellRows[4];
  const subalertCell = singleCellRows[5];

  const fieldsData = fieldRows.map((row, index) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const label = cells[0]?.textContent?.trim();
    const type = cells[1]?.textContent?.trim();
    const width = cells[2]?.textContent?.trim();
    const optionsCell = cells[3];
    const labelCell = cells[0];
    const placeholder = cells[6]?.textContent?.trim() || '';
    const icon = cells[7]?.textContent?.trim() || '';

    let options = null;
    if (type === 'select') {
      options = parseSelectOptions(optionsCell);
    } else if (type === 'checkbox') {
      options = labelCell;
    }

    const rawName = row.getAttribute('data-aue-label') || label || `field-${index}`;
    const name = getUniqueName(normalizeName(rawName) || `field-${index}`);

    return { label, name, type, width, options, placeholder, icon, row };
  });

  const container = document.createElement('div');
  container.className = 'form-runtime';

  // Header
  if (titulo || subtitulo) {
    const header = document.createElement('div');
    header.className = 'form-header';
    if (titulo) {
      const h2 = document.createElement('h2');
      h2.className = 'form-titulo';
      h2.textContent = titulo;
      header.appendChild(h2);
    }
    if (subtitulo) {
      const p = document.createElement('p');
      p.className = 'form-subtitulo';
      p.textContent = subtitulo;
      header.appendChild(p);
    }
    container.appendChild(header);
  }

  const form = document.createElement('form');
  const fragment = document.createDocumentFragment();

  fieldsData.forEach(({ row, ...fieldConfig }) => {
    const fieldEl = createField(fieldConfig);

    // Transferir atributos data-aue-* al wrapper renderizado para que el UE lo seleccione
    for (const { name: attrName, value } of row.attributes) {
      if (attrName.startsWith('data-aue') || attrName.startsWith('data-richtext')) {
        fieldEl.setAttribute(attrName, value);
      }
    }

    // Mantener la row original en el DOM (oculta) para integridad del UE
    row.hidden = true;
    fieldEl.appendChild(row);
    fragment.appendChild(fieldEl);
  });

  const textbeforesubmitContent = textbeforesubmitCell?.querySelector('div')?.innerHTML ?? textbeforesubmitCell?.innerHTML ?? '';
  if (textbeforesubmitContent.trim()) {
    const textEl = document.createElement('div');
    textEl.className = 'form-textbeforesubmit form-field--full';
    textEl.innerHTML = textbeforesubmitContent;
    fragment.appendChild(textEl);
  }

  const submitWrapper = document.createElement('div');
  submitWrapper.className = 'form-field form-field--full form-submit-wrapper';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'form-submit-btn';
  submitBtn.textContent = submitLabel;
  submitWrapper.appendChild(submitBtn);
  fragment.appendChild(submitWrapper);

  form.appendChild(fragment);
  container.appendChild(form);

  if (subtextCell) {
    const subtext = document.createElement('div');
    subtext.className = 'form-subtext';
    subtext.innerHTML = subtextCell.querySelector('div')?.innerHTML ?? subtextCell.innerHTML;
    container.appendChild(subtext);
  }

  const subalertContent = subalertCell?.querySelector('div')?.innerHTML ?? subalertCell?.innerHTML ?? '';
  if (subalertContent.trim()) {
    const subalert = document.createElement('div');
    subalert.className = 'form-subalert';
    subalert.innerHTML = subalertContent;
    container.appendChild(subalert);
  }

  // Contenedor oculto para las rows de propiedades del bloque (el UE las necesita en el DOM)
  const propsStore = document.createElement('div');
  propsStore.hidden = true;
  singleCellRows.forEach((row) => propsStore.appendChild(row));

  block.replaceChildren(container, propsStore);
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
