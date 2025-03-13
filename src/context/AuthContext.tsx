import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, UserProfile } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if Supabase is properly configured
  const isSupabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event: AuthChangeEvent, session: Session | null) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Only fetch the profile, don't try to create it
              await fetchProfile(session.user.id);
            } else {
              setProfile(null);
            }
          }
        );

        return () => {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any potentially invalid state
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isSupabaseConfigured]);

  const fetchProfile = async (userId: string) => {
    if (!isSupabaseConfigured) {
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        const userProfile = data as UserProfile;
        setProfile(userProfile);
        
        // Save complete profile to localStorage
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      // The trigger will handle profile creation
      // The onAuthStateChange listener will handle fetching the profile
      
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      
      // Clear all state and storage
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Clear local storage
      localStorage.removeItem('mockUser');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('mealPlan');
      localStorage.removeItem('savedRecipes');
      localStorage.removeItem('recipesData');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      if (!user || !profile) return;

      const newProfile = { ...profile, ...updatedProfile };
      
      // Update local state immediately for better UX
      setProfile(newProfile);
      localStorage.setItem('userProfile', JSON.stringify(newProfile));

      if (!isSupabaseConfigured) return;

      // Call the stored procedure using RPC
      const { data, error } = await supabase.rpc('update_profile', {
        profile_data: {
          p_id: user.id,
          dietaryPreferences: updatedProfile.dietaryPreferences,
          healthGoals: updatedProfile.healthGoals,
          allergies: updatedProfile.allergies,
          enableMealPlanning: updatedProfile.enableMealPlanning,
          bodyWeight: updatedProfile.bodyWeight,
          // p_dark_mode: updatedProfile.darkMode,
          updated_at: new Date().toISOString()

        }
      });


      if (error) {
        console.error('Error updating profile:', error);
        // Revert local state if update fails
        setProfile(profile);
        localStorage.setItem('userProfile', JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      // Revert local state if update fails
      setProfile(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};