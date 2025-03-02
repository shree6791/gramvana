import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight, Clock, Loader } from 'lucide-react';
import { generateMultipleRecipes } from '../services/openai';
import { Recipe } from '../types/recipe';

interface MealPlan {
  breakfast: Recipe | null;
  lunch: Recipe | null;
  snack: Recipe | null;
  dinner: Recipe | null;
}

interface WeeklyMealPlan {
  [date: string]: MealPlan;
}

const MealPlanner = () => {
  const [enableMealPlanning, setEnableMealPlanning] = useState(true);
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<WeeklyMealPlan>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Calculate protein target based on body weight
  const bodyWeight = parseInt(localStorage.getItem('bodyWeight') || '150');
  const proteinTarget = bodyWeight; // 1g per pound
  
  useEffect(() => {
    // Check if meal planning is enabled
    const storedEnableMealPlanning = localStorage.getItem('enableMealPlanning');
    if (storedEnableMealPlanning) {
      setEnableMealPlanning(storedEnableMealPlanning === 'true');
    }
    
    // Load meal plan from localStorage
    const storedMealPlan = localStorage.getItem('mealPlan');
    if (storedMealPlan) {
      setWeeklyMealPlan(JSON.parse(storedMealPlan));
    } else if (enableMealPlanning) {
      // Generate meal plan if not found
      generateMealPlan();
    }
  }, []);
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };
  
  const dateToKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };
  
  const generateMealPlan = async () => {
    if (!enableMealPlanning) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // Load user preferences from localStorage
      const dietaryPreferences = JSON.parse(localStorage.getItem('dietaryPreferences') || '[]');
      const healthGoals = localStorage.getItem('healthGoals') || '';
      const allergies = JSON.parse(localStorage.getItem('allergies') || '[]');
      
      // Calculate protein targets for each meal (total should be 95-100% of daily target)
      const breakfastProtein = Math.round(proteinTarget * 0.25); // 25% of daily protein
      const lunchProtein = Math.round(proteinTarget * 0.30); // 30% of daily protein
      const snackProtein = Math.round(proteinTarget * 0.10); // 10% of daily protein
      const dinnerProtein = Math.round(proteinTarget * 0.30); // 30% of daily protein
      
      // Generate breakfast recipe
      const breakfast = await generateMultipleRecipes({
        dietaryPreferences,
        healthGoals,
        allergies,
        mealType: 'breakfast',
        bodyWeight,
        proteinTarget: breakfastProtein
      }, 1);
      
      // Generate lunch recipe
      const lunch = await generateMultipleRecipes({
        dietaryPreferences,
        healthGoals,
        allergies,
        mealType: 'lunch',
        bodyWeight,
        proteinTarget: lunchProtein
      }, 1);
      
      // Generate snack recipe
      const snack = await generateMultipleRecipes({
        dietaryPreferences,
        healthGoals,
        allergies,
        mealType: 'snack',
        bodyWeight,
        proteinTarget: snackProtein
      }, 1);
      
      // Generate dinner recipe
      const dinner = await generateMultipleRecipes({
        dietaryPreferences,
        healthGoals,
        allergies,
        mealType: 'dinner',
        bodyWeight,
        proteinTarget: dinnerProtein
      }, 1);
      
      // Update meal plan for current date
      const dateKey = dateToKey(currentDate);
      const updatedMealPlan = {
        ...weeklyMealPlan,
        [dateKey]: {
          breakfast: breakfast[0],
          lunch: lunch[0],
          snack: snack[0],
          dinner: dinner[0]
        }
      };
      
      setWeeklyMealPlan(updatedMealPlan);
      
      // Save to localStorage
      localStorage.setItem('mealPlan', JSON.stringify(updatedMealPlan));
    } catch (err) {
      console.error('Error generating meal plan:', err);
      setError('Failed to generate meal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get today's meal plan
  const dateKey = dateToKey(currentDate);
  const todaysPlan = weeklyMealPlan[dateKey] || { breakfast: null, lunch: null, snack: null, dinner: null };
  
  // Calculate total protein for the day
  const totalProtein = (todaysPlan.breakfast?.protein || 0) + 
                       (todaysPlan.lunch?.protein || 0) + 
                       (todaysPlan.snack?.protein || 0) +
                       (todaysPlan.dinner?.protein || 0);
  
  // Calculate protein percentage
  const proteinPercentage = Math.round((totalProtein / proteinTarget) * 100);
  
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meal Planner</h1>
        <p className="text-gray-600">Plan your meals to meet your protein goals</p>
      </div>
      
      {enableMealPlanning ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => changeDate(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="text-center">
              <h2 className={`text-lg font-medium ${isToday(currentDate) ? 'text-green-700' : 'text-gray-800'}`}>
                {formatDate(currentDate)}
              </h2>
              {isToday(currentDate) && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </div>
            
            <button 
              onClick={() => changeDate(1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {/* Protein Progress Bar */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800">Daily Protein Goal</h3>
                <span className="text-sm text-gray-600">{totalProtein}g / {proteinTarget}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${proteinPercentage > 105 ? 'bg-yellow-500' : 'bg-green-600'}`}
                  style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {proteinPercentage >= 100 
                  ? proteinPercentage > 105
                    ? "You're exceeding your daily protein goal!"
                    : "You've reached your protein goal for today!" 
                  : `${proteinPercentage}% of your daily protein goal`}
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size={40} className="text-green-600 animate-spin mb-4" />
              <p className="text-gray-600">Generating your meal plan...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={generateMealPlan}
                className="mt-4 btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {['breakfast', 'lunch', 'snack', 'dinner'].map((mealType) => {
                const meal = todaysPlan[mealType as keyof typeof todaysPlan];
                
                return (
                  <div key={mealType} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 bg-green-50 border-b border-green-100">
                      <h3 className="font-medium text-green-800 capitalize">{mealType}</h3>
                    </div>
                    
                    {meal ? (
                      <div className="p-4">
                        <div className="flex items-start">
                          <img 
                            src={meal.image} 
                            alt={meal.title}
                            className="w-20 h-20 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">{meal.title}</h4>
                            <div className="flex items-center text-gray-600 text-sm mb-2">
                              <Clock size={14} className="mr-1" />
                              <span>{meal.prepTime} min</span>
                              <span className="mx-2">•</span>
                              <span>{meal.protein}g protein</span>
                            </div>
                            <Link 
                              to={`/recipe/${meal.id}`} 
                              className="text-green-700 text-sm font-medium hover:underline"
                            >
                              View Recipe
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No meal planned
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <button
            onClick={generateMealPlan}
            className="w-full btn-primary mt-6 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Calendar size={18} className="mr-2" />
                Regenerate Meal Plan
              </>
            )}
          </button>
        </>
      ) : (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Meal Planning is Disabled</h3>
          <p className="text-gray-500 mb-4">You can enable meal planning in your profile settings</p>
          <Link to="/profile" className="btn-primary">
            Go to Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;