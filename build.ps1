$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

if (!(Get-Command java.exe -ErrorAction SilentlyContinue) -and !$env:JAVA_HOME) {
    throw 'Java 17 or newer is required. Install JDK 21 and set JAVA_HOME.'
}

if (!$env:ANDROID_SDK_ROOT -and !$env:ANDROID_HOME) {
    throw 'Android SDK not found. Set ANDROID_SDK_ROOT to the SDK folder.'
}

$node = Get-Command node.exe -ErrorAction Stop
& $node.Source "$root\tools\check-media.cjs"
if ($LASTEXITCODE) { throw 'Media check failed.' }

& "$root\scripts\prepare-videos.ps1"

& "$root\gradlew.bat" --no-daemon -p $root :app:assembleRelease
if ($LASTEXITCODE) { throw 'Gradle release build failed.' }

$apk = & "$root\scripts\resolve-release-apk.ps1" -OutputDirectory "$root\android\build\outputs\apk\release"
Write-Output "Release APK: $apk"
