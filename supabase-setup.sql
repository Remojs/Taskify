-- Crear la tabla de tareas en Supabase
-- Ejecuta este SQL en el SQL Editor de tu proyecto de Supabase

-- Crear la tabla tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL DEFAULT auth.uid(),
    title text NOT NULL,
    category text NOT NULL,
    color text NOT NULL DEFAULT '#00A19D',
    due_date date NOT NULL,
    completed boolean DEFAULT false,
    calendar_id text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON public.tasks(completed);

-- Configurar Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para que los usuarios solo vean sus propias tareas
CREATE POLICY "Users can view own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Función para actualizar automatically el campo updated_at
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

-- Insertar categorías predefinidas (opcional)
-- CREATE TABLE IF NOT EXISTS public.categories (
--     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
--     name text NOT NULL UNIQUE,
--     color text DEFAULT '#00A19D',
--     created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
-- );

-- INSERT INTO public.categories (name, color) VALUES
--     ('Trabajo', '#4A90E2'),
--     ('Personal', '#7ED321'),
--     ('Estudio', '#F5A623'),
--     ('Hogar', '#D0021B'),
--     ('Salud', '#50E3C2'),
--     ('Viajes', '#9013FE')
-- ON CONFLICT (name) DO NOTHING;
