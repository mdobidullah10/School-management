import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { ParentDashboardPage } from './pages/ParentDashboardPage';
import { isNativeMobileApp } from './lib/auth';
import { App as CapApp } from '@capacitor/app';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isNative = isNativeMobileApp();

  // Android Native Hardware Back Button Handler
  React.useEffect(() => {
    let listener: any = null;
    if (isNative) {
      listener = CapApp.addListener('backButton', ({ canGoBack }) => {
        if (location.pathname === '/' || location.pathname === '/login') {
          CapApp.exitApp();
        } else if (canGoBack) {
          window.history.back();
        } else {
          navigate('/login');
        }
      });
    }
    return () => {
      if (listener && listener.remove) listener.remove();
    };
  }, [isNative, location.pathname, navigate]);

  const isAppDashboardOrLogin =
    location.pathname === '/login' ||
    location.pathname === '/student-dashboard' ||
    location.pathname === '/parent-dashboard' ||
    location.pathname === '/teacher-dashboard' ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/super-admin');

  // In Native App mode, direct root "/" directly to the 4-role login selection portal
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#18263A] antialiased">
      {!isAppDashboardOrLogin && <Header />}
      <main className="flex-1 w-full">
        <Routes>
          {/* In Native App mode, direct root directly to /login */}
          <Route
            path="/"
            element={isNative ? <Navigate to="/login" replace /> : <HomePage />}
          />
          <Route path="/home-web" element={<HomePage />} />
          <Route path="/login" element={<MobileLoginPage />} />
          <Route path="/student-dashboard" element={<StudentDashboardPage />} />
          <Route path="/parent-dashboard" element={<ParentDashboardPage />} />
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
