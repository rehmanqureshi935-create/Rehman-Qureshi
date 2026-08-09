import React, { useEffect } from 'react';
import { TestSession } from '../types/exam';
import { Trophy, AlertTriangle, CheckCircle2, Clock, ArrowRight, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsViewProps {
  session: TestSession;
  onPracticeWeakTopics: () => void;
  onReturnHome: () => void;
  onReviewMistakes: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  session,
  onPracticeWeakTopics,
  onReturnHome,
  onReviewMistakes,
}) => {
  const score = session.score || 0;
  const total = session.total || session.questions.length || 1;
  const accuracy = Math.round((score / total) * 100);

  // Trigger celebration confetti on high scores
  useEffect(() => {
    if (accuracy >= 75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [accuracy]);

  // Format time spent
  const minutes = Math.floor(session.timeSpentSeconds / 60);
  const seconds = session.timeSpentSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Topic performance breakdown
  const topicBreakdown: Record<string, { total: number; correct: number; name: string }> = {};

  session.questions.forEach((q) => {
    const isCorrect = session.userAnswers[q.id] === q.correctOptionIndex;
    if (!topicBreakdown[q.topicId]) {
      topicBreakdown[q.topicId] = { total: 0, correct: 0, name: q.topicName };
    }
    topicBreakdown[q.topicId].total += 1;
    if (isCorrect) topicBreakdown[q.topicId].correct += 1;
  });

  const topicResults = Object.values(topicBreakdown).map((tb) => ({
    name: tb.name,
    accuracy: Math.round((tb.correct / tb.total) * 100),
    correct: tb.correct,
    total: tb.total,
  }));

  const weakTopics = topicResults.filter((tr) => tr.accuracy < 65);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Result Hero Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Practice Session Completed!
          </h1>
          <p className="text-sm text-slate-500">
            Here is your targeted topic performance analysis.
          </p>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Score</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {score} / {total}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Accuracy</div>
            <div className={`text-2xl font-extrabold mt-0.5 ${accuracy >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {accuracy}%
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Time Taken</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{timeFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Performance Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Topic Performance</span>
        </h2>

        <div className="space-y-3">
          {topicResults.map((tr) => (
            <div key={tr.name} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-800">{tr.name}</span>
                <span className={tr.accuracy >= 70 ? 'text-emerald-600' : 'text-rose-600'}>
                  {tr.accuracy}% ({tr.correct}/{tr.total} correct)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${tr.accuracy >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${tr.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Weak Topic Highlight Warning */}
        {weakTopics.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs sm:text-sm">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Recommended Action</span>
            </div>
            <p className="leading-relaxed text-amber-800">
              You should revise{' '}
              <strong className="text-amber-950 font-bold">
                {weakTopics.map((wt) => wt.name).join(', ')}
              </strong>
              . Your accuracy on these topics was below 65%.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {weakTopics.length > 0 && (
          <button
            onClick={onPracticeWeakTopics}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Practice Weak Topics</span>
          </button>
        )}

        <button
          onClick={onReviewMistakes}
          className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View Saved Mistakes</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onReturnHome}
          className="w-full sm:w-auto py-3.5 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
