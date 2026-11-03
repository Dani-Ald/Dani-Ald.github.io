import { chromium } from 'playwright';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
mkdirSync('artifacts', { recursive: true });
mkdirSync('cv', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.pdf({ path: 'cv/Daniel-Aldana-Lopez-CV.pdf', preferCSSPageSize: true, printBackground: false, tagged: true });
  const pdf = await getDocument({ data: new Uint8Array(readFileSync('cv/Daniel-Aldana-Lopez-CV.pdf')), useSystemFonts: true }).promise;
  const texts = [];
  for (let i = 1; i <= pdf.numPages; i++) texts.push((await (await pdf.getPage(i)).getTextContent()).items.map(item => item.str).join(' '));
  writeFileSync('artifacts/pdf-text.txt', texts.join('\n\n'));
  console.log('PDF pages:', pdf.numPages);
  assert.equal(pdf.numPages, 1, 'El PDF debe tener una página');
  let text = texts.join(' ').replace(/\s+/g, ' ');
  const compact = text.replace(/\s+/g, '');
  const headings = ['Daniel Aldana López', 'PERFIL PROFESIONAL', 'CONTACTO', 'HABILIDADES', 'IDIOMAS', 'PROYECTOS', 'EXPERIENCIA', 'EDUCACIÓN', 'CERTIFICACIONES', 'RECONOCIMIENTOS'];
  let cursor = -1;
  for (const heading of headings) { const pos = compact.indexOf(heading.replace(/\s+/g, ''), cursor + 1); assert(pos > cursor, `Orden de ${heading}`); cursor = pos; }
  assert(text.includes('Mobile & Backend'));
  assert(text.includes('ll.daniel.l.aldana.ll@gmail.com'));
  await page.emulateMedia({ media: 'print' });
  await page.screenshot({ path: 'artifacts/print.png', fullPage: true });
  await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'artifacts/mobile-375.png', fullPage: true });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Desborde móvil');
  const report = { pages: pdf.numPages, textOrder: headings, headerVisible: true, mobileWidth: 375, horizontalOverflow: false };
  writeFileSync('artifacts/browser-report.json', JSON.stringify(report, null, 2));
  console.log('PASS: texto ordenado, encabezado y contactos presentes, sin desborde a 375px.');
} finally { await browser.close(); }
