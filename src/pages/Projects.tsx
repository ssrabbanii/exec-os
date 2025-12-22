import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, CheckSquare, Mail, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useParams } from 'react-router-dom';

export default function Projects() {
  const { projectId } = useParams();
  const { projects, tasks, messages, meetings, documents, setCurrentProject, updateTaskStatus } = useAppStore();
  const selectedProject = projectId ? projects.find(p => p.id === projectId) : projects[0];

  const projectTasks = tasks.filter(t => t.projectId === selectedProject?.id);
  const projectMessages = messages.filter(m => m.projectId === selectedProject?.id);
  const projectMeetings = meetings.filter(m => m.projectId === selectedProject?.id);
  const projectDocs = documents.filter(d => d.projectId === selectedProject?.id);

  return (
    <div className="p-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Projects</h1>
        <Button><Plus className="w-4 h-4 mr-2" />New Project</Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Project List */}
        <div className="space-y-3">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => setCurrentProject(project.id)}
              className={cn("w-full text-left p-4 rounded-xl border-2 transition-all", selectedProject?.id === project.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color === 'rose' ? 'hsl(350 89% 60%)' : project.color === 'lavender' ? 'hsl(262 52% 64%)' : project.color === 'sky' ? 'hsl(199 89% 48%)' : 'hsl(158 64% 52%)' }} />
                <span className="font-semibold">{project.name}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={project.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">{project.priority}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{project.participants.length}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Project Details */}
        {selectedProject && (
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedProject.color === 'rose' ? 'hsl(350 89% 60%)' : selectedProject.color === 'lavender' ? 'hsl(262 52% 64%)' : selectedProject.color === 'sky' ? 'hsl(199 89% 48%)' : 'hsl(158 64% 52%)' }} />
                    {selectedProject.name}
                  </CardTitle>
                  <Badge variant={selectedProject.priority === 'high' ? 'destructive' : 'secondary'}>{selectedProject.priority} priority</Badge>
                </div>
                <p className="text-muted-foreground">{selectedProject.description}</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tasks">
                  <TabsList>
                    <TabsTrigger value="tasks"><CheckSquare className="w-4 h-4 mr-1" />Tasks ({projectTasks.length})</TabsTrigger>
                    <TabsTrigger value="messages"><Mail className="w-4 h-4 mr-1" />Messages ({projectMessages.length})</TabsTrigger>
                    <TabsTrigger value="meetings"><Calendar className="w-4 h-4 mr-1" />Meetings ({projectMeetings.length})</TabsTrigger>
                    <TabsTrigger value="docs"><FileText className="w-4 h-4 mr-1" />Docs ({projectDocs.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="tasks" className="mt-4 space-y-2">
                    {projectTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                        <button onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')} className={cn("w-5 h-5 rounded border-2 flex items-center justify-center", task.status === 'done' ? "bg-primary border-primary" : "border-border")} />
                        <div className="flex-1">
                          <p className={cn("font-medium", task.status === 'done' && "line-through text-muted-foreground")}>{task.title}</p>
                          {task.dueDate && <p className="text-xs text-muted-foreground">Due: {format(task.dueDate, 'MMM d')}</p>}
                        </div>
                        <Badge className={cn("text-xs", task.priority === 'high' ? 'bg-rose-light text-rose' : task.priority === 'medium' ? 'bg-amber-light text-amber' : 'bg-mint-light text-mint')}>{task.priority}</Badge>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="messages" className="mt-4 space-y-2">
                    {projectMessages.map(msg => (
                      <div key={msg.id} className="p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{msg.from.name}</span>
                          <Badge variant="outline" className="text-[10px]">{msg.channel}</Badge>
                        </div>
                        <p className="text-sm">{msg.subject}</p>
                        <p className="text-xs text-muted-foreground">{msg.preview}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="meetings" className="mt-4 space-y-2">
                    {projectMeetings.map(meeting => (
                      <div key={meeting.id} className="p-3 rounded-lg border border-border">
                        <p className="font-medium">{meeting.title}</p>
                        <p className="text-sm text-muted-foreground">{format(meeting.start, 'MMM d, h:mm a')}</p>
                        <Badge variant="outline" className="mt-1 text-[10px]">{meeting.status}</Badge>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="docs" className="mt-4 space-y-2">
                    {projectDocs.map(doc => (
                      <div key={doc.id} className="p-3 rounded-lg border border-border flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.type.toUpperCase()} • {format(doc.lastUpdated, 'MMM d')}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
