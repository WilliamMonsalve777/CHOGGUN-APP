-- ═══════════════════════════════════════════════════════════════════════════
--  CHOGGUN · Base de datos completa para Supabase (versión 3)
--  Pega TODO este archivo en Supabase → SQL Editor → New query → Run.
--  Se puede ejecutar varias veces sin perder datos.
--  Sin contenido de ejemplo: solo publican personas reales con correo confirmado.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 0. Limpieza de la versión anterior (solo si existe; no toca datos de esta versión) ───
DO $$
BEGIN
  IF to_regclass('public.posts') IS NOT NULL THEN
    DROP TABLE IF EXISTS public.post_media, public.post_stats, public.likes, public.comments,
      public.follows, public.notifications, public.posts, public.profiles CASCADE;
    DROP FUNCTION IF EXISTS public.post_json(public.posts, boolean) CASCADE;
  END IF;
END $$;
DROP FUNCTION IF EXISTS public.get_feed(text, text, timestamptz, uuid, int);
DROP FUNCTION IF EXISTS public.get_user_posts(text, timestamptz, uuid, int);
DROP FUNCTION IF EXISTS public.get_post(uuid);
DROP FUNCTION IF EXISTS public.get_comments(uuid, timestamptz, uuid, int);
DROP FUNCTION IF EXISTS public.get_profile(text);
DROP FUNCTION IF EXISTS public.get_follows(text, text, timestamptz, uuid, int);
DROP FUNCTION IF EXISTS public.search_users(text, int);
DROP FUNCTION IF EXISTS public.get_notifications(int);
DROP FUNCTION IF EXISTS public.on_post_change(), public.on_post_edit(), public.check_post_media(),
  public.on_like(), public.on_comment(), public.on_follow() CASCADE;

-- ═════════════════════════ 1. Tablas ═════════════════════════

-- Perfiles: uno por cuenta (se crea solo al registrarse). El usuario (@) no se puede cambiar.
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username        text        NOT NULL CHECK (username ~ '^[A-Za-z0-9_]{3,20}$'),
  name            text        NOT NULL DEFAULT '' CHECK (char_length(name) <= 40),
  role            text        NOT NULL DEFAULT 'Lector/a' CHECK (role IN ('Escritor/a', 'Ilustrador/a', 'Lector/a')),
  bio             text        NOT NULL DEFAULT '' CHECK (char_length(bio) <= 160),
  genres          text[]      NOT NULL DEFAULT '{}' CHECK (cardinality(genres) <= 16),
  collab          text[]      NOT NULL DEFAULT '{}' CHECK (cardinality(collab) <= 10),
  avatar_path     text,                 -- foto subida; vacío = silueta
  banner_path     text,                 -- portada subida; vacío = portada generada
  banner_seed     text        NOT NULL DEFAULT '',
  is_mod          boolean     NOT NULL DEFAULT false,   -- se activa a mano en Supabase (Table Editor)
  follower_count  integer     NOT NULL DEFAULT 0,
  following_count integer     NOT NULL DEFAULT 0,
  work_count      integer     NOT NULL DEFAULT 0,
  karma           integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_key ON public.profiles (lower(username));

