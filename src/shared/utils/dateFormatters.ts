import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const dateFormatters = {
  /**
   * Formato para TaskCard - día y mes corto
   */
  taskCard: (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  },

  /**
   * Formato para headers de TaskSlider - con "Hoy" y "Mañana"
   */
  taskHeader: (dateKey: string, showCompletedFormat = false): string => {
    const date = new Date(dateKey);
    
    if (showCompletedFormat) {
      return format(date, 'EEEE, d MMMM yyyy', { locale: es });
    }
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    if (dateKey === todayStr) return "Hoy";
    if (dateKey === tomorrowStr) return "Mañana";
    
    return format(date, 'EEEE, d MMMM', { locale: es });
  },

  /**
   * Formato para TaskList - día de semana y fecha completa
   */
  taskList: (date: string): string => {
    const dateObj = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateStr = date;
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    if (dateStr === todayStr) return "Hoy";
    if (dateStr === tomorrowStr) return "Mañana";
    
    return format(dateObj, 'EEEE, d MMMM', { locale: es });
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
    const dateKey = format(new Date(task.date), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(task);
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
