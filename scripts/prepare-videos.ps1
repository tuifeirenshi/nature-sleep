$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$outputDir = Join-Path $root 'android\build\compressed-video-4k-9m'
$ffmpeg = (Get-Command ffmpeg.exe -ErrorAction Stop).Source
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$names = @('rain-loop4k.mp4', 'waves-4k.mp4', 'stream-clear.mp4', 'summer-night4k.mp4', 'campfire-close.mp4', 'music-moon.mp4', 'binaural-calm-light.mp4')
foreach ($name in $names) {
    $source = Join-Path $root "web\media\$name"
    $output = Join-Path $outputDir $name
    if ((Test-Path $output) -and (Get-Item $output).LastWriteTimeUtc -ge (Get-Item $source).LastWriteTimeUtc) { continue }
    $temporary = Join-Path $outputDir ("$name.partial.mp4")
    $passlog = Join-Path $outputDir ("$name.pass")
    $common = @('-hide_banner', '-loglevel', 'error', '-y', '-i', $source, '-map', '0:v:0', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-b:v', '9M', '-passlogfile', $passlog)
    if ($name -eq 'campfire-close.mp4') { $common += @('-r', '30') }
    Write-Output "Encoding $name (pass 1/2)"
    & $ffmpeg @common '-pass' '1' '-f' 'null' 'NUL'
    if ($LASTEXITCODE -ne 0) { throw "First encoding pass failed: $name" }
    Write-Output "Encoding $name (pass 2/2)"
    & $ffmpeg @common '-pass' '2' '-movflags' '+faststart' $temporary
    if ($LASTEXITCODE -ne 0) { throw "Second encoding pass failed: $name" }
    Move-Item -LiteralPath $temporary -Destination $output -Force
}
