import { useState, useEffect, useCallback } from 'react'
import { supabase, Task } from '@/lib/supabase'
import { TaskData } from '@/components/TaskForm'
import { useToast } from './use-toast'
import { useGoogleCalendar } from './use-google-calendar'

// Convertir TaskData a formato Supabase
const taskDataToSupabase = (task: TaskData, userId: string = 'anonymous') => ({
  id: task.id,
  user_id: userId,
  title: task.title,
  category: task.category,
  color: task.color,
  due_date: task.date,
  completed: task.completed,
  calendar_id: task.addToGoogleCalendar ? 'pending' : null
})

// Convertir datos de Supabase a TaskData
const supabaseToTaskData = (supabaseTask: Task): TaskData => ({
  id: supabaseTask.id,
  title: supabaseTask.title,
  category: supabaseTask.category,
  color: supabaseTask.color,
  date: supabaseTask.due_date,
  completed: supabaseTask.completed,
  addToGoogleCalendar: !!supabaseTask.calendar_id,
  createdAt: new Date(supabaseTask.created_at)
})

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Hook de Google Calendar
  const { addTaskToCalendar, updateTaskInCalendar, isGoogleLoaded, initializeGoogleAPI } = useGoogleCalendar()

  // Cargar tareas al inicializar
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const taskDataArray = data?.map(supabaseToTaskData) || []
      setTasks(taskDataArray)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar tareas'
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const createTask = async (taskData: TaskData): Promise<boolean> => {
    try {
      setError(null)
      let calendarEventId: string | null = null

      // Si el usuario quiere agregar a Google Calendar
      if (taskData.addToGoogleCalendar) {
        // Inicializar Google API si no está cargado
        if (!isGoogleLoaded) {
          await initializeGoogleAPI()
        }
        
        // Intentar agregar al calendario
        calendarEventId = await addTaskToCalendar(taskData)
      }

      // Preparar datos para Supabase
      const supabaseTask = taskDataToSupabase(taskData)
      if (calendarEventId) {
        supabaseTask.calendar_id = calendarEventId
      }

      // Insertar en Supabase
      const { data, error } = await supabase
        .from('tasks')
        .insert([supabaseTask])
        .select()

      if (error) throw error

      // Actualizar estado local inmediatamente con los datos de la base de datos
      if (data && data.length > 0) {
        const newTaskFromDB = supabaseToTaskData(data[0])
        setTasks(prev => [newTaskFromDB, ...prev])
      } else {
        // Fallback: usar datos locales si no se obtienen de la DB
        const updatedTask = { ...taskData }
        if (calendarEventId) {
          updatedTask.addToGoogleCalendar = true
        }
        setTasks(prev => [updatedTask, ...prev])
      }
      
      toast({
        title: "✅ Tarea creada",
        description: `"${taskData.title}" ha sido guardada${calendarEventId ? ' y agregada al calendario' : ''}.`,
      })

      // Refresh adicional para asegurar sincronización después de un pequeño delay
      setTimeout(() => {
        loadTasks()
      }, 500)

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear tarea'
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      })
      return false
    }
  }

  const updateTask = async (id: string, updates: Partial<TaskData>): Promise<boolean> => {
    try {
      setError(null)
      
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          category: updates.category,
          color: updates.color,
          due_date: updates.date,
          completed: updates.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      // Actualizar estado local
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ))

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar tarea'
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      })
      return false
    }
  }

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      setError(null)

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Actualizar estado local
      const deletedTask = tasks.find(t => t.id === id)
      setTasks(prev => prev.filter(task => task.id !== id))
      
      if (deletedTask) {
        toast({
          title: "🗑️ Tarea eliminada",
          description: `"${deletedTask.title}" ha sido eliminada.`,
          variant: "destructive"
        })
      }

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar tarea'
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      })
      return false
    }
  }

  const toggleTaskComplete = async (id: string): Promise<boolean> => {
    const task = tasks.find(t => t.id === id)
    if (!task) return false

    const newCompleted = !task.completed
    const success = await updateTask(id, { completed: newCompleted })
    
    if (success) {
      toast({
        title: newCompleted ? "✅ Tarea completada" : "📝 Tarea restaurada",
        description: `"${task.title}" ${newCompleted ? 'completada' : 'marcada como pendiente'}.`,
      })

      // Actualizar color en Google Calendar si la tarea estaba sincronizada
      if (task.addToGoogleCalendar) {
        // Buscar el calendar_id en la base de datos
        const { data: dbTask } = await supabase
          .from('tasks')
          .select('calendar_id')
          .eq('id', id)
          .single()

        if (dbTask?.calendar_id && dbTask.calendar_id !== 'pending') {
          await updateTaskInCalendar(dbTask.calendar_id, newCompleted, task.color)
        }
      }
    }
    
    return success
  }

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
  }
}
