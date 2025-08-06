import { TaskSliderProps } from "../types";
import { TaskCard } from "./TaskCard";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/shared/components/ui";
import { Card, CardContent } from "@/shared/components/ui";
import { Badge } from "@/shared/components/ui";
import { Calendar, Folder } from "lucide-react";
import { dateFormatters, groupTasksByDate } from "@/shared/utils";

export function TaskSlider({ tasks, onTaskComplete, onTaskDelete, showCompletedFormat = false }: TaskSliderProps) {
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
  const tasksByDate = groupTasksByDate(tasks);
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
                {dateFormatters.taskHeader(dateKey, showCompletedFormat)}
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
            
            <CarouselContent className="-ml-4">
              {dateTasks
                .sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1)
                .map((task, index) => (
                  <CarouselItem key={task.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full">
                      <CardContent className="p-0">
                        <TaskCard
                          task={task}
                          onComplete={() => onTaskComplete(task.id)}
                          onDelete={() => onTaskDelete(task.id)}
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>

          {/* Stats badges */}
          <div className="flex gap-3 mt-6">
            <Badge variant="secondary" className="animate-fade-in">
              {dateTasks.length} total
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
