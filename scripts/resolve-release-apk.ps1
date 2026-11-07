param([Parameter(Mandatory = $true)][string]$OutputDirectory)

$ErrorActionPreference = 'Stop'
$directory = [IO.Path]::GetFullPath($OutputDirectory)
$metadataPath = Join-Path $directory 'output-metadata.json'
if (!(Test-Path -LiteralPath $metadataPath -PathType Leaf)) {
    throw "Gradle APK metadata is missing: $metadataPath"
}
$metadata = Get-Content -LiteralPath $metadataPath -Raw | ConvertFrom-Json
$outputs = @($metadata.elements)
if ($outputs.Count -ne 1 -or !$outputs[0].outputFile) {
    throw 'Expected exactly one release APK in Gradle output metadata.'
}
$name = [string]$outputs[0].outputFile
if ($name -notin @('app-release.apk', 'app-release-unsigned.apk')) {
    throw "Unexpected release APK name in Gradle metadata: $name"
}
$apk = Join-Path $directory $name
if (!(Test-Path -LiteralPath $apk -PathType Leaf)) {
    throw "Gradle metadata references a missing APK: $apk"
}
$apk
