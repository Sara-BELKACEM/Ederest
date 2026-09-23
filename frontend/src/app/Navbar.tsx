import React from 'react';
import { Flame, Trophy, Shield, GraduationCap, LayoutDashboard, Sparkles, BookOpen } from 'lucide-react';
import { UserRole } from '../types';

export interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: 'courses' | 'practice' | 'dashboard';
  onNavigate: (tab: 'courses' | 'practice' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onNavigate,
}) => {
  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('courses')}
            className="flex items-center gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-lg p-1"
            aria-label="Ederest Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white font-black text-lg shadow-sm">
              E
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-[#111827]">
                EDEREST
              </span>
              <span className="block text-[10px] font-semibold text-[#4F46E5] uppercase tracking-wider">
                Academy & DAP
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('courses')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                activeTab === 'courses'
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Courses</span>
            </button>

            <button
              onClick={() => onNavigate('practice')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                activeTab === 'practice'
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Purchase Order Practice</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                Interactive
              </span>
            </button>

            <button
              onClick={() => {
                onRoleChange('admin');
                onNavigate('dashboard');
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                activeTab === 'dashboard'
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
              <span>Admin Dashboard</span>
            </button>
          </nav>
        </div>

        {/* Right side: Gamification Chips + Role Toggle + Avatar */}
        <div className="flex items-center gap-3">
          {/* Gamification chips from ui-ux-patterns.md */}
          <div className="hidden sm:flex items-center gap-2">
            {/* XP Chip */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
              <Trophy className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span>306 XP</span>
            </div>

            {/* Streak Chip */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700">
              <Flame className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
              <span>0 Days</span>
            </div>
          </div>

          {/* Quick Role Switcher for Hackathon Demo */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs">
            <button
              onClick={() => {
                onRoleChange('learner');
                if (activeTab === 'dashboard') onNavigate('courses');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                currentRole === 'learner'
                  ? 'bg-white text-[#4F46E5] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Learner</span>
            </button>

            <button
              onClick={() => {
                onRoleChange('admin');
                onNavigate('dashboard');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Avatar with Presence Indicator */}
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full bg-[#4F46E5] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs"
              aria-label="User profile: B.Y."
            >
              BY
            </div>
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
              title="Online"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
