import React, { useState } from 'react';
import { Chapter, Question, Subject, Topic } from '../types/exam';
import { BookOpen, ChevronRight, CheckCircle2, AlertTriangle, ArrowLeft, Target, Play } from 'lucide-react';

interface SubjectsViewProps {
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
  questions: Question[];
  selectedSubjectIds: string[];
  onStartTopicPractice: (topicId: string) => void;
  onStartChapterPractice: (chapterId: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  chapters,
  topics,
  questions,
  selectedSubjectIds,
  onStartTopicPractice,
  onStartChapterPractice,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const mySubjects = subjects.filter((s) => selectedSubjectIds.includes(s.id));

  // If chapter is selected, show topics view
  if (selectedChapter && selectedSubject) {
    const chapterTopics = topics.filter((t) => t.chapterId === selectedChapter.id);

    return (
      <div className="space-y-6 pb-12 animate-fade-in">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setSelectedChapter(null)}
            className="hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{selectedSubject.name} Chapters</span>
          </button>
          <span>/</span>
          <span className="text-slate-900">{selectedChapter.name}</span>
        </div>

        {/* Chapter Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded text-white"
              style={{ backgroundColor: selectedSubject.color }}
            >
              Chapter {selectedChapter.chapterNumber}
            </span>
            <span className="text-xs text-slate-500">{selectedSubject.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{selectedChapter.name}</h1>
          <p className="text-sm text-slate-600">{selectedChapter.description}</p>

          <div className="pt-3">
            <button
              onClick={() => onStartChapterPractice(selectedChapter.id)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Practice Whole Chapter ({selectedChapter.totalQuestions} Qs)</span>
            </button>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Select Topic to Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapterTopics.map((top) => {
              const topQuestions = questions.filter((q) => q.topicId === top.id);
              return (
                <div
                  key={top.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">{top.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{top.description}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-500">
                      {topQuestions.length || 8} MCQs Available
                    </span>
                    <button
                      onClick={() => onStartTopicPractice(top.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Start Practice</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // If subject is selected, show chapters list
  if (selectedSubject) {
    const subjectChapters = chapters.filter((c) => c.subjectId === selectedSubject.id);

    return (
      <div className="space-y-6 pb-12 animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => setSelectedSubject(null)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Subjects</span>
        </button>

        {/* Subject Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0"
              style={{ backgroundColor: selectedSubject.color }}
            >
              {selectedSubject.code}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{selectedSubject.name}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{selectedSubject.description}</p>
            </div>
          </div>

          <div className="text-xs font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0">
            {subjectChapters.length} Chapters • {selectedSubject.totalQuestions} Questions
          </div>
        </div>

        {/* Chapter List */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Chapters</h2>
          <div className="space-y-3">
            {subjectChapters.map((chap) => {
              // Mock accuracy for chapter demo
              const mockAccuracy = [85, 72, 61, 48, 79, 90, 52][(chap.chapterNumber - 1) % 7];
              const isWeak = mockAccuracy < 60;

              return (
                <div
                  key={chap.id}
                  onClick={() => setSelectedChapter(chap)}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {chap.chapterNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                        {chap.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{chap.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs font-bold text-slate-900">{mockAccuracy}% Accuracy</span>
                        {isWeak ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            Needs Practice
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Strong
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{chap.totalQuestions} Questions</span>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Main Subjects Cards View
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Selected Board Subjects</h1>
        <p className="text-xs text-slate-500">
          Browse chapter-wise and topic-wise practice modules tailored to your board syllabus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mySubjects.map((subj) => {
          const mockProgress = subj.id === 'sub_physics' ? 72 : subj.id === 'sub_chemistry' ? 64 : 81;

          return (
            <div
              key={subj.id}
              onClick={() => setSelectedSubject(subj)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-base shadow-sm"
                    style={{ backgroundColor: subj.color }}
                  >
                    {subj.code}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {mockProgress}% Progress
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {subj.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{subj.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ backgroundColor: subj.color, width: `${mockProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{subj.chaptersCount} Chapters</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1 group-hover:text-blue-600">
                    <span>View Chapters</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
