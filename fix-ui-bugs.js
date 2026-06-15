// fix-ui-bugs.js
// Run from E:\tryit-educations\  →  node fix-ui-bugs.js
// Then restart dev server: npm run dev

const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

let fixed = 0;
function ok(msg)   { console.log('✅ ' + msg); fixed++; }
function skip(msg) { console.log('⏭️  ' + msg); }
function warn(msg) { console.log('⚠️  ' + msg); }

// ════════════════════════════════════════════════════════════════
// FIX 1 — index.html: charset + viewport (fixes emoji garbling)
// ════════════════════════════════════════════════════════════════
const htmlPath = path.join(ROOT, 'index.html');
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  let changed = false;

  if (!html.includes('charset')) {
    html = html.replace(
      '<head>',
      '<head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />'
    );
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(htmlPath, html, 'utf8');
    ok('Added charset UTF-8 to index.html (fixes emoji garbling)');
  } else {
    skip('index.html charset already set');
  }
} else {
  warn('index.html not found — skipping');
}

// ════════════════════════════════════════════════════════════════
// FIX 2 — tailwind.config.js: emoji font fallback
// ════════════════════════════════════════════════════════════════
const twPath = path.join(ROOT, 'tailwind.config.js');
if (fs.existsSync(twPath)) {
  let tw = fs.readFileSync(twPath, 'utf8');
  if (!tw.includes('Noto Color Emoji')) {
    // Inject emoji fallback after any existing sans array, or add theme extend
    if (tw.includes("fontFamily")) {
      tw = tw.replace(
        /fontFamily:\s*\{([\s\S]*?)\}/,
        (match) => {
          // Add emoji fallback to any array values in fontFamily
          return match.replace(/\[([^\]]+)\]/g, (arrMatch, arrContent) => {
            if (arrContent.includes('Emoji')) return arrMatch;
            return `[${arrContent.trim().replace(/,?\s*$/, '')}, 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'sans-serif']`;
          });
        }
      );
    } else {
      // No fontFamily defined — add one
      tw = tw.replace(
        'extend: {',
        `extend: {\n      fontFamily: {\n        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'sans-serif'],\n      },`
      );
    }
    fs.writeFileSync(twPath, tw);
    ok('Added emoji font fallback to tailwind.config.js');
  } else {
    skip('Emoji fonts already in tailwind.config.js');
  }
} else {
  warn('tailwind.config.js not found — skipping');
}

// ════════════════════════════════════════════════════════════════
// FIX 3 — src/index.css: emoji font fallback in body
// ════════════════════════════════════════════════════════════════
const cssPath = path.join(ROOT, 'src/index.css');
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  if (!css.includes('Noto Color Emoji')) {
    const emojiBlock = `
/* ── Emoji font fallback (added by fix-ui-bugs.js) ── */
body {
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;
}
`;
    css = css + '\n' + emojiBlock;
    fs.writeFileSync(cssPath, css);
    ok('Added emoji font fallback to src/index.css');
  } else {
    skip('Emoji fonts already in src/index.css');
  }
} else {
  warn('src/index.css not found — skipping');
}

// ════════════════════════════════════════════════════════════════
// FIX 4 — ErrorBoundary component (fixes flicker → blank)
// ════════════════════════════════════════════════════════════════
const ebPath = path.join(ROOT, 'src/components/ErrorBoundary.jsx');
fs.mkdirSync(path.dirname(ebPath), { recursive: true });
if (!fs.existsSync(ebPath)) {
  fs.writeFileSync(ebPath, `import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[TryIT ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif', color: '#1E3A5F', padding: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            This page is being built
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            {this.state.error?.message || 'Something went wrong loading this page.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: '#1E3A5F', color: 'white', border: 'none',
              padding: '0.75rem 2rem', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 600, fontSize: '1rem'
            }}
          >
            ← Go Back
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
`);
  ok('Created src/components/ErrorBoundary.jsx');
} else {
  skip('ErrorBoundary.jsx already exists');
}

// ════════════════════════════════════════════════════════════════
// FIX 5 — Wrap routes in ErrorBoundary + Suspense in App.jsx
// ════════════════════════════════════════════════════════════════
const appPaths = [
  path.join(ROOT, 'src/App.jsx'),
  path.join(ROOT, 'src/app.jsx'),
  path.join(ROOT, 'src/main.jsx'),
];

