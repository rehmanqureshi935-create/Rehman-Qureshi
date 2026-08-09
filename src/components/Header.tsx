import React from 'react';
import { UserProfile } from '../types/exam';
import { Award, BookOpen, Shield, Flame, User, Settings, Sparkles } from 'lucide-react';

interface HeaderProps {
  userProfile: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  activeTab,
  setActiveTab,
  onOpenProfile,
  isAdminMode,
  setIsAdminMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-800 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            E
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-slate-900">ExamMate</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {userProfile.board} • Class {userProfile.classLevel}
            </p>
          </div>
        </div>

        {/* Right Side Tools & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Indicator */}
          <div
            onClick={onOpenProfile}
            title="Current Streak"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-xs font-semibold cursor-pointer hover:bg-amber-100/80 transition-colors"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{userProfile.streakDays} Day Streak</span>
          </div>

          {/* Board Badge (Mobile) */}
          <button
            onClick={onOpenProfile}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>{userProfile.board} ({userProfile.classLevel}th)</span>
          </button>

          {/* Mode Switcher: Student / Admin */}
          <button
            onClick={() => {
              const newMode = !isAdminMode;
              setIsAdminMode(newMode);
              if (newMode) setActiveTab('admin');
              else if (activeTab === 'admin') setActiveTab('dashboard');
            }}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all border ${
              isAdminMode
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdminMode ? 'Admin Mode' : 'Admin'}</span>
          </button>

          {/* Profile Settings Button */}
          <button
            onClick={onOpenProfile}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
            title="Student Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
