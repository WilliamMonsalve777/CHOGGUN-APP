-- ═══════════════════════════════════════════════════════════════════════════
--  CHOGGUN · Match para escritores e ilustradores (complemento de la versión 3)
--  Pega TODO este archivo en Supabase → SQL Editor → New query → Run.
--  Ejecútalo DESPUÉS de supabase-schema.sql. Se puede ejecutar varias veces.
--
--  Reglas importantes:
--  · Solo personas reales: hace falta una cuenta con correo confirmado (o Google),
--    al menos 2 fotos propias y confirmar que se es mayor de 18 años.
--  · La ubicación se guarda redondeada (~1 km) y NUNCA se muestra: los demás
--    solo ven el país, la ciudad y una distancia aproximada.
--  · Nadie puede leer la tabla de perfiles de Match directamente: todo pasa por
--    funciones que deciden qué se muestra.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Nuevo tipo de aviso: "match" ───
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check CHECK (type IN (
  'vote', 'comment', 'reply', 'comment_like', 'follow', 'credit', 'message', 'welcome', 'mod_work', 'mod_report', 'match'));

-- ─── 2. Tablas ───

-- Perfil de Match: uno por cuenta, separado del perfil público.
CREATE TABLE IF NOT EXISTS public.match_profiles (
  user_id      uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  active       boolean     NOT NULL DEFAULT true,
  photos       text[]      NOT NULL CHECK (cardinality(photos) BETWEEN 2 AND 6),
  about        text        NOT NULL CHECK (char_length(btrim(about)) BETWEEN 20 AND 500),
  match_role   text        NOT NULL CHECK (match_role IN ('Escritor/a', 'Ilustrador/a', 'Escritor/a e ilustrador/a')),
  seeking_role text        NOT NULL DEFAULT 'Cualquiera' CHECK (seeking_role IN ('Escritor/a', 'Ilustrador/a', 'Cualquiera')),
  looking_for  text[]      NOT NULL CHECK (cardinality(looking_for) BETWEEN 1 AND 10),
  genres       text[]      NOT NULL DEFAULT '{}' CHECK (cardinality(genres) <= 16),
  languages    text[]      NOT NULL DEFAULT '{}' CHECK (cardinality(languages) <= 8),
  experience   text        NOT NULL DEFAULT 'Intermedio' CHECK (experience IN ('Principiante', 'Intermedio', 'Avanzado', 'Profesional')),
  commitment   text        NOT NULL DEFAULT 'Por hobby' CHECK (commitment IN ('Por hobby', 'Proyecto serio', 'Comisión / pago')),
  portfolio    text        NOT NULL DEFAULT '' CHECK (portfolio = '' OR portfolio ~* '^https?://[^[:space:]]{4,300}$'),
  country      text        NOT NULL DEFAULT '' CHECK (char_length(country) <= 60),
  country_code text        NOT NULL DEFAULT '' CHECK (country_code = '' OR country_code ~ '^[A-Z]{2}$'),
  city         text        NOT NULL DEFAULT '' CHECK (char_length(city) <= 80),
  lat          double precision CHECK (lat BETWEEN -90 AND 90),
  lng          double precision CHECK (lng BETWEEN -180 AND 180),
  located_at   timestamptz,
  is_adult     boolean     NOT NULL CHECK (is_adult),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS match_profiles_active_idx ON public.match_profiles (active) WHERE active;

-- Deslizar: me interesa (liked = true) o pasar (liked = false).
CREATE TABLE IF NOT EXISTS public.match_swipes (
  swiper_id  uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  target_id  uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  liked      boolean     NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (swiper_id, target_id),
  CHECK (swiper_id <> target_id)
);
CREATE INDEX IF NOT EXISTS match_swipes_target_idx ON public.match_swipes (target_id) WHERE liked;
CREATE INDEX IF NOT EXISTS match_swipes_recent_idx ON public.match_swipes (swiper_id, created_at);

-- Match: cuando las dos personas dijeron "me interesa". user_a < user_b para no duplicar.
CREATE TABLE IF NOT EXISTS public.matches (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a     uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  user_b     uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (user_a < user_b),
  UNIQUE (user_a, user_b)
);
CREATE INDEX IF NOT EXISTS matches_b_idx ON public.matches (user_b);

-- Bloqueos: la otra persona deja de verte en Match y ya no puede escribirte.
CREATE TABLE IF NOT EXISTS public.blocks (
  blocker_id uuid        NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  blocked_id uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);
CREATE INDEX IF NOT EXISTS blocks_blocked_idx ON public.blocks (blocked_id);

-- ─── 3. Funciones de apoyo ───

CREATE OR REPLACE FUNCTION public.is_blocked(a uuid, b uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.blocks
                 WHERE (blocker_id = a AND blocked_id = b) OR (blocker_id = b AND blocked_id = a))
$$;

-- Distancia aproximada en km entre dos puntos (fórmula del haversine).
CREATE OR REPLACE FUNCTION public.km_between(lat1 double precision, lng1 double precision,
                                             lat2 double precision, lng2 double precision)
RETURNS double precision LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT CASE WHEN lat1 IS NULL OR lat2 IS NULL OR lng1 IS NULL OR lng2 IS NULL THEN NULL ELSE
    2 * 6371 * asin(least(1, sqrt(
      power(sin(radians(lat2 - lat1) / 2), 2) +
      cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lng2 - lng1) / 2), 2)))) END
