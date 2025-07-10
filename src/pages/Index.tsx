import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TaskList } from "@/components/TaskList";

type ViewType = "list" | "calendar";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("list");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setSidebarOpen(false); // Close sidebar on mobile when switching views
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar}
          currentView={currentView}
          onViewChange={handleViewChange}
        />
        
        <main className="flex-1 overflow-hidden">
          <TaskList 
            view={currentView}
            onViewChange={handleViewChange}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
