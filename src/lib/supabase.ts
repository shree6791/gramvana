import { createClient } from '@supabase/supabase-js';

// Check for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client for development if environment variables are missing
const createFallbackClient = () => {
  console.warn('Using fallback authentication. Please connect to Supabase for full functionality.');
  
  // Create a mock client that uses localStorage
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ data: {}, error: null }),
      signInWithPassword: async () => ({ data: {}, error: null }),
      signOut: async () => {}
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null })
        })
      }),
      insert: async () => ({ error: null }),
      update: async () => ({ error: null })
    }),
    rpc: async () => ({ data: null, error: null })
  };
};

// Create the Supabase client with proper headers and settings
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
        },
      },
    })
  : createFallbackClient() as any;

export type UserProfile = {
  id: string;
  email: string;
  dietaryPreferences: string[];
  healthGoals: string;
  allergies: string[];
  enableMealPlanning: boolean;
  bodyWeight: number;
  created_at?: string;
};