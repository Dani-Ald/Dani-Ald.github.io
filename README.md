# Daniel Aldana López · CV y portafolio

Sitio estático para GitHub Pages. Una fuente de contenido produce el portafolio completo y el CV imprimible.

## Editar contenido

- `data/perfil.json`: datos, contactos, proyectos, experiencia, educación, habilidades, certificaciones y reconocimientos.
- `contact.email`: único punto de edición del correo.
- `contact.phone`: teléfono opcional; vacío omite el enlace, icono y dato estructurado.
- `templates/index.html`: estructura de la página.
- `scripts/build.mjs`: generador JavaScript sin dependencias de ejecución.
- `styles.css`: diseño web y reglas de impresión.
- `Certificados/`: documentos originales conservados.
- `PENDIENTES.md`: información que requiere confirmación.
- `archivo/`: referencia editorial del contenido anterior; no es fuente de publicación.

No editar `index.html` directamente: se regenera con `npm run build`.

El generador añade al enlace de `styles.css` una versión calculada desde su contenido. Al cambiar estilos y regenerar el HTML, el navegador solicita la versión nueva en lugar de reutilizar una copia anterior en caché.

## Generar y validar

1. `npm ci`
2. `npm run build`
3. `npm run check`
4. `npx playwright install chromium`
5. `npm run serve` (mantener abierto en otra terminal).
6. `node scripts/validate-browser.mjs`: genera `cv/Daniel-Aldana-Lopez-CV.pdf`, verifica una página y orden del texto, y captura la vista móvil de 375px.
7. `node scripts/audit.mjs`: ejecuta Lighthouse móvil y escritorio.

Las evidencias se guardan en `artifacts/` (ignorado por Git). Publicar `index.html`, estilos y PDF actualizados junto con el contenido fuente. GitHub Pages sirve los archivos directamente; no requiere Node.js en producción.

## Impresión manual

Imprimir desde el navegador en tamaño Carta, escala 100%, sin encabezados ni pies del navegador. El diseño usa cuerpo de 10pt e interlineado 1.35. El PDF generado automáticamente fija estos parámetros. Volver a validar la paginación después de cambiar el contenido.

El CV selecciona cinco certificaciones y tres reconocimientos. El portafolio conserva todas las entradas y ofrece un archivo con todos los PDF originales. Las credenciales con verificación externa usan ese enlace; las demás enlazan al documento local.
