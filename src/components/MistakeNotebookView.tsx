import React from 'react';
import { MistakeRecord, Subject } from '../types/exam';
import { BookmarkCheck, Play, Trash2, CheckCircle2, XCircle, Lightbulb, BookOpen, Target } from 'lucide-react';

interface MistakeNotebookViewProps {
  mistakes: MistakeRecord[];
  subjects: Subject[];
  onStartMistakePractice: () => void;
  onRemoveMistake: (id: string) => void;
}

export const MistakeNotebookView: React.FC<MistakeNotebookViewProps> = ({
  mistakes,
  subjects,
  onStartMistakePractice,
  onRemoveMistake,
}) => {
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Mistake Notebook</h1>
          </div>
          <p className="text-xs text-slate-500">
            Questions answered incorrectly are automatically saved here for targeted revision.
          </p>
        </div>

        {mistakes.length > 0 && (
          <button
            onClick={onStartMistakePractice}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Practice My Mistakes ({mistakes.length})</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {mistakes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto font-bold text-xl">
            ✓
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your Mistake Notebook is empty!</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Great job! Whenever you get an MCQ wrong during practice or mock tests, ExamMate will save it here so you can review and master it.
          </p>
        </div>
      ) : (
        /* List of Saved Mistakes */
        <div className="space-y-4">
          {mistakes.map((m) => {
            const q = m.question;
            const subject = subjects.find((s) => s.id === q.subjectId);
            const studentAnsText = q.options[m.studentAnswerIndex] || 'No Answer';
            const correctAnsText = q.options[q.correctOptionIndex];

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span
                      className="px-2.5 py-0.5 rounded text-white text-[11px] font-bold"
                      style={{ backgroundColor: subject?.color || '#2563eb' }}
                    >
                      {subject?.name || 'Physics'}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{q.topicName}</span>
                  </div>

                  <button
                    onClick={() => onRemoveMistake(m.id)}
                    className="text-xs text-slate-400 hover:text-rose-600 p-1 transition-colors flex items-center gap-1"
                    title="Remove from mistakes"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                {/* Question Text */}
                <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                  {q.questionText}
                </h3>

                {/* Answer Comparisons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-1">
                    <div className="font-bold text-rose-700 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      <span>Your Answer</span>
                    </div>
                    <p className="font-medium leading-relaxed">
                      Option {optionLetters[m.studentAnswerIndex]}: {studentAnsText}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1">
                    <div className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Correct Answer</span>
                    </div>
                    <p className="font-medium leading-relaxed">
                      Option {optionLetters[q.correctOptionIndex]}: {correctAnsText}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Explanation</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
