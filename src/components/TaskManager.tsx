import { useState, useEffect } from "react";
import { TaskForm, TaskData } from "./TaskForm";
import { TaskList } from "./TaskList";
import { TaskSlider } from "./TaskSlider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Plus, CheckSquare, Calendar, Grid, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/task-hero.jpg";

export function TaskManager() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('grid');
  const [scrollY, setScrollY] = useState(0);
  const { toast } = useToast();

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
  const handleTaskCreate = (newTask: TaskData) => {
    setTasks(prev => [...prev, newTask]);
    setShowForm(false);
    
    toast({
      title: "✅ Tarea creada",
      description: `"${newTask.title}" ha sido agregada exitosamente.`,
    });

    // Simulate Google Calendar integration
    if (newTask.addToGoogleCalendar) {
      setTimeout(() => {
        toast({
          title: "📅 Google Calendar",
          description: "La tarea ha sido sincronizada con tu calendario.",
        });
      }, 1500);
    }
  };

  // Complete task
  const handleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast({
        title: task.completed ? "📝 Tarea restaurada" : "✅ Tarea completada",
        description: `"${task.title}" ${task.completed ? 'marcada como pendiente' : 'completada'}.`,
      });
    }
  };

  // Delete task
  const handleTaskDelete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    if (task) {
      toast({
        title: "🗑️ Tarea eliminada",
        description: `"${task.title}" ha sido eliminada.`,
        variant: "destructive"
      });
    }
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

          {/* Task Display */}
          {viewMode === 'grid' ? (
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