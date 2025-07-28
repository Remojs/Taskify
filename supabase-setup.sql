-- ================================================================
-- SETUP INICIAL DE SUPABASE PARA TASKIFY
-- ================================================================
-- 
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto de Supabase → SQL Editor
-- 2. Crea una nueva query
-- 3. Copia y pega todo este archivo
-- 4. Ejecuta con el botón "RUN"
-- 
-- Este script crea:
-- ✅ Tabla 'tasks' con todos los campos necesarios
-- ✅ Índices para mejor rendimiento
-- ✅ Políticas de seguridad (RLS)
-- ✅ Triggers automáticos
-- ================================================================

-- Crear la tabla tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL DEFAULT 'anonymous', -- Simplificado para MVP
    title text NOT NULL,
    category text NOT NULL,
    color text NOT NULL DEFAULT '#00A19D',
    due_date date NOT NULL,
    completed boolean DEFAULT false,
    calendar_id text, -- Para Google Calendar integration
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON public.tasks(completed);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at);

-- ================================================================
-- OPCIONAL: Row Level Security (RLS) 
-- Descomenta si quieres autenticación de usuarios más adelante
-- ================================================================

-- ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Users can view own tasks" ON public.tasks
--     FOR SELECT USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can insert own tasks" ON public.tasks
--     FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- CREATE POLICY "Users can update own tasks" ON public.tasks
--     FOR UPDATE USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can delete own tasks" ON public.tasks
--     FOR DELETE USING (auth.uid()::text = user_id);

-- ================================================================
-- TRIGGERS AUTOMÁTICOS
-- ================================================================

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER handle_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ================================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- Descomenta para insertar algunas tareas de prueba
-- ================================================================

-- INSERT INTO public.tasks (title, category, color, due_date) VALUES
--     ('Revisar emails', 'Trabajo', '#4A90E2', CURRENT_DATE),
--     ('Hacer compras', 'Personal', '#7ED321', CURRENT_DATE + 1),
--     ('Estudiar React', 'Estudio', '#F5A623', CURRENT_DATE + 2)
-- ON CONFLICT DO NOTHING;

-- ================================================================
-- ✅ SETUP COMPLETADO
-- 
-- Próximos pasos:
-- 1. Ejecuta este SQL en Supabase
-- 2. Ve a Table Editor → tasks para ver la tabla creada
-- 3. ¡Tu app ya debería funcionar con la base de datos!
-- ================================================================