$$;

-- Lo que se muestra de la distancia: nunca exacta.
CREATE OR REPLACE FUNCTION public.km_shown(km double precision) RETURNS integer
LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT CASE WHEN km IS NULL THEN NULL
              WHEN km < 2 THEN 1
              WHEN km < 100 THEN round(km)::int
              ELSE (round(km / 10) * 10)::int END
$$;

-- Afinidad 0–99: rol complementario, lo que buscan, géneros e idiomas en común, cercanía.
CREATE OR REPLACE FUNCTION public.match_affinity(m public.match_profiles, o public.match_profiles, km double precision)
RETURNS integer LANGUAGE plpgsql IMMUTABLE SET search_path = '' AS $$
DECLARE s numeric := 30;
BEGIN
  IF m.seeking_role = 'Cualquiera' OR o.match_role = m.seeking_role OR o.match_role = 'Escritor/a e ilustrador/a' THEN s := s + 18; END IF;
  IF o.seeking_role = 'Cualquiera' OR m.match_role = o.seeking_role OR m.match_role = 'Escritor/a e ilustrador/a' THEN s := s + 10; END IF;
  s := s + least(18, 6 * cardinality(ARRAY(SELECT unnest(m.looking_for) INTERSECT SELECT unnest(o.looking_for))));
  s := s + least(15, 3 * cardinality(ARRAY(SELECT unnest(m.genres) INTERSECT SELECT unnest(o.genres))));
  IF cardinality(ARRAY(SELECT unnest(m.languages) INTERSECT SELECT unnest(o.languages))) > 0 THEN s := s + 4; END IF;
  IF km IS NOT NULL AND km < 30 THEN s := s + 4; ELSIF m.country_code <> '' AND m.country_code = o.country_code THEN s := s + 2; END IF;
  RETURN least(99, s)::int;
END $$;

-- Ficha pública de Match de otra persona (sin coordenadas).
CREATE OR REPLACE FUNCTION public.match_card(o public.match_profiles, me public.match_profiles)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object(
    'userId', o.user_id, 'username', p.username, 'name', p.name, 'avatarPath', p.avatar_path,
    'photos', to_jsonb(o.photos), 'about', o.about, 'role', o.match_role, 'seeking', o.seeking_role,
    'lookingFor', to_jsonb(o.looking_for), 'genres', to_jsonb(o.genres), 'languages', to_jsonb(o.languages),
    'experience', o.experience, 'commitment', o.commitment, 'portfolio', o.portfolio,
    'country', o.country, 'countryCode', o.country_code, 'city', o.city,
    'km', public.km_shown(public.km_between(me.lat, me.lng, o.lat, o.lng)),
    'affinity', public.match_affinity(me, o, public.km_between(me.lat, me.lng, o.lat, o.lng)),
    'joined', p.created_at)
  FROM public.profiles p WHERE p.id = o.user_id
$$;

-- ─── 4. Triggers ───

