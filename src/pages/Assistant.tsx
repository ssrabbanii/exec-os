import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, MicOff, Send, User, Sparkles, Loader2, 
  Calendar, Mail, FileText, Search, Bell, CheckSquare,
  BarChart3, Users, Clock, Briefcase, MessageSquare, Zap,
  ArrowRight, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// Import avatar images
import avatarSydney from '@/assets/avatars/avatar-sydney.jpeg';
import avatarVictoria from '@/assets/avatars/avatar-victoria.jpg';
import avatarSarah from '@/assets/avatars/avatar-sarah.jpeg';

// Video paths (from public folder)
const avatarVideos: Record<string, string> = {
  'sydney': '/avatars/sydney-intro.mov',
  'victoria': '/avatars/victoria-intro.mov',
  'sarah': '/avatars/sarah-intro.mov',
};

const avatarImages: Record<string, string> = {
  'sydney': avatarSydney,
  'victoria': avatarVictoria,
  'sarah': avatarSarah,
};

const avatarNames: Record<string, string> = {
  'sydney': 'Sydney',
  'victoria': 'Victoria',
  'sarah': 'Sarah',
};

const voiceSimulations = [
  "Show me all the meetings I have",
  "What's my schedule for today?",
  "Summarize the board meeting notes",
  "Draft an email to the finance team",
  "What are the pending audit tasks?",
];

