import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Check, ArrowRight, ArrowLeft, User, Link2, FolderPlus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvatarSelector } from '@/components/avatar/AvatarSelector';

const steps = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'avatar', title: 'Choose Avatar', icon: User },
  { id: 'sources', title: 'Connect Sources', icon: Link2 },
  { id: 'project', title: 'First Project', icon: FolderPlus },
  { id: 'contacts', title: 'Priority Contacts', icon: Users },
];

const mockSources = [
  { id: 'gmail', name: 'Gmail', icon: '📧' },
  { id: 'gcal', name: 'Google Calendar', icon: '📅' },
  { id: 'gdrive', name: 'Google Drive', icon: '📁' },
  { id: 'teams', name: 'Microsoft Teams', icon: '💬' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '📱' },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const { contacts, projects, setSelectedAvatar, addConnectedSource, addPriorityContact, completeOnboarding } = useAppStore();
  const [selectedAvatarId, setSelectedAvatarLocal] = useState('mei');
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <div key={step.id} className={cn("w-2 h-2 rounded-full transition-all", i === currentStep ? "w-8 bg-primary" : i < currentStep ? "bg-primary" : "bg-border")} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <Card className="p-8">
              {currentStep === 0 && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-display text-3xl font-bold mb-2">Welcome to Aria</h1>
                    <p className="text-muted-foreground">Your AI-powered executive assistant. Let's get you set up in a few quick steps.</p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-display text-2xl font-bold mb-2">Choose Your Avatar</h2>
                    <p className="text-muted-foreground">Select an AI assistant that matches your style</p>
                  </div>
                  <AvatarSelector
                    selectedAvatarId={selectedAvatarId}
                    onSelectAvatar={setSelectedAvatarLocal}
                    compact={false}
                    showVoiceOptions={false}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-display text-2xl font-bold mb-2">Connect Your Sources</h2>
                    <p className="text-muted-foreground">Link your email, calendar, and files (mock connection)</p>
                  </div>
                  <div className="space-y-3">
                    {mockSources.map((source) => (
                      <button key={source.id} onClick={() => toggleSource(source.id)} className={cn("w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all", connectedSources.includes(source.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                        <span className="text-2xl">{source.icon}</span>
                        <span className="font-medium flex-1 text-left">{source.name}</span>
                        {connectedSources.includes(source.id) && <Check className="w-5 h-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-display text-2xl font-bold mb-2">Your First Project</h2>
                    <p className="text-muted-foreground">We've detected some projects. Select one to start with.</p>
                  </div>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <button key={project.id} onClick={() => setSelectedProject(project.id)} className={cn("w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left", selectedProject === project.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                        <div className={cn("w-3 h-3 rounded-full", `bg-${project.color}`)} style={{ backgroundColor: project.color === 'rose' ? 'hsl(350 89% 60%)' : project.color === 'lavender' ? 'hsl(262 52% 64%)' : project.color === 'sky' ? 'hsl(199 89% 48%)' : 'hsl(158 64% 52%)' }} />
                        <div className="flex-1">
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                        {selectedProject === project.id && <Check className="w-5 h-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-display text-2xl font-bold mb-2">Priority Contacts</h2>
                    <p className="text-muted-foreground">Select key people for priority handling</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-auto">
                    {contacts.slice(0, 6).map((contact) => (
                      <button key={contact.id} onClick={() => toggleContact(contact.id)} className={cn("flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left", selectedContacts.includes(contact.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">{contact.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{contact.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 0}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
