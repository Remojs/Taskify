import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CalendarPlus, Hash, Tag, Clock, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TaskFormProps {
  onTaskCreate: (task: TaskData) => void;
}

export interface TaskData {
  id: string;
  title: string;
  category: string;
  color: string;
  date: string;
  addToGoogleCalendar: boolean;
  completed: boolean;
  createdAt: Date;
  // Nuevos campos para Google Calendar
  isAllDay?: boolean;
  startTime?: string;
  endTime?: string;
  calendarDate?: string; // Fecha específica para el calendario (puede ser diferente a 'date')
}

const categories = [
  "Trabajo",
  "Personal", 
  "Estudio",
  "Hogar",
  "Salud",
  "Viajes"
];

const taskColors = [
  { name: "Teal", value: "#00A19D" },
  { name: "Azul", value: "#4A90E2" },
  { name: "Verde", value: "#7ED321" },
  { name: "Naranja", value: "#F5A623" },
  { name: "Rosa", value: "#F8B6D3" },
  { name: "Púrpura", value: "#9013FE" },
];

export function TaskForm({ onTaskCreate }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState(taskColors[0].value);
  const [date, setDate] = useState("");
  const [addToGoogleCalendar, setAddToGoogleCalendar] = useState(false);
  
  // Nuevos estados para configuración de Google Calendar
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [calendarDate, setCalendarDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !category || !date) return;

    const newTask: TaskData = {
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      color: selectedColor,
      date,
      addToGoogleCalendar,
      completed: false,
      createdAt: new Date(),
      // Nuevos campos para Google Calendar
      isAllDay: addToGoogleCalendar ? isAllDay : undefined,
      startTime: addToGoogleCalendar && !isAllDay ? startTime : undefined,
      endTime: addToGoogleCalendar && !isAllDay ? endTime : undefined,
      calendarDate: addToGoogleCalendar ? (calendarDate || date) : undefined,
    };

    onTaskCreate(newTask);
    
    // Reset form
    setTitle("");
    setCategory("");
    setSelectedColor(taskColors[0].value);
    setDate("");
    setAddToGoogleCalendar(false);
    setIsAllDay(true);
    setStartTime("09:00");
    setEndTime("10:00");
    setCalendarDate("");
  };

  return (
    <Card className="p-8 animate-scale-in shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Nueva Tarea</h2>
          <p className="text-muted-foreground text-sm">Organiza tu día de manera eficiente</p>
        </div>

        {/* Task Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Nombre de la tarea
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Ej: Revisar correos importantes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/80 border-border focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Categoría
          </Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger className="bg-background/80 border-border focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="focus:bg-primary/10">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Color de la tarea</Label>
          <div className="flex gap-3 flex-wrap">
            {taskColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  selectedColor === color.value 
                    ? 'border-foreground shadow-lg' 
                    : 'border-border hover:border-muted-foreground'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha programada
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="bg-background/80 border-border focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {/* Google Calendar Section */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="google-calendar"
              checked={addToGoogleCalendar}
              onCheckedChange={(checked) => setAddToGoogleCalendar(checked as boolean)}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="google-calendar" className="text-sm text-foreground flex items-center gap-2 cursor-pointer">
              <CalendarPlus className="w-4 h-4" />
              Agregar a Google Calendar
            </Label>
          </div>
          
          {/* Configuraciones adicionales para Google Calendar */}
          {addToGoogleCalendar && (
            <div className="space-y-4 pl-6 border-l-2 border-primary/20">
              {/* Fecha del calendario */}
              <div className="space-y-2">
                <Label htmlFor="calendar-date" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Fecha en calendario (opcional)
                </Label>
                <Input
                  id="calendar-date"
                  type="date"
                  value={calendarDate}
                  onChange={(e) => setCalendarDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-background/80 border-border focus:ring-2 focus:ring-primary/20"
                  placeholder="Si no se selecciona, usa la fecha de la tarea"
                />
                <p className="text-xs text-muted-foreground">
                  Si no se especifica, se usará la fecha de la tarea
                </p>
              </div>

              {/* Todo el día vs horario específico */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="all-day"
                    checked={isAllDay}
                    onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="all-day" className="text-sm text-foreground flex items-center gap-2 cursor-pointer">
                    <Calendar className="w-4 h-4" />
                    Todo el día
                  </Label>
                </div>

                {/* Horarios específicos */}
                {!isAllDay && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="start-time" className="text-xs font-medium text-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Hora inicio
                      </Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-background/80 border-border focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time" className="text-xs font-medium text-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Hora fin
                      </Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="bg-background/80 border-border focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-3 transition-all duration-200 shadow-md hover:shadow-lg"
          disabled={!title.trim() || !category || !date}
        >
          Crear Tarea
        </Button>
      </form>
    </Card>
  );
}