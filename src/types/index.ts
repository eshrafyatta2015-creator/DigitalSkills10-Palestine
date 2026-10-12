export interface Term {
  term: string;
  definition: string;
}

export interface Objective {
  text: string;
}

export interface BookQuestion {
  id: string;
  type: 'mcq' | 'open' | 'compare' | 'complete' | 'error-fix' | 'code' | 'design' | 'truefalse';
  prompt: string;
  options?: string[];
  correct?: number | number[];
  answer?: string;
  answerSource: 'book' | 'teacher-model' | 'review-needed';
  note?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string[];
}

export interface Lesson {
  id: string;
  unitId: string;
  number: number;
  title: string;
  bookPage: number;
  summary: string;
  objectives: Objective[];
  terms: Term[];
  sections: LessonSection[];
  examples: string[];
  bookActivities: string[];
  bookQuestions: BookQuestion[];
  commonMistakes: string[];
  enrichment: string[];
  criticalThinking: string[];
  quiz: QuizQuestion[];
  sources: string[];
  needsReview: string[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  bookPages: [number, number];
  summary: string;
  intro?: string[];
  keywords: string[];
  lessonIds: string[];
  color: string;
}

export interface ProgressState {
  completedLessons: string[];
  completedQuizzes: Record<string, number>;
  lastVisited: string | null;
}
