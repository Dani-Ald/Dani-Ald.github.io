import { readFileSync, writeFileSync } from 'node:fs';
import { icon } from './icons.mjs';

const profile = JSON.parse(readFileSync('data/perfil.json', 'utf8'));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
let html = readFileSync('templates/index.html', 'utf8');
const sections = [];
const section = (id, title, content) => `<section id="${id}"><h2>${title}</h2>${content}</section>`;
sections.push(section('resumen', 'Resumen', `<p>${escape(profile.summary)}</p>`));
const external = (url, label) => url ? `<a href="${escape(url)}">${escape(label)}${icon('external')}</a>` : '';
const entries = items => items.map(item => `<article><h3>${escape(item.name)}</h3><p class="meta">${escape(item.date)}</p>${item.bullets ? `<ul>${item.bullets.map(b => `<li>${escape(b)}</li>`).join('')}</ul>` : ''}${item.url ? `<p class="project-url">${external(item.url, item.url.replace('https://', ''))}</p>` : ''}</article>`).join('');
sections.push(section('proyectos', 'Proyectos', entries(profile.projects)));
const contact = profile.contact;
const links = [
  ['mail', `mailto:${contact.email}`, contact.email],
  ...(contact.phone.trim() ? [['phone', `tel:${contact.phone.replace(/[^+\d]/g, '')}`, contact.phone]] : []),
  ['linkedin', contact.linkedin, contact.linkedin.replace('https://www.', '')],
  ['github', contact.github, contact.github.replace('https://', '')],
  ['globe', contact.website, contact.website.replace('https://', '').replace(/\/$/, '')]
];
html = html.replace('{{CONTACT}}', links.map(([symbol, href, label]) => `<a href="${escape(href)}">${icon(symbol)}${escape(label)}</a>`).join('\n'));
html = html.replace('{{CITY}}', `${icon('pin')}${escape(contact.city)}`);
html = html.replaceAll('{{NAME}}', escape(profile.name)).replaceAll('{{HEADLINE}}', escape(profile.headline)).replaceAll('{{CITY}}', escape(contact.city));
html = html.replace('{{CONTENT}}', sections.join('\n'));
writeFileSync('index.html', html);
