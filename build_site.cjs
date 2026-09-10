// No package installation: use the compiler already versioned in vendor/ at build time.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Babel = require('./vendor/babel.min.js');
const files = ['tweaks-panel.jsx','shared.jsx','gallery.jsx','nav-hero.jsx','apps-music.jsx','player-contact.jsx','player-expand.jsx','queue.jsx','extras.jsx','search.jsx','app.jsx'];
const root = __dirname;
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const hash = value => crypto.createHash('sha256').update(value).digest('hex').slice(0, 16);
function replaceBlock(source, pattern, content) {
  if ((source.match(new RegExp(pattern.source, 'g')) || []).length !== 1) throw new Error('Missing/duplicate generated block: ' + pattern);
  return source.replace(pattern, () => content);
}
function outputs() {
  const combined = files.map(name => '\n// ==========================================\n// FILE: ' + name + '\n// ==========================================\n' + read(name)).join('');
  const compiled = Babel.transform(combined, {presets:['react'], comments:false, compact:true, minified:true}).code + '\n';
  const assets = {};
  for (const [name, content] of [['app', compiled], ['data', read('data.js')], ['supabase-data', read('supabase-data.js')]]) assets['site-assets/' + name + '.' + hash(content) + '.js'] = content;
  const names = Object.keys(assets);
  const boot = read('boot.js');
  const htmlPattern = /<!-- site-runtime:start -->[\s\S]*?<!-- site-runtime:end -->/;
  const swPattern = /\/\/ site-runtime:start[\s\S]*?\/\/ site-runtime:end/;
  const htmlBase = replaceBlock(read('index.html'), htmlPattern, '<!-- site-runtime:start --><!-- site-runtime:end -->');
  const swBase = replaceBlock(read('sw.js'), swPattern, '// site-runtime:start\n// site-runtime:end');
  // Include HTML, worker and startup code so CSS/loader-only changes also update the PWA cache.
  const version = 'jw-v109-' + hash(JSON.stringify([assets, boot, htmlBase, swBase]));
  const runtime = '<!-- site-runtime:start -->\n  <meta name="jw-release" content="' + version + '">\n  <script>\n' + boot.replace(/<\/script/gi, '<\\/script') + '</script>\n' +
    [names[1], names[2], names[0]].map(name => '  <script src="/' + name + '" data-jw-required defer></script>').join('\n') + '\n  <!-- site-runtime:end -->';
  return {
    ...assets,
    'combined.jsx': combined,
    'index.html': replaceBlock(htmlBase, htmlPattern, runtime),
    'sw.js': replaceBlock(swBase, swPattern, '// site-runtime:start\nconst VERSION = ' + JSON.stringify(version) + ';\nconst RUNTIME = ' + JSON.stringify(names.map(name => '/' + name), null, 2) + ';\n// site-runtime:end'),
  };
}
function build(check = false) {
  const result = outputs();
  for (const [name, content] of Object.entries(result)) {
    const file = path.join(root, name);
    if (check) {
      if (!fs.existsSync(file) || read(name) !== content) throw new Error('Stale build output: ' + name + '; run node build_site.cjs');
    } else {
      fs.mkdirSync(path.dirname(file), {recursive:true});
      fs.writeFileSync(file, content);
    }
  }
  // Only our generated files; never touch application assets or other scopes.
  if (!check) for (const name of fs.readdirSync(path.join(root, 'site-assets'))) {
    if (/^(app|data|supabase-data)\.[a-f0-9]{16}\.js$/.test(name) && !Object.hasOwn(result, 'site-assets/' + name)) fs.unlinkSync(path.join(root, 'site-assets', name));
  }
  return result;
}
if (require.main === module) {
  const result = build(process.argv.includes('--check'));
  console.log((process.argv.includes('--check') ? 'Verified' : 'Built') + ' production assets: ' + Object.keys(result).filter(name=>name.startsWith('site-assets/')).join(', '));
}
module.exports = {build, outputs};
