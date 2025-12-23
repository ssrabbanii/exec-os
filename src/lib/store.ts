import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AppState, Contact, Message, CalendarEvent, Task, Project, 
  Document, Folder, Meeting, Notification, AIsuggestion,
  OnboardingState, UserSettings, AssistantMessage
} from './types';
import { initialAppState } from './mockData';

interface AppStore extends AppState {
  // Onboarding
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  setSelectedAvatar: (avatarId: string) => void;
  addConnectedSource: (sourceId: string) => void;
  setFirstProject: (projectId: string) => void;
  addPriorityContact: (contactId: string) => void;
  removePriorityContact: (contactId: string) => void;
  
  // Current context
  setCurrentProject: (projectId: string | null) => void;
  
  // Messages
  markMessageAsRead: (messageId: string) => void;
  
  // Tasks
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  addTask: (task: Task) => void;
  
  // Projects
  addProject: (project: Project) => void;
  
  // Folders & Documents
  addFolder: (folder: Folder) => void;
  addDocument: (document: Document) => void;
  
  // Calendar
  updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  resolveConflict: (eventId: string, newStart: Date, newEnd: Date) => void;
  
  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  addNotification: (notification: Notification) => void;
  
  // Suggestions
  acceptSuggestion: (suggestionId: string) => void;
  rejectSuggestion: (suggestionId: string) => void;
  
  // Meetings
  updateMeetingStatus: (meetingId: string, status: Meeting['status']) => void;
  confirmMinutes: (meetingId: string) => void;
  
  // Settings
  updateNotificationPreferences: (prefs: Partial<UserSettings['notificationPreferences']>) => void;
  
  // Demo
  resetDemoData: () => void;
  
  // Assistant
  assistantMessages: AssistantMessage[];
  assistantMode: 'avatar' | 'chat';
  setAssistantMode: (mode: 'avatar' | 'chat') => void;
  addAssistantMessage: (message: AssistantMessage) => void;
  clearAssistantMessages: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialAppState,
      assistantMessages: [],
      assistantMode: 'chat',
      
      // Onboarding
      setOnboardingStep: (step) => set((state) => ({
        onboarding: { ...state.onboarding, currentStep: step }
      })),
      
      completeOnboarding: () => set((state) => ({
        onboarding: { ...state.onboarding, completed: true }
      })),
      
      setSelectedAvatar: (avatarId) => set((state) => ({
        onboarding: { ...state.onboarding, selectedAvatarId: avatarId },
        settings: { ...state.settings, selectedAvatarId: avatarId }
      })),
      
      addConnectedSource: (sourceId) => set((state) => ({
        onboarding: { 
          ...state.onboarding, 
          connectedSources: [...state.onboarding.connectedSources, sourceId] 
        }
      })),
      
      setFirstProject: (projectId) => set((state) => ({
        onboarding: { ...state.onboarding, firstProjectId: projectId }
      })),
      
      addPriorityContact: (contactId) => set((state) => ({
        onboarding: {
          ...state.onboarding,
          priorityContactIds: [...state.onboarding.priorityContactIds, contactId]
        }
      })),
      
      removePriorityContact: (contactId) => set((state) => ({
        onboarding: {
          ...state.onboarding,
          priorityContactIds: state.onboarding.priorityContactIds.filter(id => id !== contactId)
        }
      })),
      
      // Current context
      setCurrentProject: (projectId) => set({ currentProjectId: projectId }),
      
      // Messages
      markMessageAsRead: (messageId) => set((state) => ({
        messages: state.messages.map(m => 
          m.id === messageId ? { ...m, isRead: true } : m
        )
      })),
      
      // Tasks
      updateTaskStatus: (taskId, status) => set((state) => ({
        tasks: state.tasks.map(t => 
          t.id === taskId ? { 
            ...t, 
            status,
            completedAt: status === 'done' ? new Date() : undefined 
          } : t
        ),
        // Add notification if task completed
        notifications: status === 'done' ? [
          {
            id: `n-${Date.now()}`,
            type: 'task_completed' as const,
            title: 'Task Completed',
            message: `"${state.tasks.find(t => t.id === taskId)?.title}" has been completed`,
            timestamp: new Date(),
            isRead: false,
          },
          ...state.notifications
        ] : state.notifications
      })),
      
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),
      
      // Projects
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),
      
      // Folders & Documents
      addFolder: (folder) => set((state) => ({
        folders: [...state.folders, folder]
      })),
      
      addDocument: (document) => set((state) => ({
        documents: [...state.documents, document]
      })),
      
      // Calendar
      updateCalendarEvent: (eventId, updates) => set((state) => ({
        calendar: state.calendar.map(e => 
          e.id === eventId ? { ...e, ...updates } : e
        )
      })),
      
      resolveConflict: (eventId, newStart, newEnd) => set((state) => ({
        calendar: state.calendar.map(e => 
          e.id === eventId ? { 
            ...e, 
            start: newStart, 
            end: newEnd,
            isConflict: false,
            conflictWith: undefined
          } : e
        )
      })),
      
      // Notifications
      markNotificationAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
      })),
      
      // Suggestions
      acceptSuggestion: (suggestionId) => set((state) => ({
        suggestions: state.suggestions.map(s => 
          s.id === suggestionId ? { ...s, accepted: true } : s
        )
      })),
      
      rejectSuggestion: (suggestionId) => set((state) => ({
        suggestions: state.suggestions.filter(s => s.id !== suggestionId)
      })),
      
      // Meetings
      updateMeetingStatus: (meetingId, status) => set((state) => ({
        meetings: state.meetings.map(m => 
          m.id === meetingId ? { ...m, status } : m
        )
      })),
      
      confirmMinutes: (meetingId) => set((state) => ({
        meetings: state.meetings.map(m => 
          m.id === meetingId && m.minutes ? { 
            ...m, 
            minutes: { ...m.minutes, isConfirmed: true } 
          } : m
        )
      })),
      
      // Settings
      updateNotificationPreferences: (prefs) => set((state) => ({
        settings: {
          ...state.settings,
          notificationPreferences: { ...state.settings.notificationPreferences, ...prefs }
        }
      })),
      
      // Demo
      resetDemoData: () => set({
        ...initialAppState,
        assistantMessages: [],
        assistantMode: 'chat',
      }),
      
      // Assistant
      setAssistantMode: (mode) => set({ assistantMode: mode }),
      
      addAssistantMessage: (message) => set((state) => ({
        assistantMessages: [...state.assistantMessages, message]
      })),
      
      clearAssistantMessages: () => set({ assistantMessages: [] }),
    }),
    {
      name: 'exec-assistant-storage',
      partialize: (state) => ({
        onboarding: state.onboarding,
        settings: state.settings,
        currentProjectId: state.currentProjectId,
        messages: state.messages,
        tasks: state.tasks,
        notifications: state.notifications,
        suggestions: state.suggestions,
        meetings: state.meetings,
        calendar: state.calendar,
        assistantMessages: state.assistantMessages,
        assistantMode: state.assistantMode,
      }),
    }
  )
);
