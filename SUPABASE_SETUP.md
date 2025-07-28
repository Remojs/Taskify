# Configuración de Supabase para Taskify

## Pasos para configurar Supabase

### 1. Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Elige tu organización
5. Asigna un nombre al proyecto (ej: "taskify")
6. Crea una contraseña para la base de datos
7. Selecciona una región cercana a ti
8. Haz clic en "Create new project"

### 2. Obtener las credenciales

1. Una vez creado el proyecto, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (algo como: `https://xyzcompany.supabase.co`)
   - **anon public** key (clave pública)

### 3. Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto
2. Copia el contenido de `.env.example`
3. Reemplaza los valores con tus credenciales:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_aqui
```

### 4. Crear la tabla de tareas

1. Ve a tu proyecto de Supabase
2. Abre el **SQL Editor** en el panel lateral
3. Copia y pega el contenido del archivo `supabase-setup.sql`
4. Haz clic en **Run** para ejecutar el SQL

### 5. Configurar autenticación (opcional)

Si quieres que cada usuario tenga sus propias tareas:

1. Ve a **Authentication** > **Settings**
2. Configura los proveedores que desees (Google, GitHub, etc.)
3. Actualiza el hook `use-tasks.ts` para usar `auth.uid()` real

### 6. Verificar configuración

1. Inicia el proyecto: `npm run dev`
2. Intenta crear una tarea
3. Ve a **Table Editor** > **tasks** en Supabase para verificar que se guardó

## Estructura de la tabla `tasks`

| Campo       | Tipo      | Descripción                           |
|-------------|-----------|---------------------------------------|
| id          | uuid      | Identificador único (auto-generado)  |
| user_id     | uuid      | ID del usuario (para multiusuario)   |
| title       | text      | Nombre de la tarea                    |
| category    | text      | Categoría de la tarea                 |
| color       | text      | Color asignado (hex)                  |
| due_date    | date      | Fecha programada                      |
| completed   | boolean   | Estado de completado                  |
| calendar_id | text      | ID del evento de Google Calendar     |
| created_at  | timestamp | Fecha de creación                     |
| updated_at  | timestamp | Última actualización                  |

## Políticas de seguridad (RLS)

El proyecto está configurado con Row Level Security para que:
- Cada usuario solo vea sus propias tareas
- Solo pueda crear, editar y eliminar sus tareas
- No pueda acceder a tareas de otros usuarios

## Troubleshooting

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctas
- Asegúrate de haber reiniciado el servidor después de crear el `.env`

### Error: "Table 'tasks' doesn't exist"
- Ejecuta el archivo `supabase-setup.sql` en el SQL Editor

### Error: "Row Level Security policy violation"
- Asegúrate de que las políticas RLS estén creadas correctamente
- Verifica que `auth.uid()` esté configurado

### Las tareas no se guardan
- Revisa la consola del navegador para errores
- Verifica la conexión a internet
- Comprueba que el proyecto de Supabase esté activo
