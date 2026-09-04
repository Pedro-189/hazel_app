-- ================================================================
-- HAZEL COUPLES APP — SCRIPT SQL IDEMPOTENTE PARA SUPABASE
-- Copia y pega todo este código en el "SQL Editor" de tu panel de Supabase
-- y luego haz clic en "RUN".
-- ================================================================

-- 1. Crear la tabla principal de casitas compartidas de parejas
CREATE TABLE IF NOT EXISTS public.hazel_couples (
  id TEXT PRIMARY KEY,                             -- Código de pareja (ej: HAZEL-LUNA99)
  couple_data JSONB NOT NULL DEFAULT '{}'::jsonb,  -- Perfiles de ambos, ánimos, monedas, racha
  house_data JSONB NOT NULL DEFAULT '{}'::jsonb,   -- Muebles colocados, habitaciones, inventario
  qa_data JSONB NOT NULL DEFAULT '{}'::jsonb,      -- Preguntas respondidas, reveladas, cartas
  last_interaction JSONB,                          -- Último abrazo, beso o mimo enviado
  last_sender_id TEXT,                             -- Quién hizo el último cambio
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar la seguridad RLS (Row Level Security)
ALTER TABLE public.hazel_couples ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas anteriores si ya existían para evitar conflictos
DROP POLICY IF EXISTS "Permitir lectura publica por codigo" ON public.hazel_couples;
DROP POLICY IF EXISTS "Permitir insercion por codigo" ON public.hazel_couples;
DROP POLICY IF EXISTS "Permitir actualizacion por codigo" ON public.hazel_couples;

-- 4. Crear las políticas de acceso por código
CREATE POLICY "Permitir lectura publica por codigo"
  ON public.hazel_couples
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir insercion por codigo"
  ON public.hazel_couples
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir actualizacion por codigo"
  ON public.hazel_couples
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 5. Habilitar Realtime de manera segura
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'hazel_couples'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hazel_couples;
  END IF;
END $$;
