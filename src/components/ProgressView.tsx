import React from 'react';
import { PerformanceStats, Subject, TopicAccuracy } from '../types/exam';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Award, Clock, Target, Calendar } from 'lucide-react';

interface ProgressViewProps {
  stats: PerformanceStats;
  topicAccuracies: TopicAccuracy[];
  subjects: Subject[];
  onPracticeTopic: (topicId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  stats,
  topicAccuracies,
  subjects,
  onPracticeTopic,
}) => {
  const strongTopics = topicAccuracies.filter((ta) => ta.accuracyPercent >= 80);
  const weakTopics = topicAccuracies.filter((ta) => ta.accuracyPercent < 60);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Analytics Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Analytics & Progress</h1>
          </div>
          <p className="text-xs text-slate-500">
            Track accuracy trends, topic strengths, and mock test scores over time.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Last 7 Days Performance</span>
        </div>
      </div>

      {/* Primary Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500">Overall Accuracy</div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.overallAccuracy}%</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4% this week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500">Total Answered</div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.questionsAttempted}</div>
          <div className="text-[11px] text-slate-400">Questions Practiced</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500">Current Streak</div>
          <div className="text-3xl font-extrabold text-amber-600">{stats.streakDays} Days</div>
          <div className="text-[11px] text-amber-700 font-medium">Consistent practice</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500">Mock Exams Completed</div>
          <div className="text-3xl font-extrabold text-blue-600">{stats.mockTestsCompleted}</div>
          <div className="text-[11px] text-slate-400">Simulations taken</div>
        </div>
      </div>

      {/* Weekly Activity Bar Visualization */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Weekly Practice Activity</span>
        </h2>

        <div className="grid grid-cols-7 gap-2 pt-4 items-end h-40 border-b border-slate-100 pb-2">
          {stats.weeklyActivity.map((day) => {
            const heightPercent = Math.min(100, Math.max(15, (day.count / 20) * 100));
            return (
              <div key={day.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.count} Qs
                </span>
                <div
                  className="w-full max-w-10 bg-blue-600 rounded-t-xl hover:bg-blue-500 transition-all"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs font-semibold text-slate-600">{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Performance Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900">Subject Accuracy Breakdown</h2>
        <div className="space-y-4">
          {stats.subjectProgress.map((sp) => {
            const subj = subjects.find((s) => s.id === sp.subjectId);
            return (
              <div key={sp.subjectId} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-900">{sp.subjectName}</span>
                  <span className="text-slate-600">{sp.accuracy}% Accuracy</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/60">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: subj?.color || '#2563eb',
                      width: `${sp.accuracy}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strong vs Weak Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>Weak Topics (Needs Practice)</span>
          </div>

          <div className="space-y-2.5">
            {weakTopics.length === 0 ? (
              <p className="text-xs text-slate-400">No weak topics recorded yet!</p>
            ) : (
              weakTopics.map((wt) => (
                <div
                  key={wt.topicId}
                  className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{wt.topicName}</div>
                    <div className="text-[11px] text-rose-700 font-semibold">{wt.accuracyPercent}% Accuracy</div>
                  </div>
                  <button
                    onClick={() => onPracticeTopic(wt.topicId)}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Practice
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Strong Topics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Strong Topics (Mastered)</span>
          </div>

          <div className="space-y-2.5">
            {strongTopics.length === 0 ? (
              <p className="text-xs text-slate-400">Keep practicing to build strong topics!</p>
            ) : (
              strongTopics.map((st) => (
                <div
                  key={st.topicId}
                  className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{st.topicName}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">{st.accuracyPercent}% Accuracy</div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Strong
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mock Exam History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>Recent Mock Exam History</span>
        </h2>

        <div className="divide-y divide-slate-100">
          {stats.mockExamHistory.map((me) => (
            <div key={me.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 text-sm">{me.subjectName} Mock Test</div>
                <div className="text-slate-400">{me.date}</div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-slate-900 text-sm">
                  {me.score} / {me.total}
                </div>
                <div className="text-emerald-600 font-bold">{me.accuracy}% Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
