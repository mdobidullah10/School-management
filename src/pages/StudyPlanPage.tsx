import React, { useState } from 'react';
import { initialStudyPlans } from '../data/schoolData';
import type { DailyStudyPlan, StudyPeriod } from '../types';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckSquare,
  Square,
  AlertCircle,
  Printer,
  Sparkles,
  User,
  CheckCircle2,
} from 'lucide-react';

export const StudyPlanPage: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 7');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const availableGrades = ['Grade 5', 'Grade 7', 'Grade 10'];

  // Current active plan based on grade selection
  const currentPlan: DailyStudyPlan =
    initialStudyPlans.find((p) => p.grade === selectedGrade) || initialStudyPlans[0];

  const toggleTask = (periodIdx: number) => {
    const key = `${currentPlan.grade}-${periodIdx}`;
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const totalTasks = currentPlan.periods.filter((p) => p.homework && p.homework !== 'No homework during break.').length;
  const completedCount = currentPlan.periods.filter(
    (p, idx) => p.homework && p.homework !== 'No homework during break.' && completedTasks[`${currentPlan.grade}-${idx}`]
  ).length;

  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col w-full bg-[#F5F8FC] min-h-screen">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#0B2345] via-[#123B70] to-[#2563A6] text-white py-14 sm:py-18 relative overflow-hidden print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-slate-300 mb-3" aria-label="Breadcrumb">
            <a href="/" className="hover:text-[#F2B544] transition-colors">Home</a>
            <span className="opacity-60">/</span>
            <a href="/academics" className="hover:text-[#F2B544] transition-colors">Academics</a>
            <span className="opacity-60">/</span>
            <span className="text-[#F2B544] font-semibold">Study Plan</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#F2B544]">
              DAILY ACADEMIC ROADMAP
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Daily Study Plan & Class Routine
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-2xl">
            Stay on track with daily classroom schedules, syllabus topics, teacher instructions, and homework assignments.
          </p>
        </div>
      </section>

      {/* Grade Selector & Control Bar */}
      <section className="py-6 bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Grade selection tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-2 hidden sm:inline">
              Select Grade:
            </span>
            {availableGrades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedGrade === grade
                    ? 'bg-[#123B70] text-white shadow-sm'
                    : 'bg-[#F3F8FD] text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>{currentPlan.dayName}, {currentPlan.date}</span>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-[#123B70] hover:bg-[#2167B2] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Print Study Sheet</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Cols: Timeline of Periods & Homework */}
          <div className="lg:col-span-8 space-y-6">
            {/* Homeroom Notice Card */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-950 block text-xs uppercase tracking-wide">
                  Homeroom & Academic Coordinator Notice ({currentPlan.grade})
                </strong>
                <p className="mt-0.5 leading-relaxed">{currentPlan.generalNotice}</p>
              </div>
            </div>

            {/* Periods Cards List */}
            <div className="space-y-4">
              {currentPlan.periods.map((period: StudyPeriod, idx: number) => {
                const isCompleted = !!completedTasks[`${currentPlan.grade}-${idx}`];
                const hasHomework = period.homework && period.homework !== 'No homework during break.';

                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-xs hover:shadow-md ${
                      isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200/90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-[#F3F8FD] text-[#123B70] font-bold text-xs flex items-center justify-center border border-blue-100">
                          {idx + 1}
                        </span>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-[#123B70]">
                          {period.subject}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                          <Clock className="w-3 h-3 text-[#2167B2]" />
                          {period.time}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-600">
                          <User className="w-3 h-3 text-slate-400" />
                          {period.teacher}
                        </span>
                      </div>
                    </div>

                    {/* Topic in Class */}
                    <div className="mb-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Class Topic & Learning Objective:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                        {period.topic}
                      </p>
                      {period.materials && (
                        <p className="text-[11px] text-slate-500 mt-1">
                          <strong className="text-slate-600">Required Books / Materials:</strong> {period.materials}
                        </p>
                      )}
                    </div>

                    {/* Assigned Homework & Interactive Checkbox */}
                    {hasHomework && (
                      <div
                        onClick={() => toggleTask(idx)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isCompleted
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                            : 'bg-[#F3F8FD] border-blue-100 hover:border-blue-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            className="mt-0.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                          >
                            {isCompleted ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-wide text-[#123B70]">
                                Assigned Homework
                              </span>
                              {period.priority && (
                                <span
                                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                    period.priority === 'High'
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}
                                >
                                  {period.priority} Priority
                                </span>
                              )}
                            </div>
                            <p className={`text-xs ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800 font-medium'}`}>
                              {period.homework}
                            </p>
                          </div>
                        </div>

                        {period.dueDate && (
                          <div className="shrink-0 text-right">
                            <span className="text-[10px] font-bold text-slate-500 block">Due Date:</span>
                            <span className="text-[11px] font-semibold text-[#123B70]">{period.dueDate}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 4 Cols: Progress Tracker & Student Resources */}
          <div className="lg:col-span-4 space-y-6">
            {/* Homework Completion Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif font-bold text-base text-[#123B70]">
                  Daily Homework Progress
                </h4>
                <span className="text-xs font-bold text-[#FFB800] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {progressPercent}% Done
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-gradient-to-r from-[#2167B2] to-[#FFB800] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 mb-4">
                You have completed <strong>{completedCount}</strong> of <strong>{totalTasks}</strong> daily assignments for {currentPlan.grade}.
              </p>

              {progressPercent === 100 && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Brilliant! All daily tasks checked off!</span>
                </div>
              )}
            </div>

            {/* Quick Links & Study Tools */}
            <div className="bg-[#F3F8FD] rounded-3xl p-6 border border-blue-100 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-base text-[#123B70]">
                Study Support & Guidelines
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-[#2167B2] shrink-0 mt-0.5" />
                  <span>Submit homework through portal or physical notebook as specified.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#2167B2] shrink-0 mt-0.5" />
                  <span>Allocate 45 minutes of evening revision per core STEM subject.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                  <span>Need help? Subject teachers hold tutorial office hours after 3:30 PM.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
