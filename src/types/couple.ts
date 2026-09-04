export type PartnerId = 'partner1' | 'partner2';

export interface Partner {
  id: PartnerId;
  name: string;
  avatar: string; // Emoji, avatar image or illustration
  location: string;
  timezone: string;
  statusMessage: string;
  currentMood: {
    emoji: string;
    label: string;
    energy: number; // 0-100
    note: string;
    updatedAt: string;
    color: string;
  };
}

export interface LoveNote {
  id: string;
  from: PartnerId;
  text: string;
  sticker?: string;
  createdAt: string;
  isRead: boolean;
}

export interface InteractionEvent {
  id: string;
  from: PartnerId;
  type: 'hug' | 'kiss' | 'poke' | 'miss_you' | 'heart_bomb';
  createdAt: string;
  message?: string;
}

export interface CoupleState {
  partner1: Partner;
  partner2: Partner;
  activePartnerId: PartnerId;
  relationshipStartDate: string; // ISO date string
  nextMeetupDate: string | null; // ISO date string
  loveCoins: number; // Hearts earned
  level: number;
  experience: number;
  streakDays: number;
  loveNotes: LoveNote[];
  recentInteractions: InteractionEvent[];
}
