$mappings = @{
    "@/components/ui/button" = "@/components/ui/forms/button"
    "@/components/ui/input" = "@/components/ui/forms/input"
    "@/components/ui/label" = "@/components/ui/forms/label"
    "@/components/ui/select" = "@/components/ui/forms/select"
    "@/components/ui/textarea" = "@/components/ui/forms/textarea"
    "@/components/ui/card" = "@/components/ui/layout/card"
    "@/components/ui/alert" = "@/components/ui/feedback/alert"
    "@/components/ui/progress" = "@/components/ui/feedback/progress"
    "@/components/ui/skeleton" = "@/components/ui/feedback/skeleton"
    "@/components/ui/avatar" = "@/components/ui/display/avatar"
    "@/components/ui/badge" = "@/components/ui/display/badge"
    "@/components/ui/dropdown-menu" = "@/components/ui/navigation/dropdown-menu"
}

Get-ChildItem -Path . -Recurse -Include *.tsx, *.ts, *.jsx, *.js -Exclude node_modules, .next | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $modified = $false
    foreach ($key in $mappings.Keys) {
        $pattern = "([""'])" + [regex]::Escape($key) + "\1"
        if ($content -match $pattern) {
            $replacement = "`$1" + $mappings[$key] + "`$1"
            $content = $content -replace $pattern, $replacement
            $modified = $true
        }
    }
    if ($modified) {
        Set-Content -Path $_.FullName -Value $content -NoNewline
        Write-Host "Updated $($_.FullName)"
    }
}
