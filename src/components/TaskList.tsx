import { useState } from "react";
import { format, isToday, isPast, parseISO } from "date-fns";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar,
  Clock,
  Flag,
  GripVertical,
  AlertCircle,
  List
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskDetailDialog, TaskDetails } from "@/components/TaskDetailDialog";
import { CalendarView } from "@/components/CalendarView";
import { QuickTaskDialog } from "@/components/QuickTaskDialog";
import { cn } from "@/lib/utils";

type ViewType = "list" | "calendar";

interface TaskListProps {
  view?: ViewType;
  onViewChange?: (view: ViewType) => void;
}

interface SortableTaskItemProps {
  task: TaskDetails;
  onToggle: (id: string) => void;
  onEdit: (task: TaskDetails) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (task: TaskDetails) => void;
}

const SortableTaskItem = ({ task, onToggle, onEdit, onDelete, onOpenDetails }: SortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    none: "bg-priority-none",
    low: "bg-priority-low",
    medium: "bg-priority-medium",
    high: "bg-priority-high",
  };

  const categoryColors = {
    work: "bg-category-work text-white",
    personal: "bg-category-personal text-white",
    shopping: "bg-category-shopping text-white",
    other: "bg-category-other text-white",
  };

  const isOverdue = task.dueDate && isPast(task.dueDate) && !task.completed;
  const isDueToday = task.dueDate && isToday(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 p-4 rounded-lg task-item bg-background border border-transparent",
        "hover:bg-task-hover hover:border-border/50",
        task.completed && "opacity-60",
        isDragging && "shadow-lg z-10 bg-background border-border",
        isOverdue && "border-destructive/50 bg-destructive/5"
      )}
    >
      {/* Priority Indicator */}
      <div className={cn("priority-indicator", priorityColors[task.priority])} />
      
      {/* Drag Handle */}
      <button
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Checkbox */}
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="shrink-0"
      />
      
      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                "cursor-pointer font-medium transition-colors",
                task.completed && "line-through text-task-completed"
              )}
              onClick={() => onOpenDetails(task)}
            >
              {task.title}
            </div>
            
            {task.description && (
              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </div>
            )}
            
            {/* Due date and time */}
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1 mt-2 text-xs",
                isOverdue ? "text-destructive" : isDueToday ? "text-primary" : "text-muted-foreground"
              )}>
                {isOverdue && <AlertCircle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                <span>{format(task.dueDate, "MMM d")}</span>
                {task.startTime && (
                  <>
                    <Clock className="h-3 w-3 ml-1" />
                    <span>{task.startTime}{task.endTime ? ` - ${task.endTime}` : ''}</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Category Badge */}
          <Badge className={cn("category-badge text-xs", categoryColors[task.category])}>
            {task.category}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onOpenDetails(task)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(task.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const TaskList = ({ view = "list", onViewChange }: TaskListProps) => {
  const [tasks, setTasks] = useState<TaskDetails[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskDetails | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isQuickTaskDialogOpen, setIsQuickTaskDialogOpen] = useState(false);
  const [quickTaskDate, setQuickTaskDate] = useState<Date | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: TaskDetails = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        description: "",
        completed: false,
        priority: "none",
        category: "personal",
        createdAt: new Date(),
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (updatedTask: TaskDetails) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const openTaskDetails = (task: TaskDetails) => {
    setSelectedTask(task);
    setIsDetailDialogOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Sort tasks: incomplete first, then by priority (high to low), then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { high: 3, medium: 2, low: 1, none: 0 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const handleDateClick = (date: Date) => {
    setQuickTaskDate(date);
    setIsQuickTaskDialogOpen(true);
  };

  const addQuickTask = (task: TaskDetails) => {
    setTasks([task, ...tasks]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-medium text-foreground">
            {view === "calendar" ? "Calendar" : "My Tasks"}
          </h1>
          
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange?.("list")}
              className="h-8"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange?.("calendar")}
              className="h-8"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendar
            </Button>
          </div>
        </div>
        
        {/* Add new task - only show in list view */}
        {view === "list" && (
          <div className="flex gap-2">
            <Input
              placeholder="Add a task"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {view === "calendar" ? (
          <CalendarView
            tasks={tasks}
            onTaskClick={openTaskDetails}
            onDateClick={handleDateClick}
          />
        ) : (
          <>
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Plus className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg">A fresh start awaits</p>
                <p className="text-sm">Add a task to get started</p>
              </div>
            ) : (
              <div className="p-4">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={sortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {sortedTasks.map((task) => (
                        <div key={task.id} className="slide-in">
                          <SortableTaskItem
                            task={task}
                            onToggle={toggleTask}
                            onEdit={updateTask}
                            onDelete={deleteTask}
                            onOpenDetails={openTaskDetails}
                          />
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={selectedTask}
        isOpen={isDetailDialogOpen}
        onClose={() => {
          setIsDetailDialogOpen(false);
          setSelectedTask(null);
        }}
        onSave={updateTask}
      />

      {/* Quick Task Dialog */}
      <QuickTaskDialog
        isOpen={isQuickTaskDialogOpen}
        selectedDate={quickTaskDate}
        onClose={() => {
          setIsQuickTaskDialogOpen(false);
          setQuickTaskDate(null);
        }}
        onSave={addQuickTask}
      />
    </div>
  );
};