const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const ffmpeg = path.join(__dirname, 'imageio_ffmpeg', 'binaries', 'ffmpeg-win-x86_64-v7.1.exe');
const sourceDir = path.join(__dirname, 'cc0-audio');
const mediaDir = path.join(root, 'web', 'media');
const ids = ['rain-jungle', 'waves', 'stream', 'forest-night', 'campfire', 'sleep-music', 'binaural'];

function durationOf(file) {
  const probe = spawnSync(ffmpeg, ['-hide_banner', '-i', file, '-f', 'null', 'NUL'], { encoding: 'utf8' });
  const times = [...probe.stderr.matchAll(/time=(\d+):(\d+):(\d+\.\d+)/g)];
  const match = times.at(-1);
  if (!match) throw new Error(`Cannot read duration for ${file}`);
  return (+match[1] * 3600) + (+match[2] * 60) + +match[3];
}

for (const id of ids) {
  const source = id === 'binaural'
    ? path.join(sourceDir, 'replacements', 'pink-noise-348765-segment.mp3')
    : path.join(sourceDir, `${id}-preview.mp3`);
  const output = path.join(mediaDir, `${id === 'binaural' ? 'pink-noise' : id}-balanced.wav`);
  if (!fs.existsSync(source) || fs.statSync(source).size === 0) throw new Error(`Missing CC0 source ${source}`);
  const duration = durationOf(source);
  const args = ['-y', '-hide_banner', '-loglevel', 'error'];
  if (duration >= 120) {
    args.push('-i', source, '-af', 'atrim=0:120,loudnorm=I=-23:TP=-3:LRA=7,afade=t=in:d=3,afade=t=out:st=117:d=3', '-t', '120');
  } else {
    const repeats = Math.ceil((120 + 3) / duration);
    for (let i = 0; i < repeats; i++) args.push('-i', source);
    const parts = [];
    for (let i = 0; i < repeats; i++) parts.push(`[${i}:a]atrim=0:${duration - 0.05},asetpts=PTS-STARTPTS[s${i}]`);
    let joined = '[s0]';
    for (let i = 1; i < repeats; i++) {
      const next = `j${i}`;
      parts.push(`${joined}[s${i}]acrossfade=d=3:c1=tri:c2=tri[${next}]`);
      joined = `[${next}]`;
    }
    args.push('-filter_complex', `${parts.join(';')};${joined}atrim=0:120,loudnorm=I=-23:TP=-3:LRA=7,afade=t=in:d=3,afade=t=out:st=117:d=3[out]`,
      '-map', '[out]', '-t', '120');
  }
  args.push('-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', output);
  const result = spawnSync(ffmpeg, args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Processing failed for ${id}: ${result.stderr}`);
  process.stdout.write(`Processed CC0 audio: ${id}\n`);
}
