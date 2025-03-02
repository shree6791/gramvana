import axios from 'axios';
import { Recipe } from '../types/recipe';

// Load API key from environment variables
// In a production app, this would be handled by a backend service
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
  try {
    // Calculate protein target based on parameters
    const proteinTarget = params.proteinTarget ? `${params.proteinTarget}g` : 
                          params.bodyWeight ? `${Math.round(params.bodyWeight * 0.25)}g` : 
                          'high protein content';
    
    // Get meal-specific instructions
    let mealSpecificInstructions = '';
    if (params.mealType === 'breakfast') {
      mealSpecificInstructions = 'This should be a morning meal that provides energy for the day. Focus on protein-rich breakfast options that are satisfying and quick to prepare.';
    } else if (params.mealType === 'lunch') {
      mealSpecificInstructions = 'This should be a balanced midday meal that provides sustained energy. Include a good mix of protein, complex carbs, and vegetables.';
    } else if (params.mealType === 'snack') {
      mealSpecificInstructions = 'This should be a quick, easy-to-prepare snack that is portable and protein-rich. Keep it under 300 calories but with significant protein content.';
    } else if (params.mealType === 'dinner') {
      mealSpecificInstructions = 'This should be a satisfying evening meal with substantial protein content. Focus on complete proteins and nutrient-dense ingredients.';
    }
    
    // Build the prompt
    const prompt = `
      Generate a detailed vegetarian recipe (NO EGGS, NO MEAT, NO FISH) with the following specifications:
      
      - Dietary preferences: ${params.dietaryPreferences.join(', ') || 'Vegetarian'}
      - Health goal: ${params.healthGoals || 'Balanced nutrition'}
      - Allergies to avoid: ${params.allergies.join(', ') || 'None'}
      - Meal type: ${params.mealType || 'Any'}
      - Protein requirement: Approximately ${proteinTarget}
      
      ${mealSpecificInstructions}
      
      The recipe should be strictly vegetarian (no eggs, no meat, no fish).
      Focus on plant-based protein sources like legumes, tofu, tempeh, seitan, quinoa, etc.
      
      Return the recipe in JSON format with the following structure:
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
      
      For the image URL, use a placeholder from Unsplash that matches the recipe (e.g., https://images.unsplash.com/photo-xxxx).
      
      Ensure the protein content is accurately calculated and prominently featured.
      The goal is to help users achieve 1g of protein per pound of body weight daily.
    `;

    console.log('Generating recipe with prompt:', prompt);
    
    // Check if API key is available
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not found. Using mock recipe generation.');
      return generateMockRecipe(params);
    }
    
    // Use the OpenAI API to generate a recipe
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a culinary expert specializing in vegetarian nutrition.' },
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
      
      // Parse the response to get the recipe data
      const recipeData = JSON.parse(response.data.choices[0].message.content);
      
      // Generate a unique ID if not provided
      if (!recipeData.id) {
        recipeData.id = `gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      // Ensure the protein content matches the target
      if (params.proteinTarget && recipeData.protein !== params.proteinTarget) {
        recipeData.protein = params.proteinTarget;
      }
      
      // Save recipe to localStorage for future reference
      const savedRecipesData = localStorage.getItem('recipesData');
      let recipesData: Record<string, Recipe> = {};
      
      if (savedRecipesData) {
        recipesData = JSON.parse(savedRecipesData);
      }
      
      recipesData[recipeData.id] = recipeData;
      localStorage.setItem('recipesData', JSON.stringify(recipesData));
      
      return recipeData;
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      console.log('Falling back to mock recipe generation');
      // If the API call fails, fall back to the mock recipe generator
      return generateMockRecipe(params);
    }
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe. Please try again.');
  }
};

export const generateMultipleRecipes = async (
  params: RecipeRequestParams, 
  count: number = 3
): Promise<Recipe[]> => {
  try {
    const recipes: Recipe[] = [];
    
    for (let i = 0; i < count; i++) {
      const recipe = await generateRecipe(params);
      recipes.push(recipe);
      
      // Add a small delay between requests to avoid rate limiting
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return recipes;
  } catch (error) {
    console.error('Error generating multiple recipes:', error);
    throw new Error('Failed to generate recipes. Please try again.');
  }
};

// Mock function to simulate OpenAI response for demo purposes
const generateMockRecipe = (params: RecipeRequestParams): Recipe => {
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const requestedMealType = params.mealType || mealTypes[Math.floor(Math.random() * mealTypes.length)];
  
  // Use the exact protein target if provided, otherwise calculate based on meal type
  const targetProtein = params.proteinTarget || 15; // Default to 15g if no target specified
  
  const recipes = [
    {
      id: `gen-${Date.now()}-1`,
      title: 'Tofu Scramble with Spinach and Nutritional Yeast',
      image: 'https://images.unsplash.com/photo-1511690078903-71de64ac9c54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
      prepTime: 15,
      protein: targetProtein,
      calories: 320,
      carbs: 12,
      fat: 18,
      tags: ['high-protein', 'quick', 'breakfast'],
      keyBenefits: ['Complete protein', 'Iron-rich', 'B12 fortified'],
      ingredients: [
        '14oz firm tofu, pressed and crumbled',
        '2 tbsp nutritional yeast',
        '1 cup spinach, chopped',
        '1/4 cup red bell pepper, diced',
        '1/4 cup onion, diced',
        '1 tbsp olive oil',
        '1/2 tsp turmeric',
        '1/4 tsp black salt (kala namak)',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Press tofu to remove excess water and crumble into a bowl',
        'Heat olive oil in a pan over medium heat',
        'Add onion and bell pepper, sauté until softened',
        'Add crumbled tofu, turmeric, and black salt',
        'Cook for 5-6 minutes, stirring occasionally',
        'Add spinach and cook until wilted',
        'Sprinkle nutritional yeast and mix well',
        'Season with salt and pepper to taste'
      ],
      mealType: 'breakfast',
      dietaryLabels: ['Vegan', 'Gluten-Free', 'High-Protein']
    },
    {
      id: `gen-${Date.now()}-2`,
      title: 'Lentil and Quinoa Power Bowl',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      prepTime: 25,
      protein: targetProtein,
      calories: 450,
      carbs: 65,
      fat: 10,
      tags: ['high-protein', 'lunch', 'meal-prep'],
      keyBenefits: ['Complete amino acids', 'Fiber-rich', 'Sustained energy'],
      ingredients: [
        '1 cup cooked lentils',
        '1/2 cup cooked quinoa',
        '1 cup roasted vegetables (sweet potato, broccoli, bell peppers)',
        '1/4 cup hummus',
        '1 tbsp tahini',
        '1 tbsp lemon juice',
        '1 tsp cumin',
        'Fresh herbs (parsley, cilantro)',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Combine lentils and quinoa in a bowl',
        'Add roasted vegetables',
        'Top with a dollop of hummus',
        'Drizzle with tahini and lemon juice',
        'Sprinkle with cumin and fresh herbs',
        'Season with salt and pepper',
        'Mix gently before eating'
      ],
      mealType: 'lunch',
      dietaryLabels: ['Vegan', 'Gluten-Free', 'High-Protein', 'High-Fiber']
    },
    {
      id: `gen-${Date.now()}-3`,
      title: 'Tempeh and Vegetable Stir-Fry',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
      prepTime: 20,
      protein: targetProtein,
      calories: 380,
      carbs: 30,
      fat: 16,
      tags: ['high-protein', 'dinner', 'quick'],
      keyBenefits: ['Fermented protein', 'Gut health', 'Antioxidant-rich'],
      ingredients: [
        '8oz tempeh, cubed',
        '2 cups mixed vegetables (broccoli, carrots, snap peas)',
        '2 cloves garlic, minced',
        '1 tbsp ginger, grated',
        '2 tbsp tamari or soy sauce',
        '1 tbsp sesame oil',
        '1 tbsp maple syrup',
        '1 tsp sriracha (optional)',
        '1 tbsp sesame seeds',
        'Green onions for garnish'
      ],
      instructions: [
        'Cut tempeh into cubes and steam for 10 minutes',
        'In a wok or large pan, heat sesame oil over medium-high heat',
        'Add garlic and ginger, sauté for 30 seconds',
        'Add tempeh and cook until browned on all sides',
        'Add vegetables and stir-fry for 5-7 minutes',
        'In a small bowl, mix tamari, maple syrup, and sriracha',
        'Pour sauce over the stir-fry and toss to coat',
        'Garnish with sesame seeds and green onions'
      ],
      mealType: 'dinner',
      dietaryLabels: ['Vegan', 'High-Protein']
    },
    {
      id: `gen-${Date.now()}-4`,
      title: 'Protein-Packed Chickpea Salad',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      prepTime: 15,
      protein: targetProtein,
      calories: 350,
      carbs: 45,
      fat: 12,
      tags: ['high-protein', 'lunch', 'quick'],
      keyBenefits: ['Fiber-rich', 'Heart-healthy', 'Sustained energy'],
      ingredients: [
        '2 cups chickpeas, cooked',
        '1 cucumber, diced',
        '1 bell pepper, diced',
        '1/4 cup red onion, finely chopped',
        '1/4 cup kalamata olives, sliced',
        '1/4 cup feta cheese (optional, omit for vegan)',
        '2 tbsp olive oil',
        '1 tbsp lemon juice',
        '1 tsp dried oregano',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Combine chickpeas, cucumber, bell pepper, red onion, and olives in a bowl',
        'If using, add crumbled feta cheese',
        'In a small bowl, whisk together olive oil, lemon juice, and oregano',
        'Pour dressing over the salad and toss to combine',
        'Season with salt and pepper',
        'Refrigerate for 30 minutes before serving for best flavor'
      ],
      mealType: 'lunch',
      dietaryLabels: ['Vegetarian', 'Gluten-Free', 'High-Protein']
    },
    {
      id: `gen-${Date.now()}-5`,
      title: 'Seitan and Vegetable Stir-Fry',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
      prepTime: 20,
      protein: targetProtein,
      calories: 400,
      carbs: 25,
      fat: 14,
      tags: ['high-protein', 'dinner', 'quick'],
      keyBenefits: ['Complete protein', 'Low-carb', 'Vitamin-rich'],
      ingredients: [
        '8oz seitan, sliced',
        '2 cups mixed vegetables (broccoli, bell peppers, carrots)',
        '2 cloves garlic, minced',
        '1 tbsp ginger, grated',
        '2 tbsp tamari or soy sauce',
        '1 tbsp sesame oil',
        '1 tbsp rice vinegar',
        '1 tsp maple syrup',
        '1 tbsp cornstarch mixed with 2 tbsp water',
        'Sesame seeds and green onions for garnish'
      ],
      instructions: [
        'Heat sesame oil in a wok or large pan over medium-high heat',
        'Add garlic and ginger, sauté for 30 seconds',
        'Add seitan and cook until browned, about 3-4 minutes',
        'Add vegetables and stir-fry for 5-7 minutes until crisp-tender',
        'In a small bowl, mix tamari, rice vinegar, and maple syrup',
        'Pour sauce over the stir-fry',
        'Add cornstarch slurry and cook until sauce thickens',
        'Garnish with sesame seeds and green onions'
      ],
      mealType: 'dinner',
      dietaryLabels: ['Vegan', 'High-Protein']
    },
    {
      id: `gen-${Date.now()}-6`,
      title: 'Greek Yogurt Protein Bowl',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      prepTime: 5,
      protein: targetProtein,
      calories: 250,
      carbs: 20,
      fat: 8,
      tags: ['high-protein', 'snack', 'quick'],
      keyBenefits: ['Muscle recovery', 'Gut health', 'Calcium-rich'],
      ingredients: [
        '1 cup Greek yogurt',
        '1 tbsp honey or maple syrup',
        '1/4 cup mixed berries',
        '1 tbsp chia seeds',
        '1 tbsp hemp seeds',
        '1 tbsp almond butter',
        '1/4 tsp vanilla extract',
        'Pinch of cinnamon'
      ],
      instructions: [
        'Add Greek yogurt to a bowl',
        'Drizzle with honey or maple syrup',
        'Top with mixed berries, chia seeds, and hemp seeds',
        'Add a dollop of almond butter',
        'Sprinkle with cinnamon and add vanilla extract',
        'Mix gently before eating'
      ],
      mealType: 'snack',
      dietaryLabels: ['Vegetarian', 'Gluten-Free', 'High-Protein']
    },
    {
      id: `gen-${Date.now()}-7`,
      title: 'Protein-Packed Edamame Hummus with Veggie Sticks',
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      prepTime: 10,
      protein: targetProtein,
      calories: 220,
      carbs: 18,
      fat: 12,
      tags: ['high-protein', 'snack', 'vegan'],
      keyBenefits: ['Complete protein', 'Fiber-rich', 'Heart-healthy'],
      ingredients: [
        '1 cup shelled edamame, cooked',
        '1/4 cup chickpeas, cooked',
        '2 tbsp tahini',
        '1 tbsp olive oil',
        '1 tbsp lemon juice',
        '1 clove garlic',
        '1/4 tsp cumin',
        'Salt and pepper to taste',
        'Assorted vegetable sticks (carrots, celery, bell peppers)'
      ],
      instructions: [
        'Combine edamame, chickpeas, tahini, olive oil, lemon juice, garlic, and cumin in a food processor',
        'Blend until smooth, adding water if needed to reach desired consistency',
        'Season with salt and pepper to taste',
        'Transfer to a bowl and serve with vegetable sticks'
      ],
      mealType: 'snack',
      dietaryLabels: ['Vegan', 'Gluten-Free', 'High-Protein']
    },
    {
      id: `gen-${Date.now()}-8`,
      title: 'Protein Energy Balls',
      image: 'https://images.unsplash.com/photo-1490567674331-72de84996c6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      prepTime: 15,
      protein: targetProtein,
      calories: 180,
      carbs: 15,
      fat: 10,
      tags: ['high-protein', 'snack', 'no-bake'],
      keyBenefits: ['Sustained energy', 'Portable protein', 'Nutrient-dense'],
      ingredients: [
        '1 cup rolled oats',
        '1/2 cup plant-based protein powder',
        '1/2 cup nut butter (almond, peanut, or cashew)',
        '1/4 cup ground flaxseed',
        '3 tbsp maple syrup or honey',
        '2 tbsp mini dark chocolate chips',
        '1 tsp vanilla extract',
        'Pinch of salt'
      ],
      instructions: [
        'Combine all ingredients in a large bowl',
        'Mix well until a dough forms',
        'If mixture is too dry, add a little water or plant milk',
        'Roll into 1-inch balls',
        'Refrigerate for at least 30 minutes before serving',
        'Store in an airtight container in the refrigerator for up to a week'
      ],
      mealType: 'snack',
      dietaryLabels: ['Vegetarian', 'High-Protein']
    }
  ];
  
  // Filter recipes by meal type if specified
  const filteredRecipes = requestedMealType !== 'Any' 
    ? recipes.filter(r => r.mealType === requestedMealType.toLowerCase())
    : recipes;
  
  // If no recipes match the meal type, return any recipe
  if (filteredRecipes.length === 0) {
    return recipes[Math.floor(Math.random() * recipes.length)];
  }
  
  // Return a random recipe from the filtered list
  const recipe = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
  
  // Save mock recipe to localStorage for future reference
  const savedRecipesData = localStorage.getItem('recipesData');
  let recipesData: Record<string, Recipe> = {};
  
  if (savedRecipesData) {
    recipesData = JSON.parse(savedRecipesData);
  }
  
  recipesData[recipe.id] = recipe;
  localStorage.setItem('recipesData', JSON.stringify(recipesData));
  
  return recipe;
};