$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot
$items=@(@('campfire',51633),@('waves',5016),@('stream',51585),@('forest-night',50847),@('forest-wind',95))
foreach($item in $items){
 $page=(Invoke-WebRequest "https://mixkit.co/free-stock-video/download/$($item[1])/?context=sidebar&type=1080p" -TimeoutSec 30).Content
 $url=[regex]::Match($page,'data-download--modal-url-value="([^"]+)"').Groups[1].Value
 $size=(Invoke-WebRequest $url -Method Head -TimeoutSec 30).Headers['Content-Length'][0]
 & node "$PSScriptRoot\download.cjs" $url "$root\web\media\$($item[0]).mp4" $size
 if($LASTEXITCODE){throw "Download failed $url"}
 Write-Output "Downloaded $($item[0])"
}
foreach($item in @(@('campfire',1330),@('forest-wind',1237))){
 & curl.exe -L --max-time 90 --retry 2 -s -o "$root\web\media\$($item[0]).mp3" "https://assets.mixkit.co/active_storage/sfx/$($item[1])/$($item[1])-preview.mp3"
 if($LASTEXITCODE){throw 'Audio download failed'}
}
