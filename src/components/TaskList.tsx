import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Plus, Trash2, Edit3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
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

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = () => {
    if (editTitle.trim() && editingId) {
      setTasks(tasks.map(task =>
        task.id === editingId ? { ...task, title: editTitle.trim() } : task
      ));
      setEditingId(null);
      setEditTitle("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-medium text-foreground mb-4">My Tasks</h1>
        
        {/* Add new task */}
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
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Plus className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg">A fresh start awaits</p>
            <p className="text-sm">Add a task to get started</p>
          </div>
        ) : (
          <div className="space-y-1 p-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-lg hover:bg-task-hover transition-colors",
                  task.completed && "opacity-60"
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="shrink-0"
                />
                
                {editingId === task.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    onBlur={saveEdit}
                    className="flex-1 border-none shadow-none p-0 focus-visible:ring-0"
                    autoFocus
                  />
                ) : (
                  <span
                    className={cn(
                      "flex-1 cursor-pointer",
                      task.completed && "line-through text-task-completed"
                    )}
                    onClick={() => startEditing(task)}
                  >
                    {task.title}
                  </span>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEditing(task)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteTask(task.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};