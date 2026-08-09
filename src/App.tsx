import React, { useState, useEffect } from 'react';
import {
  Board,
  Chapter,
  ClassLevel,
  MistakeRecord,
  PerformanceStats,
  Question,
  Subject,
  TestSession,
  Topic,
  TopicAccuracy,
  UserProfile,
} from './types/exam';
import {
  addQuestion,
  deleteQuestion,
  getChapters,
  getMistakes,
  getPerformanceStats,
  getQuestions,
  getSubjects,
  getTestSessions,
  getTopicAccuracies,
  getTopics,
  getUserProfile,
  recordMistake,
  recordQuestionAnswer,
  removeMistake,
  resetAllData,
  saveTestSession,
  saveUserProfile,
  updateQuestion,
} from './services/storageService';
import { INITIAL_BOARDS, INITIAL_CLASSES } from './data/mockData';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './components/DashboardView';
import { SubjectsView } from './components/SubjectsView';
import { PracticeSystem } from './components/PracticeSystem';
import { ResultsView } from './components/ResultsView';
import { MistakeNotebookView } from './components/MistakeNotebookView';
import { MockExamView } from './components/MockExamView';
import { ProgressView } from './components/ProgressView';
import { AdminPanel } from './components/AdminPanel';
import { ProfileModal } from './components/ProfileModal';

