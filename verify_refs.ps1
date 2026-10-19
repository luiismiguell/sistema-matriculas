$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$issues = @()

$files = @('index.html') + (Get-ChildItem "$root\pages\*.html" | Select-Object -ExpandProperty Name)

foreach ($html_file in $files) {
    if ($html_file -eq 'index.html') {
        $html_path = Join-Path $root $html_file
        $html_dir = $root
    } else {
        $pages_dir = Join-Path $root 'pages'
        $html_path = Join-Path $pages_dir $html_file
        $html_dir = $pages_dir
    }
    $content = Get-Content $html_path -Raw

    $refs = [regex]::Matches($content, '(?:href|src)="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }

    foreach ($ref in $refs) {
        if ($ref.StartsWith('#') -or $ref.StartsWith('javascript:') -or $ref.StartsWith('mailto:') -or $ref.StartsWith('//') -or $ref.StartsWith('http')) { continue }

        # Resolve path relative to the HTML file's directory
        $target = Resolve-Path (Join-Path $html_dir $ref) -ErrorAction SilentlyContinue
        if (-not $target) {
            $fname = [System.IO.Path]::GetFileName($html_file)
            $issues += "${fname}: ${localRef}"
        }
    }
}

if ($issues.Count -gt 0) {
    'BROKEN REFERENCES:'
    $issues | ForEach-Object { "  $_" }
} else {
    'ALL REFERENCES VALID'
}