import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MicOff, Send, User, Sparkles, FileText, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// Import avatar images
import avatarSophia from '@/assets/avatars/avatar-sophia.png';
import avatarMei from '@/assets/avatars/avatar-mei.png';
import avatarElena from '@/assets/avatars/avatar-elena.png';
import avatarVictoria from '@/assets/avatars/avatar-victoria.jpg';
import avatarPriya from '@/assets/avatars/avatar-priya.png';
import avatarMichelle from '@/assets/avatars/avatar-michelle.png';
import avatarIsabella from '@/assets/avatars/avatar-isabella.png';

const avatarImages: Record<string, string> = {
  'sophia': avatarSophia,
  'mei': avatarMei,
  'elena': avatarElena,
  'victoria': avatarVictoria,
  'priya': avatarPriya,
  'michelle': avatarMichelle,
  'isabella': avatarIsabella,
};

const avatarNames: Record<string, string> = {
  'sophia': 'Sophia',
  'mei': 'Mei',
  'elena': 'Elena',
  'victoria': 'Victoria',
  'priya': 'Priya',
  'michelle': 'Michelle',
  'isabella': 'Isabella',
};

const voiceSimulations = [
  "Show me all the meetings I have",
  "What's my schedule for today?",
  "Summarize the board meeting notes",
  "Draft an email to the finance team",
  "What are the pending audit tasks?",
];

const quickPrompts = [
  "What are my top priorities today?",
  "Summarize the latest from Sarah Chen",
  "Draft an email to the auditor",
  "What's on my calendar this week?",
  "Create a brief for the board meeting",
  "Show me pending audit tasks",
];