CREATE TABLE IF NOT EXISTS public.communities (
  id           text PRIMARY KEY CHECK (id ~ '^[a-z0-9_]{3,24}$'),
  name         text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  icon         text        NOT NULL DEFAULT 'book-open-text' CHECK (icon ~ '^[a-z0-9-]{1,30}$'),
  cat          text        NOT NULL DEFAULT 'Otros' CHECK (cat IN ('Historias', 'Visual', 'Entretenimiento', 'Otros')),
  color        text        NOT NULL DEFAULT '#f5b942' CHECK (color ~ '^#[0-9a-fA-F]{6}$'),
  descr        text        NOT NULL CHECK (char_length(btrim(descr)) BETWEEN 1 AND 200),
  private      boolean     NOT NULL DEFAULT false,
  owner_id     uuid        DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE SET NULL,
  member_count integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_members (
  community_id text        NOT NULL REFERENCES public.communities (id) ON DELETE CASCADE,
  user_id      uuid        NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (community_id, user_id)
);
CREATE INDEX IF NOT EXISTS community_members_user_idx ON public.community_members (user_id);

-- Obras y publicaciones (los datos ligeros; el texto/páginas de los capítulos va en work_content).
CREATE TABLE IF NOT EXISTS public.works (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id      uuid        NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  type           text        NOT NULL CHECK (type IN ('novela', 'relato', 'manga', 'comic', 'ilustracion', 'video', 'foro')),
  title          text        NOT NULL CHECK (char_length(btrim(title)) BETWEEN 3 AND 90),
  synopsis       text        NOT NULL DEFAULT '' CHECK (char_length(synopsis) <= 4000),
  community_id   text        REFERENCES public.communities (id) ON DELETE SET NULL,
  genres         text[]      NOT NULL DEFAULT '{}' CHECK (cardinality(genres) <= 4),
  cover_path     text,
  cover_seed     text,
  image_path     text,       -- ilustración
  video_path     text,       -- video
  poster_path    text,       -- miniatura del video
  chapters_meta  jsonb       NOT NULL DEFAULT '[]'::jsonb,  -- lo calcula la base: [{title, words, pages}]
  credits        jsonb       NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(credits) = 'array' AND jsonb_array_length(credits) <= 20),
  license        text        NOT NULL DEFAULT 'Todos los derechos reservados',
  mature         boolean     NOT NULL DEFAULT false,
  status         text        NOT NULL DEFAULT 'borrador' CHECK (status IN ('borrador', 'publicado')),
  removed        boolean     NOT NULL DEFAULT false,      -- retirada por moderación
  views          integer     NOT NULL DEFAULT 0,
  score          integer     NOT NULL DEFAULT 0,
  comment_count  integer     NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS works_feed_idx ON public.works (status, created_at DESC);
CREATE INDEX IF NOT EXISTS works_author_idx ON public.works (author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS works_community_idx ON public.works (community_id);

CREATE TABLE IF NOT EXISTS public.work_content (
  work_id  uuid PRIMARY KEY REFERENCES public.works (id) ON DELETE CASCADE,
  chapters jsonb NOT NULL DEFAULT '[]'::jsonb
    CHECK (jsonb_typeof(chapters) = 'array' AND jsonb_array_length(chapters) <= 300 AND octet_length(chapters::text) <= 4000000)
);

CREATE TABLE IF NOT EXISTS public.votes (
  work_id    uuid        NOT NULL REFERENCES public.works (id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  value      smallint    NOT NULL CHECK (value IN (-1, 1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (work_id, user_id)
);
CREATE INDEX IF NOT EXISTS votes_user_idx ON public.votes (user_id);

CREATE TABLE IF NOT EXISTS public.comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id    uuid        NOT NULL REFERENCES public.works (id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  parent_id  uuid        REFERENCES public.comments (id) ON DELETE CASCADE,
  text       text        NOT NULL CHECK (char_length(btrim(text)) BETWEEN 1 AND 1000),
  flagged    boolean     NOT NULL DEFAULT false,
  removed    boolean     NOT NULL DEFAULT false,
  like_count integer     NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comments_work_idx ON public.comments (work_id, created_at);

CREATE TABLE IF NOT EXISTS public.comment_likes (
  comment_id uuid NOT NULL REFERENCES public.comments (id) ON DELETE CASCADE,
  user_id    uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  PRIMARY KEY (comment_id, user_id)
);
CREATE INDEX IF NOT EXISTS comment_likes_user_idx ON public.comment_likes (user_id);

CREATE TABLE IF NOT EXISTS public.follows (
  follower_id uuid        NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  followee_id uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id),
  CHECK (follower_id <> followee_id)
);
CREATE INDEX IF NOT EXISTS follows_followee_idx ON public.follows (followee_id);

CREATE TABLE IF NOT EXISTS public.saved_works (
  user_id    uuid        NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  work_id    uuid        NOT NULL REFERENCES public.works (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, work_id)
);

CREATE TABLE IF NOT EXISTS public.hidden_works (
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  work_id uuid NOT NULL REFERENCES public.works (id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, work_id)
);

CREATE TABLE IF NOT EXISTS public.reading_history (
  user_id    uuid        NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  work_id    uuid        NOT NULL REFERENCES public.works (id) ON DELETE CASCADE,
  ch         integer     NOT NULL DEFAULT 0 CHECK (ch >= 0),
  pct        real        NOT NULL DEFAULT 0 CHECK (pct BETWEEN 0 AND 1),
  pct_ch     integer     NOT NULL DEFAULT 0,
  read       integer[]   NOT NULL DEFAULT '{}' CHECK (cardinality(read) <= 300),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, work_id)
);

-- Notificaciones: SOLO las crea la base de datos (triggers). La app no puede inventarlas.
CREATE TABLE IF NOT EXISTS public.notifications (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  type       text        NOT NULL CHECK (type IN ('vote', 'comment', 'reply', 'comment_like', 'follow', 'credit', 'message', 'welcome', 'mod_work', 'mod_report')),
  actor_id   uuid        REFERENCES public.profiles (id) ON DELETE CASCADE,
  work_id    uuid        REFERENCES public.works (id) ON DELETE CASCADE,
  extra      text        NOT NULL DEFAULT '',
  read       boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications (user_id, id DESC);

CREATE TABLE IF NOT EXISTS public.messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    uuid        NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  recipient_id uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  text         text        NOT NULL DEFAULT '' CHECK (char_length(text) <= 2000),
  img_path     text,
  read_at      timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (sender_id <> recipient_id),
  CHECK (char_length(btrim(text)) > 0 OR img_path IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS messages_pair_idx ON public.messages (sender_id, recipient_id, created_at);
CREATE INDEX IF NOT EXISTS messages_recipient_idx ON public.messages (recipient_id, created_at);

-- "Vaciar conversación": oculta para mí los mensajes anteriores a esa fecha.
CREATE TABLE IF NOT EXISTS public.chat_clears (
  user_id    uuid        NOT NULL DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE CASCADE,
  other_id   uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  cleared_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, other_id)
);

CREATE TABLE IF NOT EXISTS public.reports (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reporter_id uuid        DEFAULT auth.uid() REFERENCES public.profiles (id) ON DELETE SET NULL,
  kind        text        NOT NULL CHECK (kind IN ('work', 'comment', 'user')),
  target_id   text        NOT NULL CHECK (char_length(target_id) <= 64),
  parent_id   text        CHECK (char_length(parent_id) <= 64),
  reason      text        NOT NULL CHECK (char_length(reason) <= 120),
  note        text        NOT NULL DEFAULT '' CHECK (char_length(note) <= 1000),
  auto        boolean     NOT NULL DEFAULT false,   -- lo marcó el filtro automático de lenguaje
  status      text        NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'retirado', 'descartado')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ═════════════════════════ 2. Funciones de apoyo ═════════════════════════

CREATE OR REPLACE FUNCTION public.is_mod() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT COALESCE((SELECT is_mod FROM public.profiles WHERE id = auth.uid()), false)
$$;

-- ¿Puede esta persona ver la obra? (publicada y no retirada, o es suya, o es moderador/a)
CREATE OR REPLACE FUNCTION public.can_see_work(p_work uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.works w WHERE w.id = p_work
    AND ((w.status = 'publicado' AND NOT w.removed) OR w.author_id = auth.uid()))
    OR public.is_mod()
$$;

CREATE OR REPLACE FUNCTION public.notify(p_user uuid, p_type text, p_actor uuid, p_work uuid, p_extra text DEFAULT '')
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF p_user IS NULL OR p_user = p_actor THEN RETURN; END IF;
  -- Sin spam: el mismo aviso de la misma persona solo una vez cada 6 horas (mensajes: cada 10 min)
  IF p_type <> 'comment' AND p_type <> 'reply' AND EXISTS (
    SELECT 1 FROM public.notifications n
    WHERE n.user_id = p_user AND n.type = p_type AND n.actor_id IS NOT DISTINCT FROM p_actor
      AND n.work_id IS NOT DISTINCT FROM p_work
      AND n.created_at > now() - CASE WHEN p_type = 'message' THEN interval '10 minutes' ELSE interval '6 hours' END
      AND (p_type <> 'message' OR NOT n.read)) THEN
    RETURN;
  END IF;
  INSERT INTO public.notifications (user_id, type, actor_id, work_id, extra)
  VALUES (p_user, p_type, p_actor, p_work, left(COALESCE(p_extra, ''), 200));
END $$;

-- ═════════════════════════ 3. Triggers ═════════════════════════

-- Perfil automático al confirmar la cuenta (usa usuario/nombre/rol del registro).
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  wanted text := meta->>'username';
  base text; candidate text; i int := 0;
  nm text := left(btrim(COALESCE(NULLIF(meta->>'name', ''), NULLIF(btrim(COALESCE(meta->>'first_name', '') || ' ' || COALESCE(meta->>'last_name', '')), ''), meta->>'full_name', '')), 40);
  r text := CASE WHEN meta->>'role' IN ('Escritor/a', 'Ilustrador/a', 'Lector/a') THEN meta->>'role' ELSE 'Lector/a' END;
BEGIN
  IF wanted ~ '^[A-Za-z0-9_]{3,20}$' AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(wanted)) THEN
    candidate := wanted;
  ELSE
    base := trim(both '_' from left(regexp_replace(regexp_replace(lower(split_part(COALESCE(NEW.email, 'creador'), '@', 1)), '[^a-z0-9_]', '_', 'g'), '_+', '_', 'g'), 15));
    IF length(base) < 3 THEN base := left(base || 'creador', 15); END IF;
    candidate := base;
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(candidate)) LOOP
      i := i + 1;
      candidate := left(base, 15) || (floor(random() * power(10, least(2 + i / 5, 5))))::int::text;
      IF i > 50 THEN candidate := 'u' || substr(replace(NEW.id::text, '-', ''), 1, 12); END IF;
    END LOOP;
  END IF;
  INSERT INTO public.profiles (id, username, name, role, banner_seed)
  VALUES (NEW.id, candidate, COALESCE(NULLIF(nm, ''), candidate), r, candidate || floor(random() * 1e6)::text)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.notifications (user_id, type) VALUES (NEW.id, 'welcome');
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Cuentas que ya existían antes de este script: se les crea su perfil.
INSERT INTO public.profiles (id, username, name, banner_seed)
SELECT u.id,
  CASE WHEN (u.raw_user_meta_data->>'username') ~ '^[A-Za-z0-9_]{3,20}$'
        AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE lower(p.username) = lower(u.raw_user_meta_data->>'username'))
       THEN u.raw_user_meta_data->>'username' ELSE 'u' || substr(replace(u.id::text, '-', ''), 1, 12) END,
  left(COALESCE(NULLIF(btrim(COALESCE(u.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(u.raw_user_meta_data->>'last_name', '')), ''), 'Creador/a'), 40),
  u.id::text
FROM auth.users u WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, username, name, banner_seed)
SELECT u.id, 'u' || substr(replace(u.id::text, '-', ''), 1, 12), 'Creador/a', u.id::text
FROM auth.users u WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT DO NOTHING;

-- Obras: reglas al crear/editar.
CREATE OR REPLACE FUNCTION public.works_before() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  NEW.title := btrim(NEW.title);
  NEW.updated_at := now();
  IF TG_OP = 'UPDATE' THEN
    NEW.author_id := OLD.author_id; NEW.type := OLD.type;
    -- Un borrador que se publica pasa al inicio del feed (como en la app original).
    IF OLD.status = 'borrador' AND NEW.status = 'publicado' THEN NEW.created_at := now(); ELSE NEW.created_at := OLD.created_at; END IF;
    IF NEW.status = 'borrador' AND OLD.status = 'publicado' THEN NEW.status := 'publicado'; END IF; -- no se "despublica"
  END IF;
  -- Solo se puede publicar en comunidades públicas o en las que eres miembro.
  IF NEW.community_id IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.community_id IS DISTINCT FROM OLD.community_id) AND EXISTS (
       SELECT 1 FROM public.communities c WHERE c.id = NEW.community_id AND c.private
         AND c.owner_id IS DISTINCT FROM NEW.author_id
         AND NOT EXISTS (SELECT 1 FROM public.community_members m WHERE m.community_id = c.id AND m.user_id = NEW.author_id)) THEN
    RAISE EXCEPTION 'Esa comunidad es privada: únete primero';
  END IF;
  -- Los archivos deben estar en la carpeta de quien publica.
  IF (NEW.cover_path IS NOT NULL AND split_part(NEW.cover_path, '/', 1) <> NEW.author_id::text)
     OR (NEW.image_path IS NOT NULL AND split_part(NEW.image_path, '/', 1) <> NEW.author_id::text)
     OR (NEW.video_path IS NOT NULL AND split_part(NEW.video_path, '/', 1) <> NEW.author_id::text)
     OR (NEW.poster_path IS NOT NULL AND split_part(NEW.poster_path, '/', 1) <> NEW.author_id::text) THEN
    RAISE EXCEPTION 'Archivo no válido';
  END IF;
  IF NEW.status = 'publicado' THEN
    IF NEW.type = 'ilustracion' AND NEW.image_path IS NULL THEN RAISE EXCEPTION 'Sube la imagen de tu ilustración'; END IF;
    IF NEW.type = 'video' AND NEW.video_path IS NULL THEN RAISE EXCEPTION 'Sube tu video'; END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS works_before ON public.works;
CREATE TRIGGER works_before BEFORE INSERT OR UPDATE ON public.works FOR EACH ROW EXECUTE FUNCTION public.works_before();

CREATE OR REPLACE FUNCTION public.works_after() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE was_pub boolean; is_pub boolean; cr jsonb; target uuid;
BEGIN
  was_pub := TG_OP <> 'INSERT' AND OLD.status = 'publicado';
  is_pub := TG_OP <> 'DELETE' AND NEW.status = 'publicado';
  IF is_pub AND NOT was_pub THEN
    UPDATE public.profiles SET work_count = work_count + 1, karma = karma + 10 WHERE id = NEW.author_id;
  ELSIF was_pub AND TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET work_count = GREATEST(work_count - 1, 0) WHERE id = OLD.author_id;
  END IF;
  -- Avisar a quienes reciben crédito (solo créditos nuevos).
  IF is_pub AND (NOT was_pub OR NEW.credits IS DISTINCT FROM OLD.credits) THEN
    FOR cr IN SELECT * FROM jsonb_array_elements(NEW.credits) LOOP
      IF was_pub AND OLD.credits @> jsonb_build_array(cr) THEN CONTINUE; END IF;
      SELECT id INTO target FROM public.profiles WHERE lower(username) = lower(cr->>'user');
      PERFORM public.notify(target, 'credit', NEW.author_id, NEW.id, cr->>'role');
    END LOOP;
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS works_after ON public.works;
CREATE TRIGGER works_after AFTER INSERT OR UPDATE OR DELETE ON public.works FOR EACH ROW EXECUTE FUNCTION public.works_after();

-- Contenido de capítulos: valida y calcula el resumen (títulos, palabras, páginas) en la obra.
CREATE OR REPLACE FUNCTION public.work_content_change() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE owner uuid; ch jsonb; pg jsonb;
BEGIN
  SELECT author_id INTO owner FROM public.works WHERE id = NEW.work_id;
  FOR ch IN SELECT * FROM jsonb_array_elements(NEW.chapters) LOOP
    IF jsonb_typeof(ch) <> 'object' OR char_length(COALESCE(ch->>'title', '')) > 120 OR char_length(COALESCE(ch->>'text', '')) > 200000 THEN
      RAISE EXCEPTION 'Capítulo no válido';
    END IF;
    IF ch ? 'pages' THEN
      IF jsonb_typeof(ch->'pages') <> 'array' OR jsonb_array_length(ch->'pages') > 200 THEN RAISE EXCEPTION 'Demasiadas páginas'; END IF;
      FOR pg IN SELECT * FROM jsonb_array_elements(ch->'pages') LOOP
        IF jsonb_typeof(pg) <> 'string' OR split_part(pg #>> '{}', '/', 1) <> owner::text THEN RAISE EXCEPTION 'Archivo no válido'; END IF;
      END LOOP;
    END IF;
  END LOOP;
  UPDATE public.works SET chapters_meta = COALESCE((
    SELECT jsonb_agg(jsonb_build_object(
      'title', COALESCE(c->>'title', ''),
      'words', CASE WHEN c ? 'text' THEN COALESCE(array_length(regexp_split_to_array(btrim(c->>'text'), '\s+'), 1), 0) ELSE 0 END,
      'pages', CASE WHEN c ? 'pages' THEN jsonb_array_length(c->'pages') ELSE NULL END) ORDER BY o)
    FROM jsonb_array_elements(NEW.chapters) WITH ORDINALITY AS t(c, o)), '[]'::jsonb)
  WHERE id = NEW.work_id;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS work_content_change ON public.work_content;
CREATE TRIGGER work_content_change AFTER INSERT OR UPDATE ON public.work_content FOR EACH ROW EXECUTE FUNCTION public.work_content_change();

-- Votos → puntaje de la obra, karma del autor y aviso por voto positivo.
CREATE OR REPLACE FUNCTION public.on_vote() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE d int; w uuid; author uuid;
BEGIN
  w := COALESCE(NEW.work_id, OLD.work_id);
  d := COALESCE(CASE WHEN TG_OP <> 'DELETE' THEN NEW.value END, 0) - COALESCE(CASE WHEN TG_OP <> 'INSERT' THEN OLD.value END, 0);
  UPDATE public.works SET score = score + d WHERE id = w RETURNING author_id INTO author;
  UPDATE public.profiles SET karma = karma + d WHERE id = author;
  IF TG_OP <> 'DELETE' AND NEW.value = 1 AND (TG_OP = 'INSERT' OR OLD.value <> 1) THEN
    PERFORM public.notify(author, 'vote', NEW.user_id, w);
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS votes_after ON public.votes;
CREATE TRIGGER votes_after AFTER INSERT OR UPDATE OR DELETE ON public.votes FOR EACH ROW EXECUTE FUNCTION public.on_vote();

CREATE OR REPLACE FUNCTION public.votes_before() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.works WHERE id = NEW.work_id AND status = 'publicado' AND NOT removed) THEN
    RAISE EXCEPTION 'Esta obra no está disponible';
  END IF;
  IF TG_OP = 'UPDATE' THEN NEW.user_id := OLD.user_id; NEW.work_id := OLD.work_id; END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS votes_before ON public.votes;
CREATE TRIGGER votes_before BEFORE INSERT OR UPDATE ON public.votes FOR EACH ROW EXECUTE FUNCTION public.votes_before();

-- Comentarios: solo un nivel de respuestas; contadores, karma y avisos.
CREATE OR REPLACE FUNCTION public.comments_before() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE pw uuid; pp uuid;
BEGIN
  NEW.text := btrim(NEW.text);
  IF NOT EXISTS (SELECT 1 FROM public.works WHERE id = NEW.work_id AND status = 'publicado' AND NOT removed) THEN
    RAISE EXCEPTION 'Esta obra no está disponible';
  END IF;
  IF NEW.parent_id IS NOT NULL THEN
    SELECT work_id, parent_id INTO pw, pp FROM public.comments WHERE id = NEW.parent_id;
    IF pw IS DISTINCT FROM NEW.work_id OR pp IS NOT NULL THEN RAISE EXCEPTION 'Respuesta no válida'; END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS comments_before ON public.comments;
CREATE TRIGGER comments_before BEFORE INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.comments_before();

CREATE OR REPLACE FUNCTION public.comments_after() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE author uuid; parent_user uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.works SET comment_count = comment_count + 1 WHERE id = NEW.work_id RETURNING author_id INTO author;
    UPDATE public.profiles SET karma = karma + 2 WHERE id = NEW.user_id;
    IF NEW.parent_id IS NULL THEN
      PERFORM public.notify(author, 'comment', NEW.user_id, NEW.work_id, left(NEW.text, 80));
    ELSE
      SELECT user_id INTO parent_user FROM public.comments WHERE id = NEW.parent_id;
      PERFORM public.notify(parent_user, 'reply', NEW.user_id, NEW.work_id, left(NEW.text, 80));
    END IF;
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS comments_after ON public.comments;
CREATE TRIGGER comments_after AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.comments_after();
-- Al borrar un comentario se van también sus respuestas (las respuestas borradas en cascada
-- ya no encuentran a su padre y no se descuentan dos veces).
CREATE OR REPLACE FUNCTION public.comments_on_delete() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF OLD.parent_id IS NULL THEN
    UPDATE public.works SET comment_count = GREATEST(comment_count - 1 - (SELECT count(*) FROM public.comments WHERE parent_id = OLD.id), 0) WHERE id = OLD.work_id;
  ELSIF EXISTS (SELECT 1 FROM public.comments WHERE id = OLD.parent_id) THEN
    UPDATE public.works SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.work_id;
  END IF;
  RETURN OLD;
END $$;
DROP TRIGGER IF EXISTS comments_before_delete ON public.comments;
CREATE TRIGGER comments_before_delete BEFORE DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.comments_on_delete();

CREATE OR REPLACE FUNCTION public.on_comment_like() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE owner uuid; w uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments SET like_count = like_count + 1 WHERE id = NEW.comment_id RETURNING user_id, work_id INTO owner, w;
    PERFORM public.notify(owner, 'comment_like', NEW.user_id, w);
  ELSE
    UPDATE public.comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS comment_likes_after ON public.comment_likes;
CREATE TRIGGER comment_likes_after AFTER INSERT OR DELETE ON public.comment_likes FOR EACH ROW EXECUTE FUNCTION public.on_comment_like();

-- Seguidores (bloqueos en el mismo orden para evitar interbloqueos).
CREATE OR REPLACE FUNCTION public.on_follow() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE a uuid; b uuid; d int;
BEGIN
  a := COALESCE(NEW.follower_id, OLD.follower_id); b := COALESCE(NEW.followee_id, OLD.followee_id);
  d := CASE WHEN TG_OP = 'INSERT' THEN 1 ELSE -1 END;
  PERFORM 1 FROM public.profiles WHERE id IN (a, b) ORDER BY id FOR NO KEY UPDATE;
  UPDATE public.profiles SET following_count = GREATEST(following_count + d, 0) WHERE id = a;
  UPDATE public.profiles SET follower_count = GREATEST(follower_count + d, 0) WHERE id = b;
  IF TG_OP = 'INSERT' THEN PERFORM public.notify(b, 'follow', a, NULL); END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS follows_after ON public.follows;
CREATE TRIGGER follows_after AFTER INSERT OR DELETE ON public.follows FOR EACH ROW EXECUTE FUNCTION public.on_follow();

-- Comunidades: quien la crea queda como miembro; contador de miembros.
CREATE OR REPLACE FUNCTION public.on_community_created() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL THEN
    INSERT INTO public.community_members (community_id, user_id) VALUES (NEW.id, NEW.owner_id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS communities_after ON public.communities;
CREATE TRIGGER communities_after AFTER INSERT ON public.communities FOR EACH ROW EXECUTE FUNCTION public.on_community_created();

CREATE OR REPLACE FUNCTION public.on_member() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
  ELSE
    UPDATE public.communities SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS members_after ON public.community_members;
CREATE TRIGGER members_after AFTER INSERT OR DELETE ON public.community_members FOR EACH ROW EXECUTE FUNCTION public.on_member();

-- Mensajes: la foto debe estar en la carpeta "remitente/destinatario"; aviso al destinatario.
CREATE OR REPLACE FUNCTION public.on_message() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.img_path IS NOT NULL AND NEW.img_path NOT LIKE NEW.sender_id::text || '/' || NEW.recipient_id::text || '/%' THEN
      RAISE EXCEPTION 'Archivo no válido';
    END IF;
    NEW.text := btrim(NEW.text);
    NEW.read_at := NULL;
    PERFORM public.notify(NEW.recipient_id, 'message', NEW.sender_id, NULL);
  ELSE
    -- Solo se puede marcar como leído (y solo quien lo recibe, por las reglas de abajo).
    NEW.text := OLD.text; NEW.img_path := OLD.img_path; NEW.sender_id := OLD.sender_id;
    NEW.recipient_id := OLD.recipient_id; NEW.created_at := OLD.created_at;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS messages_before ON public.messages;
CREATE TRIGGER messages_before BEFORE INSERT OR UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.on_message();

-- Historial de lectura: siempre a mi nombre.
CREATE OR REPLACE FUNCTION public.history_before() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
DROP TRIGGER IF EXISTS history_before ON public.reading_history;
CREATE TRIGGER history_before BEFORE INSERT OR UPDATE ON public.reading_history FOR EACH ROW EXECUTE FUNCTION public.history_before();

-- ═════════════════════════ 4. Permisos (RLS) ═════════════════════════

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_content      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_works       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_works      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_clears       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports           ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.profiles, public.communities, public.community_members, public.works, public.work_content,
  public.votes, public.comments, public.comment_likes, public.follows, public.saved_works, public.hidden_works,
  public.reading_history, public.notifications, public.messages, public.chat_clears, public.reports FROM anon, authenticated;

-- Lectura pública (también para invitados): perfiles, comunidades, obras publicadas y sus comentarios.
GRANT SELECT ON public.profiles, public.communities, public.community_members, public.works, public.work_content,
  public.comments, public.follows TO anon, authenticated;
GRANT SELECT ON public.votes, public.comment_likes, public.saved_works, public.hidden_works, public.reading_history,
  public.notifications, public.messages, public.chat_clears, public.reports TO authenticated;

-- Escritura: solo las columnas que la app puede tocar.
-- (Las tablas que se guardan con "upsert" necesitan permiso también sobre su clave.)
GRANT UPDATE (name, role, bio, genres, collab, avatar_path, banner_path, banner_seed) ON public.profiles TO authenticated;
GRANT INSERT (id, name, icon, cat, color, descr, private) ON public.communities TO authenticated;
GRANT DELETE ON public.communities TO authenticated;
GRANT INSERT (community_id), DELETE ON public.community_members TO authenticated;
GRANT INSERT (id, type, title, synopsis, community_id, genres, cover_path, cover_seed, image_path, video_path, poster_path, credits, license, mature, status) ON public.works TO authenticated;
GRANT UPDATE (title, synopsis, community_id, genres, cover_path, cover_seed, image_path, video_path, poster_path, credits, license, mature, status) ON public.works TO authenticated;
GRANT DELETE ON public.works TO authenticated;
GRANT INSERT (work_id, chapters), UPDATE (work_id, chapters) ON public.work_content TO authenticated;
GRANT INSERT (work_id, value), UPDATE (work_id, value), DELETE ON public.votes TO authenticated;
GRANT INSERT (id, work_id, parent_id, text, flagged), DELETE ON public.comments TO authenticated;
GRANT INSERT (comment_id), DELETE ON public.comment_likes TO authenticated;
GRANT INSERT (followee_id), DELETE ON public.follows TO authenticated;
GRANT INSERT (work_id), DELETE ON public.saved_works TO authenticated;
GRANT INSERT (work_id), DELETE ON public.hidden_works TO authenticated;
GRANT INSERT (work_id, ch, pct, pct_ch, read), UPDATE (work_id, ch, pct, pct_ch, read) ON public.reading_history TO authenticated;
GRANT UPDATE (read) ON public.notifications TO authenticated;
GRANT INSERT (recipient_id, text, img_path), UPDATE (read_at) ON public.messages TO authenticated;
GRANT INSERT (other_id, cleared_at), UPDATE (other_id, cleared_at) ON public.chat_clears TO authenticated;
GRANT INSERT (kind, target_id, parent_id, reason, note, auto) ON public.reports TO authenticated;

DO $$
DECLARE t text;
BEGIN
  -- Borra las reglas anteriores para poder volver a ejecutar el script.
  FOR t IN SELECT format('DROP POLICY %I ON %I.%I', policyname, schemaname, tablename) FROM pg_policies
           WHERE schemaname = 'public' AND tablename IN ('profiles','communities','community_members','works','work_content','votes',
             'comments','comment_likes','follows','saved_works','hidden_works','reading_history','notifications','messages','chat_clears','reports')
  LOOP EXECUTE t; END LOOP;
END $$;

CREATE POLICY "ver perfiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "editar mi perfil" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "ver comunidades" ON public.communities FOR SELECT USING (true);
CREATE POLICY "crear comunidad" ON public.communities FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "borrar mi comunidad" ON public.communities FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "ver miembros" ON public.community_members FOR SELECT USING (true);
CREATE POLICY "unirme" ON public.community_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "salirme" ON public.community_members FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "ver obras" ON public.works FOR SELECT
  USING ((status = 'publicado' AND NOT removed) OR author_id = auth.uid() OR public.is_mod());
CREATE POLICY "publicar como yo" ON public.works FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "editar mis obras" ON public.works FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
CREATE POLICY "borrar mis obras" ON public.works FOR DELETE TO authenticated USING (author_id = auth.uid());

CREATE POLICY "ver contenido" ON public.work_content FOR SELECT USING (public.can_see_work(work_id));
CREATE POLICY "escribir mi contenido" ON public.work_content FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.works w WHERE w.id = work_id AND w.author_id = auth.uid()));
CREATE POLICY "editar mi contenido" ON public.work_content FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.works w WHERE w.id = work_id AND w.author_id = auth.uid()));

