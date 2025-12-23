import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Volume2, Check, Clock, Globe, Palette, Lock } from 'lucide-react';

// Avatar images imports - Main 3 avatars
import avatarSydney from '@/assets/avatars/avatar-sydney.jpeg';
import avatarVictoria from '@/assets/avatars/avatar-victoria.jpg';
import avatarSarah from '@/assets/avatars/avatar-sarah.jpeg';

// Coming soon avatars (using existing images)
import avatarMei from '@/assets/avatars/avatar-mei.png';
import avatarSophia from '@/assets/avatars/avatar-sophia.png';
import avatarElena from '@/assets/avatars/avatar-elena.png';
import avatarPriya from '@/assets/avatars/avatar-priya.png';
import avatarMichelle from '@/assets/avatars/avatar-michelle.png';
import avatarIsabella from '@/assets/avatars/avatar-isabella.png';

export interface AvatarOption {
  id: string;
  name: string;
  image: string;
  personality: string;
  style: string;
  isNew?: boolean;
  comingSoon?: boolean;
  videoIntro?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  accent: string;
  tone: string;
  speed: 'slow' | 'normal' | 'fast';
}

export interface AvatarCustomization {
  avatarId: string;
  voiceId: string;
  speakingSpeed: number;
  responseLength: 'concise' | 'balanced' | 'detailed';
  personality: 'professional' | 'friendly' | 'casual';
  autoSpeak: boolean;
  language: string;
}

// Main 3 avatars - Available now
export const mainAvatars: AvatarOption[] = [
  {
    id: 'sydney',
    name: 'Sydney',
    image: avatarSydney,
    personality: 'Confident & Professional',
    style: 'Executive Partner',
    videoIntro: '/avatars/sydney-intro.mov',
  },
  {
    id: 'victoria',
    name: 'Victoria',
    image: avatarVictoria,
    personality: 'Confident & Direct',
    style: 'C-Suite Coach',
    videoIntro: '/avatars/victoria-intro.mov',
  },
  {
    id: 'sarah',
    name: 'Sarah',
    image: avatarSarah,
    personality: 'Warm & Strategic',
    style: 'Leadership Advisor',
    videoIntro: '/avatars/sarah-intro.mov',
  },
];

// Coming soon avatars with lock
export const comingSoonAvatars: AvatarOption[] = [
  {
    id: 'mei',
    name: 'Mei',
    image: avatarMei,
    personality: 'Professional & Precise',
    style: 'Executive Assistant',
    comingSoon: true,
  },
  {
    id: 'sophia',
    name: 'Sophia',
    image: avatarSophia,
    personality: 'Warm & Supportive',
    style: 'Strategic Advisor',
    comingSoon: true,
  },
  {
    id: 'elena',
    name: 'Elena',
    image: avatarElena,
    personality: 'Calm & Focused',
    style: 'Operations Expert',
    comingSoon: true,
  },
  {
    id: 'priya',
    name: 'Priya',
    image: avatarPriya,
    personality: 'Energetic & Insightful',
    style: 'Innovation Partner',
    comingSoon: true,
  },
  {
    id: 'michelle',
    name: 'Michelle',
    image: avatarMichelle,
    personality: 'Empathetic & Strategic',
    style: 'Leadership Advisor',
    comingSoon: true,
  },
  {
    id: 'isabella',
    name: 'Isabella',
    image: avatarIsabella,
    personality: 'Dynamic & Results-driven',
    style: 'Growth Strategist',
    comingSoon: true,
  },
];

