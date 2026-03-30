# ============================================================
#  AppWitch — Scarica sessione dal cloud e converti in PDF
#  Requisiti: Windows + Microsoft Excel installato
#  Esecuzione: tasto destro → "Esegui con PowerShell"
#              oppure: powershell -ExecutionPolicy Bypass -File AppWitch_PDF.ps1
# ============================================================

param(
    [string]$OutputDir = "$env:USERPROFILE\Desktop\AppWitch_PDF"
)

$SUPA_URL = "https://ttgvuoiznybjdyhlshpt.supabase.co"
$SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Z3Z1b2l6bnliamR5aGxzaHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNDc2OTIsImV4cCI6MjA4OTcyMzY5Mn0.Igk1hjHa_yY70FfDay6oCQRYo5EhIoCh-8H2u9NAXxo"

# ── Funzione di supporto: intestazione ──────────────────────
function Write-Title($msg) {
    Write-Host ""
    Write-Host "=== $msg ===" -ForegroundColor Cyan
}

# ── 1. LOGIN ────────────────────────────────────────────────
Write-Title "AppWitch — Produzione PDF"

$email = Read-Host "Email"
$secPwd = Read-Host "Password" -AsSecureString
$plainPwd = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secPwd)
)

try {
    $loginResp = Invoke-RestMethod `
        -Uri "$SUPA_URL/auth/v1/token?grant_type=password" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{ apikey = $SUPA_KEY } `
        -Body (@{ email = $email; password = $plainPwd } | ConvertTo-Json)
} catch {
    Write-Host "Login fallito: $_" -ForegroundColor Red
    Read-Host "Premi Invio per uscire"
    exit 1
}

$token  = $loginResp.access_token
$userId = $loginResp.user.id
$role   = $loginResp.user.user_metadata?.role ?? "verificatore"

if (-not $token) {
    Write-Host "Credenziali non valide." -ForegroundColor Red
    Read-Host "Premi Invio per uscire"
    exit 1
}

Write-Host "Autenticato: $($loginResp.user.email)" -ForegroundColor Green

$hdrs = @{
    apikey        = $SUPA_KEY
    Authorization = "Bearer $token"
}

# ── 2. CARICA LISTA SESSIONI ─────────────────────────────────
# Gli admin vedono tutte le sessioni, gli altri solo le proprie
if ($role -eq "admin") {
    $filesUrl = "$SUPA_URL/rest/v1/archivio_files?select=session_folder,user_name,asl,created_at&order=created_at.desc&limit=500"
} else {
    $filesUrl = "$SUPA_URL/rest/v1/archivio_files?user_id=eq.$userId&select=session_folder,user_name,asl,created_at&order=created_at.desc&limit=500"
}

try {
    $allFiles = Invoke-RestMethod -Uri $filesUrl -Headers $hdrs
} catch {
    Write-Host "Errore lettura archivio: $_" -ForegroundColor Red
    Read-Host "Premi Invio per uscire"
    exit 1
}

if (-not $allFiles -or $allFiles.Count -eq 0) {
    Write-Host "Nessuna sessione trovata nel cloud." -ForegroundColor Yellow
    Read-Host "Premi Invio per uscire"
    exit 0
}

# Deduplica sessioni mantenendo l'ordine
$seen = @{}
$sessions = @()
foreach ($f in $allFiles) {
    $key = $f.session_folder
    if (-not $seen[$key]) {
        $seen[$key] = $true
        $sessions += [PSCustomObject]@{
            Folder   = $f.session_folder
            UserName = $f.user_name
            ASL      = $f.asl
        }
    }
}

# ── 3. SELEZIONE SESSIONE ────────────────────────────────────
Write-Title "Sessioni disponibili"

