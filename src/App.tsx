import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { GalleryPage } from './pages/GalleryPage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { ContactPage } from './pages/ContactPage';
import { ResultsPage } from './pages/ResultsPage';
import { StudyPlanPage } from './pages/StudyPlanPage';
import { AdminPage } from './pages/AdminPage';
import { TeachersPage } from './pages/TeachersPage';
import { MobileLoginPage } from './pages/MobileLoginPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { isNativeMobileApp, getCurrentUser } from './lib/auth';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isNative = isNativeMobileApp();
  const currentUser = getCurrentUser();

  const isAppDashboardOrLogin =
    location.pathname === '/login' ||
    location.pathname === '/student-dashboard' ||
    location.pathname === '/teacher-dashboard' ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/super-admin');

  // If running inside Native APK and at root "/", determine landing page
  const getInitialNativeRedirect = () => {
    if (!currentUser) return <Navigate to="/login" replace />;
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    if (currentUser.role === 'teacher') return <Navigate to="/teacher-dashboard" replace />;
    return <Navigate to="/student-dashboard" replace />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#18263A] antialiased">
      {!isAppDashboardOrLogin && <Header />}
      <main className="flex-1 w-full">
        <Routes>
          {/* In Native App mode, direct root to app login/dashboard */}
          <Route
            path="/"
            element={isNative ? getInitialNativeRedirect() : <HomePage />}
          />
          <Route path="/home-web" element={<HomePage />} />
          <Route path="/login" element={<MobileLoginPage />} />
          <Route path="/student-dashboard" element={<StudentDashboardPage />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/faculty" element={<TeachersPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/news" element={<NewsEventsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/portal" element={<MobileLoginPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/study-plan" element={<StudyPlanPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/dashboard" element={<AdminPage />} />
          <Route path="/super-admin" element={<AdminPage />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAppDashboardOrLogin && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
};

export default App;
