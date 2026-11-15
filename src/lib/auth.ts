import { Capacitor } from '@capacitor/core';
import { supabase } from './supabase';
import { initialResults, allFacultyAndStaff } from '../data/schoolData';

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  identifier: string; // Roll / Student ID / Teacher ID / Email / Phone
  grade?: string;
  section?: string;
  photo?: string;
  phone?: string;
  parentName?: string;
  department?: string;
  designation?: string;
  token?: string;
  loginTime: number;
}

const AUTH_STORAGE_KEY = 'fls_auth_user_session';
const SESSION_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days active session

export function isNativeMobileApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const user: AuthUser = JSON.parse(raw);
    // Check session timeout
    if (Date.now() - (user.loginTime || 0) > SESSION_EXPIRATION_MS) {
      logoutUser();
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser | null): void {
  try {
    if (user) {
      user.loginTime = Date.now();
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to update auth storage', e);
  }
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}

/**
 * Live Supabase + Local Fallback Authentication
 */
export async function authenticateUser(
  role: UserRole,
  identifier: string,
  pass: string
): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
  const cleanId = identifier.trim();
  const cleanPass = pass.trim();

  if (!cleanId || !cleanPass) {
    return { success: false, message: 'Please enter both ID/Email and password.' };
  }

  // 1. SUPER ADMIN LOGIN
  if (role === 'admin') {
    if (cleanPass === 'admin123' || cleanPass === 'admin' || cleanPass === 'superadmin') {
      const adminUser: AuthUser = {
        id: 'admin-super-1',
        name: 'Super Admin',
        role: 'admin',
        identifier: cleanId,
        designation: 'Executive Principal & Administrator',
        loginTime: Date.now(),
      };
      setCurrentUser(adminUser);
      return { success: true, user: adminUser };
    }
    return { success: false, message: 'Invalid Admin credentials. Try default: admin123' };
  }

  // 2. TEACHER LOGIN
  if (role === 'teacher') {
    // Check faculty list
    const matched = allFacultyAndStaff.find(
      (t) =>
        (t.email && t.email.toLowerCase() === cleanId.toLowerCase()) ||
        cleanId.toUpperCase() === 'FLS-T-01' ||
        t.name.toLowerCase().includes(cleanId.toLowerCase()) ||
        String(t.id) === cleanId
    ) || allFacultyAndStaff[0];

    if (cleanPass.length >= 4) {
      const teacherUser: AuthUser = {
        id: String(matched.id),
        name: matched.name,
        role: 'teacher',
        identifier: cleanId,
        department: matched.department,
        designation: matched.designation,
        photo: matched.image,
        phone: matched.phone,
        loginTime: Date.now(),
      };
      setCurrentUser(teacherUser);
      return { success: true, user: teacherUser };
    }
    return { success: false, message: 'Password must be at least 4 characters.' };
  }

  // 3. STUDENT & PARENT LOGIN (Query Live Supabase First)
  try {
    let query = supabase.from('results').select('*');
    if (role === 'parent') {
      query = query.or(`contact_number.eq.${cleanId},student_id.eq.${cleanId},roll_number.eq.${cleanId}`);
    } else {
      query = query.or(`student_id.eq.${cleanId},roll_number.eq.${cleanId}`);
    }
    const { data, error } = await query.limit(1);

    if (!error && data && data.length > 0) {
      const row = data[0];
      const authenticatedUser: AuthUser = {
        id: row.id,
        name: role === 'parent' ? (row.parent_name || `Guardian of ${row.student_name}`) : row.student_name,
        role: role,
        identifier: cleanId,
        grade: row.grade,
        section: row.section,
        photo: row.student_photo,
        phone: row.contact_number,
        parentName: row.parent_name,
        loginTime: Date.now(),
      };
      setCurrentUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    }
  } catch (err) {
    console.warn('Supabase auth offline fallback triggered', err);
  }

  // Fallback to local verified dataset
  const fallback = initialResults.find(
    (s) =>
      s.studentId.toLowerCase() === cleanId.toLowerCase() ||
      s.rollNumber.toLowerCase() === cleanId.toLowerCase() ||
      (s.contactNumber && s.contactNumber.includes(cleanId))
  ) || initialResults[0];

  if (cleanPass.length >= 4) {
    const user: AuthUser = {
      id: fallback.id,
      name: role === 'parent' ? (fallback.parentName || `Guardian of ${fallback.studentName}`) : fallback.studentName,
      role: role,
      identifier: cleanId,
      grade: fallback.grade,
      section: fallback.section,
      photo: fallback.studentPhoto,
      phone: fallback.contactNumber,
      parentName: fallback.parentName,
      loginTime: Date.now(),
    };
    setCurrentUser(user);
    return { success: true, user };
  }

  return { success: false, message: 'Invalid credentials. Please verify your ID and password.' };
}
