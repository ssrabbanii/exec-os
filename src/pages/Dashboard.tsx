import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, CheckSquare, Sparkles, AlertTriangle, Clock, ChevronRight, Plus, X } from 'lucide-react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { calendar, messages, tasks, suggestions, projects, updateTaskStatus, acceptSuggestion, rejectSuggestion, resolveConflict } = useAppStore();
  
  const todayEvents = calendar.filter(e => isToday(e.start) || isTomorrow(e.start) || e.start <= addDays(new Date(), 7));
  const priorityMessages = messages.filter(m => m.priority === 'high' && !m.isRead).slice(0, 5);
  const pendingTasks = tasks.filter(t => t.status !== 'done').slice(0, 8);
  const activeSuggestions = suggestions.filter(s => s.accepted === undefined).slice(0, 3);
  const conflicts = calendar.filter(e => e.isConflict);

  const handleResolveConflict = (eventId: string) => {
    const event = calendar.find(e => e.id === eventId);
    if (event) {
      const newStart = new Date(event.start.getTime() + 2 * 60 * 60 * 1000);
      const newEnd = new Date(event.end.getTime() + 2 * 60 * 60 * 1000);
      resolveConflict(eventId, newStart, newEnd);
    }
  };

  return (
    <div className="p-6 pb-24 lg:pb-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Alex
          </h1>
          <p className="text-muted-foreground mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <Link to="/assistant">
          <Button className="rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Ask Aria
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              My Day
            </CardTitle>
            {conflicts.length > 0 && (
              <Badge variant="destructive" className="gap-1 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                {conflicts.length} Conflict
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {todayEvents.slice(0, 5).map(event => (
              <div 
                key={event.id} 
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all",
                  event.isConflict 
                    ? "border-destructive/50 bg-destructive/5" 
                    : "border-border/50 hover:border-border hover:bg-secondary/50"
                )}
              >
                <div className="text-center min-w-[60px]">
                  <p className="text-xs text-muted-foreground">{format(event.start, 'MMM d')}</p>
                  <p className="font-medium">{format(event.start, 'h:mm a')}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{event.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {event.participants.map(p => p.name).join(', ')}
                  </p>
                </div>
                {event.isConflict && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => handleResolveConflict(event.id)}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeSuggestions.map(s => (
              <div key={s.id} className="p-4 rounded-xl border border-border/50 bg-accent/30 space-y-3">
                <p className="font-medium text-sm text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="rounded-full flex-1"
                    onClick={() => acceptSuggestion(s.id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="rounded-full"
                    onClick={() => rejectSuggestion(s.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Priority Inbox */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Priority Inbox
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {priorityMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No unread priority messages</p>
            ) : (
              priorityMessages.map(m => (
                <Link 
                  key={m.id} 
                  to="/assistant" 
                  className="block p-3 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{m.from.name}</span>
                    <Badge variant="secondary" className="text-[10px] rounded-full">{m.channel}</Badge>
                  </div>
                  <p className="text-sm text-foreground truncate">{m.subject}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{m.preview}</p>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Tasks
            </CardTitle>
            <Link to="/projects" className="text-sm text-primary hover:underline font-medium">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <div 
                    key={task.id} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <button 
                      onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')} 
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                        task.status === 'done' 
                          ? "bg-primary border-primary" 
                          : "border-border hover:border-primary"
                      )}
                    >
                      {task.status === 'done' && (
                        <CheckSquare className="w-3 h-3 text-primary-foreground" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium",
                        task.status === 'done' && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {project && (
                          <Badge variant="outline" className="text-[10px] rounded-full">
                            {project.name}
                          </Badge>
                        )}
                        {task.dueDate && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(task.dueDate, 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge 
                      className={cn(
                        "text-[10px] rounded-full",
                        task.priority === 'high' 
                          ? 'bg-rose-light text-rose' 
                          : task.priority === 'medium' 
                            ? 'bg-amber-light text-amber' 
                            : 'bg-mint-light text-mint'
                      )}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}