const { spawn } = require('node:child_process');
const https = require('node:https');
const path = require('node:path');

const items = [
  ['rain-jungle', 'https://cdn.freesound.org/previews/765/765980_15695818-hq.mp3'],
  ['waves', 'https://cdn.freesound.org/previews/635/635104_10065335-hq.mp3'],
  ['stream', 'https://cdn.freesound.org/previews/446/446019_7241289-hq.mp3'],
  ['forest-night', 'https://cdn.freesound.org/previews/750/750874_16236894-hq.mp3'],
  ['campfire', 'https://cdn.freesound.org/previews/588/588401_6456158-hq.mp3'],
  ['sleep-music', 'https://cdn.freesound.org/previews/867/867839_15636277-hq.mp3'],
  ['binaural', 'https://cdn.freesound.org/previews/75/75309_1163156-hq.mp3'],
];

function getSize(url) {
  return new Promise((resolve, reject) => {
    https.request(url, { method: 'HEAD' }, response => {
      const size = Number(response.headers['content-length']);
      response.resume();
      if (response.statusCode !== 200 || !size) reject(new Error(`HEAD failed for ${url}`));
      else resolve(size);
    }).on('error', reject).end();
  });
}

function download(name, url, size) {
  return new Promise((resolve, reject) => {
    const dest = name === 'binaural'
      ? path.join(__dirname, 'cc0-audio', 'replacements', 'binaural-75309.mp3')
      : path.join(__dirname, 'cc0-audio', `${name}-preview.mp3`);
    const proc = spawn(process.execPath, [path.join(__dirname, 'download.cjs'), url, dest, String(size)], { stdio: 'inherit' });
    proc.on('exit', code => code === 0 ? resolve() : reject(new Error(`${name} download exited ${code}`)));
    proc.on('error', reject);
  });
}

Promise.all(items.map(async ([name, url]) => {
  const size = await getSize(url);
  await download(name, url, size);
  process.stdout.write(`Fetched ${name}\n`);
})).catch(error => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
