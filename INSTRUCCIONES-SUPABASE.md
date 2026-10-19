# CHOGGUN v3: tu misma app, ahora en línea

Este paquete **complementa** tu repositorio `CHOGGUN-APP`. No borra nada.

| Archivo | Qué hace |
|---|---|
| `index.html` | La app nueva. Reemplaza al actual. |
| `index-v2-respaldo.html` | Copia de tu `index.html` anterior, por si quieres volver atrás. |
| `build-apk.yml` | Tu mismo flujo de GitHub con 3 cambios pequeños. |
| `supabase-schema.sql` | La base de datos. Se pega en Supabase. |
| `choggun-debug.keystore` | Firma fija para que cada APK nuevo se instale encima del anterior. |
| `codigo-fuente-v3.zip` | El código fuente, por si alguien quiere editar la app después. |
| `INSTRUCCIONES-SUPABASE.md` | Este archivo. |

La app nueva conserva intactas la interfaz, los íconos Lucide, las imágenes y las fuentes. Le añade:
- Cuentas reales con código por correo, y nada de publicaciones de bots: arranca vacía.
- Publicaciones en línea (novelas, relatos, manga, cómic, ilustración, **video** y foro).
- Comentarios, votos, seguidores, mensajes y notificaciones en vivo.
- Comunidades, foto de perfil (silueta o foto propia), tema claro/oscuro y noticias.
- Match "EN DESARROLLO" con tu imagen difuminada y el engranaje.

---

## 1. Subir a GitHub (5 minutos)

1. Abre tu repositorio `CHOGGUN-APP`, entra a **Add file → Upload files** y arrastra los 7 archivos de esta carpeta. El `index.html` reemplaza al anterior automáticamente.
2. Pulsa **Commit changes**.
3. Actualiza el flujo:
   - Abre la carpeta `.github` → `workflows` → `build-apk.yml`.
   - Pulsa el **lápiz** (Edit).
   - Borra todo (Ctrl + A, Supr), pega el contenido del `build-apk.yml` de esta carpeta y pulsa **Commit changes**.
4. Abre **Actions** y espera el ✅ verde (unos 5 minutos). Descarga **CHOGGUN-apk** en *Artifacts*.

Los tres cambios del flujo son:
- Se agrega `@capacitor/preferences`, que guarda la sesión en el teléfono.
- `CapacitorHttp` pasa a `false`, para que las subidas de archivos muestren su progreso. Las noticias siguen cargando por la vía nativa.
- Se usa la firma fija `choggun-debug.keystore`.

> **Primera vez:** desinstala la CHOGGUN anterior antes de instalar la nueva, porque tiene otra firma. Desde ahí, las siguientes se instalan encima.

## 2. Base de datos en Supabase (5 minutos)

1. Supabase → tu proyecto → **SQL Editor** → **New query**.
2. Abre `supabase-schema.sql` con el Bloc de notas, copia todo, pégalo y pulsa **Run**. Debe decir *Success*.

## 3. Correos con código de 6 dígitos

1. **Authentication → Sign In / Providers → Email**: deja **Confirm email** activado.
2. **Authentication → Emails → Templates**:
   - En **Confirm signup**, pon en el mensaje: `<h2>Tu código para CHOGGUN</h2><h1>{{ .Token }}</h1>`
   - En **Reset Password**, pon en el mensaje: `<h2>Código para cambiar tu contraseña</h2><h1>{{ .Token }}</h1>`
3. **Recomendado:** en **Authentication → Emails → SMTP Settings**, usa tu Gmail. El correo de fábrica de Supabase envía muy pocos correos por hora.
   - Host: `smtp.gmail.com`
   - Puerto: `465`
   - Usuario: tu Gmail
   - Contraseña: una **contraseña de aplicación**, que se crea en <https://myaccount.google.com/apppasswords>

## Moderadores

En Supabase, entra a **Table Editor → profiles** y cambia `is_mod` a `true` en la cuenta que quieras. A esa persona le aparece **Ajustes → Panel de moderación**.
