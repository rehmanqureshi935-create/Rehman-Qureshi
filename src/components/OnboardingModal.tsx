import React, { useState } from 'react';
import { Board, ClassLevel, Subject, UserProfile } from '../types/exam';
import { Check, BookOpen, Layers, GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  boards: Board[];
  classes: ClassLevel[];
  subjects: Subject[];
  initialProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  boards,
  classes,
  subjects,
  initialProfile,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(initialProfile.name || 'Student');
  const [selectedBoard, setSelectedBoard] = useState<Board>(initialProfile.board || 'Federal Board');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(initialProfile.classLevel || '12');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(
    initialProfile.selectedSubjectIds.length > 0
      ? initialProfile.selectedSubjectIds
      : ['sub_physics', 'sub_chemistry', 'sub_cs']
  );

  if (!isOpen) return null;

  const handleToggleSubject = (subjectId: string) => {
    if (selectedSubjectIds.includes(subjectId)) {
      if (selectedSubjectIds.length === 1) return; // keep at least 1
      setSelectedSubjectIds(selectedSubjectIds.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subjectId]);
    }
  };

  const handleFinish = () => {
    const updated: UserProfile = {
      ...initialProfile,
      name: name.trim() || 'Student',
      board: selectedBoard,
      classLevel: selectedClass,
      selectedSubjectIds,
      hasCompletedOnboarding: true,
    };
    onComplete(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">
              Step {step} of 3
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-6 h-1.5 rounded-full transition-all ${
                    s <= step ? 'bg-blue-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <h2 className="text-xl font-bold">
            {step === 1 && 'Select Your Educational Board'}
            {step === 2 && 'Select Your Class Level'}
            {step === 3 && 'Choose Your Subjects'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ExamMate customizes practice questions according to your official syllabus.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Select Provincial / Federal Board</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {boards.map((b) => {
                    const isSel = selectedBoard === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBoard(b)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${
                          isSel
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <GraduationCap className={`w-4 h-4 ${isSel ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span>{b}</span>
                        </div>
                        {isSel && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Select Your Academic Class</label>
              <div className="grid grid-cols-2 gap-3">
                {classes.map((c) => {
                  const isSel = selectedClass === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedClass(c)}
                      className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                        isSel
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl font-extrabold">{c}th</span>
                      <span className="text-xs text-slate-500">
                        {['9', '10'].includes(c) ? 'Matriculation' : 'Intermediate'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold uppercase text-slate-500">
                  Choose Subjects (Multiple allowed)
                </label>
                <span className="text-xs text-slate-400">
                  {selectedSubjectIds.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjects.map((subj) => {
                  const isSel = selectedSubjectIds.includes(subj.id);
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => handleToggleSubject(subj.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${
                        isSel
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: subj.color }}
                        />
                        <div>
                          <div className="font-semibold">{subj.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {subj.chaptersCount} Chapters • {subj.totalQuestions} Qs
                          </div>
                        </div>
                      </div>
                      {isSel ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((step + 1) as any)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <span>Complete Setup</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
