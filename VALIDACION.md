# Validación de la entrega

Rama: `mejora-cv`. Veinte commits, uno por paso del plan.

## PDF

- Archivo: `cv/Daniel-Aldana-Lopez-CV.pdf`.
- Chromium, papel Carta, márgenes 6mm verticales y 11mm horizontales.
- Una página; cuerpo de 9.5pt e interlineado 1.3. La impresión usa la misma plantilla de la web: barra lateral oscura continua a la izquierda (68 mm) y columna principal blanca a la derecha; A4 con márgenes 0.
- Texto extraído con PDF.js: nombre, PERFIL PROFESIONAL, CONTACTO, HABILIDADES, IDIOMAS, PROYECTOS, EXPERIENCIA, EDUCACIÓN, CERTIFICACIONES, RECONOCIMIENTOS, en orden.
- Nombre, titular, correo y URLs de contacto presentes en el texto del PDF.
- Cinco certificaciones y tres reconocimientos en impresión; inventario completo en pantalla.

## Lighthouse local

| Modo | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| --- | ---: | ---: | ---: | ---: |
| Móvil | 100 | 100 | 100 | 100 |
| Escritorio | 98 | 100 | 100 | 100 |

Medido sobre `http://127.0.0.1:4173/`. Los resultados de GitHub Pages pueden variar respecto al servidor local.

## Comprobaciones adicionales

- 375px: sin desbordamiento horizontal; captura en `artifacts/mobile-375.png`.
- Búsqueda Unicode: `Extended_Pictographic`, `Regional_Indicator`, U+FE0F y U+20E3; cero coincidencias en el HTML generado.
- Lista de expresiones prohibidas: cero coincidencias en el HTML generado.
- SVG: todos inline, sin relleno, `stroke="currentColor"` y grosor 1.5.
- Enlaces locales existentes; un solo h1; sin marcadores de pendientes en producción.
- Teléfono: enlace `tel:+525554996118` en la web y `telephone` en JSON-LD; el PDF lo muestra como texto (`55 5499 6118`).
- Contraste sobre blanco: texto 14.76:1, secundario 6.46:1, enlaces 11.48:1; cumplen AA.

Los informes completos y el texto extraído están en `artifacts/`, excluido del repositorio. Los comandos para regenerarlos están en `README.md`.

## Confirmaciones editoriales pendientes

Consultar `PENDIENTES.md`. Los niveles de uso frecuente y conocimiento básico permanecen vacíos: actualmente se publican tres líneas de tecnologías con proyectos documentados. Google PM enumera los tres cursos registrados; la fracción 3 de 6 espera confirmación. VetSense muestra el año común a ambas fuentes y omite la constancia cuyo enlace está en conflicto.
