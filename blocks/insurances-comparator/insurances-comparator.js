const ICON_MAP = [
  { keywords: ['video', 'telemedici', 'teleconsult'], icon: 'video' },
  { keywords: ['urgencia', 'urgencias', 'emergencia', '24 hora'], icon: 'urgency' },
  { keywords: ['especialidad', 'especialidades', 'especialista'], icon: 'specialty' },
  { keywords: ['gestión', 'gestiones', 'online', 'digital'], icon: 'check' },
  { keywords: ['prueba', 'diagnóstic', 'diagnostica', 'laborat', 'analítica'], icon: 'lab' },
  { keywords: ['dental', 'odontolog'], icon: 'dental' },
  { keywords: ['psicolog', 'salud mental'], icon: 'mental' },
  { keywords: ['hospitaliz', 'hospital'], icon: 'hospital' },
];

// Nombres de icono válidos que el autor puede escribir como primera palabra del item
const ICON_NAMES = new Set(['video', 'urgency', 'specialty', 'check', 'lab', 'dental', 'mental', 'hospital']);

function resolveIcon(text) {
  const lower = text.toLowerCase();
  for (const { keywords, icon } of ICON_MAP) {
    if (keywords.some((k) => lower.includes(k))) return icon;
  }
  return 'default';
}

// Formato esperado en el richtext:
//   video **Videoconsulta** con especialistas
//   ──┬──  ───────┬───────  ────────┬────────
//   icono       título           descripción
//
// Si no se escribe icono, se autodetecta por palabras clave del título/descripción.
function buildFeatureItem(li) {
  // Extraer icono explícito de la primera palabra del primer nodo de texto
  let iconName = '';
  const firstNode = li.childNodes[0];
  if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
    const candidate = firstNode.textContent.trimStart().split(/\s+/)[0];
    if (ICON_NAMES.has(candidate)) {
      iconName = candidate;
      firstNode.textContent = firstNode.textContent.trimStart().slice(candidate.length).trimStart();
    }
  }

  // <strong> → título
  const strongEl = li.querySelector('strong');
  const title = strongEl ? strongEl.textContent.trim() : '';
  if (strongEl) strongEl.remove();

  // texto restante → descripción
  const desc = li.textContent.trim();

  const icon = iconName || resolveIcon(title || desc);

  li.classList.add('insurance-plan__feature');
  li.innerHTML = '';

  const iconSpan = document.createElement('span');
  iconSpan.className = `insurance-plan__feature-icon insurance-plan__feature-icon--${icon}`;
  iconSpan.setAttribute('aria-hidden', 'true');

  const textDiv = document.createElement('div');
  textDiv.className = 'insurance-plan__feature-text';

  if (title) {
    const titleEl = document.createElement('strong');
    titleEl.className = 'insurance-plan__feature-title';
    titleEl.textContent = title;
    textDiv.appendChild(titleEl);
  }

  if (desc) {
    const descEl = document.createElement('span');
    descEl.className = 'insurance-plan__feature-desc';
    descEl.textContent = desc;
    textDiv.appendChild(descEl);
  }

  li.append(iconSpan, textDiv);
}

function linesToFeatureList(lines) {
  const ul = document.createElement('ul');
  lines.forEach((html) => {
    const li = document.createElement('li');
    li.innerHTML = html;
    buildFeatureItem(li);
    ul.appendChild(li);
  });
  return ul;
}

function parseFeatures(cell) {
  // 1. Lista <ul><li> (formato ideal en richtext)
  const lis = [...cell.querySelectorAll('li')];
  if (lis.length) {
    lis.forEach(buildFeatureItem);
    return;
  }

  // 2. Párrafos <p>
  const paras = [...cell.querySelectorAll('p')].filter((p) => p.textContent.trim());
  if (paras.length) {
    const ul = linesToFeatureList(paras.map((p) => p.innerHTML));
    cell.innerHTML = '';
    cell.appendChild(ul);
    return;
  }

  // 3. Divs hoja (EDS a veces genera <div> sin elementos hijo)
  const leafDivs = [...cell.querySelectorAll('div')].filter(
    (d) => !d.children.length && d.textContent.trim(),
  );
  if (leafDivs.length) {
    const ul = linesToFeatureList(leafDivs.map((d) => d.innerHTML));
    cell.innerHTML = '';
    cell.appendChild(ul);
    return;
  }

  // 4. Texto plano separado por saltos de línea (último recurso)
  const raw = cell.textContent.trim();
  if (raw) {
    const lines = raw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const ul = linesToFeatureList(lines);
    cell.innerHTML = '';
    cell.appendChild(ul);
  }
}

export default function decorate(block) {
  [...block.children].forEach((item) => {
    item.classList.add('insurance-plan');
    const cells = [...item.children];

    // Las primeras 5 celdas son siempre posicionales
    const [nameCell, descCell, copagoCell, promoCell, ctaTextCell, ...rest] = cells;

    // Las celdas restantes se detectan por contenido porque ctaLink (aem-content)
    // no genera celda en el DOM cuando está vacío, desplazando features e icon
    let ctaLinkCell;
    let featuresCell;
    let iconCell;

    rest.forEach((cell) => {
      const hasLink = !!cell.querySelector('a');
      const hasList = !!cell.querySelector('ul, li');
      const text = cell.textContent.trim();
      const isIcon = ICON_NAMES.has(text);

      if (hasLink && !ctaLinkCell) {
        ctaLinkCell = cell;
      } else if (hasList && !featuresCell) {
        featuresCell = cell;
      } else if (isIcon && !iconCell) {
        iconCell = cell;
      } else if (!featuresCell) {
        // Richtext sin lista (párrafos o texto plano)
        featuresCell = cell;
      }
    });

    if (nameCell) nameCell.classList.add('insurance-plan__name');
    if (descCell) descCell.classList.add('insurance-plan__desc');
    if (copagoCell) copagoCell.classList.add('insurance-plan__copago');
    if (promoCell) promoCell.classList.add('insurance-plan__promo');

    if (iconCell) {
      const planIconName = iconCell.textContent.trim();
      if (planIconName && nameCell) {
        const planIcon = document.createElement('span');
        planIcon.className = `insurance-plan__plan-icon insurance-plan__plan-icon--${planIconName}`;
        planIcon.setAttribute('aria-hidden', 'true');
        nameCell.prepend(planIcon);
      }
      iconCell.hidden = true;
    }

    if (ctaTextCell) {
      ctaTextCell.classList.add('insurance-plan__cta-cell');
      const ctaText = ctaTextCell.textContent.trim() || 'Calcular mi seguro';
      const ctaHref = ctaLinkCell?.querySelector('a')?.href || '#';
      const btn = document.createElement('a');
      btn.className = 'insurance-plan__btn';
      btn.href = ctaHref;
      btn.textContent = ctaText;
      ctaTextCell.textContent = '';
      ctaTextCell.appendChild(btn);
    }

    if (ctaLinkCell) ctaLinkCell.hidden = true;

    if (featuresCell) {
      featuresCell.classList.add('insurance-plan__features');
      parseFeatures(featuresCell);
    }
  });
}
