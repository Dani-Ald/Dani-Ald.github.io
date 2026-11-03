const paths = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>',
  phone: '<path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  linkedin: '<rect x="3" y="9" width="4" height="12"/><circle cx="5" cy="4" r="2"/><path d="M11 21V9h4v2c3-4 7-1 7 3v7h-4v-7c0-2-3-2-3 0v7Z"/>',
  github: '<path d="M9 19c-4 1-4-2-6-3m13 6v-4a4 4 0 0 0-1-3c4 0 7-2 7-6a5 5 0 0 0-1-3 5 5 0 0 0 0-4s-2 0-4 2a14 14 0 0 0-8 0C7 2 5 2 5 2a5 5 0 0 0 0 4 5 5 0 0 0-1 3c0 4 3 6 7 6a4 4 0 0 0-1 3v4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>'
};
export const icon = name => `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
