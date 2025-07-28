import { useState, useEffect, useCallback } from 'react'
import { supabase, Task } from '@/lib/supabase'
import { TaskData } from '@/components/TaskForm'
import { useToast } from './use-toast'

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
      const supabaseTask = taskDataToSupabase(taskData)

      const { error } = await supabase
        .from('tasks')
        .insert([supabaseTask])

      if (error) throw error

      // Actualizar estado local
      setTasks(prev => [taskData, ...prev])
      
      toast({
        title: "✅ Tarea creada",
        description: `"${taskData.title}" ha sido guardada.`,
      })

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
    refreshTasks: loadTasks
  }
}
