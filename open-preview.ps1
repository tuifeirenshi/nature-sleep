$ErrorActionPreference = 'Stop'
$available = $false
try { $available = (Invoke-WebRequest 'http://127.0.0.1:8768' -TimeoutSec 2).StatusCode -eq 200 } catch {}
if (!$available) {
    $node = (Get-Command node.exe).Source
    Start-Process -FilePath $node -ArgumentList ('"' + "$PSScriptRoot\server.cjs" + '"') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
    Start-Sleep -Seconds 2
}
Start-Process -FilePath 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' -ArgumentList '--new-window http://127.0.0.1:8768'