for ($i = 0; $i -lt $sessions.Count; $i++) {
    $s = $sessions[$i]
    $label = if ($role -eq "admin") { "[$($i+1)] $($s.Folder)  ($($s.UserName) — $($s.ASL))" } `
             else                    { "[$($i+1)] $($s.Folder)" }
    Write-Host $label
}

Write-Host ""
$choice = Read-Host "Scegli sessione (numero)"
$idx = [int]$choice - 1

if ($idx -lt 0 -or $idx -ge $sessions.Count) {
    Write-Host "Scelta non valida." -ForegroundColor Red
    Read-Host "Premi Invio per uscire"
    exit 1
}

$selectedFolder = $sessions[$idx].Folder
Write-Host "Sessione: $selectedFolder" -ForegroundColor Cyan

# ── 4. SCARICA I FILE XLSX ───────────────────────────────────
$folderEncoded = [Uri]::EscapeDataString($selectedFolder)

if ($role -eq "admin") {
    $sessionFilesUrl = "$SUPA_URL/rest/v1/archivio_files?session_folder=eq.$folderEncoded&select=filename,storage_path"
} else {
    $sessionFilesUrl = "$SUPA_URL/rest/v1/archivio_files?user_id=eq.$userId&session_folder=eq.$folderEncoded&select=filename,storage_path"
}

$sessionFiles = Invoke-RestMethod -Uri $sessionFilesUrl -Headers $hdrs

if (-not $sessionFiles -or $sessionFiles.Count -eq 0) {
    Write-Host "Nessun file trovato per questa sessione." -ForegroundColor Yellow
    Read-Host "Premi Invio per uscire"
    exit 0
}

$tmpDir = Join-Path $env:TEMP "AppWitch_$([guid]::NewGuid().ToString('N').Substring(0,8))"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

Write-Title "Download ($($sessionFiles.Count) file)"

$dlOk = 0; $dlErr = 0
foreach ($f in $sessionFiles) {
    $destPath = Join-Path $tmpDir $f.filename
    $dlUrl    = "$SUPA_URL/storage/v1/object/archivio/$($f.storage_path)"
    try {
        Invoke-WebRequest -Uri $dlUrl -Headers $hdrs -OutFile $destPath -UseBasicParsing
        Write-Host "  ✓ $($f.filename)"
        $dlOk++
    } catch {
        Write-Warning "  ✗ $($f.filename): $_"
        $dlErr++
    }
}

Write-Host "Download: $dlOk OK, $dlErr errori" -ForegroundColor $(if($dlErr -gt 0){"Yellow"}else{"Green"})

if ($dlOk -eq 0) {
    Write-Host "Nessun file scaricato, impossibile procedere." -ForegroundColor Red
    Remove-Item $tmpDir -Recurse -Force
    Read-Host "Premi Invio per uscire"
    exit 1
}

# ── 5. CONVERTI IN PDF CON EXCEL ─────────────────────────────
$pdfDir = Join-Path $OutputDir $selectedFolder
New-Item -ItemType Directory -Force -Path $pdfDir | Out-Null

Write-Title "Conversione in PDF"

$excel = $null
try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible       = $false
    $excel.DisplayAlerts = $false

    $xlsxFiles = Get-ChildItem $tmpDir -Filter "*.xlsx"
    $pdfOk = 0; $pdfErr = 0

    foreach ($file in $xlsxFiles) {
        $pdfPath = Join-Path $pdfDir ($file.BaseName + ".pdf")
        $wb = $null
        try {
            $wb = $excel.Workbooks.Open($file.FullName, 0, $true)
            # 0 = xlTypePDF, 0 = xlQualityStandard
            $wb.ExportAsFixedFormat(0, $pdfPath, 0, $false)
            Write-Host "  ✓ $($file.Name) → $($file.BaseName).pdf"
            $pdfOk++
        } catch {
            Write-Warning "  ✗ $($file.Name): $_"
            $pdfErr++
        } finally {
            if ($wb) { try { $wb.Close($false) } catch {} }
        }
    }

    Write-Host ""
    Write-Host "PDF creati: $pdfOk" $(if($pdfErr -gt 0){"($pdfErr errori)"}else{""}) -ForegroundColor Green
    Write-Host "Cartella output: $pdfDir" -ForegroundColor Cyan

} catch {
    Write-Host "Errore Excel: $_" -ForegroundColor Red
    Write-Host "Assicurati che Microsoft Excel sia installato." -ForegroundColor Yellow
} finally {
    if ($excel) {
        try { $excel.Quit() } catch {}
        [Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
    }
}

# ── 6. PULIZIA ───────────────────────────────────────────────
Remove-Item $tmpDir -Recurse -Force

Write-Host ""
Read-Host "Premi Invio per uscire"
