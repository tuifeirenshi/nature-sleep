const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const ffmpeg = path.join(__dirname, 'imageio_ffmpeg', 'binaries', 'ffmpeg-win-x86_64-v7.1.exe');
const source = path.join(__dirname, 'cc0-audio', 'replacements', 'yourell-theta-138394.mp3');
const output = path.join(root, 'web', 'media', 'brainwave-balanced.wav');

const filter = [
  '[0:a]atrim=0:6,asetpts=PTS-STARTPTS[head]',
  '[1:a]atrim=6:117,asetpts=PTS-STARTPTS[body]',
  '[2:a]atrim=117:123,asetpts=PTS-STARTPTS[tail]',
  '[tail][head]acrossfade=d=3:c1=tri:c2=tri,asetpts=PTS-STARTPTS[wrap]',
  '[body][wrap]concat=n=2:v=0:a=1,asetpts=PTS-STARTPTS,loudnorm=I=-23:TP=-3:LRA=7[out]',
].join(';');

const result = spawnSync(ffmpeg, [
  '-y', '-hide_banner', '-loglevel', 'error', '-i', source, '-i', source, '-i', source,
  '-filter_complex', filter, '-map', '[out]', '-t', '120',
  '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', output,
], { stdio: 'inherit' });

if (result.status !== 0) process.exit(result.status || 1);
process.stdout.write(`Processed ${source} -> ${output}\n`);
