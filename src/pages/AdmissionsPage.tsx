import React, { useState } from 'react';
import { admissionsSteps, requiredDocuments, faqs, schoolInfo } from '../data/schoolData';
import type { AdmissionFormData, FaqItem } from '../types';
import { submitAdmissionToDb } from '../services/schoolService';
import {
  Calendar,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Loader2,
  ChevronDown,
} from 'lucide-react';

export const AdmissionsPage: React.FC = () => {
  const [formData, setFormData] = useState<AdmissionFormData>({
    studentName: '',
    dateOfBirth: '',
    applyingGrade: '',
    parentName: '',
    contactNumber: '',
    email: '',
    previousSchool: '',
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdmissionFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<AdmissionFormData | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const admissionFaqs = faqs.filter((f: FaqItem) => f.category === 'Admissions' || f.category === 'General');

  const gradeOptions = [
    'Playgroup (Age 3+)',
    'Nursery / Kindergarten (Age 4-5)',
    'Grade 1 (Primary)',
    'Grade 2 (Primary)',
    'Grade 3 (Primary)',
    'Grade 4 (Primary)',
    'Grade 5 (Primary)',
    'Grade 6 (Middle School)',
    'Grade 7 (Middle School)',
    'Grade 8 (Middle School)',
    'Grade 9 (Secondary)',
    'Grade 10 (Secondary)',
  ];

  const validate = (): boolean => {
    const errs: Partial<Record<keyof AdmissionFormData, string>> = {};

    if (!formData.studentName.trim()) {
      errs.studentName = "Please enter student's full name.";
    }

    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Please select student date of birth.';
    }

    if (!formData.applyingGrade) {
      errs.applyingGrade = 'Please select the applying grade.';
    }

    if (!formData.parentName.trim()) {
      errs.parentName = "Please enter parent/guardian's name.";
    }

    // Phone validation
    const phoneRegex = /^[+0-9\s-]{8,18}$/;
    if (!formData.contactNumber.trim()) {
      errs.contactNumber = 'Please enter a contact telephone number.';
    } else if (!phoneRegex.test(formData.contactNumber.trim())) {
      errs.contactNumber = 'Please enter a valid telephone number format.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Please enter parent/guardian email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.consent) {
      errs.consent = 'You must confirm consent to proceed.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const res = await submitAdmissionToDb(formData);
    setIsLiveConnected(res.isLiveDb);

    setIsSubmitting(false);
    setSubmittedData({ ...formData });
    setFormData({
      studentName: '',
      dateOfBirth: '',
      applyingGrade: '',
      parentName: '',
      contactNumber: '',
      email: '',
      previousSchool: '',
      message: '',
      consent: false,
    });
    setErrors({});
  };

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Hero Banner with Breadcrumbs */}
      <section className="bg-gradient-to-r from-[#0B2345] via-[#123B70] to-[#2563A6] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-slate-300 mb-3" aria-label="Breadcrumb">
            <a href="/" className="hover:text-[#F2B544] transition-colors">Home</a>
            <span className="opacity-60">/</span>
            <span className="text-[#F2B544] font-semibold">Admissions</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#F2B544]">
              JOIN OUR SCHOOL FAMILY
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Admissions & Enrollment
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-2xl">
            Take the first step toward your child’s transformative educational journey at Future Leaders School. Applications are now welcomed for the 2026–2027 academic session.
          </p>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="py-16 bg-[#F5F8FC] border-b border-[#E1E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#123B70] block mb-1">
              ADMISSION PROCESS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2345]">
              Four Simple Steps to Enroll
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#66758A]">
              Our transparent and supportive admissions procedure is crafted to help families smoothly transition their children into school.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {admissionsSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-6 border border-[#E1E8F0] shadow-xs hover:shadow-md hover:border-[#123B70] transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="font-serif text-3xl font-extrabold text-[#F2B544] block mb-2">
                    {step.step}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#0B2345] mb-2 group-hover:text-[#123B70] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#66758A] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form & Requirements 2-Column Section */}
      <section className="py-20 bg-[#F3F8FD]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Interactive Application Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
              <div className="border-b border-slate-100 pb-5 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                  ONLINE APPLICATION PORTAL
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B70] mt-1">
                  Apply for Admission
                </h3>
                <p className="text-xs text-[#65758B] mt-1">
                  Fill in the candidate details below. Our admissions team will connect with you to confirm appointment schedules.
                </p>
              </div>

              {submittedData ? (
                <div className="rounded-2xl p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-serif font-bold text-lg text-emerald-950">
                        {isLiveConnected ? 'Application Saved to Supabase Database!' : 'Application Verified & Submitted!'}
                      </h4>
                      <p className="text-xs text-emerald-800">
                        Thank you for applying for <strong>{submittedData.studentName}</strong> ({submittedData.applyingGrade}).
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 text-xs space-y-1.5 border border-emerald-100 text-slate-700">
                    <p><strong>Parent/Guardian:</strong> {submittedData.parentName}</p>
                    <p><strong>Contact Email:</strong> {submittedData.email}</p>
                    <p><strong>Contact Telephone:</strong> {submittedData.contactNumber}</p>
                    <p><strong>Date of Birth:</strong> {submittedData.dateOfBirth}</p>
                    {submittedData.previousSchool && (
                      <p><strong>Previous Institution:</strong> {submittedData.previousSchool}</p>
                    )}
                  </div>

                  <div className={`rounded-xl p-3 border text-[11px] flex items-start gap-2 ${
                    isLiveConnected ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900' : 'bg-blue-50 border-blue-200 text-[#123B70]'
                  }`}>
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#123B70]" />
                    <div>
                      {isLiveConnected ? (
                        <span><strong>Database Status:</strong> Record successfully written to your live Supabase <code>admissions</code> table.</span>
                      ) : (
                        <span><strong>Database Notice:</strong> Supabase client is connected. Run the <code>supabase-schema.sql</code> script in your Supabase SQL editor to enable live database writes.</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmittedData(null)}
                    className="inline-flex items-center gap-2 bg-[#123B70] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#2167B2] transition-colors cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Student Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                      Student’s Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="e.g. Abrar Fahim"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 ${
                        errors.studentName
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-200 focus:ring-blue-100 focus:border-[#2167B2]'
                      }`}
                    />
                    {errors.studentName && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.studentName}
                      </p>
                    )}
                  </div>

                  {/* DOB & Grade Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                        Date of Birth <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 ${
                          errors.dateOfBirth
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-slate-200 focus:ring-blue-100 focus:border-[#2167B2]'
                        }`}
                      />
                      {errors.dateOfBirth && (
                        <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                        Applying Grade <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.applyingGrade}
                        onChange={(e) => setFormData({ ...formData, applyingGrade: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 ${
                          errors.applyingGrade
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-slate-200 focus:ring-blue-100 focus:border-[#2167B2]'
                        }`}
                      >
                        <option value="">Select Target Grade</option>
                        {gradeOptions.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      {errors.applyingGrade && (
                        <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.applyingGrade}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Parent Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                      Parent / Guardian Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="e.g. Dr. Mohammad Kabir"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 ${
                        errors.parentName
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-200 focus:ring-blue-100 focus:border-[#2167B2]'
                      }`}
                    />
                    {errors.parentName && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.parentName}
                      </p>
                    )}
                  </div>

                  {/* Contact Number & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                        Contact Telephone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                        placeholder="+880 1711-XXXXXX"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 ${
                          errors.contactNumber
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-slate-200 focus:ring-blue-100 focus:border-[#2167B2]'
                        }`}
                      />
                      {errors.contactNumber && (
                        <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.contactNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="parent@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-slate-200 focus:ring-blue-100 focus:border-[#2167B2]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Previous School */}
                  <div>
                    <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                      Previous School Attended (If applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      placeholder="School name and location"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2167B2]"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                      Additional Notes or Inquiries
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any specific interests, medical needs, or academic queries..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2167B2]"
                    />
                  </div>

                  {/* Consent checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-1 h-4 w-4 text-[#123B70] rounded border-slate-300 focus:ring-[#FFB800]"
                      />
                      <span className="text-xs text-slate-600 leading-tight">
                        I confirm that the provided information is accurate and agree to be contacted by Future Leaders School regarding the admission process.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.consent}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#123B70] hover:bg-[#2167B2] text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-[#FFB800]" />
                          <span>Processing Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Online Application</span>
                          <ArrowRight className="w-4 h-4 text-[#FFB800]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Required Documents & Important Dates */}
            <div className="lg:col-span-5 space-y-8">
              {/* Important Dates Box */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md">
                <div className="flex items-center gap-2.5 mb-4 text-[#123B70]">
                  <Calendar className="w-5 h-5 text-[#FFB800]" />
                  <h4 className="font-serif font-bold text-lg">Key Admission Dates (Sample)</h4>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">Application Open:</span>
                    <span className="text-[#2167B2] font-medium">Ongoing for 2026–27</span>
                  </li>
                  <li className="flex items-start justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">Interaction Sessions:</span>
                    <span className="text-[#2167B2] font-medium">Weekly by Appointment</span>
                  </li>
                  <li className="flex items-start justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">Orientation Day:</span>
                    <span className="text-[#2167B2] font-medium">Early January 2027</span>
                  </li>
                  <li className="flex items-start justify-between">
                    <span className="font-semibold text-slate-800">Classes Commence:</span>
                    <span className="text-[#2167B2] font-medium">Mid January 2027</span>
                  </li>
                </ul>
              </div>

              {/* Required Documents Checklist */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md">
                <div className="flex items-center gap-2.5 mb-4 text-[#123B70]">
                  <FileCheck className="w-5 h-5 text-[#10B981]" />
                  <h4 className="font-serif font-bold text-lg">Required Documents Checklist</h4>
                </div>
                <p className="text-xs text-[#65758B] mb-4">
                  Please prepare the following documents before attending your scheduled campus interaction:
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {requiredDocuments.map((doc: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Help & Contact Desk */}
              <div className="bg-blue-50/70 rounded-3xl p-6 border border-blue-100 text-xs text-[#123B70] space-y-2">
                <h5 className="font-serif font-bold text-sm">Need Help with Admissions?</h5>
                <p className="text-[#65758B]">
                  Our admission coordinators are available during campus office hours:
                </p>
                <p className="font-semibold text-[#123B70]">
                  Hotline: {schoolInfo.phonePlaceholder}
                </p>
                <p className="text-slate-600">
                  Email: {schoolInfo.emailPlaceholder}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
                ADMISSION FAQS
              </span>
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B70]">
              Common Questions About Enrollment
            </h2>
            <p className="mt-3 text-base text-[#65758B]">
              Clear guidance on age prerequisites, transport coverage, and school evaluations.
            </p>
          </div>

          <div className="space-y-3">
            {admissionFaqs.map((faq: FaqItem, idx: number) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#123B70] hover:text-[#2167B2] focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FFB800]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#65758B] leading-relaxed border-t border-slate-100 bg-[#F3F8FD]/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
