const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const ffmpeg = path.join(__dirname, 'imageio_ffmpeg', 'binaries', 'ffmpeg-win-x86_64-v7.1.exe');
const sourceDir = path.join(__dirname, 'cc0-audio', 'replacements');
const audioDir = path.join(__dirname, 'cc0-audio');
const tempDir = path.join(__dirname, 'temp');
const mediaDir = path.join(root, 'web', 'media');
const tracks = {
  // This pass replaces only the two requested audio scenes.
  'rain-jungle-online.mp3': ['rain-jungle-balanced.wav', -23, ''],
  'binaural-75309.mp3': ['binaural-balanced.wav', -23, '']
};

function durationOf(file) {
  const probe = spawnSync(ffmpeg, ['-hide_banner', '-i', file, '-f', 'null', 'NUL'], { encoding: 'utf8' });
  const matches = [...probe.stderr.matchAll(/time=(\d+):(\d+):(\d+\.\d+)/g)];
  const match = matches.at(-1);
  if (!match) throw new Error(`Cannot read duration for ${file}: ${probe.stderr}`);
  return (+match[1] * 3600) + (+match[2] * 60) + +match[3];
}

function extendShortSource(source, duration, sourceName) {
  const repeats = Math.ceil(126 / (duration - 3));
  const parts = [];
  const args = ['-y', '-hide_banner', '-loglevel', 'error'];
  for (let i = 0; i < repeats; i++) args.push('-i', source);
  for (let i = 0; i < repeats; i++) {
    parts.push(`[${i}:a]atrim=0:${duration - 0.05},asetpts=PTS-STARTPTS[s${i}]`);
  }
  let joined = '[s0]';
  for (let i = 1; i < repeats; i++) {
    const next = `j${i}`;
    parts.push(`${joined}[s${i}]acrossfade=d=3:c1=tri:c2=tri[${next}]`);
    joined = `[${next}]`;
  }
  const extended = path.join(tempDir, `${path.parse(sourceName).name}-loop-source.wav`);
  args.push('-filter_complex', parts.join(';'), '-map', joined, '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', extended);
  const result = spawnSync(ffmpeg, args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Loop source preparation failed for ${sourceName}: ${result.stderr}`);
  return extended;
}

for (const [sourceName, [outputName, targetLufs, compressor]] of Object.entries(tracks)) {
  const replacementSource = path.join(sourceDir, sourceName);
  const source = fs.existsSync(replacementSource) ? replacementSource : path.join(audioDir, sourceName);
  const output = path.join(mediaDir, outputName);
  const duration = durationOf(source);
  if (duration < 6) throw new Error(`${sourceName} is too short for a three-second crossfade`);
  fs.mkdirSync(tempDir, { recursive: true });
  const loopSource = duration < 123 ? extendShortSource(source, duration, sourceName) : source;
  if (durationOf(loopSource) < 123) throw new Error(`${sourceName} could not be extended for a seamless loop`);
  const args = [
    '-y', '-hide_banner', '-loglevel', 'error', '-i', loopSource,
    '-ss', '120', '-t', '3', '-i', loopSource,
    '-t', '3', '-i', loopSource,
    '-filter_complex',
    `[0:a]atrim=start=3:end=123,asetpts=PTS-STARTPTS[body];[1:a]asetpts=PTS-STARTPTS[tail];[2:a]asetpts=PTS-STARTPTS[head];[tail][head]acrossfade=d=3:c1=tri:c2=tri[seam];[body][seam]acrossfade=d=3:c1=tri:c2=tri,${compressor ? `${compressor},` : ''}loudnorm=I=${targetLufs}:TP=-3:LRA=7[out]`,
    '-map', '[out]', '-t', '123'
  ];
  args.push('-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', output);
  const result = spawnSync(ffmpeg, args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Processing failed for ${sourceName}: ${result.stderr}`);
  if (loopSource !== source) fs.unlinkSync(loopSource);
  console.log(`Processed ${sourceName} -> ${outputName}`);
}
