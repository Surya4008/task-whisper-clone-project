import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TaskDetails {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "none" | "low" | "medium" | "high";
  category: "work" | "personal" | "shopping" | "other";
  dueDate?: Date;
  startTime?: string;
  endTime?: string;
  createdAt: Date;
}

interface TaskDetailDialogProps {
  task: TaskDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskDetails) => void;
}

export const TaskDetailDialog = ({ task, isOpen, onClose, onSave }: TaskDetailDialogProps) => {
  const [editedTask, setEditedTask] = useState<TaskDetails | null>(null);

  const handleOpen = (open: boolean) => {
    if (open && task) {
      setEditedTask({ ...task });
    } else {
      onClose();
      setEditedTask(null);
    }
  };

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask);
      onClose();
    }
  };

  const updateField = <K extends keyof TaskDetails>(field: K, value: TaskDetails[K]) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [field]: value });
    }
  };

  const priorityColors = {
    none: "bg-priority-none",
    low: "bg-priority-low",
    medium: "bg-priority-medium",
    high: "bg-priority-high",
  };

  const categoryColors = {
    work: "bg-category-work",
    personal: "bg-category-personal",
    shopping: "bg-category-shopping",
    other: "bg-category-other",
  };

  if (!editedTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedTask.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          {/* Priority and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={editedTask.priority} onValueChange={(value: any) => updateField("priority", value)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", priorityColors[editedTask.priority])} />
                    <SelectValue placeholder="Select priority" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-priority-none" />
                      None
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-priority-low" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-priority-medium" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-priority-high" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={editedTask.category} onValueChange={(value: any) => updateField("category", value)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", categoryColors[editedTask.category])} />
                    <SelectValue placeholder="Select category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-category-work" />
                      Work
                    </div>
                  </SelectItem>
                  <SelectItem value="personal">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-category-personal" />
                      Personal
                    </div>
                  </SelectItem>
                  <SelectItem value="shopping">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-category-shopping" />
                      Shopping
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-category-other" />
                      Other
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !editedTask.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedTask.dueDate ? format(editedTask.dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editedTask.dueDate}
                  onSelect={(date) => updateField("dueDate", date)}
                  initialFocus
                  className="pointer-events-auto"
                />
                {editedTask.dueDate && (
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => updateField("dueDate", undefined)}
                    >
                      Clear date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Interval */}
          <div className="space-y-2">
            <Label>Time Interval</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    value={editedTask.startTime || ""}
                    onChange={(e) => updateField("startTime", e.target.value)}
                    className="pl-10"
                    placeholder="Start time"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    value={editedTask.endTime || ""}
                    onChange={(e) => updateField("endTime", e.target.value)}
                    className="pl-10"
                    placeholder="End time"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div className="text-sm text-muted-foreground">
            Created: {format(editedTask.createdAt, "PPP 'at' p")}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};