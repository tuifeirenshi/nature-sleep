const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', '*.md'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const errors = [];
const anchors = new Map();
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function headings(file) {
  if (anchors.has(file)) return anchors.get(file);
  const ids = new Set(), counts = new Map();
  let fenced = false;
  for (const line of read(file).split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const match = /^#{1,6}\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const slug = match[1].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').toLowerCase().replace(/[^\p{L}\p{M}\p{N}_\-\s]/gu, '').replace(/\s/g, '-');
    const count = counts.get(slug) || 0;
    counts.set(slug, count + 1);
    ids.add(count ? `${slug}-${count}` : slug);
  }
  anchors.set(file, ids);
  return ids;
}
let links = 0;
for (const file of new Set(files)) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const text = read(file).replace(/^\s*(```|~~~)[\s\S]*?^\s*\1.*$/gm, '');
  if (!/English.*简体中文/.test(text.split(/\r?\n/)[0])) errors.push(`${file}: missing opening language navigation`);
  for (const match of text.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const href = match[1];
    if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//')) continue;
    links++;
    const [target, fragment] = href.split('#');
    const absolute = path.resolve(path.dirname(path.join(root, file)), decodeURIComponent(target || path.basename(file)));
    const relative = path.relative(root, absolute);
    if (relative.startsWith('..') || !fs.existsSync(absolute)) { errors.push(`${file}: missing local target ${href}`); continue; }
    if (fragment && absolute.endsWith('.md') && !headings(relative).has(decodeURIComponent(fragment))) errors.push(`${file}: missing heading ${href}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Documentation check passed: ${new Set(files).size} Markdown files, ${links} local links; opening language navigation and linked headings exist.`);
