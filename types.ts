
export enum Difficulty {
  Simple = 'Simple',
  Medium = 'Medium',
  Hard = 'Hard',
  Conceptual = 'Conceptual',
  Important = 'Important'
}

export type ViewMode = 'generator' | 'chat' | 'about' | 'admin';

export interface AdminConfig {
  ownerName: string;
  ownerBio: string;
  profileImage: string;
}

export interface QuestionConfig {
  mcqCount: number;
  shortQCount: number;
  longQCount: number;
  tfCount: number;
  blankCount: number;
  essayCount: number;
  matchCount: number;
  difficulty: Difficulty;
  topicFocus: string;
  pdfSubtitle?: string;
  examName?: string;
  watermarkText?: string;
  watermarkOpacity?: number; // 0 to 1
}

export interface BaseQuestion {
  isFlagged?: boolean; // For Review Mode
}

export interface MCQ extends BaseQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface ShortQuestion extends BaseQuestion {
  question: string;
  answerKey: string;
}

export interface LongQuestion extends BaseQuestion {
  question: string;
  answerKey: string;
}

export interface TrueFalse extends BaseQuestion {
  statement: string;
  isTrue: boolean;
}

export interface FillInBlank extends BaseQuestion {
  sentence: string; 
  answer: string;
}

export interface EssayQuestion extends BaseQuestion {
  question: string;
  keyPoints: string;
}

export interface MatchingPair {
  item: string;
  match: string;
}

export interface MatchingQuestion extends BaseQuestion {
  pairs: MatchingPair[];
}

export interface TestData {
  title: string;
  subtitle?: string;
  mcqs: MCQ[];
  shortQuestions: ShortQuestion[];
  longQuestions: LongQuestion[];
  trueFalse: TrueFalse[];
  fillInBlanks: FillInBlank[];
  essays: EssayQuestion[];
  matching: MatchingQuestion[];
}

export interface FileData {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
