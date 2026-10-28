# Future Leaders School 🎓

> **Tagline:** Learn • Grow • Lead  
> A premium, modern, production-grade institutional school website and management suite designed for **Future Leaders School** in Bangladesh.

---

## 🌟 Key Features

### 🏛️ Public Institutional Portal
- **Flagship Home Page:** Visually stunning hero section, official crest, 5 school highlights, philosophy overview, "Why Choose Us", 4 academic program tiers, learning experience pillars, gallery preview with lightbox, news & announcements, and parent testimonials.
- **About Us:** School history, Vision, Mission, 6 Core Values, campus facilities, and leadership profiles.
- **Academics:** Pedagogical framework, bilingual education, STEAM integration, co-curricular clubs, and interactive FAQ accordion.
- **Admissions:** 4-step admission guide, required document checklist, important dates, and a fully validated online admission application form.
- **Photo Gallery:** Filterable campus life photo gallery (*Campus, Classrooms, Activities, Sports, Events*) with a responsive, keyboard-accessible fullscreen lightbox.
- **News & Events:** Live keyword search, category filtering, event timeline, and article reader modal.
- **Contact Us:** Validated inquiry form, office hours, telephone hotline, email, and campus location map placeholder.

### 📊 Online Examination Result Checker (`/results`)
- Search by **Student Roll Number** or **Student ID** across examination sessions (*Annual Exam, Mid-Term*).
- Certified **Academic Transcript / Marksheet** layout:
  - GPA calculation (up to 5.00) & letter grades (*Golden A+, A+, A, etc.*).
  - Total marks and aggregate percentage.
  - Subject-by-subject breakdown with full marks, obtained marks, letter grade, and grade points.
  - Principal and teacher remarks with signature stamps.
  - Dedicated **Print Transcript** and **Save as PDF** buttons.

### 📅 Daily Study Plan & Homework Tracker (`/study-plan`)
- Select by Grade (Kindergarten, Grade 5, Grade 7, Grade 10).
- View daily class period timetable, assigned teachers, learning objectives, and required materials.
- **Interactive Student Homework Tracker:** Check off completed assignments with real-time percentage progress bars.

### 🛡️ Super Admin Management Console (`/admin`)
- **Executive Dashboard:** Live metrics for total enrollment, pending admissions, active results, and attendance rates.
- **Admissions Manager:** Review, approve, schedule interviews, or decline candidate applications in real-time.
- **Result Publisher:** Add and publish new student examination results with subject marks and GPA calculations.
- **Study Plan Manager:** Inspect daily period schedules and update homeroom notices.
- **Circulars Broadcast:** Publish campus notices to the parent and student portal feed.

---

## 🎨 Brand Identity

| Token | Hex Value | Description |
| :--- | :--- | :--- |
| **Primary Navy** | `#123B70` | Primary brand color, headers, action buttons |
| **Secondary Blue**| `#2167B2` | Accents, links, secondary badges |
| **Accent Gold** | `#FFB800` | Golden stars, badges, call-to-action highlights |
| **Light Blue** | `#F3F8FD` | Soft background tints |
| **Typography** | *Playfair Display* & *Inter* | Elegant serif headings paired with clean modern sans-serif body |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/<YOUR_USERNAME>/future-leaders-school.git

# Navigate to project folder
cd future-leaders-school

# Install dependencies
npm install --legacy-peer-deps

# Start Vite development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 📦 Production Build & Deployment

```bash
# Generate production bundle
npm run build

# Preview production build locally
npm run preview
```

### Vercel / Netlify Deployment
Preconfigured with `vercel.json` and `public/_redirects` for Single Page Application (SPA) client-side routing.
