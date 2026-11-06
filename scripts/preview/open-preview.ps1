$ErrorActionPreference = 'Stop'
$available = $false
try { $available = (Invoke-WebRequest 'http://127.0.0.1:8768' -TimeoutSec 2).StatusCode -eq 200 } catch {}
if (!$available) {
    $node = (Get-Command node.exe).Source
    $projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
    Start-Process -FilePath $node -ArgumentList ('"' + (Join-Path $PSScriptRoot 'server.cjs') + '"') -WorkingDirectory $projectRoot -WindowStyle Hidden
    Start-Sleep -Seconds 2
}
Start-Process -FilePath 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' -ArgumentList '--new-window http://127.0.0.1:8768'
