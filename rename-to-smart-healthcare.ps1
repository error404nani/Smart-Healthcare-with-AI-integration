# Run this script AFTER closing Cursor/VS Code
# Right-click -> Run with PowerShell, or run in a new terminal:
#   powershell -ExecutionPolicy Bypass -File "c:\Users\kasuk\Desktop\projects\HealthCare\rename-to-smart-healthcare.ps1"

$source = "c:\Users\kasuk\Desktop\projects\HealthCare"
$target = "c:\Users\kasuk\Desktop\projects\Smart Healthcare"

if (-not (Test-Path $source)) {
    Write-Host "Source folder not found (maybe already renamed): $source" -ForegroundColor Yellow
    exit 1
}

if (Test-Path $target) {
    Write-Host "Target already exists: $target" -ForegroundColor Red
    exit 1
}

Rename-Item -LiteralPath $source -NewName "Smart Healthcare"
Write-Host "Done! Folder renamed to: $target" -ForegroundColor Green
Write-Host "Reopen the project in Cursor: File -> Open Folder -> Smart Healthcare"
