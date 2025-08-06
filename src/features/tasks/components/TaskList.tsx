import { TaskListProps } from "../types";
import { TaskCard } from "./TaskCard";
import { Calendar, ListTodo } from "lucide-react";
import { Card } from "@/shared/components/ui";
import { dateFormatters, groupTasksByDate } from "@/shared/utils";

export function TaskList({ tasks, onTaskComplete, onTaskDelete, showCompletedFormat = false }: TaskListProps) {
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
  const groupedTasks = groupTasksByDate(tasks);

  return (
    <div className="space-y-8">
      {Object.entries(groupedTasks)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, dateTasks], index) => (
          <div key={date} className="space-y-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            {/* Date Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground capitalize">
                  {dateFormatters.taskList(date)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dateTasks.length} {dateTasks.length === 1 ? 'tarea' : 'tareas'}
                </p>
              </div>
            </div>

            {/* Tasks for this date */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dateTasks
                .sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1)
                .map((task, taskIndex) => (
                  <div 
                    key={task.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${(index * 100) + (taskIndex * 50)}ms` }}
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
    </div>
  );
}
