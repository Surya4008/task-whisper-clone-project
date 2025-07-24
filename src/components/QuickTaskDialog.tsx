import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Calendar, Clock } from "lucide-react";
import { TaskDetails } from "@/components/TaskDetailDialog";
import { cn } from "@/lib/utils";

interface QuickTaskDialogProps {
  isOpen: boolean;
  selectedDate: Date | null;
  onClose: () => void;
  onSave: (task: TaskDetails) => void;
}

export const QuickTaskDialog = ({ isOpen, selectedDate, onClose, onSave }: QuickTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"none" | "low" | "medium" | "high">("none");
  const [category, setCategory] = useState<"work" | "personal" | "shopping" | "other" | "custom">("personal");
  const [dueTime, setDueTime] = useState("");

  const handleSave = () => {
    if (title.trim() && selectedDate) {
      const newTask: TaskDetails = {
        id: Date.now().toString(),
        title: title.trim(),
        description: "",
        completed: false,
        priority,
        category,
        dueDate: selectedDate,
        starred: false,
        createdAt: new Date(),
      };
      onSave(newTask);
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setPriority("none");
    setCategory("personal");
    setDueTime("");
    onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quick Add Task
            {selectedDate && (
              <span className="text-sm font-normal text-muted-foreground">
                for {format(selectedDate, "MMM d, yyyy")}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quick-title">Task Title</Label>
            <Input
              id="quick-title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", priorityColors[priority])} />
                    <SelectValue />
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
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", categoryColors[category])} />
                    <SelectValue />
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
                  <SelectItem value="custom">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted" />
                      Custom
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-time">Due Time (optional)</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="quick-time"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Add Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};