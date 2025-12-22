import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Mail, CheckSquare, FileText, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const iconMap = {
  meeting_reminder: Calendar,
  critical_message: Mail,
  task_deadline: CheckSquare,
  task_completed: Check,
  daily_summary: FileText,
};

export default function Notifications() {
  const { notifications, markNotificationAsRead } = useAppStore();
  const unread = notifications.filter(n => !n.isRead);
  const read = notifications.filter(n => n.isRead);

  return (
    <div className="p-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Notifications</h1>
        {unread.length > 0 && <Badge variant="destructive">{unread.length} unread</Badge>}
      </div>

      {unread.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">New</h2>
          <div className="space-y-2">
            {unread.map(n => {
              const Icon = iconMap[n.type];
              return (
                <Card key={n.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                      {n.contextBriefing && <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">{n.contextBriefing}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(n.timestamp, { addSuffix: true })}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => markNotificationAsRead(n.id)}>Mark read</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">Earlier</h2>
          <div className="space-y-2">
            {read.map(n => {
              const Icon = iconMap[n.type];
              return (
                <Card key={n.id} className="opacity-70">
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(n.timestamp, { addSuffix: true })}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      )}
    </div>
  );
}
