import React from 'react';
import { PerformanceStats, Subject, TopicAccuracy, UserProfile } from '../types/exam';
import { Target, Flame, AlertTriangle, CheckCircle2, ArrowRight, Award, BookOpen, Clock, Sparkles, TrendingUp, BarChart2 } from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  stats: PerformanceStats;
  weakTopics: TopicAccuracy[];
  subjects: Subject[];
  onStartPractice: (mode: 'topic' | 'random' | 'weak_topics' | 'mistakes', topicId?: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  stats,
  weakTopics,
  subjects,
  onStartPractice,
  onNavigateToTab,
}) => {
  const goalProgressPercent = Math.min(
    100,
    Math.round((userProfile.todayCompleted / userProfile.todayGoal) * 100)
  );

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Targeted Exam Preparation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {userProfile.name} 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Let's improve your board exam score today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onStartPractice('weak_topics')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>Practice Weak Topics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Today's Practice & Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Practice Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Today's Practice Goal</h2>
                  <p className="text-xs text-slate-500">Daily target to maintain peak retention</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                {userProfile.todayGoal} Questions Goal
              </span>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-slate-600 font-medium">Progress</span>
                <span className="font-extrabold text-slate-900">
                  {userProfile.todayCompleted} / {userProfile.todayGoal} completed
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/60">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${goalProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onStartPractice('random')}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Performance Overview Metric Grid */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <span>Performance Overview</span>
            </h2>
            <button
              onClick={() => onNavigateToTab('progress')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
              <div className="text-xs font-medium text-slate-500">Overall Accuracy</div>
              <div className="text-2xl font-extrabold text-slate-900 flex items-baseline gap-1">
                <span>{stats.overallAccuracy}%</span>
                <span className="text-[10px] text-emerald-600 font-bold">High</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
              <div className="text-xs font-medium text-slate-500">Questions Attempted</div>
              <div className="text-2xl font-extrabold text-slate-900">{stats.questionsAttempted}</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
              <div className="text-xs font-medium text-slate-500">Questions Correct</div>
              <div className="text-2xl font-extrabold text-emerald-600">{stats.questionsCorrect}</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
              <div className="text-xs font-medium text-slate-500">Current Streak</div>
              <div className="text-2xl font-extrabold text-amber-600 flex items-center gap-1">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>{stats.streakDays}d</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
              <div className="text-xs font-medium text-slate-500">Mock Tests Completed</div>
              <div className="text-2xl font-extrabold text-blue-600">{stats.mockTestsCompleted}</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1 flex flex-col justify-center">
              <button
                onClick={() => onNavigateToTab('mock_tests')}
                className="w-full h-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors border border-blue-200/60"
              >
                Take Mock Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weak Topics Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Weak Topics Needing Attention</span>
            </h2>
            <p className="text-xs text-slate-500">
              ExamMate analyzes your incorrect responses and highlights topics requiring immediate practice.
            </p>
          </div>

          <button
            onClick={() => onStartPractice('weak_topics')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Practice Weak Topics</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weakTopics.slice(0, 3).map((wt) => {
            let statusColor = 'bg-amber-50 text-amber-700 border-amber-200';
            if (wt.status === 'Needs Practice') statusColor = 'bg-rose-50 text-rose-700 border-rose-200';
            if (wt.status === 'Strong') statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <div
                key={wt.topicId}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{wt.topicName}</h3>
                    <p className="text-[11px] text-slate-500">
                      {subjects.find((s) => s.id === wt.subjectId)?.name || 'Physics'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                    {wt.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Accuracy</span>
                    <span className="font-bold text-slate-900">{wt.accuracyPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        wt.accuracyPercent < 60
                          ? 'bg-rose-500'
                          : wt.accuracyPercent < 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${wt.accuracyPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => onStartPractice('topic', wt.topicId)}
                  className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Practice This Topic</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Subjects Quick Access */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>My Subjects</span>
          </h2>
          <button
            onClick={() => onNavigateToTab('subjects')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Chapters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {subjects
            .filter((s) => userProfile.selectedSubjectIds.includes(s.id))
            .map((subj) => (
              <div
                key={subj.id}
                onClick={() => onNavigateToTab('subjects')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                    style={{ backgroundColor: subj.color }}
                  >
                    {subj.code}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 flex items-center gap-1">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{subj.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {subj.chaptersCount} Chapters • {subj.totalQuestions} Questions
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