export const App: React.FC = () => {
  // App state
  const [userProfile, setUserProfileState] = useState<UserProfile>(getUserProfile());
  const [subjects, setSubjects] = useState<Subject[]>(getSubjects());
  const [chapters, setChapters] = useState<Chapter[]>(getChapters());
  const [topics, setTopics] = useState<Topic[]>(getTopics());
  const [questions, setQuestionsState] = useState<Question[]>(getQuestions());
  const [mistakes, setMistakesState] = useState<MistakeRecord[]>(getMistakes());
  const [topicAccuracies, setTopicAccuraciesState] = useState<TopicAccuracy[]>(getTopicAccuracies());
  const [stats, setStats] = useState<PerformanceStats>(getPerformanceStats());

  // UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<TestSession | null>(null);

  // Sync state helpers
  const refreshAllState = () => {
    setUserProfileState(getUserProfile());
    setQuestionsState(getQuestions());
    setMistakesState(getMistakes());
    setTopicAccuraciesState(getTopicAccuracies());
    setStats(getPerformanceStats());
  };

  useEffect(() => {
    refreshAllState();
  }, []);

  const handleUpdateProfile = (updated: UserProfile) => {
    saveUserProfile(updated);
    setUserProfileState(updated);
    refreshAllState();
  };

  // Start Practice Session Generator
  const startPracticeSession = (
    mode: 'topic' | 'random' | 'weak_topics' | 'mistakes',
    targetTopicId?: string
  ) => {
    let sessionQuestions: Question[] = [];
    let title = 'MCQ Practice';

    if (mode === 'topic' && targetTopicId) {
      const topicObj = topics.find((t) => t.id === targetTopicId);
      sessionQuestions = questions.filter((q) => q.topicId === targetTopicId);
      title = `${topicObj?.name || 'Topic'} Practice`;
    } else if (mode === 'weak_topics') {
      const weakTopicIds = topicAccuracies
        .filter((ta) => ta.accuracyPercent < 65)
        .map((ta) => ta.topicId);
      sessionQuestions = questions.filter((q) => weakTopicIds.includes(q.topicId));
      if (sessionQuestions.length === 0) sessionQuestions = questions.slice(0, 10);
      title = 'Weak Topics Targeted Practice';
    } else if (mode === 'mistakes') {
      const mistakeQuestionIds = mistakes.map((m) => m.questionId);
      sessionQuestions = questions.filter((q) => mistakeQuestionIds.includes(q.id));
      if (sessionQuestions.length === 0) sessionQuestions = questions.slice(0, 5);
      title = 'Mistake Notebook Practice';
    } else {
      // Random practice
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      sessionQuestions = shuffled.slice(0, 10);
      title = 'Random Practice';
    }

    if (sessionQuestions.length === 0) {
      sessionQuestions = questions.slice(0, 10);
    }

    const newSession: TestSession = {
      id: `session_${Date.now()}`,
      title,
      mode,
      topicId: targetTopicId,
      questions: sessionQuestions,
      userAnswers: {},
      flaggedQuestionIds: [],
      timeSpentSeconds: 0,
      startedAt: new Date().toISOString(),
    };

    setActiveSession(newSession);
    setActiveTab('practice');
  };

  const handleRecordAnswer = (question: Question, studentAnswerIndex: number, isCorrect: boolean) => {
    // Record to accuracy engine & update daily count
    recordQuestionAnswer(question, isCorrect);

    // If incorrect, record in Mistake Notebook
    if (!isCorrect) {
      recordMistake(question, studentAnswerIndex);
    }

    refreshAllState();
  };

  const handleFinishSession = (completedSession: TestSession) => {
    saveTestSession(completedSession);
    setActiveSession(completedSession);
    setActiveTab('results');
    refreshAllState();
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all your practice history and mistakes?')) {
      resetAllData();
      refreshAllState();
      setIsProfileOpen(false);
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Onboarding Flow for New Users */}
      {!userProfile.hasCompletedOnboarding && (
        <OnboardingModal
          isOpen={true}
          boards={INITIAL_BOARDS}
          classes={INITIAL_CLASSES}
          subjects={subjects}
          initialProfile={userProfile}
          onComplete={(updated) => {
            handleUpdateProfile(updated);
            setActiveTab('dashboard');
          }}
        />
      )}

      {/* Main App Layout */}
      {activeTab === 'landing' ? (
        <LandingPage
          onStartPreparing={() => {
            if (!userProfile.hasCompletedOnboarding) {
              setIsProfileOpen(true);
            } else {
              setActiveTab('dashboard');
            }
          }}
          onExploreSubjects={() => setActiveTab('subjects')}
        />
      ) : (
        <>
          {/* Header */}
          <Header
            userProfile={userProfile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenProfile={() => setIsProfileOpen(true)}
            isAdminMode={isAdminMode}
            setIsAdminMode={setIsAdminMode}
          />

          <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-6 pb-20 lg:pb-12 flex gap-8">
            {/* Sidebar Navigation (Desktop & Bottom Mobile) */}
            <Navigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isAdminMode={isAdminMode}
              mistakesCount={mistakes.length}
            />

            {/* View Container */}
            <main className="flex-1 lg:ml-64 min-w-0">
              {activeTab === 'dashboard' && (
                <DashboardView
                  userProfile={userProfile}
                  stats={stats}
                  weakTopics={topicAccuracies}
                  subjects={subjects}
                  onStartPractice={startPracticeSession}
                  onNavigateToTab={setActiveTab}
                />
              )}

              {activeTab === 'subjects' && (
                <SubjectsView
                  subjects={subjects}
                  chapters={chapters}
                  topics={topics}
                  questions={questions}
                  selectedSubjectIds={userProfile.selectedSubjectIds}
                  onStartTopicPractice={(topId) => startPracticeSession('topic', topId)}
                  onStartChapterPractice={(chapId) => {
                    const firstTopic = topics.find((t) => t.chapterId === chapId);
                    startPracticeSession('topic', firstTopic?.id || topics[0].id);
                  }}
                />
              )}

              {activeTab === 'practice' && activeSession && (
                <PracticeSystem
                  session={activeSession}
                  subjectName={
                    subjects.find((s) => s.id === activeSession.subjectId)?.name || 'Physics'
                  }
                  onFinishSession={handleFinishSession}
                  onRecordAnswer={handleRecordAnswer}
                />
              )}

              {activeTab === 'results' && activeSession && (
                <ResultsView
                  session={activeSession}
                  onPracticeWeakTopics={() => startPracticeSession('weak_topics')}
                  onReturnHome={() => setActiveTab('dashboard')}
                  onReviewMistakes={() => setActiveTab('mistakes')}
                />
              )}

              {activeTab === 'mistakes' && (
                <MistakeNotebookView
                  mistakes={mistakes}
                  subjects={subjects}
                  onStartMistakePractice={() => startPracticeSession('mistakes')}
                  onRemoveMistake={(id) => {
                    removeMistake(id);
                    refreshAllState();
                  }}
                />
              )}

              {activeTab === 'mock_tests' && (
                <MockExamView
                  subjects={subjects}
                  allQuestions={questions}
                  onFinishMockExam={handleFinishSession}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressView
                  stats={stats}
                  topicAccuracies={topicAccuracies}
                  subjects={subjects}
                  onPracticeTopic={(topId) => startPracticeSession('topic', topId)}
                />
              )}

              {activeTab === 'admin' && (
                <AdminPanel
                  questions={questions}
                  subjects={subjects}
                  chapters={chapters}
                  topics={topics}
                  boards={INITIAL_BOARDS}
                  classes={INITIAL_CLASSES}
                  onAddQuestion={(q) => {
                    addQuestion(q);
                    refreshAllState();
                  }}
                  onUpdateQuestion={(q) => {
                    updateQuestion(q);
                    refreshAllState();
                  }}
                  onDeleteQuestion={(id) => {
                    deleteQuestion(id);
                    refreshAllState();
                  }}
                />
              )}
            </main>
          </div>
        </>
      )}

      {/* Settings / Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        userProfile={userProfile}
        boards={INITIAL_BOARDS}
        classes={INITIAL_CLASSES}
        subjects={subjects}
        onSave={handleUpdateProfile}
        onResetData={handleResetData}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default App;
