import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { TaskDetails } from "@/components/TaskDetailDialog";
import { cn } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface CalendarViewProps {
  tasks: TaskDetails[];
  onTaskClick: (task: TaskDetails) => void;
  onDateClick: (date: Date) => void;
}

export const CalendarView = ({ tasks, onTaskClick, onDateClick }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToday: () => setCurrentDate(new Date()),
    onNextMonth: () => setCurrentDate(prev => addMonths(prev, 1)),
    onPrevMonth: () => setCurrentDate(prev => subMonths(prev, 1)),
    onNextDay: () => setCurrentDate(prev => addDays(prev, 1)),
    onPrevDay: () => setCurrentDate(prev => addDays(prev, -1)),
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay()); // Start from Sunday
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay())); // End on Saturday

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(task.dueDate, date)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const priorityColors = {
    none: "bg-priority-none",
    low: "bg-priority-low",
    medium: "bg-priority-medium",
    high: "bg-priority-high",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-medium text-foreground">
            {format(currentDate, "MMMM yyyy")}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday} title="Today (T)">
              Today
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')} title="Previous Month (P)">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')} title="Next Month (N)">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Keyboard shortcuts help */}
        <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
          <span>Shortcuts:</span>
          <span><kbd className="px-1 py-0.5 bg-muted rounded text-xs">T</kbd> Today</span>
          <span><kbd className="px-1 py-0.5 bg-muted rounded text-xs">N</kbd> Next month</span>
          <span><kbd className="px-1 py-0.5 bg-muted rounded text-xs">P</kbd> Previous month</span>
          <span><kbd className="px-1 py-0.5 bg-muted rounded text-xs">D</kbd> Next day</span>
          <span><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Shift+D</kbd> Previous day</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 auto-rows-fr min-h-[600px]">
          {days.map((day, index) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);

            return (
              <div
                key={index}
                className={cn(
                  "border border-border rounded-lg p-2 min-h-[120px] bg-background transition-colors",
                  "hover:bg-task-hover cursor-pointer",
                  !isCurrentMonth && "opacity-50 bg-muted/30",
                  isDayToday && "bg-primary/5 border-primary/30"
                )}
                onClick={() => onDateClick(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-sm font-medium",
                    isDayToday && "text-primary",
                    !isCurrentMonth && "text-muted-foreground"
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayTasks.length}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "p-1 rounded text-xs cursor-pointer transition-colors",
                        "hover:bg-background border border-transparent hover:border-border",
                        task.completed && "opacity-60 line-through"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityColors[task.priority])} />
                        <span className="truncate flex-1">
                          {task.title}
                        </span>
                        {task.dueTime && (
                          <span className="text-muted-foreground">
                            {task.dueTime}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>

                {/* Add task button for today or future dates */}
                {(isDayToday || day > new Date()) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateClick(day);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};