// Quick action categories with beautiful cards
const quickActionCategories = [
  {
    id: 'productivity',
    title: 'Productivity',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    actions: [
      { id: 'priorities', label: "Today's Priorities", icon: CheckSquare, prompt: "What are my top priorities today?" },
      { id: 'tasks', label: 'Pending Tasks', icon: Clock, prompt: "Show me all my pending tasks" },
      { id: 'reminders', label: 'Set Reminder', icon: Bell, prompt: "Set a reminder for" },
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    actions: [
      { id: 'email', label: 'Draft Email', icon: Mail, prompt: "Draft an email to" },
      { id: 'messages', label: 'Unread Messages', icon: MessageSquare, prompt: "Show me unread messages from priority contacts" },
      { id: 'contacts', label: 'Contact Summary', icon: Users, prompt: "Summarize the latest from Sarah Chen" },
    ]
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: Calendar,
    color: 'from-violet-500 to-purple-500',
    actions: [
      { id: 'today', label: "Today's Schedule", icon: Calendar, prompt: "What's on my calendar today?" },
      { id: 'week', label: 'Week Overview', icon: Clock, prompt: "Show me my calendar for this week" },
      { id: 'schedule', label: 'Schedule Meeting', icon: Plus, prompt: "Schedule a meeting with" },
    ]
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: FileText,
    color: 'from-emerald-500 to-teal-500',
    actions: [
      { id: 'summarize', label: 'Summarize Doc', icon: FileText, prompt: "Summarize the board meeting notes" },
      { id: 'search', label: 'Search Knowledge', icon: Search, prompt: "Search for" },
      { id: 'brief', label: 'Create Brief', icon: Briefcase, prompt: "Create a brief for the board meeting" },
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: BarChart3,
    color: 'from-pink-500 to-rose-500',
    actions: [
      { id: 'report', label: 'Generate Report', icon: BarChart3, prompt: "Generate a status report for" },
      { id: 'audit', label: 'Audit Tasks', icon: CheckSquare, prompt: "Show me pending audit tasks" },
      { id: 'insights', label: 'Get Insights', icon: Sparkles, prompt: "Give me insights on my productivity this week" },
    ]
  },
];

// Featured quick actions for the main view
const featuredActions = [
  { id: 'priorities', label: "What are my priorities?", icon: Zap, gradient: 'from-amber-500/10 to-orange-500/10', iconColor: 'text-amber-500' },
  { id: 'calendar', label: "Show my calendar", icon: Calendar, gradient: 'from-violet-500/10 to-purple-500/10', iconColor: 'text-violet-500' },
  { id: 'email', label: "Draft an email", icon: Mail, gradient: 'from-blue-500/10 to-cyan-500/10', iconColor: 'text-blue-500' },
  { id: 'summarize', label: "Summarize a document", icon: FileText, gradient: 'from-emerald-500/10 to-teal-500/10', iconColor: 'text-emerald-500' },
];

export default function Assistant() {
  const { 
    assistantMode, setAssistantMode, assistantMessages, addAssistantMessage, 
    currentProjectId, projects, settings, meetings 
  } = useAppStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interpretedText, setInterpretedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentProject = projects.find(p => p.id === currentProjectId);
  const selectedAvatarId = settings?.selectedAvatarId || 'sydney';
  const avatarImage = avatarImages[selectedAvatarId] || avatarSydney;
  const avatarName = avatarNames[selectedAvatarId] || 'Sydney';
  const avatarVideo = avatarVideos[selectedAvatarId] || avatarVideos['sydney'];

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
      const randomText = voiceSimulations[Math.floor(Math.random() * voiceSimulations.length)];
      setInterpretedText(randomText);
      setCurrentCharIndex(0);
      setIsListening(true);
      setShowResponse(false);
    } else {
      setIsListening(false);
      setIsProcessing(true);
      
      setTimeout(() => {
        const fullText = interpretedText;
        let response = "Processing your request...";
        
        if (fullText.toLowerCase().includes('meeting')) {
          const upcomingMeetings = meetings.filter(m => m.status === 'upcoming').slice(0, 3);
          response = `Fetching your meetings... Found ${upcomingMeetings.length} upcoming meetings.`;
          setResponseMessage(response);
          setShowResponse(true);
          
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
    setShowAllActions(false);
    setSelectedCategory(null);
    
    setTimeout(() => {
      let response = "I don't have that in your knowledge base yet. Want to add a source?";
      
      if (messageText.toLowerCase().includes('priorities') || messageText.toLowerCase().includes('today')) {
        response = "Based on your calendar and inbox, here are today's priorities:\n\n1. **Audit Status Call** with KPMG at 2:00 PM - Review TechCorp revenue recognition\n2. **Respond to Sarah Chen** about Board Meeting Agenda\n3. **Complete CFO commentary** for board deck (due tomorrow)\n\nWould you like me to draft any responses?";
      } else if (messageText.toLowerCase().includes('sarah')) {
        response = "Sarah Chen (Board Chair) sent 2 messages recently:\n\n**Email (2 hours ago):** Requesting M&A pipeline update and updated cash flow projection for board pack.\n\n**WhatsApp (1 hour ago):** Asking if CFO commentary section is done.\n\nShall I draft a response to either?";
      } else if (messageText.toLowerCase().includes('draft') && messageText.toLowerCase().includes('email')) {
        response = "I've drafted an email for Michael Torres:\n\n---\n**Subject:** Re: Revenue Recognition Testing\n\nHi Michael,\n\nThank you for flagging the TechCorp contract modification. I'm reviewing the documentation now and will have our analysis ready by end of day.\n\nI'm available for a call at 3pm to discuss. Lisa will pull the supporting SSP documentation.\n\nBest regards,\nAlex\n\n---\n\n*Draft saved to Board Pack > Emails*. Would you like me to send this?";
      } else if (messageText.toLowerCase().includes('calendar') || messageText.toLowerCase().includes('week') || messageText.toLowerCase().includes('schedule')) {
        response = "Your calendar for the next 7 days:\n\n• **Today 2pm** - Audit Status Call (KPMG) ⚠️ Conflict\n• **Today 2pm** - Lender Call (Capital One) ⚠️ Conflict\n• **Tomorrow** - FP&A Team Meeting\n• **In 2 days** - Audit Committee Pre-Meeting\n• **In 3 days** - Q4 Board Meeting\n• **In 5 days** - Budget Kickoff\n\n⚠️ You have a scheduling conflict today. Want me to suggest a resolution?";
      } else if (messageText.toLowerCase().includes('summarize') || messageText.toLowerCase().includes('board')) {
        response = "**Board Meeting Summary (Last Quarter)**\n\n**Key Decisions:**\n• Approved Q3 financial statements\n• Authorized $2M budget increase for digital transformation\n• Approved executive compensation plan\n\n**Action Items:**\n• CFO to present revised forecast by next meeting\n• CEO to finalize strategic partnership terms\n\n*Source: Board Pack > Minutes*";
      } else if (messageText.toLowerCase().includes('audit') || messageText.toLowerCase().includes('pending')) {
        response = "Here are the pending audit tasks:\n\n1. **Revenue Recognition Testing** - Due in 2 days\n2. **Accounts Payable Sampling** - Due in 5 days\n3. **Inventory Valuation Review** - Due in 7 days\n\nWould you like me to prioritize these or create reminders?";
      } else if (messageText.toLowerCase().includes('message') || messageText.toLowerCase().includes('unread')) {
        response = "You have 3 unread messages from priority contacts:\n\n1. **Sarah Chen** (2h ago) - Board Meeting Agenda\n2. **Michael Torres** (4h ago) - Revenue Recognition Testing\n3. **Lisa Park** (6h ago) - SSP Documentation\n\nWould you like me to summarize or respond to any of these?";
      } else if (messageText.toLowerCase().includes('reminder')) {
        response = "I can set a reminder for you. Please specify:\n\n• What would you like to be reminded about?\n• When should I remind you?\n\nFor example: \"Remind me to review the board deck tomorrow at 9 AM\"";
      } else if (messageText.toLowerCase().includes('report') || messageText.toLowerCase().includes('insight')) {
        response = "**Weekly Productivity Insights**\n\n📊 **Meetings:** 12 this week (3 more than last week)\n📧 **Emails processed:** 47 (avg response time: 2.3 hours)\n✅ **Tasks completed:** 8 of 12 planned\n🎯 **Focus time:** 6.5 hours (below target of 10 hours)\n\n**Recommendations:**\n• Consider blocking 2 hours tomorrow for focused work\n• 3 meeting conflicts this week - consolidation suggested";
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
  };

  const handleQuickAction = (prompt: string) => {
    if (prompt.endsWith(' ')) {
      setInput(prompt);
    } else {
      handleSend(prompt);
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
        {/* Avatar Panel (when in avatar mode) - Shows Video */}
        {assistantMode === 'avatar' && (
          <Card className="w-96 flex-shrink-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-card to-muted/30 relative overflow-hidden">
            {/* Avatar Video */}
            <div className={cn(
              "w-full aspect-[9/16] max-h-[400px] rounded-2xl overflow-hidden mb-4 shadow-xl relative",
              isListening && "ring-4 ring-primary ring-offset-2 ring-offset-background"
            )}>
              <video 
                ref={videoRef}
                src={avatarVideo}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster={avatarImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
            
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
                  className="mt-4 w-full"
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
                <div className="h-full flex flex-col p-4">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-2 text-foreground">How can I help you today?</h3>
                    <p className="text-sm text-muted-foreground">Choose a quick action or type your question below</p>
                  </div>

                  {/* Featured Actions Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {featuredActions.map((action, i) => (
                      <motion.button
                        key={action.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleQuickAction(
                          action.id === 'priorities' ? "What are my top priorities today?" :
                          action.id === 'calendar' ? "What's on my calendar today?" :
                          action.id === 'email' ? "Draft an email to " :
                          "Summarize the board meeting notes"
                        )}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border border-border bg-gradient-to-r transition-all duration-200 hover:scale-[1.02] hover:shadow-md text-left group",
                          action.gradient
                        )}
                      >
                        <div className={cn("p-2 rounded-lg bg-background/80", action.iconColor)}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm">{action.label}</span>
                        <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                      </motion.button>
                    ))}
                  </div>

                  {/* Category Selector */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-medium text-muted-foreground">Quick Actions:</span>
                    <div className="flex gap-2 flex-wrap">
                      {quickActionCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                            selectedCategory === category.id 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <category.icon className="w-3.5 h-3.5" />
                          {category.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Actions */}
                  <AnimatePresence mode="wait">
                    {selectedCategory && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-3 gap-2 pb-4">
                          {quickActionCategories.find(c => c.id === selectedCategory)?.actions.map((action, i) => (
                            <motion.button
                              key={action.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              onClick={() => handleQuickAction(action.prompt)}
                              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all hover:scale-[1.02] hover:shadow-sm"
                            >
                              <div className={cn(
                                "p-2.5 rounded-xl bg-gradient-to-br",
                                quickActionCategories.find(c => c.id === selectedCategory)?.color
                              )}>
                                <action.icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-xs font-medium text-center">{action.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* All Actions Grid (collapsed by default) */}
                  <AnimatePresence>
                    {showAllActions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 pb-4">
                          {quickActionCategories.map((category, catIndex) => (
                            <motion.div 
                              key={category.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: catIndex * 0.1 }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={cn("p-1.5 rounded-lg bg-gradient-to-br", category.color)}>
                                  <category.icon className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-sm font-medium">{category.title}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {category.actions.map((action, actionIndex) => (
                                  <motion.button
                                    key={action.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: catIndex * 0.1 + actionIndex * 0.05 }}
                                    onClick={() => handleQuickAction(action.prompt)}
                                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-all text-left text-xs"
                                  >
                                    <action.icon className="w-4 h-4 text-muted-foreground" />
                                    <span>{action.label}</span>
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Toggle All Actions */}
                  <button
                    onClick={() => setShowAllActions(!showAllActions)}
                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 mx-auto"
                  >
                    {showAllActions ? 'Show less' : 'Show all actions'}
                    <ArrowRight className={cn("w-3 h-3 transition-transform", showAllActions && "rotate-90")} />
                  </button>
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

            {/* Quick Actions Bar (when messages exist) */}
            {assistantMessages.length > 0 && (
              <div className="px-4 py-2 border-t border-border bg-muted/30">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {featuredActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction(
                        action.id === 'priorities' ? "What are my top priorities today?" :
                        action.id === 'calendar' ? "What's on my calendar today?" :
                        action.id === 'email' ? "Draft an email to " :
                        "Summarize the board meeting notes"
                      )}
                      className={cn("flex-shrink-0 gap-2 text-xs", action.iconColor)}
                    >
                      <action.icon className="w-3.5 h-3.5" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything... Type / for quick commands"
                  className="flex-1"
                />
                <Button onClick={() => handleSend()} disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
