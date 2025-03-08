import axios from 'axios';
import { Recipe } from '../types/recipe';

// Load API key from environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

interface RecipeRequestParams {
  dietaryPreferences: string[];
  healthGoals: string;
  allergies: string[];
  mealType?: string;
  proteinTarget?: number;
  bodyWeight?: number;
}

export const generateRecipe = async (params: RecipeRequestParams): Promise<Recipe> => {
  const recipes = await generateMultipleRecipes(params, 1);
  return recipes[0];
};

export const generateMultipleRecipes = async (
  params: RecipeRequestParams, 
  count: number = 3
): Promise<Recipe[]> => {
  try {
    // Calculate protein target based on parameters
    const proteinTarget = params.proteinTarget ? `${params.proteinTarget}g` : 
                          params.bodyWeight ? `${Math.round(params.bodyWeight * 0.25)}g` : 
                          'high protein content';
    
    // Get meal-specific instructions
    let mealSpecificInstructions = '';
    if (params.mealType === 'breakfast') {
      mealSpecificInstructions = 'These should be morning meals that provide energy for the day. Focus on protein-rich breakfast options that are satisfying and quick to prepare.';
    } else if (params.mealType === 'lunch') {
      mealSpecificInstructions = 'These should be balanced midday meals that provide sustained energy. Include a good mix of protein, complex carbs, and vegetables.';
    } else if (params.mealType === 'snack') {
      mealSpecificInstructions = 'These should be quick, easy-to-prepare snacks that are portable and protein-rich. Keep them under 300 calories but with significant protein content.';
    } else if (params.mealType === 'dinner') {
      mealSpecificInstructions = 'These should be satisfying evening meals with substantial protein content. Focus on complete proteins and nutrient-dense ingredients.';
    }
    
    // Build the prompt
    const prompt = `
      Generate ${count} different vegetarian recipes (NO EGGS, NO MEAT, NO FISH) with the following specifications:
      
      - Dietary preferences: ${params.dietaryPreferences.join(', ') || 'Vegetarian'}
      - Health goal: ${params.healthGoals || 'Balanced nutrition'}
      - Allergies to avoid: ${params.allergies.join(', ') || 'None'}
      - Meal type: ${params.mealType || 'Any'}
      - Protein requirement: Approximately ${proteinTarget} per recipe
      
      ${mealSpecificInstructions}
      
      All recipes should be strictly vegetarian (no eggs, no meat, no fish).
      Focus on plant-based protein sources like legumes, tofu, tempeh, seitan, quinoa, etc.
      
      Return the recipes in a JSON array format, where each recipe has the following structure:
      {
        "id": "unique-id",
        "title": "Recipe Title",
        "image": "placeholder-url",
        "prepTime": minutes,
        "protein": grams,
        "calories": number,
        "carbs": grams,
        "fat": grams,
        "tags": ["tag1", "tag2"],
        "keyBenefits": ["benefit1", "benefit2"],
        "ingredients": ["ingredient1", "ingredient2"],
        "instructions": ["step1", "step2"],
        "mealType": "breakfast/lunch/dinner/snack",
        "dietaryLabels": ["Vegetarian", "other-labels"]
      }
      
      For the image URLs, use placeholders from Unsplash that match each recipe (e.g., https://images.unsplash.com/photo-xxxx).
      
      Ensure the protein content is accurately calculated and prominently featured in each recipe.
      The goal is to help users achieve 1g of protein per pound of body weight daily.
      
      Return exactly ${count} unique recipes in a JSON array.
      
      IMPORTANT: Return ONLY the JSON array, with no markdown code block markers or other formatting.
    `;

    console.log('Generating recipes with prompt:', prompt);
    
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found. Please configure your API key.');
    }
    
    // Use the OpenAI API to generate recipes
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a culinary expert specializing in vegetarian nutrition. Always return data in clean JSON format without markdown or code block markers.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    // Get the content from the response
    let content = response.data.choices[0].message.content;
    
    // Clean up the content by removing any markdown code block markers
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the response to get the recipes data
    const responseData = JSON.parse(content);
    
    // Ensure we have an array of recipes
    const recipes = Array.isArray(responseData) ? responseData : [responseData];
    
    // Process each recipe
    const processedRecipes = recipes.map(recipe => {
      // Generate a unique ID if not provided
      if (!recipe.id) {
        recipe.id = `gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      // Ensure the protein content matches the target if specified
      if (params.proteinTarget) {
        recipe.protein = params.proteinTarget;
      }
      
      return recipe;
    });
    
    // Save recipes to localStorage for future reference
    const savedRecipesData = localStorage.getItem('recipesData');
    let storedRecipes: Record<string, Recipe> = {};
    
    if (savedRecipesData) {
      storedRecipes = JSON.parse(savedRecipesData);
    }
    
    // Add each recipe to the storage
    processedRecipes.forEach(recipe => {
      storedRecipes[recipe.id] = recipe;
    });
    
    localStorage.setItem('recipesData', JSON.stringify(storedRecipes));
    
    return processedRecipes;
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw new Error('Failed to generate recipes. Please try again.');
  }
};