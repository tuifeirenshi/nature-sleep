const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const ffmpeg = path.join(__dirname, 'imageio_ffmpeg', 'binaries', 'ffmpeg-win-x86_64-v7.1.exe');
const source = path.join(__dirname, 'cc0-audio', 'replacements', 'binaural-75309.mp3');
const output = path.join(root, 'web', 'media', 'brainwave-balanced.wav');
const duration = 30;
const repeats = 5;
const args = ['-y', '-hide_banner', '-loglevel', 'error'];
for (let i = 0; i < repeats; i++) args.push('-i', source);
const parts = [];
for (let i = 0; i < repeats; i++) parts.push(`[${i}:a]atrim=0:${duration},asetpts=PTS-STARTPTS[s${i}]`);
let joined = '[s0]';
for (let i = 1; i < repeats; i++) {
  const next = `j${i}`;
  parts.push(`${joined}[s${i}]acrossfade=d=3:c1=tri:c2=tri[${next}]`);
  joined = `[${next}]`;
}
parts.push(`${joined}atrim=0:120,loudnorm=I=-23:TP=-3:LRA=7,afade=t=in:d=3,afade=t=out:st=117:d=3[out]`);
args.push('-filter_complex', parts.join(';'), '-map', '[out]', '-t', '120', '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', output);
const result = spawnSync(ffmpeg, args, { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status || 1);
console.log(`Processed ${source} -> ${output}`);
