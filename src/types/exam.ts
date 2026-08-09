export type Board = 'Sindh Board' | 'Federal Board' | 'Punjab Board' | 'KPK Board' | 'Balochistan Board';

export type ClassLevel = '9' | '10' | '11' | '12';

export interface Subject {
  id: string;
  name: string;
  code: string;
  icon: string;
  chaptersCount: number;
  totalQuestions: number;
  color: string;
  description: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  chapterNumber: number;
  name: string;
  totalQuestions: number;
  description: string;
}

export interface Topic {
  id: string;
  chapterId: string;
  subjectId: string;
  name: string;
  description: string;
}

export interface Question {
  id: string;
  board: Board;
  classLevel: ClassLevel;
  subjectId: string;
  chapterId: string;
  topicId: string;
  topicName: string;
  questionText: string;
  options: [string, string, string, string];
  correctOptionIndex: number; // 0, 1, 2, 3
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  year?: string;
}

export interface UserProfile {
  name: string;
  board: Board;
  classLevel: ClassLevel;
  selectedSubjectIds: string[];
  todayGoal: number;
  todayCompleted: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  hasCompletedOnboarding: boolean;
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  question: Question;
  studentAnswerIndex: number;
  timestamp: string;
  reviewCount: number;
  mastered: boolean;
}

export interface TopicAccuracy {
  topicId: string;
  topicName: string;
  subjectId: string;
  chapterId: string;
  attempted: number;
  correct: number;
  accuracyPercent: number;
  status: 'Needs Practice' | 'Improving' | 'Strong';
}

export interface TestSession {
  id: string;
  title: string;
  mode: 'topic' | 'random' | 'weak_topics' | 'mistakes' | 'mock_exam';
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  questions: Question[];
  userAnswers: Record<string, number>; // questionId -> selected option index
  flaggedQuestionIds: string[];
  timeSpentSeconds: number;
  timeLimitSeconds?: number;
  startedAt: string;
  completedAt?: string;
  score?: number;
  total?: number;
}

export interface MockExamConfig {
  subjectId: string;
  questionCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  timeLimitMinutes: number;
}

export interface PerformanceStats {
  overallAccuracy: number;
  questionsAttempted: number;
  questionsCorrect: number;
  streakDays: number;
  mockTestsCompleted: number;
  weeklyActivity: { day: string; count: number; accuracy: number }[];
  subjectProgress: {
    subjectId: string;
    subjectName: string;
    attempted: number;
    correct: number;
    accuracy: number;
    totalQuestions: number;
  }[];
  mockExamHistory: {
    id: string;
    subjectName: string;
    score: number;
    total: number;
    accuracy: number;
    date: string;
  }[];
}
