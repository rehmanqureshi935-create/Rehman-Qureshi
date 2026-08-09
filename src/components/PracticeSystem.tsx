import React, { useState } from 'react';
import { Question, TestSession } from '../types/exam';
import { explainMistakeWithAI, generateSimilarQuestionWithAI } from '../services/aiService';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, Flag, Bookmark, RefreshCw, AlertTriangle, Lightbulb } from 'lucide-react';

interface PracticeSystemProps {
  session: TestSession;
  subjectName: string;
  onFinishSession: (completedSession: TestSession) => void;
  onRecordAnswer: (question: Question, selectedIndex: number, isCorrect: boolean) => void;
}

export const PracticeSystem: React.FC<PracticeSystemProps> = ({
  session,
  subjectName,
  onFinishSession,
  onRecordAnswer,
}) => {
  const [questions, setQuestions] = useState<Question[]>(session.questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>(session.userAnswers || {});
  const [flaggedIds, setFlaggedIds] = useState<string[]>(session.flaggedQuestionIds || []);
  const [timeSpent, setTimeSpent] = useState(0);

  // AI Explanation state
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<{ explanation: string; keyTip: string } | null>(null);

  // AI Similar Question state
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);
  const [similarAdded, setSimilarAdded] = useState(false);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const isAnswered = userAnswers[currentQ.id] !== undefined;
  const selectedIndex = userAnswers[currentQ.id];
  const isCorrect = isAnswered && selectedIndex === currentQ.correctOptionIndex;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return; // Prevent changing after answer revealed

    const updatedAnswers = { ...userAnswers, [currentQ.id]: index };
    setUserAnswers(updatedAnswers);

    const correct = index === currentQ.correctOptionIndex;
    onRecordAnswer(currentQ, index, correct);

    // Reset AI state for new question
    setAiExplanation(null);
    setSimilarAdded(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAiExplanation(null);
      setSimilarAdded(false);
    } else {
      // Complete practice session
      let score = 0;
      questions.forEach((q) => {
        if (userAnswers[q.id] === q.correctOptionIndex) {
          score += 1;
        }
      });

      const completed: TestSession = {
        ...session,
        questions,
        userAnswers,
        flaggedQuestionIds: flaggedIds,
        completedAt: new Date().toISOString(),
        score,
        total: questions.length,
        timeSpentSeconds: timeSpent + 45,
      };

      onFinishSession(completed);
    }
  };

  const handleExplainMistake = async () => {
    if (!isAnswered || isCorrect) return;
    setIsExplaining(true);
    const studentAnswerText = currentQ.options[selectedIndex];
    const res = await explainMistakeWithAI(currentQ, studentAnswerText, subjectName);
    setAiExplanation({
      explanation: res.explanation,
      keyTip: res.keyTip,
    });
    setIsExplaining(false);
  };

  const handleTrySimilarQuestion = async () => {
    setIsGeneratingSimilar(true);
    const res = await generateSimilarQuestionWithAI(currentQ, subjectName);
    if (res.question) {
      // Append similar question right after current index
      const newQuestions = [...questions];
      newQuestions.splice(currentIndex + 1, 0, res.question);
      setQuestions(newQuestions);
      setSimilarAdded(true);
    }
    setIsGeneratingSimilar(false);
  };

  const toggleFlag = () => {
    if (flaggedIds.includes(currentQ.id)) {
      setFlaggedIds(flaggedIds.filter((id) => id !== currentQ.id));
    } else {
      setFlaggedIds([...flaggedIds, currentQ.id]);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top Header & Progress */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {session.title || 'MCQ Practice'}
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentQ.topicName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFlag}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                flaggedIds.includes(currentQ.id)
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
              title="Flag for review"
            >
              <Flag className={`w-3.5 h-3.5 ${flaggedIds.includes(currentQ.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">Flag</span>
            </button>

            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main MCQ Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Question {currentIndex + 1}
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
              Difficulty: {currentQ.difficulty}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {currentQ.questionText}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let stateStyle = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50';

            if (isAnswered) {
              if (idx === currentQ.correctOptionIndex) {
                // Correct answer green
                stateStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
              } else if (idx === selectedIndex) {
                // Selected incorrect option red
                stateStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-semibold ring-1 ring-rose-500';
              } else {
                stateStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base transition-all flex items-start gap-3.5 ${stateStyle} ${
                  !isAnswered ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isAnswered && idx === currentQ.correctOptionIndex
                      ? 'bg-emerald-600 text-white'
                      : isAnswered && idx === selectedIndex
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {optionLetters[idx]}
                </span>
                <span className="pt-0.5 leading-snug flex-1">{opt}</span>

                {isAnswered && idx === currentQ.correctOptionIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 stroke-[2.5]" />
                )}
                {isAnswered && idx === selectedIndex && idx !== currentQ.correctOptionIndex && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-Answer Feedback Banner & Explanation */}
        {isAnswered && (
          <div className="pt-4 border-t border-slate-200 space-y-4 animate-fade-in">
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Correct Answer! Well done.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Incorrect. The correct answer is Option {optionLetters[currentQ.correctOptionIndex]}.</span>
                  </>
                )}
              </div>
            </div>

            {/* Standard Explanation */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Explanation</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{currentQ.explanation}</p>
            </div>

            {/* AI Explanation & Similar Question Actions */}
            {!isCorrect && (
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleExplainMistake}
                    disabled={isExplaining}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>{isExplaining ? 'Generating AI Explanation...' : 'Explain My Mistake with AI'}</span>
                  </button>

                  <button
                    onClick={handleTrySimilarQuestion}
                    disabled={isGeneratingSimilar || similarAdded}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 text-blue-600 ${isGeneratingSimilar ? 'animate-spin' : ''}`} />
                    <span>
                      {similarAdded
                        ? 'Similar Question Added!'
                        : isGeneratingSimilar
                        ? 'Creating Similar Question...'
                        : 'Try a Similar Question'}
                    </span>
                  </button>
                </div>

                {/* AI Explanation Box */}
                {aiExplanation && (
                  <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-xs space-y-2 text-purple-950 animate-fade-in">
                    <div className="font-bold flex items-center gap-1.5 text-purple-900">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>AI Smart Explanation</span>
                    </div>
                    <p className="leading-relaxed">{aiExplanation.explanation}</p>
                    <div className="pt-1.5 border-t border-purple-200/60 font-semibold text-purple-800">
                      💡 Key Tip: {aiExplanation.keyTip}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            Topic: {currentQ.topicName}
          </span>

          <button
            disabled={!isAnswered}
            onClick={handleNext}
            className={`px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              isAnswered
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
