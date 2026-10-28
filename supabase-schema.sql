-- ==============================================================================
-- FUTURE LEADERS SCHOOL — SUPABASE DATABASE INITIALIZATION SCRIPT
-- Paste this entire script into your Supabase Dashboard > SQL Editor and click RUN.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Admissions Applications Table
CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  applying_grade TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  previous_school TEXT,
  message TEXT,
  status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Student Results & Transcripts Table
CREATE TABLE IF NOT EXISTS public.results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  student_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  exam_name TEXT NOT NULL,
  session TEXT NOT NULL,
  attendance TEXT DEFAULT '97%',
  gpa NUMERIC(3,2) NOT NULL,
  letter_grade TEXT NOT NULL,
  total_marks INT NOT NULL,
  obtained_total INT NOT NULL,
  position_in_class INT DEFAULT 1,
  status TEXT DEFAULT 'Passed',
  teacher_remarks TEXT,
  published_date DATE DEFAULT CURRENT_DATE,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Daily Study Plans Table
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  day_name TEXT NOT NULL,
  general_notice TEXT,
  periods JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Campus Notices & Circulars Table
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Academic',
  target_audience TEXT NOT NULL DEFAULT 'All Students & Parents',
  published_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) with Public Read / Write policies
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Allow public read & insert for school web operations
CREATE POLICY "Public can insert admissions" ON public.admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view admissions" ON public.admissions FOR SELECT USING (true);
CREATE POLICY "Public can update admissions" ON public.admissions FOR UPDATE USING (true);

CREATE POLICY "Public can view results" ON public.results FOR SELECT USING (true);
CREATE POLICY "Public can insert results" ON public.results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can delete results" ON public.results FOR DELETE USING (true);

CREATE POLICY "Public can view study plans" ON public.study_plans FOR SELECT USING (true);
CREATE POLICY "Public can insert study plans" ON public.study_plans FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Public can insert notices" ON public.notices FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA (Results & Admissions)
-- ==============================================================================

INSERT INTO public.results (student_id, roll_number, student_name, grade, section, exam_name, session, gpa, letter_grade, total_marks, obtained_total, position_in_class, status, teacher_remarks, subjects)
VALUES
(
  'FLS-2026-101', '101', 'Tahmid Hossain', 'Grade 7', 'A - Pioneers', 'Annual Examination 2026', '2026–2027', 4.88, 'A+', 700, 642, 2, 'Promoted with Distinction',
  'Tahmid demonstrates outstanding analytical competence and exemplary leadership in collaborative sessions.',
  '[
    {"name": "English Language & Literature", "fullMarks": 100, "obtainedMarks": 91, "grade": "A+", "gradePoint": 5.0},
    {"name": "Mathematics & Geometry", "fullMarks": 100, "obtainedMarks": 94, "grade": "A+", "gradePoint": 5.0},
    {"name": "Integrated Sciences", "fullMarks": 100, "obtainedMarks": 88, "grade": "A+", "gradePoint": 5.0},
    {"name": "Bangladesh & Global Studies", "fullMarks": 100, "obtainedMarks": 92, "grade": "A+", "gradePoint": 5.0},
    {"name": "Computer Science & ICT", "fullMarks": 100, "obtainedMarks": 96, "grade": "A+", "gradePoint": 5.0},
    {"name": "Bengali First Language", "fullMarks": 100, "obtainedMarks": 89, "grade": "A+", "gradePoint": 5.0},
    {"name": "Creative Arts & Physical Ed", "fullMarks": 100, "obtainedMarks": 92, "grade": "A+", "gradePoint": 5.0}
  ]'::jsonb
),
(
  'FLS-2026-102', '102', 'Samira Anjum', 'Grade 7', 'A - Pioneers', 'Annual Examination 2026', '2026–2027', 5.00, 'A+ (Golden)', 700, 678, 1, 'Promoted with Distinction',
  'Ranked 1st in Grade 7. Samira exhibits unparalleled academic dedication, intellectual curiosity, and courteous demeanor.',
  '[
    {"name": "English Language & Literature", "fullMarks": 100, "obtainedMarks": 97, "grade": "A+", "gradePoint": 5.0},
    {"name": "Mathematics & Geometry", "fullMarks": 100, "obtainedMarks": 99, "grade": "A+", "gradePoint": 5.0},
    {"name": "Integrated Sciences", "fullMarks": 100, "obtainedMarks": 95, "grade": "A+", "gradePoint": 5.0},
    {"name": "Bangladesh & Global Studies", "fullMarks": 100, "obtainedMarks": 94, "grade": "A+", "gradePoint": 5.0},
    {"name": "Computer Science & ICT", "fullMarks": 100, "obtainedMarks": 98, "grade": "A+", "gradePoint": 5.0},
    {"name": "Bengali First Language", "fullMarks": 100, "obtainedMarks": 96, "grade": "A+", "gradePoint": 5.0},
    {"name": "Creative Arts & Physical Ed", "fullMarks": 100, "obtainedMarks": 99, "grade": "A+", "gradePoint": 5.0}
  ]'::jsonb
);

INSERT INTO public.admissions (student_name, date_of_birth, applying_grade, parent_name, contact_number, email, previous_school, message, status)
VALUES
('Abrar Fahim', '2014-04-12', 'Grade 7 (Middle School)', 'Dr. Mohammad Kabir', '+880 1711-889900', 'dr.kabir@example.com', 'Dhaka Preparatory', 'Interested in STEAM club.', 'Interview Scheduled'),
('Zainab Hossain', '2022-09-18', 'Playgroup (Age 3+)', 'Nusrat Jahan', '+880 1819-223344', 'nusrat.j@example.com', NULL, 'Early application.', 'Pending Review');
