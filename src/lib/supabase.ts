import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gotyalovbdtkiyvstvmc.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdHlhbG92YmR0a2l5dnN0dm1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNjEzMDEsImV4cCI6MjEwODczNzMwMX0.2SXCe33TNgHG6Nj5MgsI08Qs5R_5g9vKUt-j_fSnPuQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
