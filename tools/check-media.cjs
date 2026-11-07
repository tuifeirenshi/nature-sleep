const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'web', 'tracks.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context, { filename: 'web/tracks.js' });
const tracks = context.window.SLEEP_TRACKS;

if (!Array.isArray(tracks) || tracks.length === 0) {
  throw new Error('web/tracks.js does not define any tracks');
}

const ids = new Set();
const required = ['id', 'name', 'icon', 'video', 'audio', 'cover', 'title'];
for (const track of tracks) {
  for (const field of required) {
    if (typeof track[field] !== 'string' || track[field].trim() === '') {
      throw new Error(`${track.id || '<unknown>'}: missing ${field}`);
    }
  }
  if (ids.has(track.id)) throw new Error(`duplicate track id: ${track.id}`);
  ids.add(track.id);
  for (const field of ['video', 'audio', 'cover']) {
    const relativePath = track[field].split('?', 1)[0].split('#', 1)[0];
    const file = path.join(root, 'web', relativePath);
    if (!file.startsWith(path.join(root, 'web') + path.sep)) {
      throw new Error(`${track.id}: ${field} escapes web/media: ${track[field]}`);
    }
    if (!fs.existsSync(file)) throw new Error(`${track.id}: missing ${field} ${track[field]}`);
    const size = fs.statSync(file).size;
    if (size <= 0) throw new Error(`${track.id}: empty ${field} ${track[field]}`);
  }
}

console.log(`Media check passed: ${tracks.length} tracks, ${tracks.length * 2} files.`);
