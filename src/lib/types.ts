// Core types for the Executive Personal Assistant

export type Priority = 'high' | 'medium' | 'low';
export type MessageChannel = 'email' | 'whatsapp' | 'slack' | 'teams';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type MeetingStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
export type ConnectorStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  isPriority: boolean;
  avatar?: string;
}

export interface Message {
  id: string;
  from: Contact;
  to: Contact[];
  subject: string;
  preview: string;
  body: string;
  channel: MessageChannel;
  projectId?: string;
  priority: Priority;
  priorityReason?: string;
  timestamp: Date;
  isRead: boolean;
  hasAttachments: boolean;
  threadId: string;
  suggestedReplies?: string[];
}

export interface MessageThread {
  id: string;
  messages: Message[];
  subject: string;
  participants: Contact[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  participants: Contact[];
  projectId?: string;
  meetingId?: string;
  isConflict?: boolean;
  conflictWith?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  projectId: string;
  assignee?: Contact;
  createdAt: Date;
  completedAt?: Date;
  sourceType?: 'meeting' | 'email' | 'manual';
  sourceId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  color: string;
  participants: Contact[];
  createdAt: Date;
}

export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'folder';
  folderId?: string;
  projectId?: string;
  lastUpdated: Date;
  size?: string;
  preview?: string;
  tags: string[];
  linkedContacts: string[];
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  projectId?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  participants: Contact[];
  projectId?: string;
  status: MeetingStatus;
  transcript?: TranscriptEntry[];
  minutes?: MeetingMinutes;
  actionItems?: Task[];
  followUpDrafts?: FollowUpDraft[];
}

export interface TranscriptEntry {
  speaker: string;
  text: string;
  timestamp: number;
}

export interface MeetingMinutes {
  agenda: string[];
  discussion: string[];
  decisions: string[];
  risks: string[];
  nextSteps: string[];
  isConfirmed: boolean;
}

export interface FollowUpDraft {
  id: string;
  type: 'email' | 'message' | 'note';
  title: string;
  content: string;
  recipient?: Contact;
}

export interface Notification {
  id: string;
  type: 'meeting_reminder' | 'critical_message' | 'task_deadline' | 'task_completed' | 'daily_summary';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  contextBriefing?: string;
}

export interface AIsuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  projectId?: string;
  meetingId?: string;
  messageId?: string;
  artifactType?: 'draft' | 'task' | 'reminder';
  accepted?: boolean;
}

export interface Connector {
  id: string;
  name: string;
  type: 'gmail' | 'outlook' | 'whatsapp' | 'gdrive' | 'onedrive' | 'slack' | 'teams';
  status: ConnectorStatus;
  lastSync?: Date;
  icon: string;
}

export interface Avatar {
  id: string;
  name: string;
  imageUrl: string;
  voiceId?: string;
}

export interface UserSettings {
  selectedAvatarId: string;
  notificationPreferences: {
    desktop: boolean;
    mobile: boolean;
    dailySummary: boolean;
    meetingReminder15min: boolean;
    meetingReminder5min: boolean;
    criticalMessages: boolean;
  };
  connectors: Connector[];
}

export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  selectedAvatarId?: string;
  connectedSources: string[];
  firstProjectId?: string;
  priorityContactIds: string[];
}

export interface AppState {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onboarding: OnboardingState;
  settings: UserSettings;
  currentProjectId: string | null;
  contacts: Contact[];
  messages: Message[];
  threads: MessageThread[];
  calendar: CalendarEvent[];
  tasks: Task[];
  projects: Project[];
  documents: Document[];
  folders: Folder[];
  meetings: Meeting[];
  notifications: Notification[];
  suggestions: AIsuggestion[];
  avatars: Avatar[];
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: { type: string; name: string; id: string }[];
}
