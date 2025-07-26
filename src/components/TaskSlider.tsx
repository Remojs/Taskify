import { TaskData } from "./TaskForm";
import { TaskCard } from "./TaskCard";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Folder } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TaskSliderProps {
  tasks: TaskData[];
  onTaskComplete: (id: string) => void;
  onTaskDelete: (id: string) => void;
}

export function TaskSlider({ tasks, onTaskComplete, onTaskDelete }: TaskSliderProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
          <Calendar className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No hay tareas aún</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Comienza creando tu primera tarea para organizar tu día de manera elegante.
        </p>
      </div>
    );
  }

  // Group tasks by date
  const tasksByDate = tasks.reduce((groups, task) => {
    const dateKey = format(new Date(task.date), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(task);
    return groups;
  }, {} as Record<string, TaskData[]>);

  const dateGroups = Object.entries(tasksByDate).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-8">
      {dateGroups.map(([dateKey, dateTasks], groupIndex) => (
        <div key={dateKey} className="animate-slide-up" style={{ animationDelay: `${groupIndex * 100}ms` }}>
          {/* Date Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {format(new Date(dateKey), 'EEEE, d MMMM', { locale: es })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dateTasks.length} {dateTasks.length === 1 ? 'tarea' : 'tareas'}
              </p>
            </div>
          </div>

          {/* Tasks Carousel */}
          <Carousel className="w-full" opts={{ align: "start", loop: false }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Desliza para ver más</span>
              </div>
              <div className="flex gap-2">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </div>
            
            <CarouselContent className="-ml-2 md:-ml-4">
              {dateTasks.map((task, index) => (
                <CarouselItem key={task.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div 
                    className="animate-scale-in hover:animate-pulse"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TaskCard
                      task={task}
                      onComplete={() => onTaskComplete(task.id)}
                      onDelete={() => onTaskDelete(task.id)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Quick Stats */}
          <div className="mt-4 flex gap-2">
            <Badge variant="secondary" className="animate-fade-in">
              {dateTasks.filter(t => t.completed).length} completadas
            </Badge>
            <Badge variant="outline" className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              {dateTasks.filter(t => !t.completed).length} pendientes
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}