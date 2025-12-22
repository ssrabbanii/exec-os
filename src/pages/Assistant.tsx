import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Send, User, Sparkles, FileText, Calendar, Mail, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const quickPrompts = [
  "What are my top priorities today?",
  "Summarize the latest from Sarah Chen",
  "Draft an email to the auditor",
  "What's on my calendar this week?",
  "Create a brief for the board meeting",
  "Show me pending audit tasks",
];

export default function Assistant() {
  const { assistantMode, setAssistantMode, assistantMessages, addAssistantMessage, documents, messages, meetings, currentProjectId, projects } = useAppStore();
  const [input, setInput] = useState('');
  const [showKnowledgePicker, setShowKnowledgePicker] = useState(false);
  const currentProject = projects.find(p => p.id === currentProjectId);

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    addAssistantMessage({ id: `u-${Date.now()}`, role: 'user', content: messageText, timestamp: new Date() });
    
    // Mock response
    setTimeout(() => {
      let response = "I don't have that in your knowledge base yet. Want to add a source?";
      
      if (messageText.toLowerCase().includes('priorities') || messageText.toLowerCase().includes('today')) {
        response = "Based on your calendar and inbox, here are today's priorities:\n\n1. **Audit Status Call** with KPMG at 2:00 PM - Review TechCorp revenue recognition\n2. **Respond to Sarah Chen** about Board Meeting Agenda\n3. **Complete CFO commentary** for board deck (due tomorrow)\n\nWould you like me to draft any responses?";
      } else if (messageText.toLowerCase().includes('sarah')) {
        response = "Sarah Chen (Board Chair) sent 2 messages recently:\n\n**Email (2 hours ago):** Requesting M&A pipeline update and updated cash flow projection for board pack.\n\n**WhatsApp (1 hour ago):** Asking if CFO commentary section is done.\n\nShall I draft a response to either?";
      } else if (messageText.toLowerCase().includes('draft') && messageText.toLowerCase().includes('email')) {
        response = "I've drafted an email for Michael Torres:\n\n---\n**Subject:** Re: Revenue Recognition Testing\n\nHi Michael,\n\nThank you for flagging the TechCorp contract modification. I'm reviewing the documentation now and will have our analysis ready by end of day.\n\nI'm available for a call at 3pm to discuss. Lisa will pull the supporting SSP documentation.\n\nBest regards,\nAlex\n\n---\n\n*Draft saved to Board Pack > Emails*. Would you like me to send this?";
      } else if (messageText.toLowerCase().includes('calendar') || messageText.toLowerCase().includes('week')) {
        response = "Your calendar for the next 7 days:\n\n• **Today 2pm** - Audit Status Call (KPMG) ⚠️ Conflict\n• **Today 2pm** - Lender Call (Capital One) ⚠️ Conflict\n• **Tomorrow** - FP&A Team Meeting\n• **In 2 days** - Audit Committee Pre-Meeting\n• **In 3 days** - Q4 Board Meeting\n• **In 5 days** - Budget Kickoff\n\n⚠️ You have a scheduling conflict today. Want me to suggest a resolution?";
      }
      
      addAssistantMessage({ id: `a-${Date.now()}`, role: 'assistant', content: response, timestamp: new Date() });
    }, 1000);
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (input.endsWith('/')) {
      setShowKnowledgePicker(true);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Assistant</h1>
          {currentProject && <Badge variant="outline" className="mt-1">Context: {currentProject.name}</Badge>}
        </div>
        <Tabs value={assistantMode} onValueChange={(v) => setAssistantMode(v as 'avatar' | 'chat')}>
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Avatar Panel (when in avatar mode) */}
        {assistantMode === 'avatar' && (
          <Card className="w-80 flex-shrink-0 avatar-panel flex flex-col items-center justify-center p-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-lavender/20 flex items-center justify-center mb-4">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg">Aria</h3>
            <p className="text-sm text-muted-foreground mb-4">Your Executive Assistant</p>
            <Button size="lg" className="rounded-full w-14 h-14">
              <Mic className="w-6 h-6" />
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Click to speak</p>
          </Card>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {assistantMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <Sparkles className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-display font-semibold text-lg mb-2">How can I help you today?</h3>
                  <p className="text-sm text-muted-foreground mb-6">Ask me anything about your schedule, messages, or documents. Use "/" to insert knowledge sources.</p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                    {quickPrompts.map((prompt, i) => (
                      <Button key={i} variant="outline" size="sm" onClick={() => handleSend(prompt)} className="text-xs">
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                assistantMessages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "")}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div className={cn("max-w-[80%] rounded-2xl px-4 py-3", msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-[10px] opacity-70 mt-1">{format(msg.timestamp, 'h:mm a')}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Aria anything... (use / to insert sources)"
                  className="pr-12"
                />
                <Button size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={() => handleSend()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Knowledge Picker */}
              {showKnowledgePicker && (
                <Card className="absolute bottom-full left-0 right-0 mb-2 p-2 max-h-60 overflow-auto">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                    <Search className="w-3 h-3" /> Insert from knowledge base
                  </div>
                  {documents.slice(0, 5).map(doc => (
                    <button key={doc.id} className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-muted text-left" onClick={() => { setInput(input + doc.title + ' '); setShowKnowledgePicker(false); }}>
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{doc.title}</span>
                    </button>
                  ))}
                </Card>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