CREATE POLICY "mis votos" ON public.votes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "votar" ON public.votes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "cambiar voto" ON public.votes FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "quitar voto" ON public.votes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "ver comentarios" ON public.comments FOR SELECT USING (public.can_see_work(work_id));
CREATE POLICY "comentar" ON public.comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "borrar comentario (autor o dueño de la obra)" ON public.comments FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.works w WHERE w.id = work_id AND w.author_id = auth.uid()));

CREATE POLICY "mis me gusta" ON public.comment_likes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "dar me gusta" ON public.comment_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "quitar me gusta" ON public.comment_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "ver seguidores" ON public.follows FOR SELECT USING (true);
CREATE POLICY "seguir" ON public.follows FOR INSERT TO authenticated WITH CHECK (follower_id = auth.uid());
CREATE POLICY "dejar de seguir" ON public.follows FOR DELETE TO authenticated USING (follower_id = auth.uid());

CREATE POLICY "mis guardados" ON public.saved_works FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "mis ocultos" ON public.hidden_works FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "mi historial" ON public.reading_history FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "mis notificaciones" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "marcar leídas" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "mis mensajes" ON public.messages FOR SELECT TO authenticated USING (auth.uid() IN (sender_id, recipient_id));
CREATE POLICY "enviar" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
CREATE POLICY "marcar leído" ON public.messages FOR UPDATE TO authenticated USING (recipient_id = auth.uid()) WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "mis chats vaciados" ON public.chat_clears FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "mis reportes" ON public.reports FOR SELECT TO authenticated USING (reporter_id = auth.uid() OR public.is_mod());
CREATE POLICY "reportar" ON public.reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());

