# CHOGGUN — App móvil (Android)

Plataforma colaborativa para **escritores, ilustradores y lectores**: publica novelas, relatos, manga, cómic e ilustraciones, comenta y vota, únete a comunidades y encuentra colaboradores con **Match**.

Proyecto del Semillero SIIANTEC · TEINCO · Bogotá 2026.

---

## ¿Qué incluye la app?

| Módulo | Funciones |
|---|---|
| **Cuenta** | Onboarding, registro con validaciones, inicio de sesión, cuenta demo, modo invitado, cambio de contraseña y cierre de sesión |
| **Inicio** | Feed *Para ti / Siguiendo / Nuevo*, filtros por formato, "Continuar leyendo", colaboradores sugeridos |
| **Obras** | Ficha con portada, sinopsis, estadísticas, créditos de coautores, capítulos, votos, guardar y compartir |
| **Lector** | Texto con tamaño de letra y fondo (sepia, claro u oscuro), páginas de manga o cómic en scroll vertical, progreso guardado y capítulo siguiente |
| **Publicar** | 6 formatos (novela, relato, manga, cómic, ilustración, foro), varios capítulos, subida de portada y páginas desde la galería o la cámara, géneros, créditos, licencia, +18, borradores y edición |
| **Comentarios** | Hilos con respuestas, me gusta, orden por top o recientes, reporte y moderación automática del lenguaje |
| **Explorar** | Búsqueda global (obras, comunidades y personas), tendencias, géneros, comunidades por categoría |
| **Comunidades** | Unirse o salir, página de comunidad, crear comunidades públicas o privadas |
| **Match** | Tarjetas que se deslizan, % de afinidad (géneros, rol complementario, tipo de colaboración), filtros, deshacer y "¡Es un match!" |
| **Chat** | Conversaciones, envío de imágenes, respuestas simuladas e indicador de "escribiendo" |
| **Notificaciones** | Votos, comentarios, seguidores, matches y moderación |
| **Perfil** | Avatar (tus 3 personajes o una foto), banner, bio, rol, géneros, estadísticas; pestañas Obras, Guardados, Borradores y Comunidades |
| **Moderación** | Reportes con motivo, contenido oculto, panel de revisión humana (retirar o descartar) |
| **Ajustes** | Tema oscuro, claro o del sistema, opacidad de tarjetas, tamaño de lectura, notificaciones, contenido sensible, exportar datos, normas y "acerca de" |

Los datos se guardan **en el dispositivo** (localStorage). Así la app funciona sin internet y sin servidor. La arquitectura del documento (Node.js + Firebase) es el siguiente paso para la versión en línea.

**Cuenta demo:** usuario `demo` · contraseña `choggun1`

---

## Opción A — Compilar el APK con GitHub (sin instalar nada)

1. Crea un repositorio nuevo en GitHub y sube **todo el contenido de esta carpeta**.
2. Ve a la pestaña **Actions**. El flujo **"Compilar APK de CHOGGUN"** se ejecuta solo (o pulsa *Run workflow*).
3. Cuando termine (unos 5 minutos), abre la ejecución y descarga **CHOGGUN-apk** en *Artifacts*.
4. Descomprime el archivo, pasa `app-debug.apk` a tu celular e instálalo. Android te pedirá permitir "instalar apps desconocidas".

## Opción B — Android Studio

Requisitos: **Node.js 20+**, **Android Studio** (Ladybug o más reciente) y **JDK 21** (viene incluido con Android Studio).

```bash
npm install
npx cap sync android
npx cap open android
```

En Android Studio: espera a que termine *Gradle Sync* y luego **Build › Build App Bundle(s) / APK(s) › Build APK(s)**. También puedes conectar tu celular con depuración USB y pulsar ▶ Run.

Para generar un APK firmado para la Play Store: **Build › Generate Signed App Bundle / APK**.

---

## Estructura

```
CHOGGUN-App/
├── www/index.html            ← la app ya compilada (todo en un solo archivo)
├── web/                      ← código fuente de la app
│   ├── src/styles.css        ← estilos (tema oscuro y claro)
│   ├── src/art.js            ← iconos, portadas y páginas de manga generadas
│   ├── src/data.js           ← datos de ejemplo (obras, usuarios, comunidades)
│   ├── src/app.js            ← estado, navegación y componentes
│   ├── src/screens.js        ← todas las pantallas y acciones
│   └── build.py              ← une todo en www/index.html
├── android/                  ← proyecto nativo Android (Capacitor 8)
│   └── app/src/main/res/     ← iconos del launcher y splash con el logo CHOGGUN
├── resources/                ← logo e icono en alta resolución (Play Store 512 px)
├── capacitor.config.json     ← appId com.choggun.app
└── .github/workflows/        ← compilación automática del APK
```

### Editar la app

1. Modifica los archivos de `web/src/`.
2. Ejecuta `npm run build:web` (necesita Python 3). Esto regenera `www/index.html`.
3. Ejecuta `npx cap sync android` y compila de nuevo.

Para probarla en el computador, abre `www/index.html` en Chrome y activa la vista móvil (F12 › icono de celular).
