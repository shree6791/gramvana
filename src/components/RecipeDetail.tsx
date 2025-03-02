import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Bookmark, Share2, Heart, Loader } from 'lucide-react';
import { generateRecipe } from '../services/openai';
import { Recipe } from '../types/recipe';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have this recipe in localStorage
        const savedRecipesData = localStorage.getItem('recipesData');
        let recipesData: Record<string, Recipe> = {};
        
        if (savedRecipesData) {
          recipesData = JSON.parse(savedRecipesData);
        }
        
        // If we have the recipe in localStorage, use it
        if (id && recipesData[id]) {
          setRecipe(recipesData[id]);
        } else if (id) {
          // Otherwise, fetch it from the API
          // For demo purposes, we'll generate a new recipe
          // In a real app, you would fetch the specific recipe by ID
          
          // Load user preferences from localStorage
          const dietaryPreferences = JSON.parse(localStorage.getItem('dietaryPreferences') || '[]');
          const healthGoals = localStorage.getItem('healthGoals') || '';
          const allergies = JSON.parse(localStorage.getItem('allergies') || '[]');
          const bodyWeight = parseInt(localStorage.getItem('bodyWeight') || '150');
          
          const newRecipe = await generateRecipe({
            dietaryPreferences,
            healthGoals,
            allergies,
            bodyWeight
          });
          
          // Override the ID to match the requested ID
          newRecipe.id = id;
          
          // Save the recipe to localStorage
          recipesData[id] = newRecipe;
          localStorage.setItem('recipesData', JSON.stringify(recipesData));
          
          setRecipe(newRecipe);
        }
        
        // Check if recipe is saved
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
        setIsSaved(savedRecipes.includes(id));
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id, navigate]);
  
  const handleSave = () => {
    if (!id) return;
    
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    
    if (isSaved) {
      const updatedSavedRecipes = savedRecipes.filter((recipeId: string) => recipeId !== id);
      localStorage.setItem('savedRecipes', JSON.stringify(updatedSavedRecipes));
    } else {
      savedRecipes.push(id);
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
    
    setIsSaved(!isSaved);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <Loader size={40} className="text-green-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading recipe...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => navigate('/home')}
          className="mt-4 btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  if (!recipe) return null;
  
  // Calculate protein percentage of daily target
  const bodyWeight = parseInt(localStorage.getItem('bodyWeight') || '150');
  const dailyProteinTarget = bodyWeight; // 1g per pound
  const proteinPercentage = Math.round((recipe.protein / dailyProteinTarget) * 100);
  
  return (
    <div className="pb-6">
      <div className="relative h-72">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white p-2 rounded-full shadow-md"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={handleSave}
              className="bg-white p-2 rounded-full shadow-md"
            >
              <Bookmark 
                size={20} 
                className={isSaved ? "text-green-600 fill-green-600" : "text-gray-700"} 
              />
            </button>
            <button className="bg-white p-2 rounded-full shadow-md">
              <Share2 size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-4">
        <h1 className="text-2xl font-bold mt-4 mb-2">{recipe.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-4">
          <Clock size={16} className="mr-1" />
          <span>{recipe.prepTime} min</span>
          <span className="mx-2">•</span>
          <span className="font-medium">{recipe.calories} calories</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.dietaryLabels.map(label => (
            <span 
              key={label} 
              className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
            >
              {label}
            </span>
          ))}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-blue-800">Protein Content</h3>
            <span className="text-sm text-blue-700">{recipe.protein}g / {dailyProteinTarget}g daily target</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            This recipe provides {proteinPercentage}% of your daily protein goal
          </p>
        </div>
        
        <div className="grid grid-cols-4 gap-2 bg-gray-50 rounded-xl p-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Protein</p>
            <p className="font-semibold text-green-700">{recipe.protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Carbs</p>
            <p className="font-semibold text-indigo-700">{recipe.carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Fat</p>
            <p className="font-semibold text-amber-700">{recipe.fat}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Calories</p>
            <p className="font-semibold">{recipe.calories}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Key Benefits</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.keyBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full"
              >
                <Heart size={14} className="mr-1" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-medium text-sm mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;