-- ═════════════════════════ 5. Funciones para la app ═════════════════════════

CREATE OR REPLACE FUNCTION public.username_available(p_username text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p_username ~ '^[A-Za-z0-9_]{3,20}$' AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(p_username))
$$;

-- Lecturas / vistas (no cuenta las del propio autor).
CREATE OR REPLACE FUNCTION public.add_view(p_work uuid) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  UPDATE public.works SET views = views + 1
  WHERE id = p_work AND status = 'publicado' AND NOT removed AND author_id IS DISTINCT FROM auth.uid()
$$;

-- Moderación (solo perfiles con is_mod = true).
CREATE OR REPLACE FUNCTION public.mod_reports() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_mod() THEN RAISE EXCEPTION 'Solo moderación'; END IF;
  RETURN COALESCE((SELECT jsonb_agg(jsonb_build_object(
    'id', r.id, 'kind', r.kind, 'targetId', r.target_id, 'parentId', r.parent_id, 'reason', r.reason, 'note', r.note,
    'auto', r.auto, 'status', r.status, 'createdAt', r.created_at,
    'reporter', (SELECT username FROM public.profiles WHERE id = r.reporter_id),
    'target', CASE r.kind
      WHEN 'work' THEN (SELECT jsonb_build_object('title', w.title, 'type', w.type, 'author', p.name) FROM public.works w JOIN public.profiles p ON p.id = w.author_id WHERE w.id::text = r.target_id)
      WHEN 'comment' THEN (SELECT jsonb_build_object('text', left(c.text, 120), 'author', p.name) FROM public.comments c JOIN public.profiles p ON p.id = c.user_id WHERE c.id::text = r.target_id)
      ELSE (SELECT jsonb_build_object('username', p.username, 'name', p.name) FROM public.profiles p WHERE p.username = r.target_id) END
  ) ORDER BY r.status = 'pendiente' DESC, r.created_at DESC) FROM (SELECT * FROM public.reports ORDER BY created_at DESC LIMIT 300) r), '[]'::jsonb);
