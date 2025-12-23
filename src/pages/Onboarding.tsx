import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, User, Link2, FolderPlus, Users, Lock, 
  Play, Zap, Shield, Clock, Globe, Star, CheckCircle2, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import avatar images
import avatarSydney from '@/assets/avatars/avatar-sydney.jpeg';
import avatarVictoria from '@/assets/avatars/avatar-victoria.jpg';
import avatarSarah from '@/assets/avatars/avatar-sarah.jpeg';
import avatarMei from '@/assets/avatars/avatar-mei.png';
import avatarSophia from '@/assets/avatars/avatar-sophia.png';
import avatarElena from '@/assets/avatars/avatar-elena.png';

const steps = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'avatar', title: 'Choose Avatar', icon: User },
  { id: 'sources', title: 'Connect Sources', icon: Link2 },
  { id: 'project', title: 'First Project', icon: FolderPlus },
  { id: 'contacts', title: 'Priority Contacts', icon: Users },
];

const mainAvatars = [
  {
    id: 'sydney',
    name: 'Sydney',
    image: avatarSydney,
    personality: 'Confident & Professional',
    style: 'Executive Partner',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'victoria',
    name: 'Victoria',
    image: avatarVictoria,
    personality: 'Confident & Direct',
    style: 'C-Suite Coach',
    gradient: 'from-violet-500 to-purple-400',
  },
  {
    id: 'sarah',
    name: 'Sarah',
    image: avatarSarah,
    personality: 'Warm & Strategic',
    style: 'Leadership Advisor',
    gradient: 'from-rose-500 to-pink-400',
  },
];

const comingSoonAvatars = [
  { id: 'mei', name: 'Mei', image: avatarMei },
  { id: 'sophia', name: 'Sophia', image: avatarSophia },
  { id: 'elena', name: 'Elena', image: avatarElena },
];

const mockSources = [
  { id: 'gmail', name: 'Gmail', icon: '📧', desc: 'Sync emails & drafts' },
  { id: 'gcal', name: 'Google Calendar', icon: '📅', desc: 'Manage your schedule' },
  { id: 'gdrive', name: 'Google Drive', icon: '📁', desc: 'Access documents' },
  { id: 'teams', name: 'Microsoft Teams', icon: '💬', desc: 'Chat & meetings' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '📱', desc: 'Priority messages' },
];

