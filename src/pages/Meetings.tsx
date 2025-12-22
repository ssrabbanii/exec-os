import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Play, Square, FileText, CheckSquare, Mail, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function Meetings() {
  const { meetings, updateMeetingStatus, confirmMinutes } = useAppStore();
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming');
  const pastMeetings = meetings.filter(m => m.status === 'completed');
  const meeting = meetings.find(m => m.id === selectedMeeting);

  const handleJoinMeeting = (id: string) => {
    setSelectedMeeting(id);
    setIsLive(true);
    updateMeetingStatus(id, 'in_progress');
    
    // Simulate live transcription
    const phrases = [
      "Good morning, let's begin the meeting.",
      "First item on the agenda is the Q4 review.",
      "Revenue came in 12% above expectations.",
      "We need to discuss the upcoming audit timeline.",
      "The PBC list is 80% complete as of today.",
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < phrases.length) {
        setTranscript(prev => [...prev, phrases[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
  };

  const handleEndMeeting = () => {
    if (selectedMeeting) {
      updateMeetingStatus(selectedMeeting, 'completed');
      setIsLive(false);
      setTranscript([]);
    }
  };

  return (
    <div className="p-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Meetings</h1>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingMeetings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastMeetings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {upcomingMeetings.map(m => (
            <Card key={m.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-center min-w-[80px]">
                  <p className="text-xs text-muted-foreground">{format(m.start, 'MMM d')}</p>
                  <p className="font-semibold">{format(m.start, 'h:mm a')}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{m.participants.map(p => p.name).join(', ')}</p>
                </div>
                <Button onClick={() => handleJoinMeeting(m.id)}><Play className="w-4 h-4 mr-2" />Join Assistant</Button>
                <Button variant="outline" onClick={() => setSelectedMeeting(m.id)}>View</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="mt-6 space-y-4">
          {pastMeetings.map(m => (
            <Card key={m.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedMeeting(m.id)}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-center min-w-[80px]">
                  <p className="text-xs text-muted-foreground">{format(m.start, 'MMM d')}</p>
                  <p className="font-semibold">{format(m.start, 'h:mm a')}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{m.title}</p>
                  <div className="flex gap-2 mt-1">
                    {m.transcript && <Badge variant="outline" className="text-[10px]"><FileText className="w-3 h-3 mr-1" />Transcript</Badge>}
                    {m.minutes && <Badge variant="outline" className="text-[10px]"><CheckSquare className="w-3 h-3 mr-1" />Minutes</Badge>}
                    {m.actionItems && <Badge variant="outline" className="text-[10px]">{m.actionItems.length} Actions</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Live Meeting View */}
      {isLive && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
              <span className="font-semibold">Assistant is in meeting</span>
            </div>
            <Button variant="destructive" onClick={handleEndMeeting}><Square className="w-4 h-4 mr-2" />End Meeting</Button>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <h3 className="font-display font-semibold mb-4">Live Transcription</h3>
            <div className="space-y-3">
              {transcript.map((line, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted animate-fade-in">
                  <p className="text-sm">{line}</p>
                </div>
              ))}
              {transcript.length > 0 && <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4 animate-pulse" />Listening...</div>}
            </div>
          </div>
        </div>
      )}

      {/* Meeting Details Sheet */}
      <Sheet open={!!selectedMeeting && !isLive} onOpenChange={() => setSelectedMeeting(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-auto">
          <SheetHeader>
            <SheetTitle>{meeting?.title}</SheetTitle>
          </SheetHeader>
          {meeting && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {format(meeting.start, 'MMMM d, yyyy h:mm a')}
              </div>

              {meeting.minutes && (
                <div>
                  <h4 className="font-semibold mb-2">Minutes</h4>
                  <div className="space-y-3">
                    <div><p className="text-xs text-muted-foreground mb-1">Agenda</p>{meeting.minutes.agenda.map((a, i) => <p key={i} className="text-sm">• {a}</p>)}</div>
                    <div><p className="text-xs text-muted-foreground mb-1">Decisions</p>{meeting.minutes.decisions.map((d, i) => <p key={i} className="text-sm">• {d}</p>)}</div>
                    <div><p className="text-xs text-muted-foreground mb-1">Risks</p>{meeting.minutes.risks.map((r, i) => <p key={i} className="text-sm text-destructive">• {r}</p>)}</div>
                  </div>
                  {!meeting.minutes.isConfirmed && <Button className="mt-4" onClick={() => confirmMinutes(meeting.id)}>Confirm Minutes</Button>}
                </div>
              )}

              {meeting.actionItems && meeting.actionItems.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Action Items</h4>
                  {meeting.actionItems.map(task => (
                    <div key={task.id} className="p-2 rounded-lg bg-muted mb-2">
                      <p className="font-medium text-sm">{task.title}</p>
                      {task.dueDate && <p className="text-xs text-muted-foreground">Due: {format(task.dueDate, 'MMM d')}</p>}
                    </div>
                  ))}
                </div>
              )}

              {meeting.followUpDrafts && (
                <div>
                  <h4 className="font-semibold mb-2">Follow-up Drafts</h4>
                  {meeting.followUpDrafts.map(draft => (
                    <Card key={draft.id} className="mb-2">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4" />
                          <span className="font-medium text-sm">{draft.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap">{draft.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
