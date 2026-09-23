import React from 'react';
import { Clock, Trophy, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { Course } from '../../types';
import { ProgressBar } from './ProgressBar';

export interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] hover:border-[#4F46E5]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Top metadata tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#4F46E5]">
            {course.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Trophy className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              {course.xp} XP
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start gap-2">
          <h3 className="text-base font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
            {course.title}
          </h3>
          {course.isInteractive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Sparkles className="w-3 h-3 text-emerald-600" aria-hidden="true" />
              Interactive
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-[#6B7280] mt-2 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Progress Section */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-[#6B7280] mb-1.5">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  course.progressPercent === 100
                    ? 'bg-emerald-500'
                    : course.progressPercent > 0
                    ? 'bg-[#4F46E5]'
                    : 'bg-gray-300'
                }`}
                aria-hidden="true"
              />
              {course.subtasksCompleted} of {course.totalSubtasks} steps
            </span>
            <span className="font-semibold text-[#111827]">{course.progressPercent}%</span>
          </div>
          <ProgressBar value={course.progressPercent} height={5} />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3 bg-[#F9FAFB] border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-[#6B7280] flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          {course.level}
        </span>
        <button
          onClick={() => onSelect(course)}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#4F46E5] ${
            course.isInteractive
              ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm'
              : 'text-[#4F46E5] hover:bg-[#EEF2FF]'
          }`}
          aria-label={course.isInteractive ? `Start interactive task: ${course.title}` : `View details: ${course.title}`}
        >
          <span>{course.isInteractive ? 'Start Practice' : 'Preview'}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
