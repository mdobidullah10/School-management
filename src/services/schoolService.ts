import { supabase } from '../lib/supabase';
import { initialResults, initialAdminApplications } from '../data/schoolData';
import type { AdmissionFormData, StudentResult, AdminApplicationItem, SubjectResult } from '../types';

/**
 * Helper to parse Supabase row into StudentResult with metadata support
 */
function mapSupabaseRowToStudentResult(row: any): StudentResult {
  let subjects: SubjectResult[] = [];
  let studentPhoto: string | undefined = undefined;
  let gender: string | undefined = undefined;
  let parentName: string | undefined = undefined;
  let contactNumber: string | undefined = undefined;

  if (Array.isArray(row.subjects)) {
    for (const item of row.subjects) {
      if (item && item.__meta) {
        studentPhoto = item.studentPhoto || studentPhoto;
        gender = item.gender || gender;
        parentName = item.parentName || parentName;
        contactNumber = item.contactNumber || contactNumber;
      } else if (item && item.name) {
        subjects.push(item);
      }
    }
  }

  return {
    id: row.id,
    studentId: row.student_id,
    rollNumber: row.roll_number,
    studentName: row.student_name,
    studentPhoto: studentPhoto || row.student_photo,
    gender: gender || row.gender,
    parentName: parentName || row.parent_name,
    contactNumber: contactNumber || row.contact_number,
    grade: row.grade,
    section: row.section,
    examName: row.exam_name,
    session: row.session,
    attendance: row.attendance || '97%',
    gpa: parseFloat(row.gpa) || 0.0,
    letterGrade: row.letter_grade || 'N/A',
    totalMarks: row.total_marks || 0,
    obtainedTotal: row.obtained_total || 0,
    positionInClass: row.position_in_class || 1,
    status: row.status as any,
    teacherRemarks: row.teacher_remarks || 'Good academic standing.',
    publishedDate: row.published_date || new Date().toISOString().split('T')[0],
    subjects,
  };
}

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
 * Fetch all student results from Supabase 'results' table
 */
export async function fetchResultsFromDb(): Promise<{ results: StudentResult[]; isLiveDb: boolean }> {
  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('roll_number', { ascending: true });

    if (!error && data && data.length > 0) {
      const parsed = data.map(mapSupabaseRowToStudentResult);
      return { results: parsed, isLiveDb: true };
    }
  } catch (err) {
    console.warn('Supabase results list fetch failed, using local store:', err);
  }

  return { results: initialResults, isLiveDb: false };
}

/**
 * Search student results from Supabase 'results' table
 */
export async function searchStudentResultFromDb(rollOrId: string, _targetGrade?: string): Promise<{ result: StudentResult | null; isLiveDb: boolean }> {
  const query = rollOrId.trim();

  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .or(`roll_number.eq.${query},student_id.eq.${query}`);

    if (!error && data && data.length > 0) {
      return { result: mapSupabaseRowToStudentResult(data[0]), isLiveDb: true };
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
 * Save or update student result & profile in Supabase
 */
export async function saveStudentResultToDb(student: StudentResult): Promise<{ success: boolean; isLiveDb: boolean; id?: string; error?: string }> {
  try {
    // Pack metadata (photo, parent info, gender) into subjects JSONB to support live schema without migrations
    const subjectsWithMeta = [
      ...student.subjects,
      {
        __meta: true,
        studentPhoto: student.studentPhoto || null,
        parentName: student.parentName || null,
        contactNumber: student.contactNumber || null,
        gender: student.gender || null,
      },
    ];

    const payload: any = {
      student_id: student.studentId,
      roll_number: student.rollNumber,
      student_name: student.studentName,
      grade: student.grade,
      section: student.section,
      exam_name: student.examName,
      session: student.session,
      attendance: student.attendance,
      gpa: Number(student.gpa.toFixed(2)),
      letter_grade: student.letterGrade,
      total_marks: student.totalMarks,
      obtained_total: student.obtainedTotal,
      position_in_class: student.positionInClass,
      status: student.status,
      teacher_remarks: student.teacherRemarks,
      published_date: student.publishedDate || new Date().toISOString().split('T')[0],
      subjects: subjectsWithMeta,
    };

    // Check if UUID exists or if row exists with same roll/student_id
    const isRealUuid = student.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(student.id);

    if (isRealUuid) {
      const { error } = await supabase
        .from('results')
        .update(payload)
        .eq('id', student.id);

      if (!error) return { success: true, isLiveDb: true, id: student.id };
    }

    // Check by student_id or roll_number if record already exists to update
    const { data: existing } = await supabase
      .from('results')
      .select('id')
      .or(`roll_number.eq.${student.rollNumber},student_id.eq.${student.studentId}`);

    if (existing && existing.length > 0) {
      const existingId = existing[0].id;
      const { error } = await supabase
        .from('results')
        .update(payload)
        .eq('id', existingId);

      if (!error) return { success: true, isLiveDb: true, id: existingId };
    }

    // Insert new
    const { data: inserted, error: insertErr } = await supabase
      .from('results')
      .insert([payload])
      .select('id');

    if (insertErr) {
      console.warn('Supabase insert failed, local state active:', insertErr.message);
      return { success: true, isLiveDb: false, error: insertErr.message };
    }

    return {
      success: true,
      isLiveDb: true,
      id: inserted && inserted.length > 0 ? inserted[0].id : undefined,
    };
  } catch (err: any) {
    console.warn('Network exception while saving student result:', err.message);
    return { success: true, isLiveDb: false, error: err.message };
  }
}

/**
 * Delete student result from Supabase
 */
export async function deleteStudentResultFromDb(idOrRoll: string): Promise<{ success: boolean; isLiveDb: boolean }> {
  try {
    const isRealUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrRoll);

    let res;
    if (isRealUuid) {
      res = await supabase.from('results').delete().eq('id', idOrRoll);
    } else {
      res = await supabase.from('results').delete().or(`roll_number.eq.${idOrRoll},student_id.eq.${idOrRoll}`);
    }

    if (!res.error) return { success: true, isLiveDb: true };
  } catch (err) {
    console.warn('Failed to delete student result from Supabase:', err);
  }
  return { success: true, isLiveDb: false };
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

/**
 * Update admission application status in Supabase
 */
export async function updateAdmissionStatusInDb(id: string, status: AdminApplicationItem['status']): Promise<{ success: boolean; isLiveDb: boolean }> {
  try {
    const { error } = await supabase
      .from('admissions')
      .update({ status })
      .eq('id', id);

    if (!error) return { success: true, isLiveDb: true };
  } catch (err) {
    console.warn('Failed to update admission status in Supabase:', err);
  }
  return { success: true, isLiveDb: false };
}

/**
 * Delete admission application from Supabase
 */
export async function deleteAdmissionFromDb(id: string): Promise<{ success: boolean; isLiveDb: boolean }> {
  try {
    const { error } = await supabase
      .from('admissions')
      .delete()
      .eq('id', id);

    if (!error) return { success: true, isLiveDb: true };
  } catch (err) {
    console.warn('Failed to delete admission from Supabase:', err);
  }
  return { success: true, isLiveDb: false };
}