END $$;

CREATE OR REPLACE FUNCTION public.mod_resolve(p_report bigint, p_status text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r public.reports; owner uuid; rep uuid;
BEGIN
  IF NOT public.is_mod() THEN RAISE EXCEPTION 'Solo moderación'; END IF;
  IF p_status NOT IN ('retirado', 'descartado') THEN RAISE EXCEPTION 'Estado no válido'; END IF;
  SELECT * INTO r FROM public.reports WHERE id = p_report;
  IF NOT FOUND THEN RETURN; END IF;
  IF p_status = 'retirado' THEN
    IF r.kind = 'work' THEN
      UPDATE public.works SET removed = true WHERE id::text = r.target_id RETURNING author_id INTO owner;
      INSERT INTO public.notifications (user_id, type, work_id, extra)
      SELECT owner, 'mod_work', r.target_id::uuid, r.reason WHERE owner IS NOT NULL;
    ELSIF r.kind = 'comment' THEN
      UPDATE public.comments SET removed = true WHERE id::text = r.target_id;
    END IF;
  END IF;
  UPDATE public.reports SET status = p_status
  WHERE kind = r.kind AND target_id = r.target_id AND status = 'pendiente';
  FOR rep IN SELECT DISTINCT reporter_id FROM public.reports
             WHERE kind = r.kind AND target_id = r.target_id AND reporter_id IS NOT NULL AND NOT auto LOOP
    INSERT INTO public.notifications (user_id, type, extra) VALUES (rep, 'mod_report', p_status);
  END LOOP;
END $$;

-- Eliminar mi cuenta y todo lo mío (exigencia de Google Play).
CREATE OR REPLACE FUNCTION public.delete_my_account() RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Inicia sesión'; END IF;
  DELETE FROM auth.users WHERE id = auth.uid();
END $$;

REVOKE EXECUTE ON FUNCTION public.notify(uuid, text, uuid, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mod_reports(), public.mod_resolve(bigint, text), public.delete_my_account(),
  public.add_view(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.username_available(text), public.is_mod(), public.can_see_work(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_view(uuid), public.mod_reports(), public.mod_resolve(bigint, text),
  public.delete_my_account() TO authenticated;

-- ═════════════════════════ 6. Archivos (Storage) ═════════════════════════
-- "media" (público): portadas, páginas, ilustraciones, videos, fotos de perfil. Hasta 50 MB.
-- "chat" (privado): fotos de los mensajes; solo las ven las dos personas del chat.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 52428800,
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('chat', 'chat', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "media: subir a mi carpeta" ON storage.objects;
DROP POLICY IF EXISTS "media: borrar mis archivos" ON storage.objects;
DROP POLICY IF EXISTS "chat: subir" ON storage.objects;
DROP POLICY IF EXISTS "chat: ver" ON storage.objects;
DROP POLICY IF EXISTS "chat: borrar" ON storage.objects;
CREATE POLICY "media: subir a mi carpeta" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "media: borrar mis archivos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "chat: subir" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chat' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "chat: ver" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'chat' AND auth.uid()::text IN ((storage.foldername(name))[1], (storage.foldername(name))[2]));
CREATE POLICY "chat: borrar" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'chat' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ═════════════════════════ 7. Tiempo real ═════════════════════════
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles', 'communities', 'works', 'comments', 'notifications', 'messages'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;

-- Listo. Para nombrar moderadores: Table Editor → profiles → columna is_mod = true.