CREATE OR REPLACE FUNCTION public.match_profile_before() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE ph text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.user_id := auth.uid();
    NEW.created_at := now();
    -- Solo cuentas reales: correo confirmado (las de Google ya vienen confirmadas).
    IF NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = NEW.user_id
                   AND (u.email_confirmed_at IS NOT NULL OR u.confirmed_at IS NOT NULL)) THEN
      RAISE EXCEPTION 'Confirma tu correo antes de usar Match';
    END IF;
  ELSE
    NEW.user_id := OLD.user_id; NEW.created_at := OLD.created_at;
  END IF;
  -- Las fotos tienen que ser tuyas (subidas a tu carpeta) y distintas.
  FOREACH ph IN ARRAY NEW.photos LOOP
    IF ph NOT LIKE NEW.user_id::text || '/match/%' THEN RAISE EXCEPTION 'Foto no válida'; END IF;
  END LOOP;
  IF cardinality(ARRAY(SELECT DISTINCT unnest(NEW.photos))) < 2 THEN
    RAISE EXCEPTION 'Sube al menos 2 fotos distintas';
  END IF;
  NEW.about := btrim(NEW.about);
  NEW.portfolio := btrim(NEW.portfolio);
  NEW.country := btrim(NEW.country); NEW.city := btrim(NEW.city);
  NEW.country_code := upper(btrim(NEW.country_code));
  -- Privacidad: la ubicación se guarda redondeada a ~1 km.
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.lat := round(NEW.lat::numeric, 2)::double precision;
    NEW.lng := round(NEW.lng::numeric, 2)::double precision;
    IF TG_OP = 'INSERT' OR NEW.lat IS DISTINCT FROM OLD.lat OR NEW.lng IS DISTINCT FROM OLD.lng THEN
      NEW.located_at := now();
    END IF;
  ELSE
    NEW.lat := NULL; NEW.lng := NULL; NEW.located_at := NULL;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS match_profile_before ON public.match_profiles;
CREATE TRIGGER match_profile_before BEFORE INSERT OR UPDATE ON public.match_profiles
  FOR EACH ROW EXECUTE FUNCTION public.match_profile_before();

-- Al bloquear: se deshace el match y se olvidan los "me interesa" entre las dos personas.
CREATE OR REPLACE FUNCTION public.on_block() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  DELETE FROM public.matches
   WHERE user_a = least(NEW.blocker_id, NEW.blocked_id) AND user_b = greatest(NEW.blocker_id, NEW.blocked_id);
  DELETE FROM public.match_swipes
   WHERE (swiper_id = NEW.blocked_id AND target_id = NEW.blocker_id);
  UPDATE public.match_swipes SET liked = false
   WHERE swiper_id = NEW.blocker_id AND target_id = NEW.blocked_id;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS blocks_after ON public.blocks;
CREATE TRIGGER blocks_after AFTER INSERT ON public.blocks FOR EACH ROW EXECUTE FUNCTION public.on_block();

-- Mensajes: igual que antes, pero no se puede escribir a quien te bloqueó (ni a quien bloqueaste).
CREATE OR REPLACE FUNCTION public.on_message() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF public.is_blocked(NEW.sender_id, NEW.recipient_id) THEN
      RAISE EXCEPTION 'No puedes enviar mensajes a esta persona';
    END IF;
    IF NEW.img_path IS NOT NULL AND NEW.img_path NOT LIKE NEW.sender_id::text || '/' || NEW.recipient_id::text || '/%' THEN
      RAISE EXCEPTION 'Archivo no válido';
    END IF;
    NEW.text := btrim(NEW.text);
    NEW.read_at := NULL;
    PERFORM public.notify(NEW.recipient_id, 'message', NEW.sender_id, NULL);
  ELSE
    NEW.text := OLD.text; NEW.img_path := OLD.img_path; NEW.sender_id := OLD.sender_id;
    NEW.recipient_id := OLD.recipient_id; NEW.created_at := OLD.created_at;
  END IF;
  RETURN NEW;
END $$;

-- ─── 5. Permisos (RLS) ───

ALTER TABLE public.match_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_swipes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks         ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.match_profiles, public.match_swipes, public.matches, public.blocks FROM anon, authenticated;

