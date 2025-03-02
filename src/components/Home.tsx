import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Zap, Search, Filter, Sparkles, Loader } from 'lucide-react';
import { cn } from '../utils/cn';
import { generateMultipleRecipes } from '../services/openai';
import { Recipe } from '../types/recipe';

const Home = () => {
  const [greeting, setGreeting] = useState('');
  const [mealSuggestion, setMealSuggestion] = useState('');
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [activeFilter, setActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    setGreeting(getGreeting());
    setMealSuggestion(getMealSuggestion());
    
    // Load user preferences from localStorage
    const dietaryPreferences = JSON.parse(localStorage.getItem('dietaryPreferences') || '[]');
    const healthGoals = localStorage.getItem('healthGoals') || '';
    const allergies = JSON.parse(localStorage.getItem('allergies') || '[]');
    const bodyWeight = parseInt(localStorage.getItem('bodyWeight') || '150');
    
    // Get time-based meal type
    const mealType = getMealSuggestion();
    
    // Fetch recipes from OpenAI
    fetchRecipes({
      dietaryPreferences,
      healthGoals,
      allergies,
      mealType,
      bodyWeight
    });
  }, []);
  
  const fetchRecipes = async (params: any) => {
    try {
      setIsLoading(true);
      setError('');
      
      const recipes = await generateMultipleRecipes(params, 5);
      setRecommendedRecipes(recipes);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFilterChange = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter('');
      // Reset to all recipes
      setRecommendedRecipes([...recommendedRecipes]);
    } else {
      setActiveFilter(filter);
      
      if (filter === 'quick') {
        setRecommendedRecipes(recommendedRecipes.filter(recipe => recipe.prepTime < 15));
      } else if (filter === 'protein') {
        setRecommendedRecipes(recommendedRecipes.filter(recipe => recipe.protein > 20));
      } else if (filter === 'weight-loss') {
        setRecommendedRecipes(recommendedRecipes.filter(recipe => 
          recipe.tags.includes('weight-loss') || recipe.calories < 400
        ));
      }
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') {
      // Reset to all recipes
      setRecommendedRecipes([...recommendedRecipes]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = recommendedRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query) || 
      recipe.tags.some(tag => tag.toLowerCase().includes(query)) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
    );
    
    setRecommendedRecipes(filtered);
  };
  
  const handleSurpriseMe = async () => {
    setIsLoading(true);
    
    try {
      // Load user preferences from localStorage
      const dietaryPreferences = JSON.parse(localStorage.getItem('dietaryPreferences') || '[]');
      const healthGoals = localStorage.getItem('healthGoals') || '';
      const allergies = JSON.parse(localStorage.getItem('allergies') || '[]');
      const bodyWeight = parseInt(localStorage.getItem('bodyWeight') || '150');
      
      // Generate a random recipe
      const recipe = await generateMultipleRecipes({
        dietaryPreferences,
        healthGoals,
        allergies,
        bodyWeight
      }, 1);
      
      setRecommendedRecipes(recipe);
    } catch (err) {
      console.error('Error generating surprise recipe:', err);
      setError('Failed to generate a surprise recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{greeting}</h1>
          <p className="text-gray-600">Here are your {mealSuggestion} options</p>
        </div>
        <button 
          onClick={handleSurpriseMe}
          className="bg-indigo-100 text-indigo-800 p-2 rounded-full hover:bg-indigo-200 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? <Loader size={20} className="animate-spin" /> : <Sparkles size={20} />}
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="relative mb-6">
        <input
          type="text"
          placeholder="Search recipes, ingredients..."
          className="w-full py-3 pl-10 pr-4 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
      </form>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => handleFilterChange('quick')}
          className={cn(
            "flex items-center whitespace-nowrap px-3 py-1.5 rounded-full border text-sm font-medium",
            activeFilter === 'quick' 
              ? "bg-green-100 border-green-500 text-green-700" 
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          )}
        >
          <Clock size={14} className="mr-1" />
          Quick (15min)
        </button>
        <button
          onClick={() => handleFilterChange('protein')}
          className={cn(
            "flex items-center whitespace-nowrap px-3 py-1.5 rounded-full border text-sm font-medium",
            activeFilter === 'protein' 
              ? "bg-green-100 border-green-500 text-green-700" 
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          )}
        >
          <Zap size={14} className="mr-1" />
          High Protein
        </button>
        <button
          onClick={() => handleFilterChange('weight-loss')}
          className={cn(
            "flex items-center whitespace-nowrap px-3 py-1.5 rounded-full border text-sm font-medium",
            activeFilter === 'weight-loss' 
              ? "bg-green-100 border-green-500 text-green-700" 
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          )}
        >
          <Filter size={14} className="mr-1" />
          Weight Loss
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size={40} className="text-green-600 animate-spin mb-4" />
          <p className="text-gray-600">Generating personalized recipes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendedRecipes.length > 0 ? (
            recommendedRecipes.map(recipe => (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="block">
                <div className="card hover:translate-y-[-2px]">
                  <div className="relative h-48">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      {recipe.prepTime} min
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">{recipe.title}</h3>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <span className="font-medium">{recipe.protein}g protein</span>
                      <span className="mx-2">•</span>
                      <span>{recipe.calories} cal</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {recipe.dietaryLabels.slice(0, 3).map(label => (
                        <span 
                          key={label} 
                          className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recipes found. Try a different search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper functions
const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

const getMealSuggestion = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return 'breakfast';
  } else if (hour >= 11 && hour < 16) {
    return 'lunch';
  } else {
    return 'dinner';
  }
};

export default Home;