$ErrorActionPreference='Stop'
foreach($item in @(@('night-detail',51713),@('moon-detail',40047))){
 $url="https://assets.mixkit.co/videos/$($item[1])/$($item[1])-2160.mp4"
 $size=(Invoke-WebRequest $url -Method Head).Headers['Content-Length'][0]
 & node "$PSScriptRoot\download.cjs" $url "$PSScriptRoot\$($item[0]).mp4" $size
 if($LASTEXITCODE){throw 'Download failed'}
 & "$PSScriptRoot\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe" -y -hide_banner -loglevel error -i "$PSScriptRoot\$($item[0]).mp4" -frames:v 1 -vf scale=1280:-1 "$PSScriptRoot\$($item[0]).jpg"
 Copy-Item "$PSScriptRoot\$($item[0]).mp4" "$PSScriptRoot\..\web\media\$($item[0]).mp4" -Force
}
