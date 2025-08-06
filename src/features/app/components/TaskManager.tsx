import { useState, useEffect } from "react";
import { TaskForm, TaskList, TaskSlider, useTasks, TaskData } from "@/features/tasks";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/hooks";
import { DatabaseErrorMessage } from "@/shared/components";
import { Moon, Sun, Plus, Calendar, Grid, LayoutGrid, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import heroImage from "@/assets/task-hero.png";
import taskifyIcon from "@/assets/icon.png";

export function TaskManager() {
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('grid');
  const [scrollY, setScrollY] = useState(0);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showDbError, setShowDbError] = useState(false); // Estado para mostrar/ocultar error de DB
  const { toast } = useToast();
  
  // Usar el hook de tareas refactorizado
  const { 
    tasks, 
    loading, 
    error, 
    isDbError, // Nuevo estado del hook
    createTask, 
    deleteTask, 
    toggleTaskComplete,
    refreshTasks,
    initializeGoogleAPI,
    isGoogleLoaded 
  } = useTasks();

  // Mostrar error de DB cuando sea detectado
  useEffect(() => {
    if (isDbError && !showDbError) {
      setShowDbError(true);
    }
  }, [isDbError, showDbError]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Create new task
  const handleTaskCreate = async (newTask: TaskData) => {
    const success = await createTask(newTask);
    if (success) {
      setShowForm(false);
    }
  };

  // Complete task
  const handleTaskComplete = async (id: string) => {
    await toggleTaskComplete(id);
  };

  // Delete task
  const handleTaskDelete = async (id: string) => {
    await deleteTask(id);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative overflow-hidden flex flex-col">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 w-full h-[120vh]"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      {/* Animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/50 to-background/55 backdrop-blur-[1px]" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-50/95 via-indigo-50/95 to-purple-50/95 dark:from-slate-800/95 dark:via-slate-900/95 dark:to-slate-800/95 backdrop-blur-lg border-b border-blue-200/50 dark:border-slate-700/50 relative shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <img src={taskifyIcon} alt="Taskify" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Taskify</h1>
                <p className="text-sm text-muted-foreground">Organiza tu día de manera eficiente</p>
              </div>
            </div>

            {/* Stats & Actions */}
            <div className="flex items-center gap-4">
              {tasks.length > 0 && (
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{stats.total}</div>
                    <div className="text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">{stats.pending}</div>
                    <div className="text-muted-foreground">Pendientes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-accent">{stats.completed}</div>
                    <div className="text-muted-foreground">Completadas</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {tasks.length > 0 && (
                  <div className="flex items-center gap-1 mr-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="w-10 h-10 p-0"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'slider' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('slider')}
                      className="w-10 h-10 p-0"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshTasks}
                  className="w-10 h-10 p-0"
                  disabled={loading}
                  title="Actualizar tareas"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={initializeGoogleAPI}
                  className="w-10 h-10 p-0"
                  title={isGoogleLoaded ? "Google Calendar conectado" : "Conectar Google Calendar"}
                >
                  <Calendar className={`w-5 h-5 ${isGoogleLoaded ? 'text-green-500' : 'text-muted-foreground'}`} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="w-10 h-10 p-0"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2 animate-scale-in"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nueva Tarea</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-6 py-8 relative z-10">
        <div className="space-y-8">
          {/* Task Form */}
          {showForm && (
            <div className="animate-slide-up">
              <TaskForm onTaskCreate={handleTaskCreate} />
            </div>
          )}

          {/* Error Message */}
          {error && !isDbError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && tasks.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
                <RefreshCw className="w-12 h-12 text-muted-foreground animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Cargando tareas...</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Conectando con la base de datos.
              </p>
            </div>
          )}

          {/* Task Display - Pending Tasks First, then Collapsible Completed */}
          {!loading && (
            <div className="space-y-6">
              {/* Pending Tasks Section */}
              {tasks.filter(t => !t.completed).length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-foreground">Tareas Pendientes</h2>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm font-medium">
                      {tasks.filter(t => !t.completed).length}
                    </span>
                  </div>
                  {viewMode === 'grid' ? (
                    <TaskList
                      tasks={tasks.filter(t => !t.completed).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                      onTaskComplete={handleTaskComplete}
                      onTaskDelete={handleTaskDelete}
                    />
                  ) : (
                    <TaskSlider
                      tasks={tasks.filter(t => !t.completed).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                      onTaskComplete={handleTaskComplete}
                      onTaskDelete={handleTaskDelete}
                    />
                  )}
                </div>
              ) : (
                /* Empty State - No Pending Tasks */
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">No hay tareas pendientes</h3>
                    <p className="text-muted-foreground">Crea tu primera tarea para comenzar</p>
                  </div>
                </div>
              )}

              {/* Collapsible Completed Tasks Section */}
              {tasks.filter(t => t.completed).length > 0 && (
                <div className="border-t border-border pt-6">
                  <div className="space-y-4">
                    {/* Collapsible Header */}
                    <button
                      onClick={() => setShowCompleted(!showCompleted)}
                      className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-foreground">Tareas Completadas</h2>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full text-sm font-medium">
                          {tasks.filter(t => t.completed).length}
                        </span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        {showCompleted ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {/* Collapsible Content */}
                    {showCompleted && (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        {viewMode === 'grid' ? (
                          <TaskList
                            tasks={tasks.filter(t => t.completed).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
                            onTaskComplete={handleTaskComplete}
                            onTaskDelete={handleTaskDelete}
                            showCompletedFormat={true}
                          />
                        ) : (
                          <TaskSlider
                            tasks={tasks.filter(t => t.completed).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
                            onTaskComplete={handleTaskComplete}
                            onTaskDelete={handleTaskDelete}
                            showCompletedFormat={true}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Database Error Modal */}
      <DatabaseErrorMessage
        isVisible={showDbError}
        onClose={() => setShowDbError(false)}
        error={error || undefined}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-t border-blue-200/50 dark:border-slate-700/50 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <img src={taskifyIcon} alt="Taskify" className="w-6 h-6" />
              <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Taskify</span>
            </div>
            <p className="text-slate-600 max-w-md mx-auto">
              Organiza tu día de manera eficiente y mantén tus tareas bajo control.
            </p>
            <div className="text-base text-slate-600 dark:text-slate-400">
              <span>© 2025 Taskify</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