GRANT SELECT, DELETE ON public.match_profiles TO authenticated;
GRANT INSERT (active, photos, about, match_role, seeking_role, looking_for, genres, languages, experience, commitment,
              portfolio, country, country_code, city, lat, lng, is_adult),
      UPDATE (active, photos, about, match_role, seeking_role, looking_for, genres, languages, experience, commitment,
              portfolio, country, country_code, city, lat, lng, is_adult)
  ON public.match_profiles TO authenticated;
GRANT SELECT ON public.match_swipes TO authenticated;
GRANT SELECT, DELETE ON public.matches TO authenticated;
GRANT SELECT, INSERT (blocked_id), DELETE ON public.blocks TO authenticated;

DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT format('DROP POLICY %I ON %I.%I', policyname, schemaname, tablename) FROM pg_policies
           WHERE schemaname = 'public' AND tablename IN ('match_profiles', 'match_swipes', 'matches', 'blocks')
  LOOP EXECUTE t; END LOOP;
END $$;

-- Mi perfil de Match: solo yo lo leo y lo edito. Los demás lo ven a través de las funciones.
CREATE POLICY "mi perfil de match" ON public.match_profiles FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "mis deslizadas" ON public.match_swipes FOR SELECT TO authenticated USING (swiper_id = auth.uid());
CREATE POLICY "mis matches" ON public.matches FOR SELECT TO authenticated USING (auth.uid() IN (user_a, user_b));
CREATE POLICY "deshacer match" ON public.matches FOR DELETE TO authenticated USING (auth.uid() IN (user_a, user_b));
CREATE POLICY "mis bloqueos" ON public.blocks FOR ALL TO authenticated
  USING (blocker_id = auth.uid()) WITH CHECK (blocker_id = auth.uid());

-- ─── 6. Funciones para la app ───

-- Personas para deslizar: perfiles activos que aún no he visto, sin bloqueos, ordenados por afinidad y cercanía.
CREATE OR REPLACE FUNCTION public.match_candidates(p_max_km integer DEFAULT 0, p_role text DEFAULT 'Cualquiera', p_limit integer DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE me public.match_profiles;
BEGIN
  SELECT * INTO me FROM public.match_profiles WHERE user_id = auth.uid();
  IF NOT FOUND THEN RAISE EXCEPTION 'Primero crea tu perfil de Match'; END IF;
  IF NOT me.active THEN RAISE EXCEPTION 'Tu perfil de Match está pausado'; END IF;
  RETURN COALESCE((
    SELECT jsonb_agg(x.card ORDER BY x.score DESC, x.km NULLS LAST, x.rnd)
    FROM (
      SELECT public.match_card(o, me) AS card,
             public.match_affinity(me, o, public.km_between(me.lat, me.lng, o.lat, o.lng)) AS score,
             public.km_between(me.lat, me.lng, o.lat, o.lng) AS km,
             random() AS rnd
      FROM public.match_profiles o
      WHERE o.active AND o.user_id <> me.user_id
        AND NOT EXISTS (SELECT 1 FROM public.match_swipes s WHERE s.swiper_id = me.user_id AND s.target_id = o.user_id)
        AND NOT public.is_blocked(me.user_id, o.user_id)
        AND (p_role IS NULL OR p_role = 'Cualquiera' OR o.match_role = p_role OR o.match_role = 'Escritor/a e ilustrador/a')
        AND (COALESCE(p_max_km, 0) <= 0 OR public.km_between(me.lat, me.lng, o.lat, o.lng) <= p_max_km)
      ORDER BY 2 DESC, 3 NULLS LAST, 4
      LIMIT least(GREATEST(COALESCE(p_limit, 30), 1), 60)
    ) x), '[]'::jsonb);
END $$;

-- Deslizar. Devuelve {matched: true/false}. Si las dos personas dijeron "me interesa", se crea el match y ambas reciben aviso.
CREATE OR REPLACE FUNCTION public.match_swipe(p_target uuid, p_like boolean)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE me uuid := auth.uid(); mid uuid; done boolean := false;
BEGIN
  IF me IS NULL THEN RAISE EXCEPTION 'Inicia sesión'; END IF;
  IF p_target = me THEN RAISE EXCEPTION 'No puedes hacer match contigo'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.match_profiles WHERE user_id = me AND active) THEN
    RAISE EXCEPTION 'Primero crea tu perfil de Match';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.match_profiles WHERE user_id = p_target AND active) OR public.is_blocked(me, p_target) THEN
    RAISE EXCEPTION 'Este perfil ya no está disponible';
  END IF;
  -- Freno contra bots: máximo 300 deslizadas por día.
  IF (SELECT count(*) FROM public.match_swipes WHERE swiper_id = me AND created_at > now() - interval '1 day') >= 300 THEN
    RAISE EXCEPTION 'Llegaste al límite de hoy. Vuelve mañana para ver más perfiles';
  END IF;
  INSERT INTO public.match_swipes (swiper_id, target_id, liked) VALUES (me, p_target, COALESCE(p_like, false))
  ON CONFLICT (swiper_id, target_id) DO UPDATE SET liked = EXCLUDED.liked, created_at = now();
  IF p_like AND EXISTS (SELECT 1 FROM public.match_swipes WHERE swiper_id = p_target AND target_id = me AND liked) THEN
    INSERT INTO public.matches (user_a, user_b) VALUES (least(me, p_target), greatest(me, p_target))
    ON CONFLICT (user_a, user_b) DO NOTHING RETURNING id INTO mid;
    IF mid IS NOT NULL THEN
      PERFORM public.notify(p_target, 'match', me, NULL);
      PERFORM public.notify(me, 'match', p_target, NULL);
    ELSE
      SELECT id INTO mid FROM public.matches WHERE user_a = least(me, p_target) AND user_b = greatest(me, p_target);
    END IF;
    done := true;
  END IF;
  RETURN jsonb_build_object('matched', done, 'matchId', mid);
