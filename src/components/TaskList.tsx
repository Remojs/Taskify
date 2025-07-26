import { TaskData } from "./TaskForm";
import { TaskCard } from "./TaskCard";
import { Calendar, Package, ListTodo } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TaskListProps {
  tasks: TaskData[];
  onTaskComplete: (id: string) => void;
  onTaskDelete: (id: string) => void;
}

export function TaskList({ tasks, onTaskComplete, onTaskDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card className="p-12 text-center animate-fade-in bg-card/50 backdrop-blur-sm border-0 shadow-lg">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
            <ListTodo className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">No hay tareas</h3>
            <p className="text-muted-foreground">Crea tu primera tarea para comenzar a organizar tu día</p>
          </div>
        </div>
      </Card>
    );
  }

  // Group tasks by date
  const groupedTasks = tasks.reduce((groups, task) => {
    const date = task.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, TaskData[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedTasks).sort();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time parts for comparison
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    if (dateString === todayStr) return "Hoy";
    if (dateString === tomorrowStr) return "Mañana";
    
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {sortedDates.map((date, dateIndex) => (
        <div key={date} className="space-y-4" style={{ animationDelay: `${dateIndex * 100}ms` }}>
          {/* Date Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground capitalize">
                {formatDate(date)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {groupedTasks[date].length} {groupedTasks[date].length === 1 ? 'tarea' : 'tareas'}
              </p>
            </div>
          </div>

          {/* Tasks for this date */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupedTasks[date]
              .sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1)
              .map((task, taskIndex) => (
                <div 
                  key={task.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${(dateIndex * 100) + (taskIndex * 50)}ms` }}
                >
                  <TaskCard
                    task={task}
                    onComplete={() => onTaskComplete(task.id)}
                    onDelete={() => onTaskDelete(task.id)}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
      
      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            <div>
              <h4 className="font-semibold text-foreground">Resumen</h4>
              <p className="text-sm text-muted-foreground">
                {tasks.filter(t => !t.completed).length} pendientes, {tasks.filter(t => t.completed).length} completadas
              </p>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">
            {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) || 0}%
          </div>
        </div>
      </Card>
    </div>
  );
}