-- ═══════════════════════════════════════════════════════════════════════════
--  CHOGGUN · Conectar la cuenta con Discord
--  Pega TODO este archivo en Supabase → SQL Editor → New query → Run.
--  Ejecútalo DESPUÉS de supabase-schema.sql y supabase-match.sql. Se puede repetir.
--
--  La conexión real la hace Supabase (Authentication → Providers → Discord).
--  Esta tabla solo guarda lo que se muestra: el usuario de Discord y quién puede verlo.
--  · Por defecto lo ven solo tus matches. Tú decides si también sale en tu perfil público.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.discord_links (
  user_id      uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  discord_id   text        NOT NULL CHECK (discord_id ~ '^[0-9]{5,25}$'),
  username     text        NOT NULL CHECK (char_length(username) BETWEEN 1 AND 40),
  display_name text        NOT NULL DEFAULT '' CHECK (char_length(display_name) <= 40),
  show_profile boolean     NOT NULL DEFAULT false,   -- visible en mi perfil público
  show_matches boolean     NOT NULL DEFAULT true,    -- visible para mis matches
  linked_at    timestamptz NOT NULL DEFAULT now()
);

-- ¿Tenemos match? (al bloquear se deshace el match, así que también deja de verse)
CREATE OR REPLACE FUNCTION public.are_matched(a uuid, b uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.matches WHERE user_a = least(a, b) AND user_b = greatest(a, b))
$$;

ALTER TABLE public.discord_links ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.discord_links FROM anon, authenticated;
GRANT SELECT ON public.discord_links TO anon, authenticated;
GRANT UPDATE (show_profile, show_matches) ON public.discord_links TO authenticated;

DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT format('DROP POLICY %I ON %I.%I', policyname, schemaname, tablename) FROM pg_policies
           WHERE schemaname = 'public' AND tablename = 'discord_links'
  LOOP EXECUTE t; END LOOP;
END $$;

CREATE POLICY "ver discord (invitados)" ON public.discord_links FOR SELECT TO anon USING (show_profile);
CREATE POLICY "ver discord" ON public.discord_links FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR show_profile
  OR (show_matches AND public.are_matched(auth.uid(), user_id))
);
CREATE POLICY "mis opciones de discord" ON public.discord_links FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Copia los datos de Discord desde la cuenta de Supabase (auth.identities).
-- Si ya no hay Discord conectado, borra la fila. La app la llama después de conectar o desconectar.
CREATE OR REPLACE FUNCTION public.sync_discord() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE uid uuid := auth.uid(); idt jsonb; pid text; un text; dn text; r public.discord_links;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Inicia sesión'; END IF;
  SELECT i.identity_data, i.provider_id INTO idt, pid
  FROM auth.identities i WHERE i.user_id = uid AND i.provider = 'discord'
  ORDER BY i.created_at DESC LIMIT 1;
  IF idt IS NULL THEN
    DELETE FROM public.discord_links WHERE user_id = uid;
    RETURN NULL;
  END IF;
  pid := COALESCE(NULLIF(idt->>'provider_id', ''), NULLIF(idt->>'sub', ''), pid);
  un := COALESCE(NULLIF(idt->>'name', ''), NULLIF(idt->>'user_name', ''), NULLIF(idt->>'preferred_username', ''), NULLIF(idt->>'full_name', ''), 'discord');
  un := left(regexp_replace(un, '#0+$', ''), 40);
  dn := left(COALESCE(NULLIF(idt->'custom_claims'->>'global_name', ''), NULLIF(idt->>'full_name', ''), ''), 40);
  INSERT INTO public.discord_links (user_id, discord_id, username, display_name)
  VALUES (uid, pid, un, dn)
  ON CONFLICT (user_id) DO UPDATE SET discord_id = EXCLUDED.discord_id, username = EXCLUDED.username,
    display_name = EXCLUDED.display_name
  RETURNING * INTO r;
  RETURN to_jsonb(r);
END $$;

REVOKE EXECUTE ON FUNCTION public.sync_discord(), public.are_matched(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_discord() TO authenticated;
GRANT EXECUTE ON FUNCTION public.are_matched(uuid, uuid) TO authenticated;

-- Listo. Recuerda activar Discord en Authentication → Providers (ver INSTRUCCIONES-DISCORD.md).