let appPath = appPaths.find(fs.existsSync);
if (appPath) {
  let app = fs.readFileSync(appPath, 'utf8');
  let changed = false;

  // Add ErrorBoundary import if missing
  if (!app.includes('ErrorBoundary')) {
    app = `import ErrorBoundary from './components/ErrorBoundary';\n` + app;
    changed = true;
  }

  // Wrap RouterProvider or BrowserRouter in ErrorBoundary if not already
  if (!app.includes('<ErrorBoundary>')) {
    app = app
      .replace(/<RouterProvider/g, '<ErrorBoundary><RouterProvider')
      .replace(/<\/RouterProvider>/g, '</RouterProvider></ErrorBoundary>')
      .replace(/<BrowserRouter/g, '<ErrorBoundary><BrowserRouter')
      .replace(/<\/BrowserRouter>/g, '</BrowserRouter></ErrorBoundary>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(appPath, app);
    ok(`Wrapped router in ErrorBoundary in ${path.basename(appPath)}`);
  } else {
    skip('ErrorBoundary already in ' + path.basename(appPath));
  }
} else {
  warn('App.jsx / main.jsx not found — manually add ErrorBoundary');
}

// ════════════════════════════════════════════════════════════════
// FIX 6 — Suspense fallback in routes.jsx (fixes lazy load blank)
// ════════════════════════════════════════════════════════════════
const routesPath = path.join(ROOT, 'src/routes.jsx');
if (fs.existsSync(routesPath)) {
  let routes = fs.readFileSync(routesPath, 'utf8');
  let changed = false;

  // Add Suspense import if missing
  if (!routes.includes('Suspense')) {
    routes = routes.replace(
      /import React.*from 'react';/,
      `import React, { Suspense } from 'react';`
    );
    if (!routes.includes('Suspense')) {
      routes = `import { Suspense } from 'react';\n` + routes;
    }
    changed = true;
  }

  // Add a loading fallback component if missing
  if (!routes.includes('PageLoader') && !routes.includes('LoadingFallback')) {
    const loaderCode = `
// Loading fallback for lazy routes
const PageLoader = () => (
  <div style={{
    minHeight: '60vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexDirection: 'column', gap: '1rem'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '50%',
      border: '4px solid #C9A84C', borderTopColor: 'transparent',
      animation: 'spin 0.8s linear infinite'
    }} />
    <p style={{ color: '#1E3A5F', fontWeight: 600 }}>Loading...</p>
    <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
  </div>
);
`;
    // Insert after imports
    const lastImportIdx = routes.lastIndexOf('\nimport ');
    const insertIdx = routes.indexOf('\n', lastImportIdx + 1) + 1;
    routes = routes.slice(0, insertIdx) + loaderCode + routes.slice(insertIdx);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(routesPath, routes);
    ok('Added Suspense + PageLoader to routes.jsx');
  } else {
    skip('routes.jsx already has Suspense');
  }
} else {
  warn('src/routes.jsx not found — skipping');
}

// ════════════════════════════════════════════════════════════════
// FIX 7 — Scan for missing route component files
// ════════════════════════════════════════════════════════════════
console.log('\n── Scanning for missing route components ──');
const navRoutes = [
  { file: 'src/pages/FeaturesPage.jsx',    name: 'Features' },
  { file: 'src/pages/AllExams.jsx',        name: 'Exams' },
  { file: 'src/pages/Pricing.jsx',         name: 'Pricing' },
  { file: 'src/pages/ImpactPage.jsx',      name: 'Impact' },
  { file: 'src/pages/FreeAccess.jsx',      name: 'Free Access' },
  { file: 'src/pages/Institutions.jsx',    name: 'Institutions' },
  { file: 'src/pages/LandingPage.jsx',     name: 'Landing Page' },
  { file: 'src/pages/Dashboard.jsx',       name: 'Dashboard' },
];

const missing = [];
for (const r of navRoutes) {
  const full = path.join(ROOT, r.file);
  if (!fs.existsSync(full)) {
    missing.push(r);
    warn(`MISSING: ${r.file} (nav: ${r.name})`);
  } else {
    console.log(`   ✓ ${r.file}`);
  }
}

// Create stub pages for any missing ones
if (missing.length > 0) {
  console.log('\n── Creating stub pages for missing routes ──');
  for (const r of missing) {
    const full = path.join(ROOT, r.file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    const compName = path.basename(r.file, '.jsx');
    fs.writeFileSync(full, `// ${r.file} — stub created by fix-ui-bugs.js
import React from 'react';

export default function ${compName}() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif', color: '#1E3A5F', padding: '2rem',
      background: '#F8FAFC'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        ${r.name}
      </h1>
      <p style={{ color: '#888' }}>
        This page is coming soon — TryIT Educations
      </p>
    </div>
  );
}
`);
    ok(`Created stub: ${r.file}`);
  }
}

// ════════════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════════');
console.log(`  ✅ Fixes applied: ${fixed}`);
console.log('  👉 Now run: npm run dev');
console.log('  👉 Hard-refresh browser: Ctrl + Shift + R');
console.log('══════════════════════════════════════════════\n');
