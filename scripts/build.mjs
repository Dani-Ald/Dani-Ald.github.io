import { readFileSync, writeFileSync } from 'node:fs';
import { icon } from './icons.mjs';

const profile = JSON.parse(readFileSync('data/perfil.json', 'utf8'));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
let html = readFileSync('templates/index.html', 'utf8');
html = html.replace('{{CONTENT}}', '');
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
writeFileSync('index.html', html);
