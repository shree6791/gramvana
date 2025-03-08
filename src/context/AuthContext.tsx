import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
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
    if (!isSupabaseConfigured) {
      // If Supabase is not configured, use localStorage for auth simulation
      const mockUser = localStorage.getItem('mockUser');
      if (mockUser) {
        const userData = JSON.parse(mockUser);
        setUser(userData);
        
        // Get profile from localStorage
        const dietaryPreferences = JSON.parse(localStorage.getItem('dietaryPreferences') || '[]');
        const healthGoals = localStorage.getItem('healthGoals') || '';
        const allergies = JSON.parse(localStorage.getItem('allergies') || '[]');
        const enableMealPlanning = localStorage.getItem('enableMealPlanning') === 'true';
        const bodyWeight = parseInt(localStorage.getItem('bodyWeight') || '150');
        
        setProfile({
          id: userData.id,
          email: userData.email,
          dietaryPreferences,
          healthGoals,
          allergies,
          enableMealPlanning,
          bodyWeight
        });
      }
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isSupabaseConfigured]);

  const fetchProfile = async (userId: string) => {
    if (!isSupabaseConfigured) {
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data as UserProfile);
        
        // Sync with localStorage for compatibility
        localStorage.setItem('dietaryPreferences', JSON.stringify(data.dietaryPreferences || []));
        localStorage.setItem('healthGoals', data.healthGoals || '');
        localStorage.setItem('allergies', JSON.stringify(data.allergies || []));
        localStorage.setItem('enableMealPlanning', String(data.enableMealPlanning));
        localStorage.setItem('bodyWeight', String(data.bodyWeight || 150));
        localStorage.setItem('isOnboarded', data.dietaryPreferences?.length > 0 ? 'true' : 'false');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock signup with localStorage
      const mockUserId = `user_${Date.now()}`;
      const mockUser = {
        id: mockUserId,
        email,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser as any);
      
      // Create empty profile
      const newProfile = {
        id: mockUserId,
        email,
        dietaryPreferences: [],
        healthGoals: '',
        allergies: [],
        enableMealPlanning: true,
        bodyWeight: 150
      };
      
      setProfile(newProfile);
      
      return { error: null };
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!error && data.user) {
        // Create a profile for the new user
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          dietaryPreferences: [],
          healthGoals: '',
          allergies: [],
          enableMealPlanning: true,
          bodyWeight: 150
        });
      }

      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock signin with localStorage
      const mockUserId = `user_${Date.now()}`;
      const mockUser = {
        id: mockUserId,
        email,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser as any);
      
      // Create empty profile
      const newProfile = {
        id: mockUserId,
        email,
        dietaryPreferences: [],
        healthGoals: '',
        allergies: [],
        enableMealPlanning: true,
        bodyWeight: 150
      };
      
      setProfile(newProfile);
      
      return { error: null };
    }
    
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
    if (!isSupabaseConfigured) {
      // Mock signout with localStorage
      localStorage.removeItem('mockUser');
      setUser(null);
      setProfile(null);
    } else {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('dietaryPreferences');
    localStorage.removeItem('healthGoals');
    localStorage.removeItem('allergies');
    localStorage.removeItem('enableMealPlanning');
    localStorage.removeItem('bodyWeight');
    localStorage.removeItem('mealPlan');
    localStorage.removeItem('savedRecipes');
    localStorage.removeItem('recipesData');
    localStorage.removeItem('isOnboarded');
  };

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      if (!user) return;

      // Always update local state first for immediate UI feedback
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      
      // Update localStorage for compatibility with existing code
      if (updatedProfile.dietaryPreferences) {
        localStorage.setItem('dietaryPreferences', JSON.stringify(updatedProfile.dietaryPreferences));
      }
      if (updatedProfile.healthGoals) {
        localStorage.setItem('healthGoals', updatedProfile.healthGoals);
      }
      if (updatedProfile.allergies) {
        localStorage.setItem('allergies', JSON.stringify(updatedProfile.allergies));
      }
      if (updatedProfile.enableMealPlanning !== undefined) {
        localStorage.setItem('enableMealPlanning', String(updatedProfile.enableMealPlanning));
      }
      if (updatedProfile.bodyWeight) {
        localStorage.setItem('bodyWeight', String(updatedProfile.bodyWeight));
      }
      
      // Mark as onboarded in localStorage
      if (updatedProfile.dietaryPreferences && updatedProfile.dietaryPreferences.length > 0) {
        localStorage.setItem('isOnboarded', 'true');
      }

      // If Supabase is not configured, we're done after updating localStorage
      if (!isSupabaseConfigured) {
        return;
      }

      // Get API key from environment variables
      const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      // For Supabase, attempt to update the remote profile
      // This is a best-effort operation - we don't block the UI on it
      try {
        // Use POST method instead of PATCH to avoid CORS issues
        const { error } = await supabase.rpc('update_profile', {
          profile_data:{
            p_id: user.id, // Use the actual user ID from the session
            updated_at: new Date().toISOString(),
            ...updatedProfile,
          }
        }, {
          headers: {
            'apikey': apiKey,
            'Content-Type': 'application/json',
          }
        });

        if (error) {
          console.error('Error updating profile via RPC:', error);
          
          // Fallback to direct update if RPC fails
          try {
            const { error: directError } = await supabase
              .from('profiles')
              .update({
                ...updatedProfile,
                p_id: user.id, 
                updated_at: new Date().toISOString(),
              })
              .eq('id', user.id)
              .select();
              
            if (directError) {
              console.error('Error updating profile directly:', directError);
            }
          } catch (directErr) {
            console.error('Exception during direct profile update:', directErr);
          }
        }
      } catch (err) {
        console.error('Exception during profile update:', err);
        // We don't rethrow here because we've already updated the local state
        // and we don't want to block the UI flow
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
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