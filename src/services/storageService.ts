import { INITIAL_CHAPTERS, INITIAL_QUESTIONS, INITIAL_SUBJECTS, INITIAL_TOPICS, INITIAL_USER_PROFILE } from '../data/mockData';
import { Chapter, MistakeRecord, PerformanceStats, Question, Subject, TestSession, Topic, TopicAccuracy, UserProfile } from '../types/exam';

const KEYS = {
  USER_PROFILE: 'exammate_user_profile',
  QUESTIONS: 'exammate_questions',
  SUBJECTS: 'exammate_subjects',
  CHAPTERS: 'exammate_chapters',
  TOPICS: 'exammate_topics',
  MISTAKES: 'exammate_mistakes',
  TOPIC_ACCURACY: 'exammate_topic_accuracy',
  TEST_SESSIONS: 'exammate_test_sessions',
};

// Helper for local storage
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// User Profile
export function getUserProfile(): UserProfile {
  return getItem<UserProfile>(KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
}

export function saveUserProfile(profile: UserProfile): void {
  setItem(KEYS.USER_PROFILE, profile);
}

// Educational Content (Questions, Subjects, Chapters, Topics)
export function getQuestions(): Question[] {
  return getItem<Question[]>(KEYS.QUESTIONS, INITIAL_QUESTIONS);
}

export function saveQuestions(questions: Question[]): void {
  setItem(KEYS.QUESTIONS, questions);
}

export function addQuestion(question: Question): Question[] {
  const list = getQuestions();
  const updated = [question, ...list];
  saveQuestions(updated);
  return updated;
}

export function updateQuestion(updatedQuestion: Question): Question[] {
  const list = getQuestions();
  const updated = list.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q));
  saveQuestions(updated);
  return updated;
}

export function deleteQuestion(id: string): Question[] {
  const list = getQuestions();
  const updated = list.filter((q) => q.id !== id);
  saveQuestions(updated);
  return updated;
}

export function getSubjects(): Subject[] {
  return getItem<Subject[]>(KEYS.SUBJECTS, INITIAL_SUBJECTS);
}

export function saveSubjects(subjects: Subject[]): void {
  setItem(KEYS.SUBJECTS, subjects);
}

export function getChapters(): Chapter[] {
  return getItem<Chapter[]>(KEYS.CHAPTERS, INITIAL_CHAPTERS);
}

export function saveChapters(chapters: Chapter[]): void {
  setItem(KEYS.CHAPTERS, chapters);
}

export function getTopics(): Topic[] {
  return getItem<Topic[]>(KEYS.TOPICS, INITIAL_TOPICS);
}

export function saveTopics(topics: Topic[]): void {
  setItem(KEYS.TOPICS, topics);
}

// Mistake Notebook
export function getMistakes(): MistakeRecord[] {
  return getItem<MistakeRecord[]>(KEYS.MISTAKES, []);
}

export function saveMistakes(mistakes: MistakeRecord[]): void {
  setItem(KEYS.MISTAKES, mistakes);
}

export function recordMistake(question: Question, studentAnswerIndex: number): MistakeRecord[] {
  const current = getMistakes();
  const existingIndex = current.findIndex((m) => m.questionId === question.id);

  let updated: MistakeRecord[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = {
      ...updated[existingIndex],
      studentAnswerIndex,
      timestamp: new Date().toISOString(),
      reviewCount: updated[existingIndex].reviewCount + 1,
      mastered: false,
    };
  } else {
    const newRecord: MistakeRecord = {
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      questionId: question.id,
      question,
      studentAnswerIndex,
      timestamp: new Date().toISOString(),
      reviewCount: 1,
      mastered: false,
    };
    updated = [newRecord, ...current];
  }
  saveMistakes(updated);
  return updated;
}

export function removeMistake(id: string): MistakeRecord[] {
  const current = getMistakes();
  const updated = current.filter((m) => m.id !== id);
  saveMistakes(updated);
  return updated;
}

