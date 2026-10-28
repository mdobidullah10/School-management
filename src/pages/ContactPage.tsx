import React, { useState } from 'react';
import { schoolInfo } from '../data/schoolData';
import type { ContactFormData } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Loader2,
} from 'lucide-react';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from '../components/common/SocialIcons';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Please provide an inquiry subject.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please write a message with at least 10 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0B2244] via-[#123B70] to-[#2167B2] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
              GET IN TOUCH
            </span>
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Contact Future Leaders School
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
            We welcome inquiries from prospective families, educators, and community partners. Reach out to plan a visit or ask questions.
          </p>
        </div>
      </section>

      {/* Main Form & Contact Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 7 Cols: Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                SEND A MESSAGE
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B70] mt-1 mb-2">
                How Can We Assist You?
              </h3>
              <p className="text-xs text-[#65758B] mb-6">
                Our administrative staff reviews and responds to messages within one business day.
              </p>

              {submitted ? (
                <div className="rounded-2xl p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                    <h4 className="font-serif font-bold text-lg">Message Received!</h4>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Thank you for reaching out to Future Leaders School. A member of our admissions or administrative team will review your inquiry shortly.
                  </p>
                  <p className="text-[11px] text-emerald-700 bg-white/70 p-3 rounded-lg border border-emerald-100">
                    <strong>Demo Notice:</strong> This contact form demonstration verified all inputs correctly. Connect with an email API (such as SendGrid or Nodemailer) for production delivery.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-[#123B70] hover:underline cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Nusrat Jahan"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 ${
                        errors.fullName
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-200 focus:ring-blue-100 focus:border-[#2167B2]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
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
                      placeholder="e.g. parent@example.com"
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

                  <div>
                    <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                      Subject / Topic <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Admission Query for Grade 3"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 ${
                        errors.subject
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-200 focus:ring-blue-100 focus:border-[#2167B2]'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share your questions or visit requirements..."
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#18263A] bg-white focus:outline-none focus:ring-2 ${
                        errors.message
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-200 focus:ring-blue-100 focus:border-[#2167B2]'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#123B70] hover:bg-[#2167B2] text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#FFB800]" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Inquiry Message</span>
                          <Send className="w-4 h-4 text-[#FFB800]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right 5 Cols: Contact Details & Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Institutional Details */}
              <div className="bg-[#F3F8FD] rounded-3xl p-7 border border-blue-100 shadow-sm space-y-6">
                <h4 className="font-serif font-bold text-xl text-[#123B70] border-b border-blue-200/60 pb-3">
                  Campus Address & Contacts
                </h4>

                <div className="space-y-4 text-xs text-[#18263A]">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#123B70] shrink-0 border border-blue-100">
                      <MapPin className="w-5 h-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <span className="font-bold text-[#123B70] block mb-0.5">Campus Location</span>
                      <p className="text-slate-600 leading-relaxed">{schoolInfo.addressPlaceholder}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#123B70] shrink-0 border border-blue-100">
                      <Phone className="w-5 h-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <span className="font-bold text-[#123B70] block mb-0.5">Telephone Inquiries</span>
                      <p className="text-slate-600">{schoolInfo.phonePlaceholder}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#123B70] shrink-0 border border-blue-100">
                      <Mail className="w-5 h-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <span className="font-bold text-[#123B70] block mb-0.5">Email Communications</span>
                      <p className="text-slate-600">{schoolInfo.emailPlaceholder}</p>
                      <p className="text-slate-600">{schoolInfo.infoEmailPlaceholder}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#123B70] shrink-0 border border-blue-100">
                      <Clock className="w-5 h-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <span className="font-bold text-[#123B70] block mb-0.5">Office & Visitor Hours</span>
                      <p className="text-slate-600">{schoolInfo.officeHoursPlaceholder}</p>
                    </div>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="pt-4 border-t border-blue-200/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#123B70] block mb-2">
                    Official Social Channels
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={schoolInfo.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white text-[#123B70] hover:bg-[#123B70] hover:text-white flex items-center justify-center border border-blue-100 transition-colors"
                      aria-label="Facebook placeholder"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={schoolInfo.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white text-[#123B70] hover:bg-[#123B70] hover:text-white flex items-center justify-center border border-blue-100 transition-colors"
                      aria-label="Twitter placeholder"
                    >
                      <TwitterIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={schoolInfo.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white text-[#123B70] hover:bg-[#123B70] hover:text-white flex items-center justify-center border border-blue-100 transition-colors"
                      aria-label="Instagram placeholder"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={schoolInfo.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white text-[#123B70] hover:bg-[#123B70] hover:text-white flex items-center justify-center border border-blue-100 transition-colors"
                      aria-label="YouTube placeholder"
                    >
                      <YoutubeIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Clearly Labeled Map Section */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif font-bold text-base text-[#123B70] flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#FFB800]" />
                    <span>Campus Location Map</span>
                  </h4>
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-200">
                    Placeholder Location
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden h-52 bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#123B70] text-[#FFB800] flex items-center justify-center shadow-lg mb-2 animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h5 className="font-serif font-bold text-sm text-[#123B70]">
                    Future Leaders School Campus
                  </h5>
                  <p className="text-[11px] text-[#65758B] max-w-xs mt-1">
                    Road 11, Block D, Dhaka, Bangladesh (Demo Placement)
                  </p>
                  <span className="mt-2 text-[10px] text-slate-500 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                    Embed Google Maps API or OpenStreetMap iframe here
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
