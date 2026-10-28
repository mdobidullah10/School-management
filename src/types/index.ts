export interface SchoolHighlight {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface AdvantageItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface AcademicProgram {
  id: string;
  name: string;
  grades: string;
  ageRange: string;
  badgeColor: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  subjects: string[];
  image: string;
}

export interface LearningExperience {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Classrooms' | 'Activities' | 'Sports' | 'Events';
  image: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Academics' | 'Events' | 'Achievements' | 'Announcements';
  date: string;
  formattedDate: string;
  summary: string;
  content: string[];
  image: string;
  readTime: string;
  author: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  targetAudience: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  isDemo: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  bio: string;
  qualifications: string;
  isDemo: boolean;
  email?: string;
  phone?: string;
  experience?: string;
  designation?: string;
  subjects?: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface AdmissionFormData {
  studentName: string;
  dateOfBirth: string;
  applyingGrade: string;
  parentName: string;
  contactNumber: string;
  email: string;
  previousSchool: string;
  message: string;
  consent: boolean;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface SubjectResult {
  name: string;
  fullMarks: number;
  obtainedMarks: number;
  grade: string;
  gradePoint: number;
  comment?: string;
}

export interface StudentResult {
  id: string;
  studentId: string;
  rollNumber: string;
  studentName: string;
  studentPhoto?: string;
  gender?: string;
  parentName?: string;
  contactNumber?: string;
  grade: string;
  section: string;
  examName: string;
  session: string;
  subjects: SubjectResult[];
  totalMarks: number;
  obtainedTotal: number;
  gpa: number;
  letterGrade: string;
  positionInClass: number;
  status: 'Passed' | 'Promoted with Distinction' | 'Needs Improvement';
  attendance: string;
  teacherRemarks: string;
  publishedDate: string;
}

export interface StudyPeriod {
  time: string;
  subject: string;
  teacher: string;
  topic: string;
  homework: string;
  materials?: string;
  dueDate?: string;
  priority?: 'High' | 'Normal' | 'Optional';
}

export interface DailyStudyPlan {
  id: string;
  grade: string;
  date: string;
  dayName: string;
  periods: StudyPeriod[];
  generalNotice: string;
}

export interface AdminApplicationItem {
  id: string;
  studentName: string;
  applyingGrade: string;
  parentName: string;
  contactNumber: string;
  email: string;
  submissionDate: string;
  status: 'Pending Review' | 'Interview Scheduled' | 'Approved' | 'Declined';
  notes: string;
}

export interface FeeRecord {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  grade: string;
  month: string;
  feeType: 'Tuition Fee' | 'Admission Fee' | 'Exam Fee' | 'Transport Fee' | 'Annual Session Fee';
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Unpaid';
  paymentMethod?: 'bKash' | 'Nagad' | 'Bank Transfer' | 'Cash Counter';
  transactionId?: string;
  paymentDate?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  grade: string;
  section: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  timeIn?: string;
}

export interface LibraryBook {
  id: string;
  code: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfNo: string;
}

export interface BookIssueRecord {
  id: string;
  bookTitle: string;
  bookCode: string;
  studentName: string;
  studentId: string;
  rollNumber: string;
  issueDate: string;
  dueDate: string;
  status: 'Active' | 'Returned' | 'Overdue';
}

export interface TransportRoute {
  id: string;
  busNo: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  assignedStudents: number;
  monthlyFee: number;
  stops: string[];
}

export interface SmsBroadcast {
  id: string;
  audience: string;
  message: string;
  date: string;
  recipientsCount: number;
  status: 'Delivered' | 'Pending' | 'Scheduled';
}
