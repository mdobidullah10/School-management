import { Capacitor } from '@capacitor/core';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  identifier: string; // Roll / Teacher ID / Email
  grade?: string;
  section?: string;
  photo?: string;
  phone?: string;
  department?: string;
  designation?: string;
}

const AUTH_STORAGE_KEY = 'fls_auth_user_session';

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
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to update auth storage', e);
  }
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
