import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Search, ArrowRight, Play, BookOpen } from 'lucide-react';
import { Course } from '../types';
import { MOCK_COURSES } from '../services/mockData';
import { CourseCard } from '../components/ui/CourseCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';

export interface CoursesPageProps {
  onOpenCourseDetail: (courseId: string) => void;
  onStartInteractiveTask: () => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  onOpenCourseDetail,
  onStartInteractiveTask,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewModalCourse, setPreviewModalCourse] = useState<Course | null>(null);

  const categories = ['All', 'SAP / ERP', 'ERP Operations', 'Business Systems', 'Supply Chain'];

  const filteredCourses = MOCK_COURSES.filter((c) => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleSelectCourse = (course: Course) => {
    if (course.id === 'sap-fundamentals') {
      onOpenCourseDetail('sap-fundamentals');
    } else if (course.id === 'po-practice') {
      onStartInteractiveTask();
    } else {
      setPreviewModalCourse(course);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Academy Welcome & Overall Progress Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-md">
                Ederest Learning Path
              </span>
              <span className="text-xs text-gray-500">SAP & ERP Academy</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
              Enterprise Business Application Academy
            </h1>
            <p className="text-xs text-[#6B7280] mt-1 max-w-2xl leading-relaxed">
              Master enterprise concepts and software transactions. Choose between guided course learning journeys and hands-on procurement practice simulations.
            </p>
          </div>

          {/* Overall curriculum progress widget */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 min-w-[280px]">
            <div className="flex justify-between items-center text-xs font-bold text-gray-900 mb-1.5">
              <span>Overall Academy Progress</span>
              <span className="text-[#4F46E5]">75% Complete</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">
              15 subtasks completed / 20 total subtasks
            </p>
            <ProgressBar value={75} height={6} />
          </div>
        </div>

        {/* Featured Course: SAP Fundamentals Callout */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/50 p-4 rounded-xl border border-indigo-100">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#4F46E5] text-white rounded-xl shadow-xs flex-shrink-0">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">
                  Core Course: SAP Fundamentals
                </h2>
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Featured
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                4-step guided course covering ERP architecture, Master Data vs Transactions, and Procure-to-Pay workflows.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onOpenCourseDetail('sap-fundamentals')}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <span>Explore Course</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Course Categories">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                selectedCategory === cat
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] w-full sm:w-60"
            aria-label="Search courses by keyword"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onSelect={handleSelectCourse}
          />
        ))}
      </div>

      {/* Static Course Preview Modal */}
      <Modal
        isOpen={Boolean(previewModalCourse)}
        onClose={() => setPreviewModalCourse(null)}
        title={previewModalCourse?.title || 'Course Details'}
        description={`Category: ${previewModalCourse?.category} · Level: ${previewModalCourse?.level}`}
      >
        <div className="space-y-4 text-xs text-gray-600">
          <p className="leading-relaxed">
            {previewModalCourse?.description}
          </p>

          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Estimated Duration:</span>
              <span className="text-gray-900">{previewModalCourse?.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Completion XP:</span>
              <span className="font-bold text-amber-600">{previewModalCourse?.xp} XP</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Module Structure:</span>
              <span className="text-gray-900">{previewModalCourse?.totalSubtasks} lessons</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed">
              This course preview is simulated for curriculum demonstration. For the active interactive experiences, check out <strong>SAP Fundamentals</strong> or the <strong>Purchase Order Practice</strong> simulation.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setPreviewModalCourse(null)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => {
                setPreviewModalCourse(null);
                onOpenCourseDetail('sap-fundamentals');
              }}
              className="px-4 py-1.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] text-xs font-bold"
            >
              Open SAP Fundamentals
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
};