// Topic Accuracy Engine
export function getTopicAccuracies(): TopicAccuracy[] {
  // Default mock accuracies if empty to showcase Weak Topics feature immediately
  const defaultAccuracies: TopicAccuracy[] = [
    {
      topicId: 'top_ac_gen',
      topicName: 'AC Generator',
      subjectId: 'sub_physics',
      chapterId: 'chap_phy_7',
      attempted: 12,
      correct: 5,
      accuracyPercent: 42,
      status: 'Needs Practice',
    },
    {
      topicId: 'top_em_ind',
      topicName: 'Electromagnetic Induction',
      subjectId: 'sub_physics',
      chapterId: 'chap_phy_6',
      attempted: 12,
      correct: 7,
      accuracyPercent: 58,
      status: 'Improving',
    },
    {
      topicId: 'top_curr_elec',
      topicName: 'Current Electricity',
      subjectId: 'sub_physics',
      chapterId: 'chap_phy_5',
      attempted: 16,
      correct: 13,
      accuracyPercent: 81,
      status: 'Strong',
    },
    {
      topicId: 'top_proj_motion',
      topicName: 'Projectile Motion',
      subjectId: 'sub_physics',
      chapterId: 'chap_phy_3',
      attempted: 10,
      correct: 5,
      accuracyPercent: 50,
      status: 'Needs Practice',
    },
    {
      topicId: 'top_mole_concept',
      topicName: 'Mole Concept & Avogadro Number',
      subjectId: 'sub_chemistry',
      chapterId: 'chap_chem_1',
      attempted: 14,
      correct: 11,
      accuracyPercent: 78,
      status: 'Strong',
    },
    {
      topicId: 'top_osi_model',
      topicName: 'OSI 7-Layer Reference Model',
      subjectId: 'sub_cs',
      chapterId: 'chap_cs_2',
      attempted: 15,
      correct: 13,
      accuracyPercent: 86,
      status: 'Strong',
    },
  ];

  return getItem<TopicAccuracy[]>(KEYS.TOPIC_ACCURACY, defaultAccuracies);
}

export function saveTopicAccuracies(list: TopicAccuracy[]): void {
  setItem(KEYS.TOPIC_ACCURACY, list);
}

export function recordQuestionAnswer(question: Question, isCorrect: boolean): void {
  const accuracies = getTopicAccuracies();
  const existingIndex = accuracies.findIndex((a) => a.topicId === question.topicId);

  let updated: TopicAccuracy[];
  if (existingIndex >= 0) {
    const existing = accuracies[existingIndex];
    const newAttempted = existing.attempted + 1;
    const newCorrect = existing.correct + (isCorrect ? 1 : 0);
    const newPercent = Math.round((newCorrect / newAttempted) * 100);

    let status: 'Needs Practice' | 'Improving' | 'Strong' = 'Improving';
    if (newPercent < 60) status = 'Needs Practice';
    else if (newPercent >= 80) status = 'Strong';

    updated = [...accuracies];
    updated[existingIndex] = {
      ...existing,
      attempted: newAttempted,
      correct: newCorrect,
      accuracyPercent: newPercent,
      status,
    };
  } else {
    const newPercent = isCorrect ? 100 : 0;
    const status = isCorrect ? 'Strong' : 'Needs Practice';
    const newItem: TopicAccuracy = {
      topicId: question.topicId,
      topicName: question.topicName,
      subjectId: question.subjectId,
      chapterId: question.chapterId,
      attempted: 1,
      correct: isCorrect ? 1 : 0,
      accuracyPercent: newPercent,
      status,
    };
    updated = [...accuracies, newItem];
  }

  saveTopicAccuracies(updated);

  // Increment today's completed count in profile
  const profile = getUserProfile();
  const today = new Date().toISOString().split('T')[0];
  const isNewDay = profile.lastActiveDate !== today;

  saveUserProfile({
    ...profile,
    todayCompleted: isNewDay ? 1 : profile.todayCompleted + 1,
    lastActiveDate: today,
  });
}

