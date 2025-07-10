import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, 
  Plus, 
  Calendar,
  Star,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskList {
  id: string;
  name: string;
  taskCount: number;
  isDefault?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [taskLists] = useState<TaskList[]>([
    { id: "1", name: "My Tasks", taskCount: 0, isDefault: true },
  ]);
  
  const [activeListId, setActiveListId] = useState("1");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-80 bg-background border-r border-border transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 space-y-2">
              {/* Default views */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    activeListId === "1" && "bg-task-sidebar-active text-primary"
                  )}
                  onClick={() => setActiveListId("1")}
                >
                  <CheckSquare className="h-4 w-4" />
                  My Tasks
                  <Badge variant="secondary" className="ml-auto">
                    0
                  </Badge>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10"
                >
                  <Star className="h-4 w-4" />
                  Starred
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10"
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Button>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Lists</span>
                </div>
                
                {taskLists.map((list) => (
                  <Button
                    key={list.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-10",
                      activeListId === list.id && "bg-task-sidebar-active text-primary"
                    )}
                    onClick={() => setActiveListId(list.id)}
                  >
                    <CheckSquare className="h-4 w-4" />
                    {list.name}
                    {list.taskCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {list.taskCount}
                      </Badge>
                    )}
                  </Button>
                ))}
                
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10 text-muted-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Create new list
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};