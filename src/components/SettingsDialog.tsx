import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Settings } from "lucide-react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ isOpen, onClose }: SettingsDialogProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [defaultView, setDefaultView] = useState<"list" | "calendar">("list");
  const [autoArchive, setAutoArchive] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Appearance</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="space-y-2">
              <Label>Default View</Label>
              <Select value={defaultView} onValueChange={(value: any) => setDefaultView(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">List View</SelectItem>
                  <SelectItem value="calendar">Calendar View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-reminders">Task Reminders</Label>
              <Switch
                id="task-reminders"
                checked={taskReminders}
                onCheckedChange={setTaskReminders}
              />
            </div>
          </div>

          {/* Task Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Task Management</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-archive">Auto-archive completed tasks</Label>
                <p className="text-xs text-muted-foreground">Automatically hide completed tasks after 24 hours</p>
              </div>
              <Switch
                id="auto-archive"
                checked={autoArchive}
                onCheckedChange={setAutoArchive}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};