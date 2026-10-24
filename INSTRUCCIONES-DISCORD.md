# CHOGGUN v4.1: imagen nueva de Match + conectar Discord

**Qué cambia:**
- La pantalla de Match usa la imagen nueva (tinta, pluma y lápiz digital).
- **Conectar Discord** desde Ajustes → *Cuentas conectadas*.
  - Por defecto, tu usuario de Discord **solo lo ven tus matches**, en su ficha de Match.
  - Si quieres, actívalo también en tu **perfil público**.
  - Desde la ficha se abre el perfil de Discord o se copia el usuario.
- **Continuar con Discord** en la pantalla de inicio de sesión, para entrar o crear la cuenta con Discord.

| Archivo | Qué hacer con él |
|---|---|
| `supabase-discord.sql` | Pegarlo en Supabase (paso 2) |
| `index.html` | Reemplaza el `index.html` del repositorio |
| `.github/workflows/build-apk.yml` | Reemplaza tu flujo (agrega el enlace para volver a la app desde Discord) |
| `codigo-fuente-v4.1.zip` | El código fuente actualizado |

---

## 1. Crear la app en Discord (5 minutos)

1. Entra a <https://discord.com/developers/applications> con tu cuenta de Discord → **New Application** → nombre `CHOGGUN` → **Create**.
2. En el menú de la izquierda, abre **OAuth2**.
3. Copia el **Client ID**. Luego pulsa **Reset Secret** y copia el **Client Secret**. Guárdalos, los necesitas en el paso 3.
4. En **Redirects**, pulsa **Add Redirect** y pega exactamente esto:
   `https://ugwajrjdajfaaqsdzqge.supabase.co/auth/v1/callback`
5. Pulsa **Save Changes**.

## 2. Base de datos (1 minuto)

Supabase → **SQL Editor** → **New query** → pega todo `supabase-discord.sql` → **Run**.

## 3. Activar Discord en Supabase (3 minutos)

1. **Authentication → Sign In / Providers → Discord:** actívalo, pega el **Client ID** y el **Client Secret**, y pulsa **Save**.
2. En esa misma página de *Sign In / Providers*, activa **Allow manual linking**. Sin esto no se puede conectar Discord a una cuenta que ya existe.
3. **Authentication → URL Configuration → Redirect URLs:** pulsa **Add URL**, pega `com.choggun.app://auth` y guarda.

## 4. Subir a GitHub y compilar

1. **Add file → Upload files:** sube `index.html`, `supabase-discord.sql` y `codigo-fuente-v4.1.zip` → **Commit changes**.
2. Abre <https://github.com/WilliamMonsalve777/CHOGGUN-APP/edit/main/.github/workflows/build-apk.yml>, borra todo, pega el `build-apk.yml` nuevo y pulsa **Commit changes**.
3. Espera el ✅ en **Actions**, descarga el APK e instálalo encima del anterior.

## 5. Probar

Abre **Ajustes → Cuentas conectadas → Conectar Discord**. Se abre Discord, pulsas **Autorizar** y vuelves solo a CHOGGUN con el mensaje "Discord conectado".

## Si algo falla

- **"Falta activar Allow manual linking":** te faltó el punto 2 del paso 3.
- **"Ese método de inicio de sesión aún no está activado":** Discord no está activado o guardado en Supabase (punto 1 del paso 3).
- **Discord dice "Invalid OAuth2 redirect_uri":** la dirección del punto 4 del paso 1 no quedó exacta.
- **Después de autorizar te quedas en el navegador:** falta `com.choggun.app://auth` en Redirect URLs (punto 3 del paso 3), o no compilaste con el `build-apk.yml` nuevo.
- **"Esa cuenta de Discord ya está conectada a otra cuenta":** esa cuenta de Discord ya se usó para entrar o ya está conectada a otra cuenta de CHOGGUN.
