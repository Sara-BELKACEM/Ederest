import React, { useState } from 'react';
import { UserRole } from './types';
import { Navbar } from './app/Navbar';
import { CoursesPage } from './pages/CoursesPage';
import { PracticeTaskPage } from './pages/PracticeTaskPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { SapFundamentalsGuidePage } from './pages/SapFundamentalsGuidePage';

export const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('learner');
  const [activeTab, setActiveTab] = useState<'courses' | 'course-detail' | 'sap-guide' | 'practice' | 'dashboard'>('courses');

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans">
      {/* Persistent Navigation Bar with Role Switcher */}
      <Navbar
        currentRole={role}
        onRoleChange={(newRole) => {
          setRole(newRole);
          if (newRole === 'admin') {
            setActiveTab('dashboard');
          } else if (activeTab === 'dashboard') {
            setActiveTab('courses');
          }
        }}
        activeTab={activeTab === 'course-detail' || activeTab === 'sap-guide' ? 'courses' : activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          if (tab === 'dashboard') {
            setRole('admin');
          } else {
            setRole('learner');
          }
        }}
      />

      {/* Main Dynamic View Content */}
      <div className="flex-1">
        {activeTab === 'courses' && (
          <CoursesPage
            onOpenCourseDetail={() => setActiveTab('course-detail')}
            onStartInteractiveTask={() => setActiveTab('practice')}
          />
        )}

        {activeTab === 'course-detail' && (
          <CourseDetailPage
            onBackToCourses={() => setActiveTab('courses')}
            onStartCourseGuide={() => setActiveTab('sap-guide')}
            onOpenPurchaseOrderPractice={() => setActiveTab('practice')}
          />
        )}

        {activeTab === 'sap-guide' && (
          <SapFundamentalsGuidePage
            onBackToCourseDetail={() => setActiveTab('course-detail')}
            onOpenPurchaseOrderPractice={() => setActiveTab('practice')}
            onOpenDashboard={() => {
              setRole('admin');
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeTaskPage
            onBackToCourses={() => setActiveTab('courses')}
            onOpenDashboard={() => {
              setRole('admin');
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'dashboard' && <AdminDashboardPage />}
      </div>

      {/* Accessible Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">EDEREST</span>
            <span>· EdTech Hack&Hire Prototype</span>
          </div>
          <p className="text-[11px] text-gray-400">
            🔒 Privacy-by-design: No personal identifiers collected. Fully keyboard-accessible.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('courses')}
              className="hover:text-[#4F46E5] focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded"
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className="hover:text-[#4F46E5] focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded"
            >
              Practice Task
            </button>
            <button
              onClick={() => {
                setRole('admin');
                setActiveTab('dashboard');
              }}
              className="hover:text-[#4F46E5] focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