const features = [
  { icon: Zap, title: 'AI-Powered', desc: 'Smart task prioritization' },
  { icon: Shield, title: 'Enterprise Secure', desc: 'SOC 2 compliant' },
  { icon: Clock, title: 'Save 10+ hrs/week', desc: 'Automate routine work' },
  { icon: Globe, title: 'Works Everywhere', desc: 'Email, chat, calendar' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'CFO, TechCorp', text: 'Aria transformed how I manage my day.' },
  { name: 'Michael Torres', role: 'VP Finance', text: 'Like having a second brain for work.' },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const { contacts, projects, setSelectedAvatar, addConnectedSource, addPriorityContact, completeOnboarding } = useAppStore();
  const [selectedAvatarId, setSelectedAvatarLocal] = useState('sydney');
  const [connectedSources, setConnectedSources] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      setSelectedAvatar(selectedAvatarId);
      connectedSources.forEach(s => addConnectedSource(s));
      selectedContacts.forEach(c => addPriorityContact(c));
      completeOnboarding();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const toggleSource = (id: string) => {
    setConnectedSources(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const selectedAvatar = mainAvatars.find(a => a.id === selectedAvatarId);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 blur-[100px]"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/20 to-primary/20 blur-[100px]"
        />
        <motion.div
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -80, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-rose-500/10 to-amber-500/10 blur-[80px]"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none opacity-30" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Aria</span>
          </motion.div>

          {/* Progress indicator */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1"
          >
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  animate={{ scale: i === currentStep ? 1 : 0.8 }}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                    i === currentStep 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : i < currentStep 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </motion.div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "w-8 h-0.5 mx-1 transition-all",
                    i < currentStep ? "bg-primary" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </motion.div>

          <div className="w-32" /> {/* Spacer for centering */}
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <AnimatePresence mode="wait">
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-5xl text-center"
              >
                {/* Hero badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Trusted by 10,000+ executives</span>
                </motion.div>

                {/* Main headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                >
                  Meet your new
                  <br />
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
                    AI Executive Assistant
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
                >
                  Aria learns your workflow, manages your communications, and helps you focus on what matters most.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center gap-4 mb-16"
                >
                  <Button 
                    size="lg" 
                    onClick={handleNext}
                    className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90 shadow-xl shadow-primary/25 group"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    No credit card required
                  </p>
                </motion.div>

                {/* Features grid */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                >
                  {features.map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 mx-auto group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="font-semibold text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-16 flex items-center justify-center gap-8"
                >
                  <div className="flex -space-x-3">
                    {[avatarSydney, avatarVictoria, avatarSarah, avatarMei].map((img, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Loved by executives worldwide</p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 1: Avatar Selection */}
            {currentStep === 1 && (
              <motion.div
                key="avatar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4"
                  >
                    <User className="w-3.5 h-3.5 text-violet-500" />
                    <span className="text-xs font-medium text-violet-500">Step 2 of 5</span>
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-3">Choose Your AI Partner</h2>
                  <p className="text-muted-foreground text-lg">Select an avatar that resonates with your working style</p>
                </div>

                {/* Avatar cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {mainAvatars.map((avatar, i) => (
                    <motion.button
                      key={avatar.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedAvatarLocal(avatar.id)}
                      className={cn(
                        "relative group rounded-3xl overflow-hidden transition-all duration-300",
                        selectedAvatarId === avatar.id 
                          ? "ring-4 ring-primary ring-offset-4 ring-offset-background scale-[1.02]" 
                          : "hover:scale-[1.02]"
                      )}
                    >
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img
                          src={avatar.image}
                          alt={avatar.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Gradient overlay */}
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"
                        )} />
                        
                        {/* Play button on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                          >
                            <Play className="w-6 h-6 text-foreground ml-1" />
                          </motion.div>
                        </div>

                        {/* Selection indicator */}
                        {selectedAvatarId === avatar.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
                          >
                            <Check className="w-6 h-6 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                        <div className={cn(
                          "inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2 bg-gradient-to-r text-white",
                          avatar.gradient
                        )}>
                          {avatar.style}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{avatar.name}</h3>
                        <p className="text-white/80 text-sm">{avatar.personality}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Coming soon */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {comingSoonAvatars.map((avatar) => (
                        <div key={avatar.id} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden opacity-60 grayscale">
                          <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" />
                        6+ more avatars coming soon
                      </p>
                      <p className="text-xs text-muted-foreground">New personalities & specializations</p>
                    </div>
                  </div>
                  <Badge variant="outline">Coming Q1 2025</Badge>
                </motion.div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-10">
                  <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button onClick={handleNext} size="lg" className="gap-2 px-8 rounded-full">
                    Continue with {selectedAvatar?.name}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Connect Sources */}
            {currentStep === 2 && (
              <motion.div
                key="sources"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl"
              >
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4"
                  >
                    <Link2 className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="text-xs font-medium text-cyan-500">Step 3 of 5</span>
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-3">Connect Your World</h2>
                  <p className="text-muted-foreground text-lg">Link your tools so Aria can help manage everything</p>
                </div>

                <div className="space-y-3 mb-8">
                  {mockSources.map((source, i) => (
                    <motion.button
                      key={source.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => toggleSource(source.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left group",
                        connectedSources.includes(source.id) 
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <span className="text-3xl">{source.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{source.name}</p>
                        <p className="text-sm text-muted-foreground">{source.desc}</p>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        connectedSources.includes(source.id) 
                          ? "border-primary bg-primary" 
                          : "border-muted-foreground/30"
                      )}>
                        {connectedSources.includes(source.id) && (
                          <Check className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-sm text-muted-foreground mb-8"
                >
                  <Shield className="w-4 h-4 inline mr-1" />
                  Your data is encrypted and never shared. <a href="#" className="text-primary hover:underline">Learn more</a>
                </motion.p>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleNext}>
                      Skip for now
                    </Button>
                    <Button onClick={handleNext} size="lg" className="gap-2 px-8 rounded-full">
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Project Selection */}
            {currentStep === 3 && (
              <motion.div
                key="project"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl"
              >
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">Step 4 of 5</span>
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-3">Your First Project</h2>
                  <p className="text-muted-foreground text-lg">Select a project context to get started</p>
                </div>

                <div className="space-y-3 mb-8">
                  {projects.map((project, i) => (
                    <motion.button
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedProject(project.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left",
                        selectedProject === project.id 
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ 
                          backgroundColor: project.color === 'rose' ? 'hsl(350 89% 95%)' : 
                                          project.color === 'lavender' ? 'hsl(262 52% 95%)' : 
                                          project.color === 'sky' ? 'hsl(199 89% 95%)' : 'hsl(158 64% 95%)',
                          color: project.color === 'rose' ? 'hsl(350 89% 50%)' : 
                                 project.color === 'lavender' ? 'hsl(262 52% 50%)' : 
                                 project.color === 'sky' ? 'hsl(199 89% 40%)' : 'hsl(158 64% 40%)'
                        }}
                      >
                        <FolderPlus className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                      {selectedProject === project.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button onClick={handleNext} size="lg" className="gap-2 px-8 rounded-full">
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Priority Contacts */}
            {currentStep === 4 && (
              <motion.div
                key="contacts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl"
              >
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4"
                  >
                    <Users className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-xs font-medium text-rose-500">Final Step</span>
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-3">Priority Contacts</h2>
                  <p className="text-muted-foreground text-lg">Who matters most? Aria will prioritize their messages.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {contacts.slice(0, 6).map((contact, i) => (
                    <motion.button
                      key={contact.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => toggleContact(contact.id)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left",
                        selectedContacts.includes(contact.id) 
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-lg font-semibold">
                        {contact.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{contact.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{contact.role}</p>
                      </div>
                      {selectedContacts.includes(contact.id) && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mb-8"
                >
                  <p className="text-sm text-muted-foreground">
                    {selectedContacts.length} contacts selected • You can always change this later
                  </p>
                </motion.div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    size="lg" 
                    className="gap-2 px-8 rounded-full bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90 shadow-xl shadow-primary/25"
                  >
                    Launch Aria
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our <a href="#" className="underline hover:text-foreground">Terms</a> and <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
