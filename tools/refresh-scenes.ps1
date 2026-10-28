$ErrorActionPreference='Stop'
foreach($item in @(@('moon-forest',3350),@('wind-trees',50870),@('campfire-close',22730))){
 $page=(Invoke-WebRequest "https://mixkit.co/free-stock-video/download/$($item[1])/?context=sidebar&type=2160p").Content
 $url=[regex]::Match($page,'data-download--modal-url-value="([^"]+)"').Groups[1].Value
 $size=(Invoke-WebRequest $url -Method Head).Headers['Content-Length'][0]
 & node "$PSScriptRoot\download.cjs" $url "$PSScriptRoot\$($item[0]).mp4" $size
 if($LASTEXITCODE){throw 'Download failed'}
 Copy-Item "$PSScriptRoot\$($item[0]).mp4" "$PSScriptRoot\..\web\media\$($item[0]).mp4" -Force
}
