import { supabase } from '../lib/supabase';
import { initialResults, initialAdminApplications } from '../data/schoolData';
import type { AdmissionFormData, StudentResult, AdminApplicationItem } from '../types';

/**
 * Submit online admission form to Supabase 'admissions' table
 */
export async function submitAdmissionToDb(formData: AdmissionFormData): Promise<{ success: boolean; isLiveDb: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('admissions').insert([
      {
        student_name: formData.studentName,
        date_of_birth: formData.dateOfBirth,
        applying_grade: formData.applyingGrade,
        parent_name: formData.parentName,
        contact_number: formData.contactNumber,
        email: formData.email,
        previous_school: formData.previousSchool || null,
        message: formData.message || null,
        status: 'Pending Review',
      },
    ]);

    if (error) {
      console.warn('Supabase admissions insert failed, falling back to local simulation:', error.message);
      return { success: true, isLiveDb: false, error: error.message };
    }

    return { success: true, isLiveDb: true };
  } catch (err: any) {
    console.warn('Network exception to Supabase, falling back to local simulation:', err.message);
    return { success: true, isLiveDb: false, error: err.message };
  }
}

/**
 * Fetch student results from Supabase 'results' table
 */
export async function searchStudentResultFromDb(rollOrId: string, _targetGrade?: string): Promise<{ result: StudentResult | null; isLiveDb: boolean }> {
  const query = rollOrId.trim();

  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .or(`roll_number.eq.${query},student_id.eq.${query}`);

    if (!error && data && data.length > 0) {
      const row = data[0];
      const parsedResult: StudentResult = {
        id: row.id,
        studentId: row.student_id,
        rollNumber: row.roll_number,
        studentName: row.student_name,
        grade: row.grade,
        section: row.section,
        examName: row.exam_name,
        session: row.session,
        attendance: row.attendance || '97%',
        gpa: parseFloat(row.gpa),
        letterGrade: row.letter_grade,
        totalMarks: row.total_marks,
        obtainedTotal: row.obtained_total,
        positionInClass: row.position_in_class || 1,
        status: row.status as any,
        teacherRemarks: row.teacher_remarks || 'Good academic standing.',
        publishedDate: row.published_date || 'October 2026',
        subjects: Array.isArray(row.subjects) ? row.subjects : [],
      };
      return { result: parsedResult, isLiveDb: true };
    }
  } catch (err) {
    console.warn('Supabase results fetch failed, using local store:', err);
  }

  // Local fallback
  const local = initialResults.find(
    (r) =>
      r.rollNumber.toLowerCase() === query.toLowerCase() ||
      r.studentId.toLowerCase() === query.toLowerCase()
  );

  return { result: local || null, isLiveDb: false };
}

/**
 * Fetch all admissions applications for the Super Admin panel
 */
export async function fetchApplicationsForAdmin(): Promise<{ applications: AdminApplicationItem[]; isLiveDb: boolean }> {
  try {
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped: AdminApplicationItem[] = data.map((d: any) => ({
        id: d.id,
        studentName: d.student_name,
        applyingGrade: d.applying_grade,
        parentName: d.parent_name,
        contactNumber: d.contact_number,
        email: d.email,
        submissionDate: d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : 'Today',
        status: (d.status as any) || 'Pending Review',
        notes: d.message || 'Submitted via online portal',
      }));
      return { applications: mapped, isLiveDb: true };
    }
  } catch (err) {
    console.warn('Could not load applications from Supabase, using initial data:', err);
  }

  return { applications: initialAdminApplications, isLiveDb: false };
}
