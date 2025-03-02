import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronRight, Moon, Bell, Calendar } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { profile, signOut, updateProfile, user } = useAuth();
  const navigate = useNavigate();
  
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [healthGoals, setHealthGoals] = useState<string>('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [enableMealPlanning, setEnableMealPlanning] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [bodyWeight, setBodyWeight] = useState<number>(150);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setDietaryPreferences(profile.dietaryPreferences || []);
      setHealthGoals(profile.healthGoals || '');
      setAllergies(profile.allergies || []);
      setEnableMealPlanning(profile.enableMealPlanning);
      setBodyWeight(profile.bodyWeight || 150);
    }
  }, [profile]);
  
  const handleMealPlanningToggle = async () => {
    const newValue = !enableMealPlanning;
    setEnableMealPlanning(newValue);
    
    try {
      await updateProfile({ enableMealPlanning: newValue });
    } catch (error) {
      console.error('Error updating meal planning setting:', error);
    }
  };
  
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // In a real app, we would apply dark mode to the entire app
  };
  
  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    // In a real app, we would handle notification permissions
  };
  
  const handleBodyWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBodyWeight(parseInt(e.target.value) || 0);
  };
  
  const saveBodyWeight = async () => {
    setIsLoading(true);
    
    try {
      await updateProfile({ bodyWeight });
      setIsEditingWeight(false);
      
      // Clear meal plan to regenerate with new protein targets
      localStorage.removeItem('mealPlan');
    } catch (error) {
      console.error('Error updating body weight:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Calculate daily protein target
  const proteinTarget = bodyWeight; // 1g per pound
  
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600">Manage your preferences and settings</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <User size={24} className="text-green-700" />
          </div>
          <div>
            <h2 className="font-medium text-gray-800">{user?.email || 'User'}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-green-50 border-b border-green-100">
          <h3 className="font-medium text-green-800">Nutrition Goals</h3>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-medium text-gray-700">Body Weight</h4>
              {!isEditingWeight ? (
                <p className="text-gray-800">{bodyWeight} lbs</p>
              ) : (
                <div className="flex items-center mt-2">
                  <input
                    type="number"
                    value={bodyWeight}
                    onChange={handleBodyWeightChange}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md mr-2"
                    min="50"
                    max="400"
                  />
                  <span className="text-gray-600 mr-2">lbs</span>
                  <button
                    onClick={saveBodyWeight}
                    className="text-green-700 text-sm font-medium flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="inline-block h-3 w-3 border-2 border-green-700 border-t-transparent rounded-full animate-spin mr-1"></span>
                    ) : null}
                    Save
                  </button>
                </div>
              )}
            </div>
            {!isEditingWeight ? (
              <button
                onClick={() => setIsEditingWeight(true)}
                className="text-sm text-green-700 font-medium"
              >
                Edit
              </button>
            ) : null}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-blue-800 mb-1">Daily Protein Target</h4>
            <p className="text-blue-700">
              {proteinTarget}g of protein (1g per pound of body weight)
            </p>
            <p className="text-blue-600 text-sm mt-1">
              This target will be used to generate your meal recommendations.
            </p>
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-100">
            <h4 className="font-medium text-gray-700 mb-2">Health Goal</h4>
            <p className="text-gray-800">{healthGoals || 'Not set'}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-green-50 border-b border-green-100">
          <h3 className="font-medium text-green-800">Dietary Preferences</h3>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {dietaryPreferences.length > 0 ? (
              dietaryPreferences.map((preference) => (
                <span 
                  key={preference} 
                  className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full"
                >
                  {preference}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No preferences set</p>
            )}
          </div>
          
          <div className="mt-4 pt-2 border-t border-gray-100">
            <h4 className="font-medium text-gray-700 mb-2">Allergies & Dislikes</h4>
            <div className="flex flex-wrap gap-2">
              {allergies.length > 0 ? (
                allergies.map((allergy) => (
                  <span 
                    key={allergy} 
                    className="bg-red-50 text-red-700 text-sm px-3 py-1 rounded-full"
                  >
                    {allergy}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No allergies set</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-green-50 border-b border-green-100">
          <h3 className="font-medium text-green-800">Settings</h3>
        </div>
        
        <div>
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center">
              <Bell size={20} className="text-gray-600 mr-3" />
              <span className="text-gray-800">Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notifications}
                onChange={handleNotificationsToggle}
              />
              <div className={cn(
                "w-11 h-6 rounded-full peer",
                notifications ? "bg-green-600" : "bg-gray-200",
                "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all",
                notifications && "after:translate-x-5"
              )}></div>
            </label>
          </div>
          
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center">
              <Moon size={20} className="text-gray-600 mr-3" />
              <span className="text-gray-800">Dark Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={handleDarkModeToggle}
              />
              <div className={cn(
                "w-11 h-6 rounded-full peer",
                darkMode ? "bg-green-600" : "bg-gray-200",
                "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all",
                darkMode && "after:translate-x-5"
              )}></div>
            </label>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Calendar size={20} className="text-gray-600 mr-3" />
              <span className="text-gray-800">Meal Planning</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={enableMealPlanning}
                onChange={handleMealPlanningToggle}
              />
              <div className={cn(
                "w-11 h-6 rounded-full peer",
                enableMealPlanning ? "bg-green-600" : "bg-gray-200",
                "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all",
                enableMealPlanning && "after:translate-x-5"
              )}></div>
            </label>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleLogout}
        className="w-full p-4 flex items-center justify-center text-red-600 bg-white rounded-xl shadow-md hover:bg-red-50 transition-colors"
      >
        <LogOut size={20} className="mr-2" />
        Log Out
      </button>
    </div>
  );
};

export default Profile;