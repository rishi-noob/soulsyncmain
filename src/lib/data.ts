import { UserRole } from "@/context/auth-context";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  streak: number;
  focusPoints: number;
  treesPlanted: number;
};

export type Thread = {
  id: string;
  title: string;
  authorHash: string;
  createdAt: string;
  messageCount: number;
  isClosed: boolean;
};

export type Message = {
  id:string;
  threadId: string;
  authorHash: string;
  authorAvatar: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
};

export type MoodEntry = {
  date: string;
  intensity: number; // 1-5 scale for heatmap
};

export type AcademicEvent = {
  id: string;
  title: string;
  date: Date;
  type: "exam" | "assignment" | "presentation" | "other";
  notes?: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  formatType: 'gratitude' | 'proud_list' | 'free_form';
  content: string;
}

export const mockUsers: Record<string, User> = {
  "user-1": {
    id: "user-1",
    name: "Alex Doe",
    email: "alex.doe@example.com",
    avatarUrl: "https://picsum.photos/seed/avatar1/100/100",
    role: "student",
    streak: 0,
    focusPoints: 0,
    treesPlanted: 0,
  },
  "user-2": {
    id: "user-2",
    name: "Sam Smith",
    email: "sam.smith@example.com",
    avatarUrl: "https://picsum.photos/seed/avatar2/100/100",
    role: "volunteer",
    streak: 0,
    focusPoints: 0,
    treesPlanted: 0,
  },
  "user-3": {
    id: "user-3",
    name: "Casey Jones",
    email: "casey.jones@example.com",
    avatarUrl: "https://picsum.photos/seed/avatar3/100/100",
    role: "admin",
    streak: 0,
    focusPoints: 0,
    treesPlanted: 0,
  },
  "user-rishabh": {
    id: "user-rishabh",
    name: "Rishabh Sharma",
    email: "rishisahab@gmail.com",
    avatarUrl: "https://picsum.photos/seed/rishabh/100/100",
    role: "student",
    streak: 15,
    focusPoints: 256,
    treesPlanted: 8,
  }
};

export const mockThreads: Thread[] = [
  { id: 'thread-1', title: "Struggling with exam stress", authorHash: "Student_1a2b", createdAt: "2 days ago", messageCount: 15, isClosed: false },
  { id: 'thread-2', title: "How do you handle social anxiety?", authorHash: "Student_3c4d", createdAt: "5 days ago", messageCount: 8, isClosed: false },
  { id: 'thread-3', title: "Positive things that happened this week", authorHash: "Student_5e6f", createdAt: "1 week ago", messageCount: 22, isClosed: false },
  { id: 'thread-4', title: "Just need to vent (closed)", authorHash: "Student_7g8h", createdAt: "2 weeks ago", messageCount: 5, isClosed: true },
];

export const mockMessages: Message[] = [
  { id: 'msg-1', threadId: 'thread-1', authorHash: "Student_1a2b", authorAvatar: mockUsers['user-1'].avatarUrl, authorRole: 'student', text: "I have 3 exams next week and I'm feeling so overwhelmed. Any tips on how to manage the stress?", createdAt: "2 days ago" },
  { id: 'msg-2', threadId: 'thread-1', authorHash: "Volunteer_9i0j", authorAvatar: mockUsers['user-2'].avatarUrl, authorRole: 'volunteer', text: "Hey! It's completely normal to feel that way. Make sure you're taking short breaks. The Pomodoro technique can be really helpful. There's a great tool for it in this app!", createdAt: "2 days ago" },
  { id: 'msg-3', threadId: 'thread-1', authorHash: "Student_3c4d", authorAvatar: "https://picsum.photos/seed/avatar4/100/100", authorRole: 'student', text: "I find that breaking down my study material into smaller chunks makes it less daunting. And lots of tea!", createdAt: "1 day ago" },
];

export const mockMoodData: MoodEntry[] = Array.from({ length: 90 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return {
    date: date.toISOString().split('T')[0],
    intensity: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : 0,
  };
}).reverse();

export const mockAcademicEvents: AcademicEvent[] = [
  { id: 'event-1', title: "Psychology Midterm", date: new Date(new Date().setDate(new Date().getDate() + 5)), type: "exam" },
  { id: 'event-2', title: "History Essay Due", date: new Date(new Date().setDate(new Date().getDate() + 10)), type: "assignment" },
  { id: 'event-3', title: "Group Project Presentation", date: new Date(new Date().setDate(new Date().getDate() + 18)), type: "presentation" },
];

export const mockJournalEntries: JournalEntry[] = [
  { id: 'journal-1', date: "3 days ago", formatType: 'gratitude', content: '1. The warm sun today.\n2. A nice chat with a friend.\n3. Finishing a difficult chapter.\n4. A delicious dinner.\n5. Listening to my favorite song.'},
  { id: 'journal-2', date: "1 day ago", formatType: 'free_form', content: 'Felt a bit down today, but pushing through. I think the upcoming deadlines are getting to me. I should probably use the focus tool tomorrow and get a head start.'},
]

export const mockAdminStats = {
  moodTrends: [
    { name: 'Jan', mood: 2.8 },
    { name: 'Feb', mood: 3.2 },
    { name: 'Mar', mood: 3.1 },
    { name: 'Apr', mood: 3.5 },
    { name: 'May', mood: 3.8 },
    { name: 'Jun', mood: 3.6 },
  ],
  chatbotUsage: [
    { name: 'Jan', usage: 120 },
    { name: 'Feb', usage: 150 },
    { name: 'Mar', usage: 180 },
    { name: 'Apr', usage: 210 },
    { name: 'May', usage: 250 },
    { name: 'Jun', usage: 230 },
  ],
  forumActivity: [
    { name: 'Jan', posts: 300 },
    { name: 'Feb', posts: 350 },
    { name: 'Mar', posts: 400 },
    { name: 'Apr', posts: 420 },
    { name: 'May', posts: 480 },
    { name: 'Jun', posts: 450 },
  ],
};
