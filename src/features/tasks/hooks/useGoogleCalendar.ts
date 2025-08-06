import { useState, useCallback } from 'react';
import { useToast } from '@/shared/hooks';
import { googleCalendarService, GoogleCalendarHook } from '../services';
import { TaskData } from '../types';

export const useGoogleCalendar = (): GoogleCalendarHook => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Inicializar Google API
  const initializeGoogleAPI = useCallback(async (): Promise<boolean> => {
    if (!googleCalendarService.hasValidCredentials()) {
      console.error('❌ Google API credentials not configured');
      toast({
        title: "Error",
        description: "Credenciales de Google no configuradas",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    
    try {
      await googleCalendarService.loadGoogleScripts();
      const initialized = await googleCalendarService.initializeGoogleAPI();
      
      if (initialized) {
        setIsGoogleLoaded(true);
        toast({
          title: "📅 Google Calendar",
          description: "API inicializada correctamente",
        });
      }
      
      setLoading(false);
      return initialized;
      
    } catch (error) {
      console.error('❌ Error initializing Google API:', error);
      setLoading(false);
      toast({
        title: "Error Google Calendar",
        description: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Iniciar sesión usando Google Identity Services
  const signIn = useCallback(async (): Promise<boolean> => {
    if (!(window as any).tokenClient) {
      console.log('🔄 Initializing Google API first...');
      const initialized = await initializeGoogleAPI();
      if (!initialized) return false;
    }

    return new Promise((resolve) => {
      const config = googleCalendarService.getOAuthConfig();
      
      // Configurar el cliente OAuth2 con Google Identity Services
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        ...config,
        callback: (response: any) => {
          if (response.error !== undefined) {
            console.error('❌ OAuth error:', response.error);
            setIsSignedIn(false);
            setAccessToken(null);
            resolve(false);
            return;
          }
          
          console.log('✅ User signed in successfully');
          setAccessToken(response.access_token);
          setIsSignedIn(true);
          
          // Configurar el token en GAPI client
          (window as any).gapi.client.setToken({
            access_token: response.access_token
          });

          toast({
            title: "📅 Autenticación exitosa",
            description: "Ya puedes sincronizar tareas con Google Calendar",
          });
          
          resolve(true);
        }
      });

      // Solicitar el token
      tokenClient.requestAccessToken();
    });
  }, [initializeGoogleAPI, toast]);

  // Cerrar sesión
  const signOut = useCallback(async (): Promise<void> => {
    if (accessToken) {
      // Revocar el token
      (window as any).google.accounts.oauth2.revoke(accessToken, () => {
        console.log('✅ Token revoked');
      });
    }

    // Limpiar estado local
    setIsSignedIn(false);
    setAccessToken(null);
    
    // Limpiar token de GAPI
    if ((window as any).gapi?.client?.setToken) {
      (window as any).gapi.client.setToken(null);
    }

    toast({
      title: "📅 Sesión cerrada",
      description: "Desconectado de Google Calendar",
    });
  }, [accessToken, toast]);

  // Agregar tarea a Google Calendar
  const addTaskToCalendar = useCallback(async (task: TaskData): Promise<string | null> => {
    if (!isSignedIn || !accessToken) {
      console.log('🔄 User not signed in, attempting to sign in...');
      const signedIn = await signIn();
      if (!signedIn) {
        toast({
          title: "❌ Error de autenticación",
          description: "No se pudo conectar con Google Calendar",
          variant: "destructive"
        });
        return null;
      }
    }

    try {
      const eventId = await googleCalendarService.createCalendarEvent(task);
      
      if (eventId) {
        const eventTypeText = task.googleCalendarConfig?.isAllDay ? 'evento de todo el día' : 
          `evento de ${task.googleCalendarConfig?.startTime} a ${task.googleCalendarConfig?.endTime}`;
        
        toast({
          title: "📅 Evento creado",
          description: `Tarea "${task.title}" agregada como ${eventTypeText}`,
        });
      }

      return eventId;
      
    } catch (error) {
      console.error('❌ Error creating calendar event:', error);
      toast({
        title: "❌ Error",
        description: "No se pudo crear el evento en Google Calendar",
        variant: "destructive"
      });
      return null;
    }
  }, [isSignedIn, accessToken, signIn, toast]);

  // Actualizar color de tarea en Google Calendar cuando se marca como completada
  const updateTaskInCalendar = useCallback(async (taskId: string, completed: boolean, originalColor: string): Promise<boolean> => {
    if (!isSignedIn || !accessToken) {
      console.log('🔄 User not signed in for update');
      return false;
    }

    try {
      const success = await googleCalendarService.updateCalendarEventColor(taskId, completed, originalColor);
      
      if (success) {
        toast({
          title: "📅 Calendario actualizado",
          description: completed ? "Tarea marcada como completada en el calendario" : "Tarea restaurada en el calendario",
        });
      }

      return success;
      
    } catch (error) {
      console.error('❌ Error updating calendar event:', error);
      return false;
    }
  }, [isSignedIn, accessToken, toast]);

  return {
    isGoogleLoaded,
    isSignedIn,
    loading,
    signIn,
    signOut,
    addTaskToCalendar,
    updateTaskInCalendar,
    initializeGoogleAPI
  };
};
