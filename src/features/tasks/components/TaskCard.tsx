import { TaskCardProps } from "../types";
import { Button } from "@/shared/components/ui";
import { Card } from "@/shared/components/ui";
import { Check, Trash2, Tag, Calendar, CalendarCheck } from "lucide-react";
import { cn, dateFormatters } from "@/shared/utils";

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  return (
    <Card className={cn(
      "p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border-0 shadow-md animate-fade-in hover:animate-float",
      "bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm",
      task.completed && "opacity-60 bg-gradient-to-br from-muted/50 to-muted/30"
    )}>
      <div className="space-y-4">
        {/* Header with color indicator */}
        <div className="flex items-start justify-between">
          <div 
            className="w-4 h-4 rounded-full shadow-sm"
            style={{ backgroundColor: task.color }}
          />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onComplete}
              className={cn(
                "p-2 h-8 w-8 hover:bg-primary/10",
                task.completed && "text-primary bg-primary/10"
              )}
              title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="p-2 h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              title="Eliminar tarea"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Task Content */}
        <div className="space-y-3">
          <h3 className={cn(
            "font-medium text-foreground leading-tight",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>

          {/* Category */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="w-4 h-4" />
            <span>{task.category}</span>
          </div>

          {/* Date and Google Calendar indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{dateFormatters.taskCard(task.date)}</span>
            </div>
            
            {task.addToGoogleCalendar && (
              <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                <CalendarCheck className="w-3 h-3" />
                <span>Google</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        {task.completed && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-primary">
              <Check className="w-3 h-3" />
              <span>Completada</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
