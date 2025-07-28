
md
Copiar
Editar
# 📋 `README_DEV.md` — Proyecto ToDo Calendar App

---

## 🧠 Resumen del Proyecto

Esta es una aplicación web **minimalista y moderna** de gestión de tareas, con una estética inspirada en la **UI de Apple**. Permite a los usuarios:

- Crear tareas personalizadas con categoría, color y fecha.
- Ver las tareas en una lista limpia y ordenada.
- Marcar tareas como completadas o eliminarlas.
- (Opcional) Agregar automáticamente una tarea como evento en Google Calendar al crearla.

El frontend fue generado automáticamente con **Lovable.so**, usando **React + TailwindCSS**.

---

## 🧩 Tecnologías utilizadas

| Componente      | Tecnología             |
|-----------------|------------------------|
| Frontend        | React + TailwindCSS    |
| Backend/DB      | Supabase (PostgreSQL + Auth) |
| API externa     | Google Calendar API v3 |
| OAuth           | Google OAuth2          |
| Deployment      | Vercel (recomendado)   |

---

## ✅ Funcionalidad Esperada

1. **Agregar tarea**:
   - Input de texto: nombre de la tarea
   - Input tipo select: categoría
   - Color picker o select: color de la tarea
   - Input tipo date: fecha programada
   - Checkbox: “Agregar a Google Calendar”
   - Botón "Guardar tarea"
  
2. **Al enviar el formulario**:
   - Guardar la tarea en la tabla `tasks` de Supabase.
   - Si el checkbox está activo:
     - Autenticar con Google (OAuth2)
     - Crear evento en el Calendar del usuario
       - Campos: título = nombre tarea, descripción = categoría, fecha = input

3. **Home page**:
   - Muestra lista de tareas visualmente ordenada:
   - Agrupadas por fecha o todas juntas
   - Cada card muestra:
     - Nombre
     - Categoría
     - Color (como tag o círculo)
     - Fecha
   - Acciones: completar / eliminar

---

## 🗂 Estructura esperada en Supabase

**Tabla: `tasks`**

| Campo        | Tipo       | Descripción                      |
|--------------|------------|----------------------------------|
| id           | UUID       | Identificador único              |
| user_id      | UUID       | ID del usuario (auth)            |
| title        | text       | Nombre de la tarea               |
| category     | text       | Categoría asignada               |
| color        | text       | Color elegido (hex o nombre)     |
| due_date     | date       | Fecha asignada                   |
| completed    | boolean    | Si la tarea fue completada       |
| calendar_id  | text/null  | ID del evento de Calendar creado |

---

## 🔐 Google Calendar API

Se debe implementar:

- Autenticación con OAuth2 (guardar el token en `localStorage` o `sessionStorage`)
- Petición `POST` a `https://www.googleapis.com/calendar/v3/calendars/primary/events`
- Payload mínimo:

```json
{
  "summary": "Nombre de la tarea",
  "description": "Categoría: Trabajo / Personal / etc",
  "start": {
    "date": "YYYY-MM-DD"
  },
  "end": {
    "date": "YYYY-MM-DD"
  }
}
📦 TODOs para el Copilot (orden sugerido)
 Conectar el frontend generado con Supabase.

 Crear función addTaskToDB(data) para guardar en Supabase.

 Crear hook o función addTaskToCalendar(task):

Autenticación con Google OAuth2

Crear evento con la fecha seleccionada

Guardar calendar_id devuelto si se desea

 Renderizar tareas mapeadas desde Supabase (getTasks())

 Añadir completeTask(id) y deleteTask(id)

 Manejar loading, errores, y feedback al usuario

 (Opcional) Añadir modo oscuro / selector de color más personalizado

🎨 Paleta de colores (Grey & Teal)
Usar como base para el diseño:

#91A3B1

#708091

#536877

#00A19D

#008082

Fondo general: tonos grises suaves (#F8F8F8 o similar)
Cards y UI: usar tonos con contraste mínimo, sombras suaves, tipografía clara.

🧠 Notas extra
El frontend está listo (Lovable generado).

La prioridad es que todo funcione simple, sin backend custom.

Se puede usar localStorage para manejar el token de Google si no hay login global aún.

El enfoque es MVP: rápido, funcional, limpio.