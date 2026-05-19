# Notas de Migración: Seguro Sanitas Más Salud

## Componentes migrados exitosamente (usando v2 cuando disponible)

| Sección original | Bloque EDS utilizado | Notas |
|---|---|---|
| Banner hero + promoción | `promotion-banner-v2` | Título, subtítulo y texto promocional |
| Formulario cotizador | `form` | Estructura de campos (select, birthday, text, tel) |
| Blua digital | `accordion-v2` | 5 servicios digitales con iconos y descripción expandible |
| Coberturas principales | `coverage-v2` | 12 items accordion + 2 cards laterales (provisión médica, segunda opinión) |
| Qué incluye hospitalización | `info-box-v2` | 3 cards con icono |
| Ventajas hospitalización | `info-box-v2` | 3 cards con icono |
| Te acompaña en todo momento | `info-box-v2` | 3 cards (urgencias extranjero, 24h, gestiones online) |
| Tabla copago medio (Óptima) | `pricing-table` | Todas las filas + nota al pie |
| Tabla copago bajo (Plus) | `pricing-table` | Todas las filas + notas al pie |
| Tabla sin copago | `pricing-table` | Fila única + nota explicativa |
| Carencias | `conditions-table` | 6 periodos + callout informativo |
| Edad contratación/permanencia | `conditions-table` | 2 bloques de datos |
| Descarga condiciones | `download-link` | PDF condiciones generales |
| CTA cards | `cta-cards` | Descarga info + calcula seguro |
| Opiniones clientes | `opinions` | 3 reviews con carousel |
| Complementos de salud | `featured-cards` | 2 cards (accidentes, Sanitas Renta) |
| FAQ cards | `faq-cards` | 8 términos con modal |
| FAQ accordion | `accordion` | 3 preguntas frecuentes |
| Contacto | `contact-v2` | 4 opciones (oficinas, teléfono, callback, calculadora) |
| Sidebar links | `sidebar-links` | 4 enlaces "Te puede interesar" |
| Texto SEO | default content | Párrafo con enlaces internos |
| Disclaimer legal | default content | Texto tarifas y condiciones |
| Botones de enlace | `button-list` | "Ver más opiniones" + "Ver complementos" |

## Componentes NO migrados / Diferencias

| Componente original | Razón | Alternativa aplicada |
|---|---|---|
| **Selector de tabs para copagos** | No existe un bloque tipo "tabs" que permita alternar entre las 3 opciones de copago en una sola vista. En el original se muestran como pestañas interactivas. | Se usaron 3 bloques `pricing-table` separados en la misma sección `highlight-sand`. Visualmente similar pero sin la interacción de tabs. |
| **Sección de descuentos** (10% pack familiar, 4% pago anual) | No existe un bloque específico para mostrar badges/tarjetas de descuento con porcentajes destacados. | El descuento familiar se incluyó en el texto del `promotion-banner-v2`. El 4% pago anual no se incluyó por falta de bloque adecuado. |
| **Centro Relaciones con Cliente** (4º item del "te acompaña") | El bloque `info-box-v2` muestra un grid de 3 columnas. El 4º item rompería la simetría visual. | Se priorizaron los 3 items más relevantes. Se podría añadir como 4º item si se acepta una fila parcial. |
| **Programas digitales de salud detallados** (embarazo, nutrición, entrenador, pediatría como sub-cards) | En el original aparecen como tarjetas individuales dentro de un grid dedicado a programas. No hay bloque que replique esta visualización específica. | Se integraron como descripción dentro del item "Planes personalizados por videoconsulta" en el `coverage-v2`. |
| **Formulario real con integración backend** | El bloque `form` es una estructura visual; la integración con el calculador real de Sanitas requiere desarrollo adicional. | Se mantiene la estructura de campos como placeholder visual. |
| **Imágenes reales del hero y featured cards** | Las imágenes originales requieren descarga y almacenamiento en el DAM. Se usaron nombres placeholder. | Reemplazar `media_1mas-salud-hero.jpg`, `media_1accidentes-trafico.jpg` y `media_1sanitas-renta.jpg` con las imágenes reales del DAM. |

## Recomendaciones

1. **Tabs de copago**: Crear un bloque `pricing-tabs` que agrupe las 3 tablas y permita navegar entre ellas con pestañas.
2. **Descuentos**: Crear un bloque `discount-badges` o usar `info-box-v2` con un estilo adicional para badges promocionales.
3. **Imágenes**: Descargar las imágenes reales de la web original y subirlas al DAM del proyecto.
4. **Formulario**: Integrar con el endpoint real del cotizador de Sanitas para que el formulario sea funcional.
