import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to dummy values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

// Only create client if valid URL is provided
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    // Don't log auth errors in production - they're normal (e.g., user not logged in)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting user:', error.message);
    }
    return null;
  }
  return user;
};

// Helper function to sign up a new user
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    // Only log error message, not full error object (may contain sensitive data)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error signing up:', error.message);
    }
    return { user: null, session: null, error };
  }
  
  return { user: data.user, session: data.session, error: null };
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error && process.env.NODE_ENV === 'development') {
    console.error('Error signing out:', error.message);
  }
};

// Helper function to delete user account
export const deleteUserAccount = async () => {
  try {
    // Get current user
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    if (getUserError || !user) {
      throw new Error('No user found');
    }

    // Delete auth account (this will cascade delete in Supabase)
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    
    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting user:', error.message);
      }
      return { error: error.message };
    }
    
    return { error: null };
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in deleteUserAccount:', error.message);
    }
    return { error: error.message };
  }
};

