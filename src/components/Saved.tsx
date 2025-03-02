import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, Loader } from 'lucide-react';
import { Recipe } from '../types/recipe';

const Saved = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load saved recipes from localStorage
    const loadSavedRecipes = async () => {
      setIsLoading(true);
      try {
        const savedRecipeIds = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
        
        if (savedRecipeIds.length === 0) {
          setSavedRecipes([]);
          setIsLoading(false);
          return;
        }
        
        // Get recipes data from localStorage
        const savedRecipesData = localStorage.getItem('recipesData');
        let recipesData: Record<string, Recipe> = {};
        
        if (savedRecipesData) {
          recipesData = JSON.parse(savedRecipesData);
        }
        
        // Filter recipes by saved IDs
        const recipes = savedRecipeIds
          .map((id: string) => recipesData[id])
          .filter(Boolean);
        
        setSavedRecipes(recipes);
      } catch (err) {
        console.error('Error loading saved recipes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedRecipes();
  }, []);
  
  const removeSavedRecipe = (id: string) => {
    const savedRecipeIds = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    const updatedSavedRecipes = savedRecipeIds.filter((recipeId: string) => recipeId !== id);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedSavedRecipes));
    
    setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== id));
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader size={40} className="text-green-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading saved recipes...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Saved Recipes</h1>
        <p className="text-gray-600">Your favorite recipes in one place</p>
      </div>
      
      {savedRecipes.length > 0 ? (
        <div className="space-y-4">
          {savedRecipes.map(recipe => (
            <div key={recipe.id} className="card hover:translate-y-[-2px]">
              <div className="flex">
                <div className="w-1/3">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-full object-cover rounded-l-xl"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-800">{recipe.title}</h3>
                    <button 
                      onClick={() => removeSavedRecipe(recipe.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Bookmark size={18} className="fill-green-600 text-green-600" />
                    </button>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <Clock size={14} className="mr-1" />
                    <span>{recipe.prepTime} min</span>
                    <span className="mx-2">•</span>
                    <span>{recipe.calories} cal</span>
                  </div>
                  
                  <Link 
                    to={`/recipe/${recipe.id}`} 
                    className="mt-2 inline-block text-green-700 text-sm font-medium hover:underline"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No saved recipes yet</h3>
          <p className="text-gray-500 mb-4">Save your favorite recipes to access them quickly</p>
          <Link to="/home" className="btn-primary">
            Discover Recipes
           </Link>
        </div>
      )}
    </div>
  );
};

export default Saved;