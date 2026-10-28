import React, { useState } from 'react';
import { initialResults, schoolInfo } from '../data/schoolData';
import type { StudentResult } from '../types';
import { searchStudentResultFromDb } from '../services/schoolService';
import {
  Search,
  CheckCircle2,
  Printer,
  Download,
  GraduationCap,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const [examName, setExamName] = useState('Annual Examination 2026');
  const [selectedGrade, setSelectedGrade] = useState('Grade 7');
  const [rollOrId, setRollOrId] = useState('101');
  const [result, setResult] = useState<StudentResult | null>(initialResults[0]);
  const [errorMsg, setErrorMsg] = useState('');

  const [isLiveRecord, setIsLiveRecord] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const query = rollOrId.trim();

    if (!query) {
      setErrorMsg('Please enter a Roll Number or Student ID.');
      setResult(null);
      return;
    }

    const { result: found, isLiveDb } = await searchStudentResultFromDb(query, selectedGrade);
    setIsLiveRecord(isLiveDb);

    if (found) {
      setResult(found);
      setSelectedGrade(found.grade);
    } else {
      setResult(null);
      setErrorMsg(`No examination record found for Roll/ID "${rollOrId}". Try clicking one of the demo roll chips below.`);
    }
  };

  const handleQuickSelect = (roll: string, grade: string) => {
    setRollOrId(roll);
    setSelectedGrade(grade);
    const item = initialResults.find((r) => r.rollNumber === roll);
    if (item) {
      setResult(item);
      setErrorMsg('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      {/* Header Banner - hidden when printing */}
      <section className="bg-gradient-to-r from-[#0B2244] via-[#123B70] to-[#2167B2] text-white py-14 sm:py-16 relative overflow-hidden print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
              ACADEMIC EVALUATION & ARCHIVE
            </span>
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Online Examination Result Portal
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto">
            Check student report cards, subject-wise marks, GPA calculations, and download verified academic transcripts.
          </p>
        </div>
      </section>

      {/* Search Filter Card - hidden when printing */}
      <section className="py-8 bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSearch} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {/* Exam Name */}
              <div>
                <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                  Examination Session
                </label>
                <select
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-blue-100 focus:border-[#2167B2]"
                >
                  <option value="Annual Examination 2026">Annual Examination 2026</option>
                  <option value="Term 1 Mid-Term Examination 2026">Term 1 Mid-Term Examination 2026</option>
                  <option value="Class Assessment - Term 2">Class Assessment - Term 2</option>
                </select>
              </div>

              {/* Grade / Class */}
              <div>
                <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                  Target Grade
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-blue-100 focus:border-[#2167B2]"
                >
                  <option value="All">All Grades</option>
                  <option value="Grade 5">Grade 5 (Primary)</option>
                  <option value="Grade 7">Grade 7 (Middle School)</option>
                  <option value="Grade 10">Grade 10 (Secondary Track)</option>
                </select>
              </div>

              {/* Student Roll / ID */}
              <div>
                <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                  Student Roll / ID No.
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={rollOrId}
                    onChange={(e) => setRollOrId(e.target.value)}
                    placeholder="e.g. 101 or FLS-2026-101"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-blue-100 focus:border-[#2167B2]"
                  />
                  <button
                    type="submit"
                    className="bg-[#123B70] hover:bg-[#2167B2] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Search className="w-4 h-4 text-[#FFB800]" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Demo Test Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/60 text-xs">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                Demo Student Profiles:
              </span>
              <button
                type="button"
                onClick={() => handleQuickSelect('101', 'Grade 7')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#123B70] hover:text-[#123B70] transition-colors font-medium text-slate-700 cursor-pointer"
              >
                Roll 101: Tahmid (Grade 7, GPA 4.88)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('102', 'Grade 7')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#123B70] hover:text-[#123B70] transition-colors font-medium text-slate-700 cursor-pointer"
              >
                Roll 102: Samira (Grade 7, Golden 5.0)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('103', 'Grade 5')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#123B70] hover:text-[#123B70] transition-colors font-medium text-slate-700 cursor-pointer"
              >
                Roll 103: Ayman (Grade 5, GPA 4.75)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('104', 'Grade 10')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#123B70] hover:text-[#123B70] transition-colors font-medium text-slate-700 cursor-pointer"
              >
                Roll 104: Maliha (Grade 10, Golden 5.0)
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </section>

      {/* Marksheet Display Area */}
      <section className="py-10 px-4 sm:px-6 flex-1">
        <div className="max-w-4xl mx-auto">
          {result ? (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
              {/* Action Toolbar - hidden during print */}
              <div className="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-3 print:hidden">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">
                    {isLiveRecord ? 'Live Supabase Record' : 'Verified Academic Record'}
                  </span>
                  <span>•</span>
                  <span>Published on {result.publishedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 bg-[#123B70] hover:bg-[#2167B2] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Print Transcript</span>
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save as PDF</span>
                  </button>
                </div>
              </div>

              {/* Official Transcript Header */}
              <div className="text-center pb-6 border-b-2 border-[#123B70]/20 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <img
                    src="/images/logo.jpg"
                    alt="Future Leaders School Crest"
                    className="w-14 h-14 object-contain rounded-lg border border-slate-100 p-0.5"
                  />
                  <div className="text-left">
                    <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#123B70] tracking-tight leading-tight">
                      FUTURE LEADERS SCHOOL
                    </h2>
                    <p className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
                      Learn • Grow • Lead
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {schoolInfo.addressPlaceholder} • {schoolInfo.phonePlaceholder}
                    </p>
                  </div>
                </div>
                <div className="inline-block mt-3 bg-[#F3F8FD] px-5 py-1.5 rounded-full border border-blue-200/80">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#123B70]">
                    ACADEMIC TRANSCRIPT & PROGRESS REPORT
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-600">
                    {result.examName} • Academic Session: {result.session}
                  </p>
                </div>
              </div>

              {/* Student Metadata Card with Photo */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#F3F8FD] rounded-2xl p-4 sm:p-5 mb-6 text-xs border border-blue-100/80">
                {result.studentPhoto ? (
                  <img
                    src={result.studentPhoto}
                    alt={result.studentName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#123B70] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-sm shrink-0 border-2 border-white">
                    {result.studentName.charAt(0)}
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 w-full">
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Student Name</span>
                    <strong className="text-sm sm:text-base font-bold text-[#123B70] block leading-tight">{result.studentName}</strong>
                    {result.gender && <span className="text-[11px] text-slate-500 font-medium">({result.gender})</span>}
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Student ID / Roll</span>
                    <span className="font-bold text-slate-800 block text-xs sm:text-sm">{result.studentId}</span>
                    <span className="text-[11px] font-semibold text-[#2167B2]">Roll: {result.rollNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Class & Section</span>
                    <span className="font-bold text-slate-800 block text-xs sm:text-sm">{result.grade}</span>
                    <span className="text-[11px] text-slate-500">{result.section}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Attendance Rate</span>
                    <span className="font-bold text-emerald-700 block text-xs sm:text-sm">{result.attendance}</span>
                    {result.parentName && <span className="text-[10px] text-slate-500">Guardian: {result.parentName}</span>}
                  </div>
                </div>
              </div>

              {/* Summary Score Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#123B70] to-[#2167B2] text-white">
                  <span className="text-[10px] uppercase font-bold text-[#FFB800]">Grade Point Average (GPA)</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold">{result.gpa.toFixed(2)}</span>
                    <span className="text-xs text-slate-200">/ 5.00</span>
                  </div>
                  <span className="text-xs font-semibold text-[#FFB800] mt-0.5 block">{result.letterGrade}</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Marks Obtained</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-slate-800">{result.obtainedTotal}</span>
                    <span className="text-xs text-slate-400">/ {result.totalMarks}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {((result.obtainedTotal / result.totalMarks) * 100).toFixed(1)}% Aggregate
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Overall Assessment</span>
                  <div className="mt-1">
                    <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {result.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Class Standing: Rank #{result.positionInClass}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Institutional Seal</span>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#123B70]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Officially Certified</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Controller of Exams</span>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#123B70] text-white">
                      <th className="py-3 px-3.5 rounded-l-lg font-bold">Subject Name</th>
                      <th className="py-3 px-3 font-bold text-center">Full Marks</th>
                      <th className="py-3 px-3 font-bold text-center">Obtained Marks</th>
                      <th className="py-3 px-3 font-bold text-center">Letter Grade</th>
                      <th className="py-3 px-3 font-bold text-center">Grade Point</th>
                      <th className="py-3 px-3.5 rounded-r-lg font-bold">Faculty Observation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.subjects.map((sub, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="py-3 px-3.5 font-bold text-slate-800">{sub.name}</td>
                        <td className="py-3 px-3 text-center text-slate-500">{sub.fullMarks}</td>
                        <td className="py-3 px-3 text-center font-bold text-[#123B70]">{sub.obtainedMarks}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                              sub.grade === 'A+'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.grade === 'A'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-700">
                          {sub.gradePoint.toFixed(1)}
                        </td>
                        <td className="py-3 px-3.5 text-slate-500 italic text-[11px]">
                          {sub.comment || 'Good grasp of syllabus concepts.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Teacher Remarks & Signatures */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#123B70]">
                    Class Teacher / Academic Coordinator's Remarks:
                  </span>
                  <p className="text-xs text-slate-700 italic bg-[#F3F8FD] p-3 rounded-xl border border-blue-100">
                    "{result.teacherRemarks}"
                  </p>
                </div>

                <div className="flex flex-col justify-end text-center space-y-1 pt-6 sm:pt-0">
                  <div className="w-36 mx-auto border-b-2 border-slate-400 pb-1">
                    <span className="font-serif italic font-semibold text-slate-700 text-xs">Azizur Rahman</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#123B70]">Prof. Mohammad Azizur Rahman</span>
                  <span className="text-[10px] text-slate-400">Head of School & Principal</span>
                </div>
              </div>

              {/* Grading Scale Legend */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <span><strong>Grading Standard:</strong> 80–100% = A+ (5.0) | 70–79% = A (4.0) | 60–69% = A- (3.5) | 50–59% = B (3.0)</span>
                <span>Generated by Future Leaders School Academic Records Management System</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-slate-700">No Record Displayed</h3>
              <p className="text-xs text-slate-500">
                Enter your Roll Number (e.g. 101, 102, 103, 104) and select your target class to view your official report card.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
