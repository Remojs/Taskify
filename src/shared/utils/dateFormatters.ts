import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const dateFormatters = {
  /**
   * Formato para TaskCard - día y mes corto
   */
  taskCard: (dateString: string): string => {
    console.log('📅 [DEBUG taskCard] Input dateString:', dateString);
    
    // Asegurar formato YYYY-MM-DD y parsear correctamente
    const cleanDateString = dateString.split('T')[0]; // Solo la parte de fecha
    const [year, month, day] = cleanDateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month - 1 porque Date() espera 0-11
    
    console.log('📅 [DEBUG taskCard] Parsed date:', date);
    console.log('📅 [DEBUG taskCard] Local date string:', date.toLocaleDateString('es-ES'));
    
    const result = date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
    
    console.log('📅 [DEBUG taskCard] Result:', result);
    return result;
  },

  /**
   * Formato para headers de TaskSlider - con "Hoy" y "Mañana"
   */
  taskHeader: (dateKey: string, showCompletedFormat = false): string => {
    console.log('📅 [DEBUG taskHeader] Input dateKey:', dateKey);
    
    // Parsear la fecha correctamente
    const cleanDateString = dateKey.split('T')[0];
    const [year, month, day] = cleanDateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    console.log('📅 [DEBUG taskHeader] Parsed date:', date);
    
    if (showCompletedFormat) {
      const result = format(date, 'EEEE, d MMMM yyyy', { locale: es });
      console.log('📅 [DEBUG taskHeader] Completed format result:', result);
      return result;
    }
    
    // Obtener fechas de hoy y mañana EN LA MISMA ZONA HORARIA
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparación exacta
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Crear fecha de comparación con misma zona horaria
    const taskDate = new Date(year, month - 1, day);
    taskDate.setHours(0, 0, 0, 0);
    
    console.log('📅 [DEBUG taskHeader] Today:', today.toLocaleDateString('es-ES'));
    console.log('📅 [DEBUG taskHeader] Tomorrow:', tomorrow.toLocaleDateString('es-ES'));
    console.log('📅 [DEBUG taskHeader] Task date:', taskDate.toLocaleDateString('es-ES'));
    
    if (taskDate.getTime() === today.getTime()) {
      console.log('📅 [DEBUG taskHeader] Result: Hoy');
      return "Hoy";
    }
    if (taskDate.getTime() === tomorrow.getTime()) {
      console.log('📅 [DEBUG taskHeader] Result: Mañana');
      return "Mañana";
    }
    
    const result = format(date, 'EEEE, d MMMM', { locale: es });
    console.log('📅 [DEBUG taskHeader] Regular format result:', result);
    return result;
  },

  /**
   * Formato para TaskList - día de semana y fecha completa
   */
  taskList: (date: string): string => {
    console.log('📅 [DEBUG taskList] Input date:', date);
    
    // Parsear correctamente la fecha
    const cleanDateString = date.split('T')[0];
    const [year, month, day] = cleanDateString.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    // Obtener fechas de comparación
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(year, month - 1, day);
    taskDate.setHours(0, 0, 0, 0);
    
    console.log('📅 [DEBUG taskList] Today:', today.toLocaleDateString('es-ES'));
    console.log('📅 [DEBUG taskList] Tomorrow:', tomorrow.toLocaleDateString('es-ES'));
    console.log('📅 [DEBUG taskList] Task date:', taskDate.toLocaleDateString('es-ES'));
    
    if (taskDate.getTime() === today.getTime()) {
      console.log('📅 [DEBUG taskList] Result: Hoy');
      return "Hoy";
    }
    if (taskDate.getTime() === tomorrow.getTime()) {
      console.log('📅 [DEBUG taskList] Result: Mañana');
      return "Mañana";
    }
    
    const result = format(dateObj, 'EEEE, d MMMM', { locale: es });
    console.log('📅 [DEBUG taskList] Regular format result:', result);
    return result;
  },

  /**
   * Formato para fecha de Google Calendar
   */
  googleCalendar: (dateString: string): string => {
    return dateString.split('T')[0]; // YYYY-MM-DD
  }
};

/**
 * Agrupa tareas por fecha
 */
export const groupTasksByDate = <T extends { date: string }>(tasks: T[]) => {
  return tasks.reduce((groups, task) => {
    // Asegurar formato correcto de fecha para agrupación
    const cleanDate = task.date.split('T')[0]; // Solo YYYY-MM-DD
    console.log('📅 [DEBUG groupTasksByDate] Task date:', task.date, '-> Clean date:', cleanDate);
    
    if (!groups[cleanDate]) {
      groups[cleanDate] = [];
    }
    groups[cleanDate].push(task);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Valida si una fecha es válida
 */
export const isValidDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};
