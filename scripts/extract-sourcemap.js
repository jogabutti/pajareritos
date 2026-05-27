const fs = require('fs');
const path = require('path');

function safeName(p) {
  // remove leading ../ or / and normalize
  return p.replace(/^(\.\.\/|\/)+/, '');
}

function main() {
  const mapPath = process.argv[2] || '.gh-pages-worktree/static/js/main.2c47b1b7.js.map';
  const outDir = process.argv[3] || 'recovered_from_ghpages';

  if (!fs.existsSync(mapPath)) {
    console.error('Source map not found:', mapPath);
    process.exit(2);
  }

  const raw = fs.readFileSync(mapPath, 'utf8');
  let map;
  try {
    map = JSON.parse(raw);
  } catch (err) {
    console.error('Invalid JSON in source map:', err.message);
    process.exit(3);
  }

  const sources = map.sources || [];
  const contents = map.sourcesContent || [];

  if (!contents.length) {
    console.error('No sourcesContent found in the source map.');
    process.exit(4);
  }

  for (let i = 0; i < sources.length; i++) {
    const src = sources[i];
    const content = contents[i] || '';
    const safe = safeName(src);
    const dest = path.join(outDir, safe);
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dest, content, 'utf8');
    console.log('Wrote', dest);
  }

  console.log('Extraction complete. Files saved to', outDir);
}

main();
