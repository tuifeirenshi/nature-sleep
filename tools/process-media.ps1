$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot
$ff="$PSScriptRoot\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
& $ff -y -hide_banner -loglevel error -i "$PSScriptRoot\forest4k-original.mp4" -an -c:v copy -movflags +faststart "$root\web\media\rainforest4k.mp4"
if($LASTEXITCODE){throw 'Video processing failed'}
foreach($name in @('rain-heavy','rain-light','rain-jungle','waves','stream','forest-night')){
 $source=if($name -eq 'stream'){"$root\web\media\stream.mp3"}else{"$PSScriptRoot\$name-original.mp3"}
 if($name -eq 'stream'){Copy-Item $source "$PSScriptRoot\stream-original.mp3" -Force;$source="$PSScriptRoot\stream-original.mp3"}
 # Five repeats with overlap preserve the original recording while smoothing joins.
 & $ff -y -hide_banner -loglevel error -i $source -filter_complex '[0:a]asplit=5[a][b][c][d][e];[a][b]acrossfade=d=1:c1=tri:c2=tri[ab];[ab][c]acrossfade=d=1:c1=tri:c2=tri[abc];[abc][d]acrossfade=d=1:c1=tri:c2=tri[abcd];[abcd][e]acrossfade=d=1:c1=tri:c2=tri[out]' -map '[out]' -c:a libmp3lame -b:a 160k "$root\web\media\$name.mp3"
 if($LASTEXITCODE){throw "Audio processing failed: $name"}
}
