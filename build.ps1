$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$env:TEMP = "$root\tools\temp"
$env:TMP = $env:TEMP
New-Item -ItemType Directory -Force $env:TEMP,"$root\android\classes","$root\android\dex","$root\dist" | Out-Null
$node = (Get-Command node.exe -ErrorAction Stop).Source
& $node "$root\tools\check-media.cjs"
if ($LASTEXITCODE) { throw 'media check failed' }
$bt = "$root\tools\bt\android-15"
$platform = Get-ChildItem "$root\tools\plat" -Recurse -Filter android.jar | Select-Object -First 1 -ExpandProperty FullName
$packageAssets="$root\android\package-assets"
New-Item -ItemType Directory -Force "$packageAssets\media" | Out-Null
foreach($name in @('index.html','app.js','tracks.js','style.css','responsive.css','lucide.js','leaf.svg')){Copy-Item "$root\web\$name" "$packageAssets\$name" -Force}
foreach($name in @('rain-loop4k.mp4','waves-4k.mp4','stream-clear.mp4','summer-night4k.mp4','campfire-close.mp4','music-moon.mp4','binaural-calm-light.mp4')){Copy-Item "$root\web\media\$name" "$packageAssets\media\$name" -Force}
foreach($name in @('rain-jungle','waves','stream','forest-night','campfire','sleep-music','binaural')){Copy-Item "$root\web\media\$name-balanced.wav" "$packageAssets\media\$name-balanced.wav" -Force}
& javac -encoding UTF-8 -source 8 -target 8 -classpath $platform -d "$root\android\classes" (Get-ChildItem "$root\android\src" -Recurse -Filter *.java).FullName
if ($LASTEXITCODE) { throw 'javac failed' }
& "$bt\d8.bat" --lib $platform --min-api 26 --output "$root\android\dex" (Get-ChildItem "$root\android\classes" -Recurse -Filter *.class).FullName
if ($LASTEXITCODE) { throw 'd8 failed' }
& "$bt\aapt.exe" package -f -M "$root\android\AndroidManifest.xml" -I $platform -S "$root\android\res" -A $packageAssets --replace-version --version-code 21 --version-name 21.0.0 -0 wav -0 mp4 -F "$root\dist\unsigned.apk"
if ($LASTEXITCODE) { throw 'aapt failed' }
Push-Location "$root\android\dex"
& "$bt\aapt.exe" add "$root\dist\unsigned.apk" classes.dex
Pop-Location
& "$bt\zipalign.exe" -f 4 "$root\dist\unsigned.apk" "$root\dist\aligned.apk"
if (!(Test-Path "$root\tools\rain-sleep.keystore")) { & keytool -genkeypair -keystore "$root\tools\rain-sleep.keystore" -storepass [REDACTED] -keypass [REDACTED] -alias rainsleep -keyalg RSA -keysize 2048 -validity 10000 -dname 'CN=Rain Sleep Personal App' }
& "$bt\apksigner.bat" sign --ks "$root\tools\rain-sleep.keystore" --ks-pass pass:[REDACTED] --v4-signing-enabled false --out "$root\dist\nature-sleep-v21.apk" "$root\dist\aligned.apk"
if ($LASTEXITCODE) { throw 'signing failed' }
& "$bt\apksigner.bat" verify --verbose "$root\dist\nature-sleep-v21.apk"
if ($LASTEXITCODE) { throw 'signature verification failed' }
# Keep only the three latest installable releases after a successful build.
$releases = Get-ChildItem "$root\dist" -File -Filter *.apk | Where-Object { $_.Name -match '^(nature-sleep|rain-sleep).*\.apk$' } | Sort-Object LastWriteTime -Descending
$releases | Select-Object -Skip 3 | ForEach-Object { Remove-Item -LiteralPath $_.FullName; if(Test-Path ($_.FullName+'.idsig')){Remove-Item -LiteralPath ($_.FullName+'.idsig')} }
foreach($name in @('unsigned.apk','aligned.apk','volume-patched-unsigned.apk','volume-patched-aligned.apk')){Remove-Item -LiteralPath "$root\dist\$name" -ErrorAction SilentlyContinue}