// Test Sessions
export function getTestSessions(): TestSession[] {
  return getItem<TestSession[]>(KEYS.TEST_SESSIONS, []);
}

export function saveTestSession(session: TestSession): TestSession[] {
  const sessions = getTestSessions();
  const updated = [session, ...sessions];
  setItem(KEYS.TEST_SESSIONS, updated);
  return updated;
}

// Performance Stats Calculation
export function getPerformanceStats(): PerformanceStats {
  const topicAccuracies = getTopicAccuracies();
  const sessions = getTestSessions();
  const subjects = getSubjects();
  const profile = getUserProfile();

  let totalAttempted = 0;
  let totalCorrect = 0;

  topicAccuracies.forEach((ta) => {
    totalAttempted += ta.attempted;
    totalCorrect += ta.correct;
  });

  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 74;

  const mockTestsCompleted = sessions.filter((s) => s.mode === 'mock_exam').length || 3;

  // Mock weekly activity if empty
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyActivity = days.map((day, idx) => ({
    day,
    count: [8, 12, 10, 15, 6, 14, 10][idx],
    accuracy: [70, 75, 80, 68, 85, 78, 82][idx],
  }));

  // Subject performance breakdown
  const subjectProgress = subjects.map((subj) => {
    const subjTopics = topicAccuracies.filter((ta) => ta.subjectId === subj.id);
    let sAttempted = 0;
    let sCorrect = 0;
    subjTopics.forEach((t) => {
      sAttempted += t.attempted;
      sCorrect += t.correct;
    });

    const acc = sAttempted > 0 ? Math.round((sCorrect / sAttempted) * 100) : subj.id === 'sub_physics' ? 72 : subj.id === 'sub_chemistry' ? 64 : 81;

    return {
      subjectId: subj.id,
      subjectName: subj.name,
      attempted: sAttempted || 25,
      correct: sCorrect || 18,
      accuracy: acc,
      totalQuestions: subj.totalQuestions,
    };
  });

  const mockExamHistory = sessions
    .filter((s) => s.mode === 'mock_exam' && s.completedAt)
    .map((s) => ({
      id: s.id,
      subjectName: subjects.find((sub) => sub.id === s.subjectId)?.name || 'Full Mock',
      score: s.score || 0,
      total: s.total || 0,
      accuracy: s.total ? Math.round(((s.score || 0) / s.total) * 100) : 0,
      date: s.completedAt ? new Date(s.completedAt).toLocaleDateString() : 'Today',
    }));

  if (mockExamHistory.length === 0) {
    mockExamHistory.push(
      { id: 'm1', subjectName: 'Physics', score: 24, total: 30, accuracy: 80, date: 'Yesterday' },
      { id: 'm2', subjectName: 'Chemistry', score: 18, total: 25, accuracy: 72, date: '3 days ago' },
      { id: 'm3', subjectName: 'Computer Science', score: 27, total: 30, accuracy: 90, date: '1 week ago' }
    );
  }

  return {
    overallAccuracy,
    questionsAttempted: totalAttempted || 79,
    questionsCorrect: totalCorrect || 58,
    streakDays: profile.streakDays || 5,
    mockTestsCompleted,
    weeklyActivity,
    subjectProgress,
    mockExamHistory,
  };
}

export function resetAllData(): void {
  localStorage.removeItem(KEYS.USER_PROFILE);
  localStorage.removeItem(KEYS.QUESTIONS);
  localStorage.removeItem(KEYS.SUBJECTS);
  localStorage.removeItem(KEYS.CHAPTERS);
  localStorage.removeItem(KEYS.TOPICS);
  localStorage.removeItem(KEYS.MISTAKES);
  localStorage.removeItem(KEYS.TOPIC_ACCURACY);
  localStorage.removeItem(KEYS.TEST_SESSIONS);
}
