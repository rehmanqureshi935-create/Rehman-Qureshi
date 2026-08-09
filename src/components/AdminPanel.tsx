import React, { useState } from 'react';
import { Board, Chapter, ClassLevel, Question, Subject, Topic } from '../types/exam';
import { Shield, Plus, Trash2, Edit3, Save, X, BookOpen, Layers, Target, HelpCircle } from 'lucide-react';

interface AdminPanelProps {
  questions: Question[];
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
  boards: Board[];
  classes: ClassLevel[];
  onAddQuestion: (q: Question) => void;
  onUpdateQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  questions,
  subjects,
  chapters,
  topics,
  boards,
  classes,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'subjects' | 'chapters'>('questions');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // New Question Form state
  const [formBoard, setFormBoard] = useState<Board>(boards[0] || 'Federal Board');
  const [formClass, setFormClass] = useState<ClassLevel>(classes[3] || '12');
  const [formSubjectId, setFormSubjectId] = useState<string>(subjects[0]?.id || 'sub_physics');
  const [formChapterId, setFormChapterId] = useState<string>(chapters[0]?.id || 'chap_phy_7');
  const [formTopicId, setFormTopicId] = useState<string>(topics[0]?.id || 'top_ac_gen');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formOptionA, setFormOptionA] = useState('');
  const [formOptionB, setFormOptionB] = useState('');
  const [formOptionC, setFormOptionC] = useState('');
  const [formOptionD, setFormOptionD] = useState('');
  const [formCorrectIndex, setFormCorrectIndex] = useState<number>(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const filteredChapters = chapters.filter((c) => c.subjectId === formSubjectId);
  const filteredTopics = topics.filter((t) => t.subjectId === formSubjectId);

  const resetForm = () => {
    setFormQuestionText('');
    setFormOptionA('');
    setFormOptionB('');
    setFormOptionC('');
    setFormOptionD('');
    setFormCorrectIndex(0);
    setFormExplanation('');
    setEditingQuestionId(null);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionText.trim() || !formOptionA.trim() || !formOptionB.trim()) return;

    const topicObj = topics.find((t) => t.id === formTopicId);

    const questionObj: Question = {
      id: editingQuestionId || `q_admin_${Date.now()}`,
      board: formBoard,
      classLevel: formClass,
      subjectId: formSubjectId,
      chapterId: formChapterId,
      topicId: formTopicId,
      topicName: topicObj?.name || 'General',
      questionText: formQuestionText,
      options: [formOptionA, formOptionB, formOptionC, formOptionD],
      correctOptionIndex: formCorrectIndex,
      explanation: formExplanation,
      difficulty: formDifficulty,
    };

    if (editingQuestionId) {
      onUpdateQuestion(questionObj);
    } else {
      onAddQuestion(questionObj);
    }

    resetForm();
  };

  const handleEditClick = (q: Question) => {
    setEditingQuestionId(q.id);
    setFormBoard(q.board);
    setFormClass(q.classLevel);
    setFormSubjectId(q.subjectId);
    setFormChapterId(q.chapterId);
    setFormTopicId(q.topicId);
    setFormQuestionText(q.questionText);
    setFormOptionA(q.options[0]);
    setFormOptionB(q.options[1]);
    setFormOptionC(q.options[2]);
    setFormOptionD(q.options[3]);
    setFormCorrectIndex(q.correctOptionIndex);
    setFormExplanation(q.explanation);
    setFormDifficulty(q.difficulty);
    setIsAddingNew(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl font-extrabold">ExamMate Content Admin</h1>
          </div>
          <p className="text-xs text-slate-400">
            Manage board-mapped questions, topics, correct answers, and explanations.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddingNew(!isAddingNew);
          }}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          {isAddingNew ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAddingNew ? 'Close Form' : 'Add New Question'}</span>
        </button>
      </div>

      {/* Form Add/Edit */}
      {isAddingNew && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            {editingQuestionId ? 'Edit Question' : 'Add New MCQ'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Board</label>
              <select
                value={formBoard}
                onChange={(e) => setFormBoard(e.target.value as Board)}
                className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-xl"
              >
                {boards.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Class</label>
              <select
                value={formClass}
                onChange={(e) => setFormClass(e.target.value as ClassLevel)}
                className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-xl"
              >
                {classes.map((c) => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subject</label>
              <select
                value={formSubjectId}
                onChange={(e) => setFormSubjectId(e.target.value)}
                className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-xl"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Chapter</label>
              <select
                value={formChapterId}
                onChange={(e) => setFormChapterId(e.target.value)}
                className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-xl"
              >
                {filteredChapters.map((c) => (
                  <option key={c.id} value={c.id}>Ch {c.chapterNumber}: {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Topic</label>
              <select
                value={formTopicId}
                onChange={(e) => setFormTopicId(e.target.value)}
                className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-xl"
              >
                {filteredTopics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Question Text</label>
            <textarea
              required
              rows={2}
              value={formQuestionText}
              onChange={(e) => setFormQuestionText(e.target.value)}
              placeholder="Enter the question text"
              className="w-full p-3 text-sm border border-slate-300 rounded-xl"
            />
          </div>

          {/* Options A, B, C, D */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase">Options</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Option A', val: formOptionA, set: setFormOptionA, idx: 0 },
                { label: 'Option B', val: formOptionB, set: setFormOptionB, idx: 1 },
                { label: 'Option C', val: formOptionC, set: setFormOptionC, idx: 2 },
                { label: 'Option D', val: formOptionD, set: setFormOptionD, idx: 3 },
              ].map((opt) => (
                <div key={opt.label} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={formCorrectIndex === opt.idx}
                    onChange={() => setFormCorrectIndex(opt.idx)}
                    className="w-4 h-4 text-purple-600"
                    title="Mark as correct answer"
                  />
                  <input
                    type="text"
                    required
                    value={opt.val}
                    onChange={(e) => opt.set(e.target.value)}
                    placeholder={opt.label}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">Select the radio button next to the correct option.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Explanation</label>
            <textarea
              rows={2}
              value={formExplanation}
              onChange={(e) => setFormExplanation(e.target.value)}
              placeholder="Provide a clear student explanation"
              className="w-full p-3 text-xs border border-slate-300 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm"
            >
              Save Question
            </button>
          </div>
        </form>
      )}

      {/* Questions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Question Bank ({questions.length})</h2>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {questions.map((q) => {
            const subj = subjects.find((s) => s.id === q.subjectId);
            return (
              <div key={q.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {subj?.name}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-medium">{q.topicName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{q.board}</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{q.questionText}</p>
                  <p className="text-xs text-emerald-700 font-medium">
                    Correct: {q.options[q.correctOptionIndex]}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEditClick(q)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDeleteQuestion(q.id)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
