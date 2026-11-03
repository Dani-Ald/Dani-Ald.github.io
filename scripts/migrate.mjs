// One-time import of the original portfolio into the structured source.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const original = readFileSync('index.html', 'utf8');
const profile = JSON.parse(readFileSync('data/perfil.json', 'utf8'));
const plain = text => text.replace(/<[^>]*>/g, '').replaceAll('&amp;', '&').replaceAll('&nbsp;', ' ').replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').replace(/\s+/g, ' ').trim();
profile.certifications = [...original.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].filter(m => m[1].includes('cert-name')).map(m => {
  const row = m[1];
  const cells = [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m => m[1]);
  const name = plain(row.match(/class="cert-name">(.*?)<\/div>/)[1]);
  const hrefs = [...row.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  return { name, issuer: plain(row.match(/class="cert-issuer">(.*?)<\/div>/)[1]), date: plain(cells[2]), id: plain(cells[3]).includes('…') ? '' : plain(cells[3]).replace('—', ''), url: hrefs[0], documents: hrefs.filter(h => h.endsWith('.pdf')), featured: /Python Programming|Introduction to HTML5|Agile with Atlassian|Enterprise Networking|Manufacturing/.test(name) };
});
profile.awards = [...original.matchAll(/class="award-name">(.*?)<\/div>[\s\S]*?class="award-org">(.*?)<\/div>[\s\S]*?class="award-date">(.*?)<\/div>[\s\S]*?class="award-detail">(.*?)<\/div>[\s\S]*?<a href="([^"]+)"/g)].map((m, i) => ({ name: plain(m[1]), organization: plain(m[2]), date: plain(m[3]).split(' ·')[0], detail: plain(m[4]), url: i === 0 ? '' : m[5], featured: i < 3 }));
profile.awards[0].name = 'VetSense — participación en Innova TecNM 2026, etapa local';
mkdirSync('archivo', { recursive: true });
for (const file of ['README.md', 'perfil_profesional_y_portafolio_de_credenciales.md']) {
  const text = readFileSync(file, 'utf8').replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').replace(/convergencia|robust[oa]|glassmorphism|apasionad[oa]|ejecución técnica sólida de extremo a extremo|visión estratégica|resolución de problemas complejos|orientado a resultados/gi, '[redacción retirada]');
  writeFileSync(`archivo/${file}`, text);
}
writeFileSync('data/perfil.json', JSON.stringify(profile, null, 2) + '\n');
mkdirSync('templates', { recursive: true });
writeFileSync('templates/index.html', original.replace(/<div class="hero-contact">[\s\S]*?<\/div>/, '<div class="hero-contact">{{CONTACT}}</div>'));
