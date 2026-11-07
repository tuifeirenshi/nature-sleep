$ErrorActionPreference='Stop'
foreach($item in @(@('summer-night',31613),@('music-lake',1704))){
 $page=(Invoke-WebRequest "https://mixkit.co/free-stock-video/download/$($item[1])/?context=sidebar&type=2160p").Content
 $url=[regex]::Match($page,'data-download--modal-url-value="([^"]+)"').Groups[1].Value
 $size=(Invoke-WebRequest $url -Method Head).Headers['Content-Length'][0]
 & node "$PSScriptRoot\download.cjs" $url "$PSScriptRoot\$($item[0]).mp4" $size
 if($LASTEXITCODE){throw 'Video download failed'}
 Copy-Item "$PSScriptRoot\$($item[0]).mp4" "$PSScriptRoot\..\web\media\$($item[0]).mp4" -Force
}
$url='https://assets.mixkit.co/music/584/584.mp3'
$size=(Invoke-WebRequest $url -Method Head).Headers['Content-Length'][0]
& node "$PSScriptRoot\download.cjs" $url "$PSScriptRoot\rest-now.mp3" $size
if($LASTEXITCODE){throw 'Music download failed'}
& "$PSScriptRoot\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe" -y -hide_banner -loglevel error -i "$PSScriptRoot\rest-now.mp3" -af 'loudnorm=I=-23:TP=-3:LRA=7,afade=t=in:d=3,afade=t=out:st=296:d=4' -ar 44100 -c:a libmp3lame -b:a 160k "$PSScriptRoot\..\web\media\sleep-music.mp3"
