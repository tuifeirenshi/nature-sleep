$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot
$ffmpeg = Join-Path $PSScriptRoot 'imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe'
$output = Join-Path $root 'web\media\binaural-balanced.wav'

# Integer-cycle frequencies over 120 seconds make the loop endpoints match.
& $ffmpeg -y -hide_banner -loglevel error `
  -f lavfi -i 'aevalsrc=0.15*sin(2*PI*100*t)|0.15*sin(2*PI*106*t):s=44100:d=120' `
  -ar 44100 -ac 2 -c:a pcm_s16le $output
if ($LASTEXITCODE) { throw 'Binaural audio generation failed' }
