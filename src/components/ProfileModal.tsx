import React, { useState } from 'react';
import { Board, ClassLevel, Subject, UserProfile } from '../types/exam';
import { X, Save, RotateCcw, User, BookOpen, Target, GraduationCap } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  boards: Board[];
  classes: ClassLevel[];
  subjects: Subject[];
  onSave: (updated: UserProfile) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  userProfile,
  boards,
  classes,
  subjects,
  onSave,
  onResetData,
  onClose,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [selectedBoard, setSelectedBoard] = useState<Board>(userProfile.board);
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(userProfile.classLevel);
  const [todayGoal, setTodayGoal] = useState<number>(userProfile.todayGoal || 10);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(
    userProfile.selectedSubjectIds || []
  );

  if (!isOpen) return null;

  const handleToggleSubject = (subjectId: string) => {
    if (selectedSubjectIds.includes(subjectId)) {
      if (selectedSubjectIds.length === 1) return;
      setSelectedSubjectIds(selectedSubjectIds.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subjectId]);
    }
  };

  const handleSave = () => {
    onSave({
      ...userProfile,
      name: name.trim() || 'Student',
      board: selectedBoard,
      classLevel: selectedClass,
      todayGoal,
      selectedSubjectIds,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-base">
            <User className="w-5 h-5 text-blue-400" />
            <span>Student Settings & Profile</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          <div>
            <label className="block font-semibold uppercase text-slate-500 mb-1">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-slate-500 mb-1">Board</label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value as Board)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
              >
                {boards.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase text-slate-500 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as ClassLevel)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
              >
                {classes.map((c) => (
                  <option key={c} value={c}>Class {c}th</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-slate-500 mb-1">Daily Question Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setTodayGoal(goal)}
                  className={`py-2 rounded-xl border font-bold text-xs ${
                    todayGoal === goal ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'
                  }`}
                >
                  {goal} Qs / Day
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-slate-500 mb-2">My Subjects</label>
            <div className="grid grid-cols-2 gap-2">
              {subjects.map((subj) => {
                const isSel = selectedSubjectIds.includes(subj.id);
                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => handleToggleSubject(subj.id)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                      isSel ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-white text-slate-600'
                    }`}
                  >
                    {subj.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onResetData}
              className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-700 font-semibold hover:bg-rose-50 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Practice History & Progress</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
