import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const html = readFileSync('index.html', 'utf8');
const emoji = /[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u20E3]/gu;
const forbidden = /convergencia|robust[oa]|glassmorphism|apasionad[oa]|ejecución técnica sólida de extremo a extremo|visión estratégica|resolución de problemas complejos|orientad[oa] a resultados/gi;
assert.equal((html.match(emoji) || []).length, 0, 'Emojis presentes');
assert.equal((html.match(forbidden) || []).length, 0, 'Redacción prohibida');
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert(!html.includes('PENDIENTE'));
assert(!html.includes('{{'));
const data = JSON.parse(readFileSync('data/perfil.json', 'utf8'));
if (!data.contact.phone.trim()) assert(!html.includes('tel:'));
for (const match of html.matchAll(/href="([^"]+)"/g)) {
  const url = match[1].replaceAll('&amp;', '&');
  if (!/^(https?:|mailto:|tel:|#)/.test(url)) assert(existsSync(decodeURIComponent(url.split('#')[0])), `Falta ${url}`);
}
assert.equal(data.certifications.filter(c => c.featured).length, 5);
assert.equal(data.awards.filter(c => c.featured).length, 3);
for (const svg of html.matchAll(/<svg\b[^>]*>/g)) {
  assert(svg[0].includes('stroke="currentColor"'));
  assert(svg[0].includes('stroke-width="1.5"'));
  assert(svg[0].includes('fill="none"'));
}
console.log('PASS: 0 emojis Unicode; 0 expresiones prohibidas; un h1; contactos condicionales; enlaces locales; 5 certificaciones; 3 reconocimientos; SVG conformes.');