END $$;

-- Deshacer la última persona que pasé (solo "pasar", no los "me interesa").
CREATE OR REPLACE FUNCTION public.match_undo(p_target uuid) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  DELETE FROM public.match_swipes WHERE swiper_id = auth.uid() AND target_id = p_target AND NOT liked
$$;

-- Mis matches con la ficha de cada persona.
CREATE OR REPLACE FUNCTION public.my_matches() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE me public.match_profiles; uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN '[]'::jsonb; END IF;
  SELECT * INTO me FROM public.match_profiles WHERE user_id = uid;
  RETURN COALESCE((
    SELECT jsonb_agg(jsonb_build_object('matchId', m.id, 'createdAt', m.created_at) || public.match_card(o, me) ORDER BY m.created_at DESC)
    FROM public.matches m
    JOIN public.match_profiles o ON o.user_id = CASE WHEN m.user_a = uid THEN m.user_b ELSE m.user_a END
    WHERE uid IN (m.user_a, m.user_b)), '[]'::jsonb);
END $$;

-- Ficha de una persona: si tenemos match, o si su perfil está activo y el mío también.
CREATE OR REPLACE FUNCTION public.match_profile_of(p_user uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE me public.match_profiles; o public.match_profiles; uid uuid := auth.uid(); mid uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Inicia sesión'; END IF;
  SELECT * INTO me FROM public.match_profiles WHERE user_id = uid;
  SELECT * INTO o FROM public.match_profiles WHERE user_id = p_user;
  IF NOT FOUND OR public.is_blocked(uid, p_user) THEN RETURN NULL; END IF;
  SELECT id INTO mid FROM public.matches WHERE user_a = least(uid, p_user) AND user_b = greatest(uid, p_user);
  IF mid IS NULL AND (me.user_id IS NULL OR NOT me.active OR NOT o.active) THEN RETURN NULL; END IF;
  RETURN public.match_card(o, me) || jsonb_build_object('matchId', mid);
END $$;

REVOKE EXECUTE ON FUNCTION public.is_blocked(uuid, uuid), public.match_card(public.match_profiles, public.match_profiles),
  public.match_candidates(integer, text, integer), public.match_swipe(uuid, boolean), public.match_undo(uuid),
  public.my_matches(), public.match_profile_of(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.match_candidates(integer, text, integer), public.match_swipe(uuid, boolean),
  public.match_undo(uuid), public.my_matches(), public.match_profile_of(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.km_between(double precision, double precision, double precision, double precision),
  public.km_shown(double precision) TO authenticated;

-- Listo. Las fotos de Match se guardan en el bucket "media", en la carpeta <tu-id>/match/.
