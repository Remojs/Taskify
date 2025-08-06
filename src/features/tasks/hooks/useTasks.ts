import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/shared/hooks';
import { taskService } from '../services';
import { useGoogleCalendar } from './useGoogleCalendar';
import { TaskData } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Hook de Google Calendar
  const { addTaskToCalendar, updateTaskInCalendar, isGoogleLoaded, initializeGoogleAPI } = useGoogleCalendar();

  // Cargar tareas al inicializar
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const taskDataArray = await taskService.getTasks();
      setTasks(taskDataArray);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar tareas';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = useCallback(async (taskData: TaskData): Promise<boolean> => {
    try {
      setError(null);
      let calendarEventId: string | null = null;

      // Si el usuario quiere agregar a Google Calendar
      if (taskData.addToGoogleCalendar) {
        // Inicializar Google API si no está cargado
        if (!isGoogleLoaded) {
          await initializeGoogleAPI();
        }
        
        // Intentar agregar al calendario
        calendarEventId = await addTaskToCalendar(taskData);
      }

      // Crear tarea en la base de datos
      const createdTask = await taskService.createTask(taskData);

      // Si se creó el evento en Google Calendar, actualizar el calendar_id
      if (calendarEventId) {
        await taskService.updateTaskCalendarId(createdTask.id, calendarEventId);
        createdTask.addToGoogleCalendar = true;
      }

      // Actualizar estado local
      setTasks(prev => [createdTask, ...prev]);
      
      toast({
        title: "✅ Tarea creada",
        description: `"${taskData.title}" ha sido guardada${calendarEventId ? ' y agregada al calendario' : ''}.`,
      });

      // Refresh adicional para asegurar sincronización
      setTimeout(() => {
        loadTasks();
      }, 500);

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear tarea';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return false;
    }
  }, [toast, addTaskToCalendar, isGoogleLoaded, initializeGoogleAPI, loadTasks]);

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