const voiceOptions: VoiceOption[] = [
  { id: 'v1', name: 'Clara', accent: 'American', tone: 'Professional', speed: 'normal' },
  { id: 'v2', name: 'Sophie', accent: 'British', tone: 'Sophisticated', speed: 'normal' },
  { id: 'v3', name: 'Aria', accent: 'Australian', tone: 'Friendly', speed: 'normal' },
  { id: 'v4', name: 'Luna', accent: 'American', tone: 'Warm', speed: 'slow' },
  { id: 'v5', name: 'Nova', accent: 'International', tone: 'Neutral', speed: 'fast' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Mandarin' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
];

interface AvatarSelectorProps {
  selectedAvatarId: string;
  onSelectAvatar: (avatarId: string) => void;
  customization?: AvatarCustomization;
  onCustomizationChange?: (customization: AvatarCustomization) => void;
  compact?: boolean;
  showVoiceOptions?: boolean;
}

export function AvatarSelector({
  selectedAvatarId,
  onSelectAvatar,
  customization,
  onCustomizationChange,
  compact = false,
  showVoiceOptions = true,
}: AvatarSelectorProps) {
  const [activeTab, setActiveTab] = useState('avatars');
  const selectedAvatar = mainAvatars.find(a => a.id === selectedAvatarId);

  const defaultCustomization: AvatarCustomization = {
    avatarId: selectedAvatarId,
    voiceId: 'v1',
    speakingSpeed: 50,
    responseLength: 'balanced',
    personality: 'professional',
    autoSpeak: true,
    language: 'en',
    ...customization,
  };

  const handleCustomizationUpdate = (updates: Partial<AvatarCustomization>) => {
    if (onCustomizationChange) {
      onCustomizationChange({ ...defaultCustomization, ...updates });
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Main 3 Avatars */}
        <div className="grid grid-cols-3 gap-4">
          {mainAvatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => onSelectAvatar(avatar.id)}
              className={cn(
                "relative group rounded-2xl overflow-hidden border-2 transition-all duration-200 aspect-[3/4]",
                selectedAvatarId === avatar.id 
                  ? "border-primary ring-2 ring-primary/20 scale-105" 
                  : "border-border hover:border-primary/50 hover:scale-102"
              )}
            >
              <img
                src={avatar.image}
                alt={avatar.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-left">
                <p className="font-semibold text-white text-sm">{avatar.name}</p>
              </div>
              {selectedAvatarId === avatar.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
        
        {/* Coming Soon */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Lock className="w-3 h-3" /> More avatars coming soon
          </p>
          <div className="grid grid-cols-6 gap-2">
            {comingSoonAvatars.map((avatar) => (
              <div
                key={avatar.id}
                className="relative rounded-xl overflow-hidden border border-dashed border-muted opacity-50 aspect-square"
              >
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{selectedAvatar?.name || 'None'}</span>
          {selectedAvatar && ` • ${selectedAvatar.personality}`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="avatars" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Avatars
          </TabsTrigger>
          {showVoiceOptions && (
            <TabsTrigger value="voice" className="gap-2">
              <Volume2 className="w-4 h-4" />
              Voice
            </TabsTrigger>
          )}
          <TabsTrigger value="personality" className="gap-2">
            <Palette className="w-4 h-4" />
            Style
          </TabsTrigger>
        </TabsList>

        <TabsContent value="avatars" className="space-y-6">
          {/* Available Avatars - Main 3 */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Choose Your AI Assistant</h4>
            <div className="grid grid-cols-3 gap-4">
              {mainAvatars.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  onClick={() => onSelectAvatar(avatar.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative group rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left",
                    selectedAvatarId === avatar.id 
                      ? "border-primary ring-4 ring-primary/20" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-semibold text-white text-xl">{avatar.name}</p>
                    <p className="text-white/80 text-sm">{avatar.personality}</p>
                    <p className="text-white/60 text-xs">{avatar.style}</p>
                  </div>
                  {selectedAvatarId === avatar.id && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">More Avatars Coming Soon</h4>
              <Badge variant="outline" className="text-xs">6+ new models</Badge>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {comingSoonAvatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className="relative rounded-2xl overflow-hidden border-2 border-dashed border-muted bg-muted/30 opacity-60 cursor-not-allowed"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div className="absolute inset-0 bg-background/40 flex flex-col items-center justify-center">
                    <Lock className="w-6 h-6 text-muted-foreground mb-1" />
                    <p className="text-xs font-medium text-muted-foreground">{avatar.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              We're constantly adding new avatar models with diverse appearances, personalities, and specializations.
            </p>
          </div>
        </TabsContent>

        {showVoiceOptions && (
          <TabsContent value="voice" className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Voice Selection</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {voiceOptions.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => handleCustomizationUpdate({ voiceId: voice.id })}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      defaultCustomization.voiceId === voice.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{voice.name}</p>
                      <p className="text-xs text-muted-foreground">{voice.accent} • {voice.tone}</p>
                    </div>
                    {defaultCustomization.voiceId === voice.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-3 block">Speaking Speed</Label>
                <Slider
                  value={[defaultCustomization.speakingSpeed]}
                  onValueChange={([value]) => handleCustomizationUpdate({ speakingSpeed: value })}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Slower</span>
                  <span>Normal</span>
                  <span>Faster</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Auto-speak Responses</Label>
                  <p className="text-xs text-muted-foreground">Avatar speaks responses automatically</p>
                </div>
                <Switch
                  checked={defaultCustomization.autoSpeak}
                  onCheckedChange={(checked) => handleCustomizationUpdate({ autoSpeak: checked })}
                />
              </div>
            </div>
          </TabsContent>
        )}

        <TabsContent value="personality" className="space-y-6">
          <div>
            <Label className="text-sm mb-3 block">Language</Label>
            <Select
              value={defaultCustomization.language}
              onValueChange={(value) => handleCustomizationUpdate({ language: value })}
            >
              <SelectTrigger className="w-full">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm mb-3 block">Communication Style</Label>
            <div className="grid grid-cols-3 gap-3">
              {(['professional', 'friendly', 'casual'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => handleCustomizationUpdate({ personality: style })}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-center capitalize",
                    defaultCustomization.personality === style 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <p className="font-medium">{style}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {style === 'professional' && 'Formal & precise'}
                    {style === 'friendly' && 'Warm & approachable'}
                    {style === 'casual' && 'Relaxed & conversational'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm mb-3 block">Response Length</Label>
            <div className="grid grid-cols-3 gap-3">
              {(['concise', 'balanced', 'detailed'] as const).map((length) => (
                <button
                  key={length}
                  onClick={() => handleCustomizationUpdate({ responseLength: length })}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-center capitalize",
                    defaultCustomization.responseLength === length 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <p className="font-medium">{length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {length === 'concise' && 'Brief answers'}
                    {length === 'balanced' && 'Standard detail'}
                    {length === 'detailed' && 'In-depth responses'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Avatar Preview */}
      {selectedAvatar && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <img
            src={selectedAvatar.image}
            alt={selectedAvatar.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold">{selectedAvatar.name}</p>
            <p className="text-sm text-muted-foreground">{selectedAvatar.personality}</p>
            <p className="text-xs text-muted-foreground">{selectedAvatar.style}</p>
          </div>
          <Badge className="bg-primary">Active</Badge>
        </div>
      )}
    </div>
  );
}
