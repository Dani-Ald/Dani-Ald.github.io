import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { writeFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
mkdirSync('artifacts', { recursive: true });
const browser = await chromium.launch({ args: ['--remote-debugging-port=9222'] });
try {
  const results = [];
  for (const mode of ['mobile', 'desktop']) {
    const { lhr, report } = await lighthouse('http://127.0.0.1:4173/', { port: 9222, output: 'html', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], ...(mode === 'desktop' ? { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false } } : {}) });
    const scores = Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]));
    writeFileSync(`artifacts/lighthouse-${mode}.html`, report);
    writeFileSync(`artifacts/lighthouse-${mode}.json`, JSON.stringify(lhr, null, 2));
    results.push({ mode, ...scores });
    console.log(mode, scores);
    assert(scores.performance >= 90 && scores.accessibility >= 90, 'Lighthouse por debajo de 90');
  }
  writeFileSync('artifacts/lighthouse-summary.json', JSON.stringify(results, null, 2));
} finally { await browser.close(); }
