import { TaskData } from '../types';

// Configuración de Google Calendar API
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

// Mapeo de colores de la app a Google Calendar
const COLOR_MAP: { [key: string]: string } = {
  '#00A19D': '10', // Teal -> Verde azulado
  '#4A90E2': '1',  // Azul -> Azul lavanda
  '#7ED321': '11', // Verde -> Verde
  '#F5A623': '6',  // Naranja -> Naranja
  '#F8B6D3': '4',  // Rosa -> Rosa flamingo
  '#9013FE': '3',  // Púrpura -> Púrpura grape
};

// Color para tareas completadas
const COMPLETED_COLOR = '8'; // Gris

export interface GoogleCalendarHook {
  isGoogleLoaded: boolean;
  isSignedIn: boolean;
  loading: boolean;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
  addTaskToCalendar: (task: TaskData) => Promise<string | null>;
  updateTaskInCalendar: (taskId: string, completed: boolean, originalColor: string) => Promise<boolean>;
  initializeGoogleAPI: () => Promise<boolean>;
}

export const googleCalendarService = {
  /**
   * Cargar scripts de Google API
   */
  loadGoogleScripts: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Si ya están cargados, resolver inmediatamente
      if ((window as any).google && (window as any).gapi) {
        resolve();
        return;
      }

      // Cargar Google Identity Services (GSI)
      const gsiScript = document.createElement('script');
      gsiScript.src = 'https://accounts.google.com/gsi/client';
      gsiScript.onload = () => {
        // Cargar Google API (GAPI)
        const gapiScript = document.createElement('script');
        gapiScript.src = 'https://apis.google.com/js/api.js';
        gapiScript.onload = () => resolve();
        gapiScript.onerror = () => reject(new Error('Failed to load GAPI'));
        document.head.appendChild(gapiScript);
      };
      gsiScript.onerror = () => reject(new Error('Failed to load GSI'));
      document.head.appendChild(gsiScript);
    });
  },

  /**
   * Inicializar Google API
   */
  initializeGoogleAPI: async (): Promise<boolean> => {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
      console.error('❌ Google API credentials not configured');
      return false;
    }

    try {
      await googleCalendarService.loadGoogleScripts();
      
      // Inicializar GAPI para Calendar API
      await new Promise<void>((resolve) => {
        (window as any).gapi.load('client', resolve);
      });

      await (window as any).gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: [DISCOVERY_DOC]
      });

      return true;
    } catch (error) {
      console.error('❌ Error initializing Google API:', error);
      return false;
    }
  },

  /**
   * Crear evento en Google Calendar
   */
  createCalendarEvent: async (task: TaskData): Promise<string | null> => {
    try {
      // Usar la fecha del calendario si está especificada, sino usar la fecha de la tarea
      const eventDate = task.googleCalendarConfig?.calendarDate || task.date;
      const selectedDate = new Date(eventDate);
      
      // Validar que la fecha sea válida
      if (isNaN(selectedDate.getTime())) {
        throw new Error('Fecha inválida');
      }

      // Configurar el evento base
      const event: any = {
        summary: task.title,
        description: `Categoría: ${task.category}\nTarea: ${task.title}`,
        colorId: COLOR_MAP[task.color] || '1' // Color por defecto azul si no se encuentra
      };

      // Configurar horarios según si es todo el día o no
      const isAllDay = task.googleCalendarConfig?.isAllDay ?? true;
      
      if (isAllDay) {
        // Evento de todo el día
        event.start = {
          date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        event.end = {
          date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      } else {
        // Evento con horario específico
        const startTime = task.googleCalendarConfig?.startTime || '09:00';
        const endTime = task.googleCalendarConfig?.endTime || '10:00';
        
        // Crear fechas con horarios específicos
        const startDateTime = new Date(selectedDate);
        const [startHour, startMinute] = startTime.split(':').map(Number);
        startDateTime.setHours(startHour, startMinute, 0, 0);
        
        const endDateTime = new Date(selectedDate);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        endDateTime.setHours(endHour, endMinute, 0, 0);
        
        // Si la hora de fin es menor que la de inicio, asumimos que es al día siguiente
        if (endDateTime <= startDateTime) {
          endDateTime.setDate(endDateTime.getDate() + 1);
        }
        
        event.start = {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        event.end = {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      }

      console.log('📅 Creating calendar event:', event);

      const response = await (window as any).gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      console.log('✅ Event created:', response);
      return response.result.id;
      
    } catch (error) {
      console.error('❌ Error creating calendar event:', error);
      return null;
    }
  },

  /**
   * Actualizar color de evento en Google Calendar
   */
  updateCalendarEventColor: async (taskId: string, completed: boolean, originalColor: string): Promise<boolean> => {
    try {
      // Obtener el evento actual
      const getResponse = await (window as any).gapi.client.calendar.events.get({
        calendarId: 'primary',
        eventId: taskId
      });

      if (!getResponse.result) {
        console.log('📅 Event not found in calendar');
        return false;
      }

      // Actualizar el color del evento
      const updatedEvent = {
        ...getResponse.result,
        colorId: completed ? COMPLETED_COLOR : (COLOR_MAP[originalColor] || '1')
      };

      // Actualizar el evento en Google Calendar
      await (window as any).gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: taskId,
        resource: updatedEvent
      });

      console.log('✅ Event color updated in Google Calendar');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating calendar event:', error);
      return false;
    }
  },

  /**
   * Obtener configuración OAuth2
   */
  getOAuthConfig: () => ({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
  }),

  /**
   * Validar credenciales
   */
  hasValidCredentials: (): boolean => {
    return !!(GOOGLE_CLIENT_ID && GOOGLE_API_KEY);
  }
};
