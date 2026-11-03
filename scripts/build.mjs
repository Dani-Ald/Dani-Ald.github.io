import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { icon } from './icons.mjs';

// Interruptor: cambia a false para excluir la foto del PDF (p. ej. empresas que no la aceptan).
const SHOW_PHOTO_IN_PDF = true;
const profile = JSON.parse(readFileSync('data/perfil.json', 'utf8'));
for (const award of profile.awards) {
  const months = { Enero: 'Ene', Febrero: 'Feb', Marzo: 'Mar', Abril: 'Abr', Mayo: 'May', Junio: 'Jun', Julio: 'Jul', Agosto: 'Ago', Septiembre: 'Sep', Octubre: 'Oct', Noviembre: 'Nov', Diciembre: 'Dic' };
  award.date = award.date.replace(/\b(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)\b/g, month => months[month]);
}
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
let html = readFileSync('templates/index.html', 'utf8');
const styleVersion = createHash('sha256').update(readFileSync('styles.css')).digest('hex').slice(0, 12);
html = html.replace('href="styles.css"', `href="styles.css?v=${styleVersion}"`);

const contact = profile.contact;
const phoneNational = contact.phone.replace(/\D/g, '');
const phoneIntl = contact.phone.trim().startsWith('+') ? `+${phoneNational}` : `+52${phoneNational}`;
const section = (id, title, content) => `<section id="${id}"><h2>${title}</h2>${content}</section>`;
const external = (url, label) => url ? `<a href="${escape(url)}">${escape(label)}${icon('external')}</a>` : '';
const entries = items => items.map(item => `<article><h3>${escape(item.name)}</h3><p class="meta">${escape(item.date)}</p>${item.bullets ? `<ul>${item.bullets.map(b => `<li>${escape(b)}</li>`).join('')}</ul>` : ''}${item.url ? `<p class="project-url">${external(item.url, item.url.replace('https://', ''))}</p>` : ''}</article>`).join('');

const person = { '@context': 'https://schema.org', '@type': 'Person', name: profile.name, description: profile.headline, email: contact.email, url: contact.website, image: 'https://dani-ald.github.io/assets/img/foto-perfil.webp', address: { '@type': 'PostalAddress', addressLocality: contact.city }, sameAs: [contact.linkedin, contact.github], knowsLanguage: ['es', 'en'], ...(phoneNational ? { telephone: phoneIntl } : {}) };
html = html.replace('</head>', `<link rel="canonical" href="${escape(contact.website)}"><meta property="og:title" content="${escape(profile.name + ' | ' + profile.headline)}"><meta property="og:description" content="${escape(profile.summary)}"><meta property="og:url" content="${escape(contact.website)}"><meta property="og:type" content="website"><meta property="og:locale" content="es_MX"><meta property="og:image" content="https://dani-ald.github.io/assets/img/foto-perfil.webp"><meta property="og:image:width" content="480"><meta property="og:image:height" content="480"><script type="application/ld+json">${JSON.stringify(person).replaceAll('<', '\\u003c')}</script></head>`);
html = html.replace('<body>', `<body class="${SHOW_PHOTO_IN_PDF ? 'show-photo-pdf' : 'hide-photo-pdf'}">`);

const links = [
  ['mail', `mailto:${contact.email}`, contact.email],
  ...(phoneNational ? [['phone', `tel:${phoneIntl}`, contact.phone]] : []),
  ['linkedin', contact.linkedin, contact.linkedin.replace('https://www.', '')],
  ['github', contact.github, contact.github.replace('https://', '')],
  ['globe', contact.website, contact.website.replace('https://', '').replace(/\/$/, '')]
];
const contactHtml = `<div class="contact">${links.map(([symbol, href, label]) => `<a href="${escape(href)}">${icon(symbol)}${escape(label)}</a>`).join('\n')}</div>`;

const sidebar = [
  section('resumen', 'Perfil profesional', `<p>${escape(profile.summary)}</p>`),
  section('contacto', 'Contacto', contactHtml),
  section('habilidades', 'Habilidades', `<div class="skills">${Object.entries(profile.skills).flatMap(([level, rows]) => rows.map(row => `<p><strong>${escape(level)}</strong>${escape(row)}</p>`)).join('')}</div>`),
  section('idiomas', 'Idiomas', `<p>${escape(profile.languages)}</p>`)
];

const mainSections = [
  section('proyectos', 'Proyectos', entries(profile.projects)),
  section('experiencia', 'Experiencia', entries(profile.experience)),
  section('educacion', 'Educación', profile.education.map(text => `<p>${escape(text)}</p>`).join('')),
  section('certificaciones', 'Certificaciones', profile.certifications.map(cert => {
    const id = cert.id ? `<span class="id-web web-only">ID: ${escape(cert.id)}</span>` : '';
    return `<article class="credential ${cert.featured ? '' : 'web-only'}"><h3>${escape(cert.name)}${id}</h3><p class="meta">${escape(cert.issuer)} · ${escape(cert.date)}</p><div class="web-only">${external(cert.url, 'Verificar')}</div></article>`;
  }).join('')),
  section('reconocimientos', 'Reconocimientos', profile.awards.map(award => {
    const detail = `<div class="web-only"><p>${escape(award.organization)}. ${escape(award.detail)}</p>${external(award.url, 'Verificar')}</div>`;
    return `<article class="award ${award.featured ? '' : 'web-only'}"><h3>${escape(award.name)}</h3><p class="meta">${escape(award.date)}</p>${detail}</article>`;
  }).join(''))
];

html = html.replaceAll('{{NAME}}', escape(profile.name)).replaceAll('{{HEADLINE}}', escape(profile.headline));
html = html.replace('{{CITY}}', `${icon('pin')}${escape(contact.city)}`);
html = html.replace('{{SIDEBAR}}', sidebar.join('\n'));
html = html.replace('{{MAIN}}', mainSections.join('\n'));

const documents = readdirSync('Certificados', { recursive: true }).filter(file => file.endsWith('.pdf'));
const catalog = `<details class="web-only catalog"><summary>Archivo documental completo (${documents.length} PDF)</summary><p>Documentos originales; algunos nombres todavía requieren identificación.</p><ul>${documents.map(file => `<li>${external('Certificados/' + file.replaceAll('\\', '/').split('/').map(encodeURIComponent).join('/'), file.split(/[\\/]/).pop())}</li>`).join('')}</ul></details>`;
html = html.replace('</main>', `${catalog}</main>`);
writeFileSync('index.html', html);
