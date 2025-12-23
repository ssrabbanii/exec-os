import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Sparkles, Link2, Bell, Download, RotateCcw, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AvatarSelector } from '@/components/avatar/AvatarSelector';

export default function Settings() {
  const { user, settings, updateNotificationPreferences, resetDemoData, setSelectedAvatar } = useAppStore();
  const [selectedAvatarId, setSelectedAvatarId] = useState(settings.selectedAvatarId || 'mei');

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    setSelectedAvatar(avatarId);
    toast.success('Avatar updated');
  };

  const handleExport = () => {
    const data = localStorage.getItem('exec-assistant-storage');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aria-demo-data.json';
      a.click();
      toast.success('Demo data exported');
    }
  };

  const handleReset = () => {
    resetDemoData();
    toast.success('Demo data reset to defaults');
    window.location.reload();
  };

  return (
    <div className="p-6 pb-24 lg:pb-6 max-w-3xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">AM</div>
            <div>
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-muted-foreground">{user.role}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5" />Avatar & Voice</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarSelector
            selectedAvatarId={selectedAvatarId}
            onSelectAvatar={handleAvatarSelect}
            showVoiceOptions={true}
          />
        </CardContent>
      </Card>

      {/* Connected Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Link2 className="w-5 h-5" />Connected Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {settings.connectors.map(conn => (
            <div key={conn.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <span className="text-xl">{conn.icon}</span>
                <div>
                  <p className="font-medium">{conn.name}</p>
                  {conn.lastSync && <p className="text-xs text-muted-foreground">Last synced: {format(conn.lastSync, 'h:mm a')}</p>}
                </div>
              </div>
              <div className={cn("px-2 py-1 rounded text-xs font-medium", conn.status === 'connected' ? "bg-success-light text-success" : "bg-muted text-muted-foreground")}>{conn.status}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" />Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.notificationPreferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1').replace('15min', '15 min').replace('5min', '5 min')}</Label>
              <Switch id={key} checked={value} onCheckedChange={(checked) => updateNotificationPreferences({ [key]: checked })} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5" />Data Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handleExport} className="w-full justify-start"><Download className="w-4 h-4 mr-2" />Export Demo Data (JSON)</Button>
          <Button variant="destructive" onClick={handleReset} className="w-full justify-start"><RotateCcw className="w-4 h-4 mr-2" />Reset Demo Data</Button>
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle className="w-5 h-5" />Help</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted">
            <h4 className="font-semibold mb-2">Using "/" to insert sources</h4>
            <p className="text-sm text-muted-foreground">When chatting with Aria, type "/" to open the knowledge picker. Select documents, meeting notes, or message threads to ground the assistant's response in your actual data.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
