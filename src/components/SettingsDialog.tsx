import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Clock, 
  Archive, 
  Trash2, 
  Download,
  Upload,
  Shield,
  Globe,
  Keyboard
} from "lucide-react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ isOpen, onClose }: SettingsDialogProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [emailReminders, setEmailReminders] = useState(false);
  const [defaultView, setDefaultView] = useState<"list" | "calendar">("list");
  const [autoArchive, setAutoArchive] = useState(false);
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [language, setLanguage] = useState("english");
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  const [dataRetention, setDataRetention] = useState("30");
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <Moon className="h-4 w-4" />
              Appearance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="sidebar-collapse">Auto-collapse sidebar</Label>
                </div>
                <Switch
                  id="sidebar-collapse"
                  checked={sidebarCollapse}
                  onCheckedChange={setSidebarCollapse}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animations">Enable Animations</Label>
                <Switch
                  id="animations"
                  checked={animationsEnabled}
                  onCheckedChange={setAnimationsEnabled}
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
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <Bell className="h-4 w-4" />
              Notifications
            </h3>
            <div className="space-y-3">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="email-reminders">Email Reminders</Label>
                <Switch
                  id="email-reminders"
                  checked={emailReminders}
                  onCheckedChange={setEmailReminders}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <Switch
                  id="sound-effects"
                  checked={soundEffects}
                  onCheckedChange={setSoundEffects}
                />
              </div>
            </div>
          </div>

          {/* Task Management */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Task Management
            </h3>
            <div className="space-y-3">
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
              <div className="space-y-2">
                <Label>Time Format</Label>
                <Select value={timeFormat} onValueChange={(value: any) => setTimeFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour format</SelectItem>
                    <SelectItem value="24h">24-hour format</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4" />
              Privacy & Security
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="privacy-mode">Privacy Mode</Label>
                  <p className="text-xs text-muted-foreground">Hide task content in notifications</p>
                </div>
                <Switch
                  id="privacy-mode"
                  checked={privacyMode}
                  onCheckedChange={setPrivacyMode}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Retention (days)</Label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Localization */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4" />
              Localization
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="french">Français</SelectItem>
                    <SelectItem value="german">Deutsch</SelectItem>
                    <SelectItem value="chinese">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <Download className="h-4 w-4" />
              Data Management
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
              <Button variant="destructive" className="w-full justify-start gap-2">
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <Keyboard className="h-4 w-4" />
              Keyboard Shortcuts
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>New Task</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + N</kbd>
              </div>
              <div className="flex justify-between">
                <span>Toggle Sidebar</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + B</kbd>
              </div>
              <div className="flex justify-between">
                <span>Search Tasks</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + F</kbd>
              </div>
              <div className="flex justify-between">
                <span>Settings</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + ,</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
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