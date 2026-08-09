import React from 'react';
import { LayoutDashboard, Target, BookOpen, Clock, BarChart3, BookmarkCheck, Globe, Shield } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode: boolean;
  mistakesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  isAdminMode,
  mistakesCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'mock_tests', label: 'Mock Tests', icon: Clock },
    { id: 'mistakes', label: 'Mistakes', icon: BookmarkCheck, badge: mistakesCount },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
  ];

  if (isAdminMode) {
    navItems.push({ id: 'admin', label: 'Admin', icon: Shield, badge: 0 });
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center w-full py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] mt-1 font-medium tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block fixed left-0 top-[65px] bottom-0 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 z-20 p-4 space-y-6">
        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white text-blue-600' : 'bg-slate-800 text-rose-400 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Landing Page Link */}
        <div className="pt-6 border-t border-slate-800 space-y-1">
          <button
            onClick={() => setActiveTab('landing')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'landing'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Landing Page</span>
          </button>
        </div>

        {/* Quick Motivation Card */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-1.5 mt-auto">
          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
            <span>🎯 Daily Goal</span>
          </div>
          <p className="text-slate-400">
            Targeted topic practice improves board exam accuracy by over 35%.
          </p>
        </div>
      </aside>
    </>
  );
};
