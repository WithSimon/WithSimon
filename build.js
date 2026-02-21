#!/usr/bin/env node
/**
 * Build script: injects partials/header.html and partials/footer.html
 * into each page. Replaces the header block (from <!-- Header --> to just
 * before <main>) and the footer block (from <!-- Footer --> to </body>).
 * Run: node build.js
 * Edit partials, then run again before commit/deploy.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const PARTIALS = path.join(ROOT, 'partials');
const PAGES = [
  'index.html',
  'hire-me.html',
  'product.html',
  'my-work.html',
  'my-thoughts.html',
  'about-me.html',
];

const headerHtml = fs.readFileSync(path.join(PARTIALS, 'header.html'), 'utf8');
const footerHtml = fs.readFileSync(path.join(PARTIALS, 'footer.html'), 'utf8');

let updated = 0;
for (const file of PAGES) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace header block: from "<!-- Header -->" or "<header" up to (but not including) "<main>"
  const headerPattern = /(\s*)(<!--\s*Header\s*-->[\s\S]*?)(\n\s*<main>)/;
  if (headerPattern.test(content)) {
    content = content.replace(headerPattern, headerHtml.trimStart() + '$3');
  }

  // Replace footer block: from "<!-- Footer -->" only through the shared script (toggleMobileMenu + back-to-top).
  // Preserve any page-specific scripts that follow (e.g. products.js, marquee on index).
  const footerPattern = /(\s*)(<!--\s*Footer\s*-->[\s\S]*?toggleMobileMenu[\s\S]*?<\/script>)\s*/;
  if (footerPattern.test(content)) {
    content = content.replace(footerPattern, footerHtml.trimEnd() + '\n\n    ');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    updated++;
    console.log('Updated:', file);
  }
}
console.log(updated ? `Done. ${updated} file(s) updated.` : 'No files needed updating.');
console.log('To change nav or footer: edit partials/header.html or partials/footer.html, then run node build.js again.');
