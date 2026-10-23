# CHOGGUN v4: Match para escritores e ilustradores

Este paquete agrega a tu app:

- **Perfil de Match:** de 2 a 6 fotos (mínimo 2), descripción, rol, con quién quieres colaborar, qué te interesa, géneros, idiomas, experiencia, modalidad y portafolio.
- **Ubicación automática:** con el GPS se llenan solos el país y la ciudad, y se calcula a cuántos km está cada persona. La ubicación se guarda redondeada (~1 km), así que nadie ve dónde estás exactamente. Si alguien no da permiso, puede escribir su país y ciudad a mano.
- **Tarjetas para deslizar** (derecha = colaborar, izquierda = pasar), deshacer, filtros por distancia y por rol, y porcentaje de afinidad.
- **¡Es un match!** cuando las dos personas dicen "me interesa", con aviso a ambas, lista de **Mis matches** y botón para abrir el **chat**.
- **Seguridad:** solo cuentas con correo confirmado (o Google), confirmación de mayoría de edad, máximo 300 deslizadas por día, reportar y **bloquear** (quien queda bloqueado ya no puede escribirte ni verte en Match).
- Todo lo que ya tenía la app sigue igual: el inicio con Google, la animación de bienvenida, las obras y el chat.

| Archivo | Qué hacer con él |
|---|---|
| `supabase-match.sql` | Pegarlo en Supabase (paso 1) |
| `index.html` | Reemplaza el `index.html` de tu repositorio |
| `.github/workflows/build-apk.yml` | Reemplaza tu flujo de GitHub (agrega el plugin de ubicación y sus permisos) |
| `codigo-fuente-v4.zip` | El código fuente actualizado, para editar la app después |

---

## 1. Base de datos en Supabase (2 minutos)

1. Supabase → tu proyecto → **SQL Editor** → **New query**.
2. Abre `supabase-match.sql` con el Bloc de notas, copia todo, pégalo y pulsa **Run**. Debe decir *Success*.

Si la app muestra "Match aún no está activado", te faltó este paso.

## 2. Subir a GitHub (5 minutos)

1. Abre tu repositorio `CHOGGUN-APP` → **Add file → Upload files**. Arrastra `index.html`, `supabase-match.sql` y `codigo-fuente-v4.zip`, y pulsa **Commit changes**.
2. Actualiza el flujo:
   - Abre `.github` → `workflows` → `build-apk.yml` y pulsa el **lápiz** (Edit).
   - Borra todo (Ctrl + A, Supr), pega el contenido del `build-apk.yml` de este paquete y pulsa **Commit changes**.
3. Abre **Actions**, espera el ✅ verde (unos 5 minutos) y descarga **CHOGGUN-apk** en *Artifacts*.

## 3. Instalar y probar

1. Instala el APK nuevo. **Si Android dice que la app "entra en conflicto" o "no se instaló",** desinstala primero la CHOGGUN que tienes y vuelve a instalar. Eso pasa porque el APK que tienes ahora se firmó con otra llave. Desde aquí, las siguientes versiones se instalan encima.
2. Entra a la pestaña **Match** → **Crear mi perfil** → sube 2 fotos o más → toca **Usar mi ubicación** y acepta el permiso.
3. Para ver un match de verdad necesitas **dos cuentas reales** en dos teléfonos, las dos con perfil de Match, que se den "me interesa" una a la otra.

## Cómo se ve cada perfil para los demás

- **Sí se ve:** fotos de Match, nombre, @usuario, descripción, rol, ciudad, país (con bandera), distancia aproximada ("a 12 km", o "a menos de 2 km" si están muy cerca), géneros, idiomas y portafolio.
- **Nunca se ve:** las coordenadas, el correo ni la ubicación exacta.

## Si algo falla

- **"Necesitamos permiso de ubicación":** Ajustes del teléfono → Apps → CHOGGUN → Permisos → Ubicación → Permitir.
- **La compilación en GitHub sale en rojo:** abre la ejecución, copia las últimas líneas del error y mándalas.