export default function Assistant() {
  const { 
    assistantMode, setAssistantMode, assistantMessages, addAssistantMessage, 
    documents, currentProjectId, projects, settings, meetings 
  } = useAppStore();
  const [input, setInput] = useState('');
  const [showKnowledgePicker, setShowKnowledgePicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interpretedText, setInterpretedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const currentProject = projects.find(p => p.id === currentProjectId);
  const selectedAvatarId = settings?.selectedAvatarId || 'sophia';
  const avatarImage = avatarImages[selectedAvatarId] || avatarSophia;
  const avatarName = avatarNames[selectedAvatarId] || 'Sophia';

  // Simulate voice interpretation typing effect
  useEffect(() => {
    if (isListening && currentCharIndex < interpretedText.length) {
      const timer = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isListening, currentCharIndex, interpretedText]);

  const handleVoiceClick = () => {
    if (!isListening) {
      // Start listening - pick a random voice simulation
      const randomText = voiceSimulations[Math.floor(Math.random() * voiceSimulations.length)];
      setInterpretedText(randomText);
      setCurrentCharIndex(0);
      setIsListening(true);
      setShowResponse(false);
    } else {
      // Stop listening - process the voice input
      setIsListening(false);
      setIsProcessing(true);
      
      // Show processing response after a short delay
      setTimeout(() => {
        const fullText = interpretedText;
        let response = "Processing your request...";
        
        if (fullText.toLowerCase().includes('meeting')) {
          const upcomingMeetings = meetings.filter(m => m.status === 'upcoming').slice(0, 3);
          response = `Fetching your meetings... Found ${upcomingMeetings.length} upcoming meetings.`;
          setResponseMessage(response);
          setShowResponse(true);
          
          // Add to chat after showing popup
          setTimeout(() => {
            addAssistantMessage({ id: `u-${Date.now()}`, role: 'user', content: fullText, timestamp: new Date() });
            const detailedResponse = `Here are your upcoming meetings:\n\n${upcomingMeetings.map((m, i) => 
              `${i + 1}. **${m.title}** - ${format(m.start, 'MMM d, h:mm a')}`
            ).join('\n')}\n\nWould you like me to prepare briefings for any of these?`;
            addAssistantMessage({ id: `a-${Date.now()}`, role: 'assistant', content: detailedResponse, timestamp: new Date() });
            setIsProcessing(false);
          }, 2000);
        } else if (fullText.toLowerCase().includes('schedule') || fullText.toLowerCase().includes('today')) {
          response = "Checking your calendar for today...";
          setResponseMessage(response);
          setShowResponse(true);
          
          setTimeout(() => {
            addAssistantMessage({ id: `u-${Date.now()}`, role: 'user', content: fullText, timestamp: new Date() });
            addAssistantMessage({ 
              id: `a-${Date.now()}`, 
              role: 'assistant', 
              content: "Here's your schedule for today:\n\n• **10:00 AM** - Team Standup\n• **2:00 PM** - Audit Status Call (KPMG)\n• **2:00 PM** - Lender Call ⚠️ Conflict\n• **4:00 PM** - Review Board Deck\n\n⚠️ You have a scheduling conflict at 2 PM. Would you like me to help resolve it?", 
              timestamp: new Date() 
            });
            setIsProcessing(false);
          }, 2000);
        } else if (fullText.toLowerCase().includes('board') || fullText.toLowerCase().includes('summarize')) {
          response = "Searching knowledge base for board meeting notes...";
          setResponseMessage(response);
          setShowResponse(true);
          
          setTimeout(() => {
            addAssistantMessage({ id: `u-${Date.now()}`, role: 'user', content: fullText, timestamp: new Date() });
            addAssistantMessage({ 
              id: `a-${Date.now()}`, 
              role: 'assistant', 
              content: "**Board Meeting Summary (Last Quarter)**\n\n**Key Decisions:**\n• Approved Q3 financial statements\n• Authorized $2M budget increase for digital transformation\n• Approved executive compensation plan\n\n**Action Items:**\n• CFO to present revised forecast by next meeting\n• CEO to finalize strategic partnership terms\n\n*Source: Board Pack > Minutes*", 
              timestamp: new Date() 
            });
            setIsProcessing(false);
          }, 2000);
        } else if (fullText.toLowerCase().includes('email') || fullText.toLowerCase().includes('draft')) {
          response = "Drafting email based on context...";
          setResponseMessage(response);
          setShowResponse(true);
          
          setTimeout(() => {
            addAssistantMessage({ id: `u-${Date.now()}`, role: 'user', content: fullText, timestamp: new Date() });
            addAssistantMessage({ 
              id: `a-${Date.now()}`, 
              role: 'assistant', 
              content: "I've drafted an email for the finance team:\n\n---\n**Subject:** Q4 Budget Review - Action Required\n\nDear Team,\n\nPlease review the attached Q4 budget projections by end of week. Key areas needing input:\n\n1. Revenue forecast adjustments\n2. OPEX variance explanations\n3. Capital expenditure updates\n\nLet me know if you have any questions.\n\nBest regards\n\n---\n\n*Draft saved to Drafts folder*. Shall I send this?", 
              timestamp: new Date() 
            });
            setIsProcessing(false);
          }, 2000);
        } else {
          response = "Searching your knowledge base...";
          setResponseMessage(response);
          setShowResponse(true);
          
          setTimeout(() => {
            addAssistantMessage({ id: `u-${Date.now()}`, role: 'user', content: fullText, timestamp: new Date() });
            addAssistantMessage({ 
              id: `a-${Date.now()}`, 
              role: 'assistant', 
              content: "Here are the pending audit tasks:\n\n1. **Revenue Recognition Testing** - Due in 2 days\n2. **Accounts Payable Sampling** - Due in 5 days\n3. **Inventory Valuation Review** - Due in 7 days\n\nWould you like me to prioritize these or create reminders?", 
              timestamp: new Date() 
            });
            setIsProcessing(false);
          }, 2000);
        }
      }, 500);
    }
  };

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
          <h1 className="font-display text-2xl font-bold text-foreground">Assistant</h1>
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
          <Card className="w-80 flex-shrink-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-card to-muted/30 relative overflow-hidden">
            {/* Avatar Image */}
            <motion.div 
              className={cn(
                "w-40 h-40 rounded-full overflow-hidden mb-4 ring-4 ring-primary/20 shadow-xl",
                isListening && "ring-primary ring-offset-2 ring-offset-background"
              )}
              animate={isListening ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <img 
                src={avatarImage} 
                alt={avatarName}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <h3 className="font-display font-semibold text-lg text-foreground">{avatarName}</h3>
            <p className="text-sm text-muted-foreground mb-4">Your Executive Assistant</p>
            
            {/* Voice Button */}
            <Button 
              size="lg" 
              className={cn(
                "rounded-full w-16 h-16 transition-all duration-300",
                isListening ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary hover:bg-primary/90"
              )}
              onClick={handleVoiceClick}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {isProcessing ? "Processing..." : isListening ? "Click to stop" : "Click to speak"}
            </p>
            
            {/* Interpreted Text Display */}
            <AnimatePresence>
              {isListening && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 w-full"
                >
                  <div className="bg-muted/50 rounded-xl p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Listening...</p>
                    <p className="text-sm text-foreground font-medium min-h-[24px]">
                      "{interpretedText.substring(0, currentCharIndex)}"
                      <span className="animate-pulse">|</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Response Popup */}
            <AnimatePresence>
              {showResponse && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="absolute bottom-4 left-4 right-4"
                >
                  <div className="bg-primary text-primary-foreground rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4" />
                      <p className="text-xs font-medium">Processing</p>
                    </div>
                    <p className="text-sm">{responseMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                  <h3 className="font-display font-semibold text-lg mb-2 text-foreground">How can I help you today?</h3>
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
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                        <img src={avatarImage} alt={avatarName} className="w-full h-full object-cover" />
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
                  placeholder={`Ask ${avatarName} anything... (use / to insert sources)`}
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
