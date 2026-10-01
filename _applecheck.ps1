# Analiza el apple-touch-icon: canal alfa, margenes y esquinas
Add-Type -AssemblyName System.Drawing
$f = (Resolve-Path '.\public\apple-touch-icon.png').Path
$bmp = [System.Drawing.Bitmap]::new($f)
$w = $bmp.Width; $h = $bmp.Height
"dimensiones: $w x $h"
"formato de pixel: $($bmp.PixelFormat)"

# 1) Hay pixeles transparentes?
$transp = 0; $semi = 0
for ($y = 0; $y -lt $h; $y += 1) {
  for ($x = 0; $x -lt $w; $x += 1) {
    $a = $bmp.GetPixel($x, $y).A
    if ($a -eq 0) { $transp++ }
    elseif ($a -lt 255) { $semi++ }
  }
}
"pixeles totalmente transparentes: $transp  ($([math]::Round(100*$transp/($w*$h),2))%)"
"pixeles semitransparentes:       $semi  ($([math]::Round(100*$semi/($w*$h),2))%)"
if ($transp -gt 0 -or $semi -gt 0) {
  "  => iOS compone sobre NEGRO: las zonas transparentes se verian negras."
} else {
  "  => sin alfa: seguro para iOS."
}

# 2) Bordes: iOS aplica su propia mascara redondeada, el contenido no debe
#    tocar el borde ni tener esquinas ya redondeadas
"bordes (4 pixeles de esquina):"
"  TL=$($bmp.GetPixel(0,0).ToArgb().ToString('X8'))  TR=$($bmp.GetPixel($w-1,0).ToArgb().ToString('X8'))"
"  BL=$($bmp.GetPixel(0,$h-1).ToArgb().ToString('X8'))  BR=$($bmp.GetPixel($w-1,$h-1).ToArgb().ToString('X8'))"
"centro=$($bmp.GetPixel([int]($w/2),[int]($h/2)).ToArgb().ToString('X8'))"

# 3) Vista previa: tal cual, y con la mascara redondeada que aplica iOS
$cell = 300
$sheet = [System.Drawing.Bitmap]::new($cell * 2 + 30, $cell + 60)
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.Clear([System.Drawing.Color]::FromArgb(235, 235, 238))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$font = [System.Drawing.Font]::new('Segoe UI', 11)
$RED = [System.Drawing.Color]::FromArgb(200, 0, 0)

# izquierda: el archivo tal cual
$g.DrawString('el archivo tal cual', $font, [System.Drawing.SolidBrush]::new($RED), 15, 12)
$g.DrawImage($bmp, 15, 34, $cell, $cell)

# derecha: como lo vera iOS (mascara redondeada) sobre un fondo de pantalla
$g.DrawString('como lo vera iOS (mascara redondeada)', $font, [System.Drawing.SolidBrush]::new($RED), $cell + 40, 12)
$path = [System.Drawing.Drawing2D.GraphicsPath]::new()
$r = 40
$path.AddArc($cell + 45, 34, $r * 2, $r * 2, 180, 90)
$path.AddArc($cell + 45 + $cell - $r * 2, 34, $r * 2, $r * 2, 270, 90)
$path.AddArc($cell + 45 + $cell - $r * 2, 34 + $cell - $r * 2, $r * 2, $r * 2, 0, 90)
$path.AddArc($cell + 45, 34 + $cell - $r * 2, $r * 2, $r * 2, 90, 90)
$path.CloseFigure()
$g.SetClip($path)
$g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(30, 30, 34)), $cell + 45, 34, $cell, $cell)
$g.DrawImage($bmp, $cell + 45, 34, $cell, $cell)
$g.ResetClip()
$path.Dispose()

$sheet.Save((Join-Path (Resolve-Path '.').Path '_apple-check.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $sheet.Dispose(); $font.Dispose(); $bmp.Dispose()
"previa: $(Join-Path (Resolve-Path '.').Path '_apple-check.png')"
