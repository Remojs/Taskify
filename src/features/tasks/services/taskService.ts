import { supabase, Task } from '@/shared/services';
import { TaskData } from '../types';

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
});

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
});

export const taskService = {
  /**
   * Obtener todas las tareas del usuario
   */
  async getTasks(): Promise<TaskData[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(supabaseToTaskData) || [];
  },

  /**
   * Crear una nueva tarea
   */
  async createTask(taskData: TaskData): Promise<TaskData> {
    const supabaseTask = taskDataToSupabase(taskData);

    const { data, error } = await supabase
      .from('tasks')
      .insert([supabaseTask])
      .select()
      .single();

    if (error) throw error;

    return supabaseToTaskData(data);
  },

  /**
   * Actualizar una tarea existente
   */
  async updateTask(id: string, updates: Partial<TaskData>): Promise<TaskData> {
    const { data, error } = await supabase
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
      .select()
      .single();

    if (error) throw error;

    return supabaseToTaskData(data);
  },

  /**
   * Eliminar una tarea
   */
  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Obtener tarea por ID
   */
  async getTaskById(id: string): Promise<TaskData | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return supabaseToTaskData(data);
  },

  /**
   * Actualizar calendar_id de una tarea
   */
  async updateTaskCalendarId(id: string, calendarId: string | null): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .update({ calendar_id: calendarId })
      .eq('id', id);

    if (error) throw error;
  }
};
