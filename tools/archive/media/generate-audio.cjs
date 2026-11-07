const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const ffmpeg = path.join(__dirname, 'imageio_ffmpeg', 'binaries', 'ffmpeg-win-x86_64-v7.1.exe');
const media = path.join(root, 'web', 'media');
const tracks = [
  ['rain-jungle', 'anoisesrc=color=pink:amplitude=0.34:seed=101:d=120', 'highpass=f=160,lowpass=f=7200,tremolo=f=0.12:d=0.15'],
  ['waves', 'anoisesrc=color=brown:amplitude=0.46:seed=202:d=120', 'highpass=f=35,lowpass=f=700,tremolo=f=0.1:d=0.78'],
  ['stream', 'anoisesrc=color=pink:amplitude=0.34:seed=303:d=120', 'highpass=f=280,lowpass=f=6200,tremolo=f=0.32:d=0.12'],
  ['forest-night', 'anoisesrc=color=white:amplitude=0.16:seed=404:d=120', 'bandpass=f=4700:width_type=o:w=1.2,tremolo=f=0.9:d=0.82'],
  ['campfire', 'anoisesrc=color=brown:amplitude=0.42:seed=505:d=120', 'highpass=f=60,lowpass=f=2400,tremolo=f=0.24:d=0.62'],
  ['sleep-music', 'aevalsrc=0.12*sin(2*PI*130.81*t)+0.09*sin(2*PI*164.81*t)+0.08*sin(2*PI*196*t)+0.06*sin(2*PI*261.63*t):s=44100:d=120', 'tremolo=f=0.1:d=0.08'],
  ['binaural', 'aevalsrc=0.15*sin(2*PI*100*t)|0.15*sin(2*PI*106*t):s=44100:d=120', 'anull'],
];

for (const [id, source, filters] of tracks) {
  const output = path.join(media, `${id}-balanced.wav`);
  const result = spawnSync(ffmpeg, [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'lavfi', '-i', source,
    '-af', `${filters},loudnorm=I=-23:TP=-3:LRA=7,afade=t=in:d=3,afade=t=out:st=117:d=3`,
    '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', output,
  ], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Audio generation failed for ${id}: ${result.stderr}`);
  process.stdout.write(`Generated ${id}\n`);
}
