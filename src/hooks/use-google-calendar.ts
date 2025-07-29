import { useState, useCallback } from 'react'
import { TaskData } from '@/components/TaskForm'
import { useToast } from './use-toast'

// Configuración de Google Calendar API
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
const SCOPES = 'https://www.googleapis.com/auth/calendar.events'

// Mapeo de colores de la app a Google Calendar
const COLOR_MAP: { [key: string]: string } = {
  '#00A19D': '10', // Teal -> Verde azulado
  '#4A90E2': '1',  // Azul -> Azul lavanda
  '#7ED321': '11', // Verde -> Verde
  '#F5A623': '6',  // Naranja -> Naranja
  '#F8B6D3': '4',  // Rosa -> Rosa flamingo
  '#9013FE': '3',  // Púrpura -> Púrpura grape
}

interface GoogleCalendarHook {
  isGoogleLoaded: boolean
  isSignedIn: boolean
  loading: boolean
  signIn: () => Promise<boolean>
  signOut: () => Promise<void>
  addTaskToCalendar: (task: TaskData) => Promise<string | null>
  initializeGoogleAPI: () => Promise<boolean>
}

export function useGoogleCalendar(): GoogleCalendarHook {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const { toast } = useToast()

  // Cargar scripts de Google
  const loadGoogleScripts = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Si ya están cargados, resolver inmediatamente
      if ((window as any).google && (window as any).gapi) {
        resolve()
        return
      }

      // Cargar Google Identity Services (GSI)
      const gsiScript = document.createElement('script')
      gsiScript.src = 'https://accounts.google.com/gsi/client'
      gsiScript.onload = () => {
        // Cargar Google API (GAPI)
        const gapiScript = document.createElement('script')
        gapiScript.src = 'https://apis.google.com/js/api.js'
        gapiScript.onload = () => resolve()
        gapiScript.onerror = () => reject(new Error('Failed to load GAPI'))
        document.head.appendChild(gapiScript)
      }
      gsiScript.onerror = () => reject(new Error('Failed to load GSI'))
      document.head.appendChild(gsiScript)
    })
  }, [])

  // Inicializar Google API usando la nueva arquitectura
  const initializeGoogleAPI = useCallback(async (): Promise<boolean> => {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
      console.error('❌ Google API credentials not configured')
      toast({
        title: "Error",
        description: "Credenciales de Google no configuradas",
        variant: "destructive"
      })
      return false
    }

    setLoading(true)
    
    try {
      // Cargar scripts
      await loadGoogleScripts()
      
      // Inicializar GAPI para Calendar API
      await new Promise<void>((resolve) => {
        ;(window as any).gapi.load('client', resolve)
      })

      await (window as any).gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: [DISCOVERY_DOC]
      })

      // Configurar el cliente OAuth2 con Google Identity Services
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error !== undefined) {
            console.error('❌ OAuth error:', response.error)
            setIsSignedIn(false)
            setAccessToken(null)
            return
          }
          
          console.log('✅ Access token received')
          setAccessToken(response.access_token)
          setIsSignedIn(true)
          
          // Configurar el token en GAPI client
          ;(window as any).gapi.client.setToken({
            access_token: response.access_token
          })

          toast({
            title: "📅 Google Calendar",
            description: "Conectado exitosamente",
          })
        }
      })

      // Guardar referencia al tokenClient
      ;(window as any).tokenClient = tokenClient

      setIsGoogleLoaded(true)
      setLoading(false)
      
      console.log('✅ Google Calendar API initialized (new GSI)')
      
      toast({
        title: "📅 Google Calendar",
        description: "API inicializada correctamente",
      })

      return true
      
    } catch (error) {
      console.error('❌ Error initializing Google API:', error)
      setLoading(false)
      toast({
        title: "Error Google Calendar",
        description: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive"
      })
      return false
    }
  }, [toast, loadGoogleScripts])

  // Iniciar sesión usando Google Identity Services
  const signIn = useCallback(async (): Promise<boolean> => {
    if (!(window as any).tokenClient) {
      console.log('🔄 Initializing Google API first...')
      const initialized = await initializeGoogleAPI()
      if (!initialized) return false
    }

    return new Promise((resolve) => {
      // Configurar callback específico para este sign-in
      ;(window as any).tokenClient.callback = (response: any) => {
        if (response.error !== undefined) {
          console.error('❌ OAuth error:', response.error)
          setIsSignedIn(false)
          setAccessToken(null)
          resolve(false)
          return
        }
        
        console.log('✅ User signed in successfully')
        setAccessToken(response.access_token)
        setIsSignedIn(true)
        
        // Configurar el token en GAPI client
        ;(window as any).gapi.client.setToken({
          access_token: response.access_token
        })

        toast({
          title: "📅 Autenticación exitosa",
          description: "Ya puedes sincronizar tareas con Google Calendar",
        })
        
        resolve(true)
      }

      // Solicitar el token
      ;(window as any).tokenClient.requestAccessToken()
    })
  }, [initializeGoogleAPI, toast])

  // Cerrar sesión
  const signOut = useCallback(async (): Promise<void> => {
    if (accessToken) {
      // Revocar el token
      ;(window as any).google.accounts.oauth2.revoke(accessToken, () => {
        console.log('✅ Token revoked')
      })
    }

    // Limpiar estado local
    setIsSignedIn(false)
    setAccessToken(null)
    
    // Limpiar token de GAPI
    if ((window as any).gapi?.client?.setToken) {
      ;(window as any).gapi.client.setToken(null)
    }

    toast({
      title: "📅 Sesión cerrada",
      description: "Desconectado de Google Calendar",
    })
  }, [accessToken, toast])

  // Agregar tarea a Google Calendar
  const addTaskToCalendar = useCallback(async (task: TaskData): Promise<string | null> => {
    if (!isSignedIn || !accessToken) {
      console.log('🔄 User not signed in, attempting to sign in...')
      const signedIn = await signIn()
      if (!signedIn) {
        toast({
          title: "❌ Error de autenticación",
          description: "No se pudo conectar con Google Calendar",
          variant: "destructive"
        })
        return null
      }
    }

    try {
      // Usar la fecha del calendario si está especificada, sino usar la fecha de la tarea
      const eventDate = task.calendarDate || task.date
      const selectedDate = new Date(eventDate)
      
      // Validar que la fecha sea válida
      if (isNaN(selectedDate.getTime())) {
        throw new Error('Fecha inválida')
      }

      // Configurar el evento base
      const event: any = {
        summary: task.title,
        description: `Categoría: ${task.category}\nTarea: ${task.title}`,
        colorId: COLOR_MAP[task.color] || '1' // Color por defecto azul si no se encuentra
      }

      // Configurar horarios según si es todo el día o no
      if (task.isAllDay) {
        // Evento de todo el día
        event.start = {
          date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
        event.end = {
          date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      } else {
        // Evento con horario específico
        const startTime = task.startTime || '09:00'
        const endTime = task.endTime || '10:00'
        
        // Crear fechas con horarios específicos
        const startDateTime = new Date(selectedDate)
        const [startHour, startMinute] = startTime.split(':').map(Number)
        startDateTime.setHours(startHour, startMinute, 0, 0)
        
        const endDateTime = new Date(selectedDate)
        const [endHour, endMinute] = endTime.split(':').map(Number)
        endDateTime.setHours(endHour, endMinute, 0, 0)
        
        // Si la hora de fin es menor que la de inicio, asumimos que es al día siguiente
        if (endDateTime <= startDateTime) {
          endDateTime.setDate(endDateTime.getDate() + 1)
        }
        
        event.start = {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
        event.end = {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      }

      console.log('📅 Creating calendar event:', event)

      const response = await (window as any).gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      })

      console.log('✅ Event created:', response)

      const eventTypeText = task.isAllDay ? 'evento de todo el día' : `evento de ${task.startTime} a ${task.endTime}`
      toast({
        title: "📅 Evento creado",
        description: `Tarea "${task.title}" agregada como ${eventTypeText}`,
      })

      return response.result.id
      
    } catch (error) {
      console.error('❌ Error creating calendar event:', error)
      toast({
        title: "❌ Error",
        description: "No se pudo crear el evento en Google Calendar",
        variant: "destructive"
      })
      return null
    }
  }, [isSignedIn, accessToken, signIn, toast])

  return {
    isGoogleLoaded,
    isSignedIn,
    loading,
    signIn,
    signOut,
    addTaskToCalendar,
    initializeGoogleAPI
  }
}
