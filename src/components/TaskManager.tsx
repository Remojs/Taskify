import { useState, useEffect } from "react";
import { TaskForm, TaskData } from "./TaskForm";
import { TaskList } from "./TaskList";
import { TaskSlider } from "./TaskSlider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Plus, CheckSquare, Calendar, Grid, LayoutGrid, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTasks } from "@/hooks/use-tasks";
import heroImage from "@/assets/task-hero.jpg";

export function TaskManager() {
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('grid');
  const [scrollY, setScrollY] = useState(0);
  const { toast } = useToast();
  
  // Usar el hook de Supabase
  const { 
    tasks, 
    loading, 
    error, 
    createTask, 
    deleteTask, 
    toggleTaskComplete,
    refreshTasks 
  } = useTasks();

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
      
      // Simulate Google Calendar integration
      if (newTask.addToGoogleCalendar) {
        setTimeout(() => {
          toast({
            title: "📅 Google Calendar",
            description: "La tarea ha sido sincronizada con tu calendario.",
          });
        }, 1500);
      }
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
    <div className="min-h-screen bg-background transition-colors duration-300 relative overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/85 to-background/80 backdrop-blur-[2px]" />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border relative">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg">
                <CheckSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
                <p className="text-sm text-muted-foreground">Gestión elegante de tareas</p>
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
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="space-y-8">
          {/* Task Form */}
          {showForm && (
            <div className="animate-slide-up">
              <TaskForm onTaskCreate={handleTaskCreate} />
            </div>
          )}

          {/* Error Message */}
          {error && (
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

          {/* Task Display */}
          {!loading && (
            viewMode === 'grid' ? (
              <TaskList
                tasks={tasks}
                onTaskComplete={handleTaskComplete}
                onTaskDelete={handleTaskDelete}
              />
            ) : (
              <TaskSlider
                tasks={tasks}
                onTaskComplete={handleTaskComplete}
                onTaskDelete={handleTaskDelete}
              />
            )
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-border bg-muted/30 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Diseñado con ❤️ para una gestión elegante de tareas
          </p>
        </div>
      </footer>
    </div>
  );
}