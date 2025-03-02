import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Home from './components/Home';
import RecipeDetail from './components/RecipeDetail';
import Saved from './components/Saved';
import MealPlanner from './components/MealPlanner';
import Profile from './components/Profile';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Check if user has completed onboarding
const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // If profile exists and has dietary preferences, consider onboarding complete
  const isOnboarded = profile && (profile.dietaryPreferences?.length > 0 || localStorage.getItem('isOnboarded') === 'true');
  
  if (!isOnboarded) {
    return <Navigate to="/onboarding" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isLoading, profile } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Check if user has completed onboarding
  const isOnboarded = profile && (profile.dietaryPreferences?.length > 0 || localStorage.getItem('isOnboarded') === 'true');
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? (isOnboarded ? <Navigate to="/home" /> : <Navigate to="/onboarding" />) : <LandingPage />} 
      />
      <Route 
        path="/login" 
        element={user ? (isOnboarded ? <Navigate to="/home" /> : <Navigate to="/onboarding" />) : <Login />} 
      />
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            {isOnboarded ? <Navigate to="/home" /> : <Onboarding />}
          </ProtectedRoute>
        } 
      />
      <Route 
        element={
          <ProtectedRoute>
            <OnboardingCheck>
              <Layout />
            </OnboardingCheck>
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;