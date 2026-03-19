param(
    [Parameter(Mandatory = $true)]
    [string]$FrontendUrl,

    [Parameter(Mandatory = $true)]
    [string]$SupabaseProjectUrl,

    [Parameter(Mandatory = $true)]
    [string]$AllowedOrigin,

    [Parameter(Mandatory = $false)]
    [string]$AdminToken
)

$ErrorActionPreference = 'Stop'

function Assert-Ok($condition, $message) {
    if (-not $condition) {
        throw $message
    }
}

function Invoke-JsonGet {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url,

        [Parameter(Mandatory = $true)]
        [hashtable]$Headers
    )

    return Invoke-RestMethod -Method Get -Uri $Url -Headers $Headers -TimeoutSec 20 -UseBasicParsing
}

function Invoke-OptionsCheck {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url,

        [Parameter(Mandatory = $true)]
        [hashtable]$Headers
    )

    $response = Invoke-WebRequest -Method Options -Uri $Url -Headers $Headers -TimeoutSec 20 -UseBasicParsing
    Assert-Ok (($response.StatusCode -eq 200) -or ($response.StatusCode -eq 204)) "OPTIONS check failed. StatusCode=$($response.StatusCode) URL=$Url"
}

Write-Host "Running CuidAR smoke test..." -ForegroundColor Cyan

$frontendBase = $FrontendUrl.TrimEnd('/')
$supabaseBase = $SupabaseProjectUrl.TrimEnd('/')

$frontendHeaders = @{ }
$functionHeaders = @{ Origin = $AllowedOrigin }

# 1) Frontend availability
$frontendResponse = Invoke-WebRequest -Method Get -Uri $frontendBase -Headers $frontendHeaders -TimeoutSec 20 -UseBasicParsing
Assert-Ok ($frontendResponse.StatusCode -eq 200) "Frontend check failed. StatusCode=$($frontendResponse.StatusCode)"
Write-Host "OK Frontend reachable" -ForegroundColor Green

# 2) Edge function health checks
$adminHealthUrl = "$supabaseBase/functions/v1/admin/health"
$formulariosHealthUrl = "$supabaseBase/functions/v1/formularios/health"

try {
    $adminHealth = Invoke-JsonGet -Url $adminHealthUrl -Headers $functionHeaders
    Assert-Ok ($adminHealth.ok -eq $true) "Admin health check failed"
    Write-Host "OK Admin function health" -ForegroundColor Green
}
catch {
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode.value__ -eq 401) {
        $adminBaseUrl = "$supabaseBase/functions/v1/admin"
        Invoke-OptionsCheck -Url $adminBaseUrl -Headers $functionHeaders
        Write-Host "OK Admin function reachable (OPTIONS fallback due to 401 on GET health)" -ForegroundColor Yellow
    }
    else {
        throw
    }
}

try {
    $formulariosHealth = Invoke-JsonGet -Url $formulariosHealthUrl -Headers $functionHeaders
    Assert-Ok ($formulariosHealth.ok -eq $true) "Formularios health check failed"
    Write-Host "OK Formularios function health" -ForegroundColor Green
}
catch {
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode.value__ -eq 401) {
        $formulariosBaseUrl = "$supabaseBase/functions/v1/formularios"
        Invoke-OptionsCheck -Url $formulariosBaseUrl -Headers $functionHeaders
        Write-Host "OK Formularios function reachable (OPTIONS fallback due to 401 on GET health)" -ForegroundColor Yellow
    }
    else {
        throw
    }
}

# 3) Optional admin authenticated data read
if ($AdminToken) {
    $adminDataUrl = "$supabaseBase/functions/v1/admin/cuidadores"
    $adminHeaders = @{ 
        Origin = $AllowedOrigin
        Authorization = "Bearer $AdminToken"
    }

    $adminData = Invoke-JsonGet -Url $adminDataUrl -Headers $adminHeaders
    Assert-Ok ($null -ne $adminData) "Admin data endpoint returned null"
    Write-Host "OK Admin authenticated data endpoint" -ForegroundColor Green
}

Write-Host "Smoke test passed." -ForegroundColor Green
exit 0
