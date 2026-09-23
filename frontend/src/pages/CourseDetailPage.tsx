import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Trophy,
  CheckCircle2,
  Sparkles,
  Play,
  Layers,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { MOCK_COURSES } from '../services/mockData';
import { ProgressBar } from '../components/ui/ProgressBar';

export interface CourseDetailPageProps {
  onBackToCourses: () => void;
  onStartCourseGuide: () => void;
  onOpenPurchaseOrderPractice: () => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  onBackToCourses,
  onStartCourseGuide,
  onOpenPurchaseOrderPractice,
}) => {
  const course = MOCK_COURSES.find((c) => c.id === 'sap-fundamentals') || MOCK_COURSES[0];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <button
          onClick={onBackToCourses}
          className="flex items-center gap-1 hover:text-[#4F46E5] focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded p-0.5"
          aria-label="Back to course catalog"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Courses</span>
        </button>
        <span>/</span>
        <span className="font-semibold text-gray-900">{course.title}</span>
      </div>

      {/* Main Course Hero Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-md">
                {course.category}
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                Interactive Course Guide
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Level: {course.level}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              {course.title}
            </h1>

            <p className="text-sm text-gray-600 leading-relaxed">
              {course.overview || course.description}
            </p>

            {/* Metadata Chips */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
                Duration: {course.duration}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Trophy className="w-4 h-4 text-amber-500" aria-hidden="true" />
                {course.xp} Total XP
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Layers className="w-4 h-4 text-gray-400" aria-hidden="true" />
                4 Guided Modules
              </span>
            </div>
          </div>

          {/* Progress Box & Quick Start Action */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-5 min-w-[280px] space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-900 mb-1.5">
                <span>Course Progress</span>
                <span className="text-[#4F46E5]">{course.progressPercent}%</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">
                {course.subtasksCompleted} of {course.totalSubtasks} modules completed
              </p>
              <ProgressBar value={course.progressPercent} height={6} />
            </div>

            <button
              onClick={onStartCourseGuide}
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold px-4 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4F46E5] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" aria-hidden="true" />
              <span>Start SAP Fundamentals Guide</span>
            </button>

            <button
              onClick={onOpenPurchaseOrderPractice}
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
              <span>Open Purchase Order Practice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Learning Objectives Grid */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#4F46E5]" aria-hidden="true" />
          <h2 className="text-base font-bold text-[#111827]">
            Course Learning Objectives
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.learningObjectives?.map((objective, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-100 bg-[#F9FAFB] flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Objective {idx + 1}
                </span>
                <p className="text-xs text-gray-800 font-medium mt-0.5 leading-relaxed">
                  {objective}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Independent Experiences Banner */}
      <div className="bg-gradient-to-r from-indigo-50/70 to-emerald-50/60 border border-indigo-100/90 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
          <span>Two Connected Guided Experiences on One Platform</span>
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          Ederest provides both theoretical comprehension and hands-on software mastery. Choose where to begin:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-indigo-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider block">
                EXPERIENCE 1 · CONCEPTUAL
              </span>
              <h4 className="text-xs font-bold text-gray-900 mt-1">
                SAP Fundamentals Course Guide
              </h4>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                4-step guided journey through ERP architecture, Master Data vs Transactions, and Procure-to-Pay workflows.
              </p>
            </div>
            <button
              onClick={onStartCourseGuide}
              className="mt-3 text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1 text-left"
            >
              <span>Launch Course Guide &rarr;</span>
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                EXPERIENCE 2 · PRACTICAL
              </span>
              <h4 className="text-xs font-bold text-gray-900 mt-1">
                Purchase Order Practice Simulator
              </h4>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                4-step hands-on mock ERP software interface for Transaction ME21N: Vendor, Material, Quantity, and Submit.
              </p>
            </div>
            <button
              onClick={onOpenPurchaseOrderPractice}
              className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 text-left"
            >
              <span>Open PO Practice Simulator &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
