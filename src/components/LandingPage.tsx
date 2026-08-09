import React from 'react';
import { Target, CheckCircle2, AlertTriangle, BookOpen, Clock, BookmarkCheck, BarChart3, ArrowRight, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { Board } from '../types/exam';

interface LandingPageProps {
  onStartPreparing: () => void;
  onExploreSubjects: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPreparing,
  onExploreSubjects,
}) => {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Pakistani Board Exam Prep Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Prepare Smarter. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Score Better.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Practice topic-wise MCQs, identify your weak areas, and prepare for Sindh, Federal, Punjab, KPK, & Balochistan board exams with ExamMate.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onStartPreparing}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Start Preparing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreSubjects}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>Explore Subjects</span>
              </button>
            </div>

            {/* Board Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Supported Boards:</span>
              {['Sindh', 'Federal', 'Punjab', 'KPK', 'Balochistan'].map((b) => (
                <span key={b} className="bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-md text-slate-300">
                  {b} Board
                </span>
              ))}
            </div>
          </div>

          {/* Clean Dashboard Preview Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-slate-400 font-mono">ExamMate Dashboard</span>
              </div>

              {/* Progress Card Mock */}
              <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Physics — AC Generator</span>
                  <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Needs Practice (42%)
                  </span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[42%]" />
                </div>
                <p className="text-xs text-slate-300">
                  Recommendation: Complete 5 targeted MCQs on AC Generator slip rings.
                </p>
              </div>

              {/* Mini Accuracy Meter */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                  <div className="text-2xl font-bold text-emerald-400">80%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Overall Accuracy</div>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                  <div className="text-2xl font-bold text-blue-400">12 / 15</div>
                  <div className="text-xs text-slate-400 mt-0.5">Mock Test Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How ExamMate Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How ExamMate Works</h2>
          <p className="text-slate-600">A structured 4-step framework engineered for high board exam performance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Choose Your Board',
              desc: 'Select your specific provincial board (Sindh, Federal, Punjab, etc.) and class (9-12).',
              icon: BookOpen,
            },
            {
              step: '02',
              title: 'Practice Questions',
              desc: 'Solve chapter and topic-aligned MCQs with detailed answer explanations.',
              icon: Target,
            },
            {
              step: '03',
              title: 'Discover Weak Topics',
              desc: 'Our analytics engine automatically tracks your accuracy per topic.',
              icon: AlertTriangle,
            },
            {
              step: '04',
              title: 'Targeted Improvement',
              desc: 'Use Weak Topic Practice and Mistake Notebook to turn weaknesses into strengths.',
              icon: CheckCircle2,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="text-4xl font-extrabold text-slate-100 absolute top-4 right-4 select-none">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-slate-100/70 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Key Features</h2>
            <p className="text-slate-600">Everything you need to master your board exam syllabus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Topic-Wise MCQs',
                desc: 'Deep topic-level question bank mapped directly to Pakistani board textbooks.',
                icon: BookOpen,
              },
              {
                title: 'Timed Mock Exams',
                desc: 'Simulate real board exam environment with countdown timers and question flags.',
                icon: Clock,
              },
              {
                title: 'Weak Topic Analysis',
                desc: 'Instant visual breakdown identifying exact concepts requiring revision.',
                icon: AlertTriangle,
              },
              {
                title: 'Mistake Notebook',
                desc: 'Automatically collects every incorrect answer for targeted re-practice.',
                icon: BookmarkCheck,
              },
              {
                title: 'Progress Analytics',
                desc: 'Monitor accuracy trends, weekly question counts, and improvement curves.',
                icon: BarChart3,
              },
              {
                title: 'AI Smart Explanations',
                desc: 'Get instant, simple tutor explanations and generate similar practice questions.',
                icon: Sparkles,
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why ExamMate */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Why ExamMate?</h2>
            <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
              Standard study guides force students to solve thousands of random questions without feedback. ExamMate focuses on <strong className="text-white">targeted preparation</strong> — analyzing every response to show you exactly which topic is dragging down your score.
            </p>
            <div className="pt-2 flex items-center gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Board Syllabus Aligned</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Actionable Analytics</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 text-center lg:text-right">
            <button
              onClick={onStartPreparing}
              className="px-8 py-4 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-base shadow-lg transition-colors cursor-pointer"
            >
              Start Preparing Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
