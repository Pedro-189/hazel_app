import { PartnerId } from './couple';

export type QuestionCategory = 
  | 'intimacy' 
  | 'dreams' 
  | 'memories' 
  | 'deep' 
  | 'fun' 
  | 'spicy'
  | 'custom';

export interface Question {
  id: string;
  category: QuestionCategory;
  title: string;
  prompt: string;
  categoryLabel: string;
  categoryEmoji: string;
  accentColor: string;
  isCustom?: boolean;
  createdBy?: PartnerId;
  rewardHearts: number;
}

export interface QuestionAnswerRecord {
  id: string;
  questionId: string;
  partner1Answer?: string;
  partner1AnsweredAt?: string;
  partner2Answer?: string;
  partner2AnsweredAt?: string;
  isRevealed: boolean;
  revealedAt?: string;
  reactions: {
    partner1Emoji?: string;
    partner2Emoji?: string;
  };
  rewardClaimed: boolean;
  notes?: string;
}

export interface QAState {
  dailyQuestionId: string;
  activeDeckCategory: QuestionCategory | 'all';
  records: Record<string, QuestionAnswerRecord>; // keyed by questionId
  customQuestions: Question[];
}
