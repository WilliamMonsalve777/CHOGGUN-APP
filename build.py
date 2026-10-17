#!/usr/bin/env python3
"""Construye dist/index.html (autocontenido: fuentes, logo, avatares, CSS y JS embebidos)."""
import base64, os, pathlib
ROOT = pathlib.Path(__file__).parent
SRC, ASSETS, DIST = ROOT/'src', ROOT/'assets', ROOT/'dist'
FONTS = ASSETS/'fonts'

def b64(path, mime):
    return f"data:{mime};base64," + base64.b64encode(pathlib.Path(path).read_bytes()).decode()

def font_faces():
    css = []
    for fam, pkg, weights in [('Rajdhani','rajdhani',[400,500,600,700]), ('Barlow Condensed','barlow-condensed',[700,800,900])]:
        for w in weights:
            f = FONTS/f'{pkg}-latin-{w}-normal.woff2'
            css.append(f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{w};font-display:swap;src:url({b64(f,'font/woff2')}) format('woff2')}}")
    return '\n'.join(css)

def build():
    DIST.mkdir(exist_ok=True)
    logo = b64(ASSETS/'logo-256.jpg', 'image/jpeg')
    js = '\n'.join((SRC/n).read_text() for n in ['art.js','data.js','app.js','screens.js'])
    js = js.replace("'__LOGO__'", repr(logo)).replace("'__GATO__'", repr(b64(ASSETS/'av_gato.jpg','image/jpeg'))).replace("'__RANA__'", repr(b64(ASSETS/'av_rana.jpg','image/jpeg')))
    css = (SRC/'styles.css').read_text()
    icon192 = b64(ASSETS/'logo-192.png','image/png')
    html = f"""<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0b1720">
<meta name="description" content="CHOGGUN — comunidad colaborativa para escritores, ilustradores y lectores.">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="CHOGGUN">
<title>CHOGGUN App</title>
<link rel="icon" type="image/png" href="{icon192}">
<link rel="apple-touch-icon" href="{icon192}">
<style>
{font_faces()}
</style>
<style>
{css}
</style>
</head>
<body>
<div id="app">
  <div id="view"></div>
  <div id="overlay"></div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <div class="splash" id="splash"><img src="{logo}" alt="CHOGGUN"><b>CHOGGUN</b><small>ESCRIBE · ILUSTRA · COLABORA</small><div class="loader"><i></i></div></div>
</div>
<script>
{js}
</script>
</body>
</html>
"""
    (DIST/'index.html').write_text(html)
    print('dist/index.html', round(len(html)/1024), 'KB')

if __name__ == '__main__':
    build()
