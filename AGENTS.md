# Guía rápida: creación de blocks (Franklin/AEM)

Este documento resume el flujo que hemos seguido para crear el block `accordion` y sirve como referencia para crear nuevos blocks en este proyecto.

## 1. Estructura de un block

Cada block vive en `blocks/<nombre>/` y suele tener:

- `blocks/<nombre>/<nombre>.js`: lógica de transformación del DOM del block.
- `blocks/<nombre>/<nombre>.css`: estilos específicos del block.
- `blocks/<nombre>/_<nombre>.json`: definición local del block (definitions/models/filters) para el editor.

Ejemplo (accordion):

- `blocks/accordion/accordion.js`
- `blocks/accordion/accordion.css`
- `blocks/accordion/_accordion.json`

## 2. Definición local del block (`_<nombre>.json`)

Este JSON define cómo se expone el block al editor y qué hijos puede tener.

Para `accordion`:

- `definitions`:
  - `title`: nombre visible en el editor ("Accordion").
  - `id`: identificador lógico del componente ("accordion").
  - `plugins.xwalk.page.resourceType`: resourceType AEM/Franklin, por ejemplo `core/franklin/components/accordion/v1/accordion`.
- `models`:
  - Modelo del propio block (`id: "accordion"`), opcional si no tiene campos propios.
  - Modelo de los hijos (`id: "accordion-item"`) con sus campos:
    - `title`: texto.
    - `content`: richtext.
- `filters`:
  - `id: "accordion"` → `components: ["accordion-item"]` indica que el accordion puede contener items.

Nota: inicialmente se añadió un campo `items` para indicar número de items, pero en este caso no aporta valor porque el número de items se controla añadiendo/eliminando filas en el editor. Por eso se ha simplificado el modelo y se ha eliminado ese campo.

## 3. Modelos globales (`component-models.json`)

En `component-models.json` se declaran los modelos reutilizables a nivel de proyecto.

Para el accordion:

- `id: "accordion"`: modelo del block (sin campos en este caso).
- `id: "accordion-item"`: modelo de cada item con:
  - `title`: `component: "text"`, `valueType: "string"`.
  - `content`: `component: "richtext"`, `valueType: "string"`.

Estos modelos permiten que el editor conozca los campos de cada tipo de componente.

## 4. Filtros globales (`component-filters.json` y modelos de section)

Los filtros globales controlan qué componentes pueden contener otros componentes.

Ejemplos relevantes:

- `id: "main"` → `components: ["section"]` (main contiene sections).
- `id: "section"` → `components: ["text", "image", "button", "title", "hero", "cards", "columns", "fragment", "accordion"]`.
- `id: "accordion"` → `components: ["accordion-item"]`.

Además, en `models/_section.json` se ha añadido el `accordion` en el filtro local:

```json
"filters": [
  {
    "id": "section",
    "components": [
      "text",
      "image",
      "button",
      "title",
      "hero",
      "cards",
      "columns",
      "fragment",
      "accordion"
    ]
  }
]
```

Esto es lo que permite que, dentro de un `section`, puedas insertar un `accordion`.

## 5. Lógica del block (`<nombre>.js`)

La función `decorate(block)` recibe el DOM del block tal como viene del HTML/autoría y lo transforma en la estructura final.

Patrón seguido para `accordion`:

- Cada fila hija directa del block (`block.children`) se interpreta como un item del accordion.
- Se espera que cada fila tenga dos columnas:
  - Columna 1 → título del item.
  - Columna 2 → contenido del item.
- El JS crea una estructura:
  - `div.accordion`
    - `div.accordion-item`
      - `button.accordion-header` (título)
      - `div.accordion-panel` (contenido)
- Al hacer click en un header:
  - Se cierran todos los items.
  - Se abre solo el item clicado (clase `is-open`).

### Importante: no romper la contribución en EDS/author

En este proyecto estamos usando EDS/author para la contribución de contenido. Eso implica una restricción importante para los JS de los blocks:

- **No modificar la estructura del DOM generada por EDS**:
  - No crear contenedores nuevos que sustituyan a los existentes (`block.replaceChildren(...)`).
  - No reordenar nodos ni cambiar la jerarquía de filas/columnas que genera el editor.
- **Sí está permitido**:
  - Añadir clases a los elementos existentes (por ejemplo, `accordion`, `accordion-item`, `accordion-header`, `accordion-panel`).
  - Añadir listeners de eventos (click, etc.) sobre esos elementos.
  - Cambiar atributos no estructurales (por ejemplo, `aria-*`, `data-*`).

Para el `accordion` en concreto, la implementación final de `decorate(block)` sigue este patrón:

- El `block` actúa como contenedor raíz y se le añade la clase `accordion`.
- Cada hijo directo del `block` se considera un item y se le añade la clase `accordion-item`.
- Dentro de cada item:
  - La primera celda/columna se marca como `accordion-header`.
  - La segunda celda/columna se marca como `accordion-panel`.
- Al hacer click en el header:
  - Se quita la clase `is-open` de todos los items del block.
  - Se añade `is-open` solo al item clicado.

Con este enfoque, el JS añade comportamiento y clases sin alterar la estructura que necesita EDS para representar el contenido en el árbol y en el editor.

## 6. Estilos del block (`<nombre>.css`)

Los estilos se limitan al block usando clases específicas (`.accordion`, `.accordion-item`, `.accordion-header`, `.accordion-panel`).

Para `accordion` se ha definido:

- Bordes superior/inferior para separar items.
- `button.accordion-header` ocupando todo el ancho, alineado a la izquierda.
- `div.accordion-panel` con animación simple usando `max-height` y `padding` para mostrar/ocultar el contenido cuando el item tiene la clase `is-open`.

## 7. Flujo general para crear un nuevo block

1. Crear carpeta en `blocks/<nombre>/`.
2. Crear `_<nombre>.json` con:
   - `definitions` (title, id, resourceType).
   - `models` (campos del block y de sus hijos, si aplica).
   - `filters` (qué hijos puede contener el block).
3. Añadir modelos globales en `component-models.json` si el block o sus hijos necesitan campos reutilizables.
4. Actualizar filtros globales:
   - `component-filters.json` y/o modelos específicos (como `models/_section.json`) para permitir que el nuevo block se pueda insertar dentro de `section` u otros componentes.
5. Implementar `blocks/<nombre>/<nombre>.js` con la función `decorate(block)` que transforme el DOM en la estructura final.
6. Añadir estilos en `blocks/<nombre>/<nombre>.css`.
7. Ejecutar `npm run build:json` y `npm run lint` para validar que los JSON y el código son correctos.

Con estos pasos, el nuevo block quedará disponible en el editor y se podrá anidar correctamente dentro de `section` u otros componentes permitidos por los filtros.
