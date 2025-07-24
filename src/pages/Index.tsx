import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TaskList } from "@/components/TaskList";
import { SettingsDialog } from "@/components/SettingsDialog";

type ViewType = "list" | "calendar";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [showStarred, setShowStarred] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setShowStarred(false);
    setSidebarOpen(false); // Close sidebar on mobile when switching views
  };

  const handleShowStarred = () => {
    setShowStarred(true);
    setCurrentView("list");
    setSidebarOpen(false);
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
          onShowStarred={handleShowStarred}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        
        <main className="flex-1 overflow-hidden">
          <TaskList 
            view={currentView}
            onViewChange={handleViewChange}
            showStarred={showStarred}
            onStarredChange={setShowStarred}
          />
        </main>
      </div>
      
      <SettingsDialog 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Index;
