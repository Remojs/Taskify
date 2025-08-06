export interface TaskData {
  id: string;
  title: string;
  category: string;
  color: string;
  date: string;
  addToGoogleCalendar: boolean;
  completed: boolean;
  createdAt: Date;
  googleCalendarConfig?: GoogleCalendarConfig;
}

export interface GoogleCalendarConfig {
  isAllDay: boolean;
  startTime?: string;
  endTime?: string;
  calendarDate?: string;
}

export interface TaskFormProps {
  onTaskCreate: (task: TaskData) => void;
}

export interface TaskCardProps {
  task: TaskData;
  onComplete: () => void;
  onDelete: () => void;
}

export interface TaskListProps {
  tasks: TaskData[];
  onTaskComplete: (id: string) => void;
  onTaskDelete: (id: string) => void;
  showCompletedFormat?: boolean;
}

export interface TaskSliderProps {
  tasks: TaskData[];
  onTaskComplete: (id: string) => void;
  onTaskDelete: (id: string) => void;
  showCompletedFormat?: boolean;
}

export const categories = [
  "Trabajo",
  "Personal", 
  "Estudio",
  "Hogar",
  "Salud",
  "Viajes"
] as const;

export type TaskCategory = typeof categories[number];

export const taskColors = [
  { name: "Teal", value: "#00A19D" },
  { name: "Azul", value: "#4A90E2" },
  { name: "Verde", value: "#7ED321" },
  { name: "Naranja", value: "#F5A623" },
  { name: "Rosa", value: "#F8B6D3" },
  { name: "Púrpura", value: "#9013FE" },
] as const;

export type TaskColor = typeof taskColors[number];
