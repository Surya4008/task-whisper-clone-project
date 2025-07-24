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
  X,
  Flag,
  Briefcase,
  User,
  ShoppingCart,
  Circle,
  Filter,
  Settings
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  onFilterChange?: (filter: FilterOptions) => void;
  currentView?: "list" | "calendar";
  onViewChange?: (view: "list" | "calendar") => void;
  onShowStarred?: () => void;
  onOpenSettings?: () => void;
}

interface FilterOptions {
  priority?: "none" | "low" | "medium" | "high";
  category?: "work" | "personal" | "shopping" | "other";
  showCompleted?: boolean;
}

export const Sidebar = ({ isOpen, onToggle, onFilterChange, currentView, onViewChange, onShowStarred, onOpenSettings }: SidebarProps) => {
  const [taskLists] = useState<TaskList[]>([
    { id: "1", name: "My Tasks", taskCount: 0, isDefault: true },
  ]);
  
  const [activeListId, setActiveListId] = useState("1");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOptions>({});

  const handleFilterClick = (filter: FilterOptions) => {
    const newFilter = { ...activeFilter, ...filter };
    setActiveFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const clearFilters = () => {
    setActiveFilter({});
    onFilterChange?.({});
  };

  const priorityItems = [
    { id: "high", label: "High Priority", color: "bg-priority-high", icon: Flag },
    { id: "medium", label: "Medium Priority", color: "bg-priority-medium", icon: Flag },
    { id: "low", label: "Low Priority", color: "bg-priority-low", icon: Flag },
  ];

  const categoryItems = [
    { id: "work", label: "Work", color: "bg-category-work", icon: Briefcase },
    { id: "personal", label: "Personal", color: "bg-category-personal", icon: User },
    { id: "shopping", label: "Shopping", color: "bg-category-shopping", icon: ShoppingCart },
    { id: "other", label: "Other", color: "bg-category-other", icon: Circle },
  ];

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
                    activeListId === "1" && "bg-accent text-accent-foreground"
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
                  onClick={onShowStarred}
                >
                  <Star className="h-4 w-4" />
                  Starred
                </Button>
                
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    currentView === "calendar" && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => onViewChange?.("calendar")}
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Button>
              </div>

              {/* Filters */}
              <div className="pt-4 border-t border-border">
                <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between h-10"
                    >
                      <div className="flex items-center gap-3">
                        <Filter className="h-4 w-4" />
                        Filters
                      </div>
                      {Object.keys(activeFilter).length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {Object.keys(activeFilter).length}
                        </Badge>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-3 mt-2">
                    {/* Priority Filters */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Priority</h4>
                      <div className="space-y-1">
                        {priorityItems.map((item) => (
                          <Button
                            key={item.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start gap-3 h-8",
                              activeFilter.priority === item.id && "bg-muted"
                            )}
                            onClick={() => handleFilterClick({ priority: item.id as any })}
                          >
                            <div className={cn("w-3 h-3 rounded-full", item.color)} />
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Category Filters */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Category</h4>
                      <div className="space-y-1">
                        {categoryItems.map((item) => (
                          <Button
                            key={item.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start gap-3 h-8",
                              activeFilter.category === item.id && "bg-muted"
                            )}
                            onClick={() => handleFilterClick({ category: item.id as any })}
                          >
                            <div className={cn("w-3 h-3 rounded-full", item.color)} />
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {Object.keys(activeFilter).length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </CollapsibleContent>
                </Collapsible>
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
                      activeListId === list.id && "bg-accent text-accent-foreground"
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

              {/* Settings */}
              <div className="pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10"
                  onClick={onOpenSettings}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};