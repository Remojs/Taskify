import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/shared/hooks';
import { taskService } from '../services';
import { useGoogleCalendar } from './useGoogleCalendar';
import { TaskData } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDbError, setIsDbError] = useState(false); // Estado específico para errores de DB
  const { toast } = useToast();
  
  // Hook de Google Calendar
  const { addTaskToCalendar, updateTaskInCalendar, isGoogleLoaded, initializeGoogleAPI } = useGoogleCalendar();

  // Cargar tareas al inicializar
  const loadTasks = useCallback(async () => {
    try {
      if (import.meta.env.DEV) {
        console.log('🔄 [DEBUG] Iniciando carga de tareas...');
      }
      setLoading(true);
      setError(null);
      setIsDbError(false);

      const taskDataArray = await taskService.getTasks();
      if (import.meta.env.DEV) {
        console.log('✅ [DEBUG] Tareas cargadas desde Supabase:', taskDataArray);
      }
      setTasks(taskDataArray);
      
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('❌ [DEBUG] Error al cargar tareas:', err);
      }
      const message = err instanceof Error ? err.message : 'Error al cargar tareas';
      
      // Detectar si es un error de conexión a la base de datos
      const isConnectionError = 
        message.includes('ERR_NAME_NOT_RESOLVED') ||
        message.includes('Failed to fetch') ||
        message.includes('Network error') ||
        message.includes('fetch');
        
      setError(message);
      setIsDbError(isConnectionError);
      
      if (!isConnectionError) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
      if (import.meta.env.DEV) {
        console.log('🏁 [DEBUG] Carga de tareas finalizada');
      }
    }
  }, [toast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = useCallback(async (taskData: TaskData): Promise<boolean> => {
    try {
      console.log('🚀 [DEBUG] Creando nueva tarea:', taskData);
      setError(null);
      setIsDbError(false);
      let calendarEventId: string | null = null;

      // Si el usuario quiere agregar a Google Calendar
      if (taskData.addToGoogleCalendar) {
        console.log('📅 [DEBUG] Agregando a Google Calendar...');
        // Inicializar Google API si no está cargado
        if (!isGoogleLoaded) {
          console.log('🔄 [DEBUG] Inicializando Google API...');
          await initializeGoogleAPI();
        }
        
        // Intentar agregar al calendario
        calendarEventId = await addTaskToCalendar(taskData);
        console.log('✅ [DEBUG] Evento creado en Google Calendar:', calendarEventId);
      }

      // Intentar crear tarea en la base de datos solo si no hay error de DB
      if (!isDbError) {
        try {
          console.log('💾 [DEBUG] Guardando tarea en Supabase...');
          const createdTask = await taskService.createTask(taskData);
          console.log('✅ [DEBUG] Tarea guardada en Supabase:', createdTask);

          // Si se creó el evento en Google Calendar, actualizar el calendar_id
          if (calendarEventId) {
            console.log('🔗 [DEBUG] Actualizando calendar_id en la base de datos...');
            await taskService.updateTaskCalendarId(createdTask.id, calendarEventId);
            createdTask.addToGoogleCalendar = true;
          }

          // Actualizar estado local
          console.log('🔄 [DEBUG] Actualizando estado local...');
          setTasks(prev => {
            const updatedTasks = [createdTask, ...prev];
            console.log('📝 [DEBUG] Estado local actualizado. Total tareas:', updatedTasks.length);
            return updatedTasks;
          });
          
          toast({
            title: "✅ Tarea creada",
            description: `"${taskData.title}" ha sido guardada${calendarEventId ? ' y agregada al calendario' : ''}.`,
          });

        } catch (dbErr) {
          console.warn('⚠️ [DEBUG] Error de DB, pero continúa con Calendar:', dbErr);
          
          // Si hay error de DB pero el calendario funcionó
          if (calendarEventId) {
            toast({
              title: "✅ Tarea creada en Calendar",
              description: `"${taskData.title}" se agregó al calendario. La base de datos no está disponible.`,
              variant: "default"
            });
          } else {
            throw dbErr; // Re-lanzar si tampoco funcionó el calendario
          }
        }
      } else {
        // Solo mostrar éxito del calendario si la DB está caída
        if (calendarEventId) {
          toast({
            title: "✅ Tarea creada en Calendar",
            description: `"${taskData.title}" se agregó al calendario.`,
          });
        }
      }

      // Refresh adicional para asegurar sincronización (solo si DB disponible)
      if (!isDbError) {
        console.log('🔄 [DEBUG] Haciendo refresh adicional en 500ms...');
        setTimeout(() => {
          loadTasks();
        }, 500);
      }

      return true;
    } catch (err) {
      console.error('❌ [DEBUG] Error al crear tarea:', err);
      const message = err instanceof Error ? err.message : 'Error al crear tarea';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return false;
    }
  }, [toast, addTaskToCalendar, isGoogleLoaded, initializeGoogleAPI, loadTasks, isDbError]);

  const updateTask = useCallback(async (id: string, updates: Partial<TaskData>): Promise<boolean> => {
    try {
      setError(null);
      
      const updatedTask = await taskService.updateTask(id, updates);

      // Actualizar estado local
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar tarea';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      // Obtener la tarea antes de eliminarla para el toast
      const task = tasks.find(t => t.id === id);
      
      await taskService.deleteTask(id);

      // Actualizar estado local
      setTasks(prev => prev.filter(task => task.id !== id));
      
      if (task) {
        toast({
          title: "🗑️ Tarea eliminada",
          description: `"${task.title}" ha sido eliminada.`,
          variant: "destructive"
        });
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar tarea';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return false;
    }
  }, [tasks, toast]);

  const toggleTaskComplete = useCallback(async (id: string): Promise<boolean> => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;

    const newCompleted = !task.completed;
    const success = await updateTask(id, { completed: newCompleted });
    
    if (success) {
      toast({
        title: newCompleted ? "✅ Tarea completada" : "📝 Tarea restaurada",
        description: `"${task.title}" ${newCompleted ? 'completada' : 'marcada como pendiente'}.`,
      });

      // Actualizar color en Google Calendar si la tarea estaba sincronizada
      if (task.addToGoogleCalendar) {
        // Buscar el calendar_id en la base de datos
        const dbTask = await taskService.getTaskById(id);
        if (dbTask && dbTask.addToGoogleCalendar) {
          // Nota: Aquí necesitaríamos el calendar_id real de la base de datos
          // Por ahora simulamos con el ID de la tarea
          await updateTaskInCalendar(id, newCompleted, task.color);
        }
      }
    }
    
    return success;
  }, [tasks, updateTask, updateTaskInCalendar, toast]);

  return {
    tasks,
    loading,
    error,
    isDbError, // Agregar el nuevo estado
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refreshTasks: loadTasks,
    // Exponer funciones de Google Calendar
    initializeGoogleAPI,
    isGoogleLoaded
  };
};
