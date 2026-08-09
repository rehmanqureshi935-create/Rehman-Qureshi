import React, { useState, useEffect } from 'react';
import { MockExamConfig, Question, Subject, TestSession } from '../types/exam';
import { Clock, Play, Flag, CheckCircle2, ArrowRight, ArrowLeft, ShieldAlert, Award } from 'lucide-react';

interface MockExamViewProps {
  subjects: Subject[];
  allQuestions: Question[];
  onFinishMockExam: (session: TestSession) => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({
  subjects,
  allQuestions,
  onFinishMockExam,
}) => {
  // Config state
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub_physics');
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(15);

  // Active Exam state
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);

  // Countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isExamRunning && remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam(); // Auto-submit when time expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExamRunning, remainingSeconds]);

  const handleStartExam = () => {
    // Filter questions for subject
    let filtered = allQuestions.filter((q) => q.subjectId === selectedSubjectId);
    if (difficulty !== 'Mixed') {
      const diffMatch = filtered.filter((q) => q.difficulty === difficulty);
      if (diffMatch.length > 0) filtered = diffMatch;
    }

    // Shuffle and pick
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    setExamQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedIds([]);
    setRemainingSeconds(timeLimitMinutes * 60);
    setIsExamRunning(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    const qId = examQuestions[currentIndex].id;
    setUserAnswers({ ...userAnswers, [qId]: optionIndex });
  };

  const toggleFlag = () => {
    const qId = examQuestions[currentIndex].id;
    if (flaggedIds.includes(qId)) {
      setFlaggedIds(flaggedIds.filter((id) => id !== qId));
    } else {
      setFlaggedIds([...flaggedIds, qId]);
    }
  };

  const handleSubmitExam = () => {
    let score = 0;
    examQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        score += 1;
      }
    });

    const timeSpent = timeLimitMinutes * 60 - remainingSeconds;

    const session: TestSession = {
      id: `mock_${Date.now()}`,
      title: `${subjects.find((s) => s.id === selectedSubjectId)?.name || 'Board'} Mock Test`,
      mode: 'mock_exam',
      subjectId: selectedSubjectId,
      questions: examQuestions,
      userAnswers,
      flaggedQuestionIds: flaggedIds,
      timeSpentSeconds: timeSpent,
      timeLimitSeconds: timeLimitMinutes * 60,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      score,
      total: examQuestions.length,
    };

    setIsExamRunning(false);
    onFinishMockExam(session);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  // Configuration Setup Screen
  if (!isExamRunning) {
    const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Clock className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Timed Board Mock Exam</h1>
            </div>
            <p className="text-xs text-slate-500">
              Simulate actual board exam pressure with timed questions, question navigation map, and review flags.
            </p>
          </div>

          {/* Configuration Form */}
          <div className="space-y-5 pt-2">
            {/* Subject Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Select Subject</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subjects.map((subj) => {
                  const isSel = selectedSubjectId === subj.id;
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => setSelectedSubjectId(subj.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2.5 ${
                        isSel
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: subj.color }}
                      />
                      <span>{subj.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Number of Questions</label>
              <div className="grid grid-cols-3 gap-3">
                {[10, 15, 30].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-3 rounded-xl border text-center text-sm font-bold transition-all ${
                      questionCount === count
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Difficulty</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['Easy', 'Medium', 'Hard', 'Mixed'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      difficulty === diff
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Time Limit</label>
              <div className="grid grid-cols-3 gap-3">
                {[10, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTimeLimitMinutes(mins)}
                    className={`py-3 rounded-xl border text-center text-sm font-bold transition-all ${
                      timeLimitMinutes === mins
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleStartExam}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start {selectedSubject?.name} Mock Test</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Timed Exam Interface
  const currentQ = examQuestions[currentIndex];
  if (!currentQ) return null;

  const isFlagged = flaggedIds.includes(currentQ.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top Fixed Exam Status Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-medium">Mock Exam in Progress</div>
          <div className="text-sm font-bold text-white">
            Question {currentIndex + 1} of {examQuestions.length}
          </div>
        </div>

        {/* Live Timer Badge */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-extrabold font-mono ${
          remainingSeconds < 180 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-slate-800 text-amber-300 border-slate-700'
        }`}>
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{formatTimer(remainingSeconds)}</span>
        </div>

        <button
          onClick={handleSubmitExam}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Submit Exam
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MCQ Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Topic: {currentQ.topicName}
            </span>
            <button
              onClick={toggleFlag}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                isFlagged ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {currentQ.questionText}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = userAnswers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {optionLetters[idx]}
                  </span>
                  <span className="pt-0.5 leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={currentIndex === examQuestions.length - 1}
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-40"
            >
              Next Question
            </button>
          </div>
        </div>

        {/* Question Status Grid Map */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Question Map
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {examQuestions.map((q, idx) => {
              const isAns = userAnswers[q.id] !== undefined;
              const isFlg = flaggedIds.includes(q.id);
              const isCurr = idx === currentIndex;

              let style = 'bg-slate-100 text-slate-600 border-slate-200';
              if (isAns) style = 'bg-blue-600 text-white border-blue-600 font-bold';
              if (isFlg) style = 'bg-amber-400 text-slate-900 border-amber-500 font-bold';
              if (isCurr) style += ' ring-2 ring-slate-900 ring-offset-1';

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-400" />
              <span>Flagged for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
              <span>Unanswered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
