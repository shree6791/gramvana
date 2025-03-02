export interface Recipe {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  tags: string[];
  keyBenefits: string[];
  ingredients: string[];
  instructions: string[];
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dietaryLabels: string[];
}

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Protein-Packed Chickpea Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    prepTime: 15,
    protein: 22,
    calories: 450,
    carbs: 65,
    fat: 12,
    tags: ['high-protein', 'quick', 'weight-loss'],
    keyBenefits: ['Muscle recovery', 'Sustained energy', 'Gut health'],
    ingredients: [
      '1 cup chickpeas, cooked',
      '1 cup quinoa, cooked',
      '1 avocado, sliced',
      '1 cup cherry tomatoes, halved',
      '1/4 cup red onion, diced',
      '2 tbsp olive oil',
      '1 tbsp lemon juice',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Combine chickpeas and quinoa in a bowl',
      'Add sliced avocado, cherry tomatoes, and red onion',
      'Drizzle with olive oil and lemon juice',
      'Season with salt and pepper',
      'Mix gently and serve'
    ],
    mealType: 'lunch',
    dietaryLabels: ['Vegan', 'Gluten-Free', 'High-Protein']
  },
  {
    id: '2',
    title: 'Overnight Oats with Berries',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80',
    prepTime: 10,
    protein: 15,
    calories: 350,
    carbs: 55,
    fat: 8,
    tags: ['breakfast', 'quick', 'weight-loss'],
    keyBenefits: ['Heart health', 'Digestive health', 'Sustained energy'],
    ingredients: [
      '1/2 cup rolled oats',
      '1/2 cup almond milk',
      '1/4 cup Greek yogurt',
      '1 tbsp chia seeds',
      '1/2 cup mixed berries',
      '1 tbsp honey or maple syrup',
      '1/4 tsp vanilla extract'
    ],
    instructions: [
      'Combine oats, almond milk, yogurt, and chia seeds in a jar',
      'Add honey and vanilla extract',
      'Stir well and refrigerate overnight',
      'Top with mixed berries before serving'
    ],
    mealType: 'breakfast',
    dietaryLabels: ['Vegetarian', 'Low-Fat']
  },
  {
    id: '3',
    title: 'Spinach and Mushroom Tofu Scramble',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
    prepTime: 12,
    protein: 18,
    calories: 280,
    carbs: 15,
    fat: 16,
    tags: ['breakfast', 'high-protein', 'quick'],
    keyBenefits: ['Muscle building', 'Iron-rich', 'Low-carb energy'],
    ingredients: [
      '200g firm tofu, crumbled',
      '1 cup spinach, chopped',
      '1/2 cup mushrooms, sliced',
      '1/4 cup nutritional yeast',
      '1/2 tsp turmeric',
      '1/4 tsp black salt (kala namak)',
      '1 tbsp olive oil',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Heat olive oil in a pan over medium heat',
      'Add mushrooms and cook until softened',
      'Add crumbled tofu, turmeric, and black salt',
      'Cook for 3-4 minutes, stirring occasionally',
      'Add spinach and cook until wilted',
      'Sprinkle nutritional yeast and mix well',
      'Season with salt and pepper'
    ],
    mealType: 'breakfast',
    dietaryLabels: ['Vegan', 'Gluten-Free', 'High-Protein', 'Low-Carb']
  },
  {
    id: '4',
    title: 'Mediterranean Lentil Salad',
    image: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    prepTime: 20,
    protein: 16,
    calories: 320,
    carbs: 45,
    fat: 10,
    tags: ['lunch', 'weight-loss', 'high-fiber'],
    keyBenefits: ['Heart health', 'Digestive health', 'Anti-inflammatory'],
    ingredients: [
      '1 cup cooked lentils',
      '1 cucumber, diced',
      '1 bell pepper, diced',
      '1/2 cup cherry tomatoes, halved',
      '1/4 cup red onion, finely chopped',
      '1/4 cup olives, sliced',
      '2 tbsp olive oil',
      '1 tbsp lemon juice',
      '1 tsp dried oregano',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Combine lentils, cucumber, bell pepper, tomatoes, onion, and olives in a bowl',
      'In a small bowl, whisk together olive oil, lemon juice, and oregano',
      'Pour dressing over the salad and toss to combine',
      'Season with salt and pepper',
      'Refrigerate for 30 minutes before serving for best flavor'
    ],
    mealType: 'lunch',
    dietaryLabels: ['Vegan', 'Gluten-Free', 'High-Fiber']
  },
  {
    id: '5',
    title: 'Sweet Potato and Black Bean Burrito Bowl',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    prepTime: 25,
    protein: 14,
    calories: 420,
    carbs: 70,
    fat: 12,
    tags: ['dinner', 'high-fiber', 'weight-loss'],
    keyBenefits: ['Gut health', 'Sustained energy', 'Vitamin A boost'],
    ingredients: [
      '1 medium sweet potato, diced and roasted',
      '1 cup black beans, cooked',
      '1/2 cup corn kernels',
      '1/2 cup brown rice, cooked',
      '1 avocado, sliced',
      '1/4 cup red onion, diced',
      '2 tbsp cilantro, chopped',
      '1 lime, juiced',
      '1 tsp cumin',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Arrange brown rice at the bottom of a bowl',
      'Top with roasted sweet potatoes, black beans, and corn',
      'Add sliced avocado and red onion',
      'Sprinkle with cilantro',
      'Drizzle with lime juice',
      'Season with cumin, salt, and pepper'
    ],
    mealType: 'dinner',
    dietaryLabels: ['Vegan', 'Gluten-Free', 'High-Fiber']
  },
  {
    id: '6',
    title: 'Green Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1638439430466-b9d7d7f42e49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    prepTime: 8,
    protein: 12,
    calories: 280,
    carbs: 40,
    fat: 8,
    tags: ['breakfast', 'quick', 'weight-loss'],
    keyBenefits: ['Detoxification', 'Vitamin boost', 'Antioxidant-rich'],
    ingredients: [
      '1 frozen banana',
      '1 cup spinach',
      '1/2 cup kale',
      '1/2 cup almond milk',
      '1 tbsp almond butter',
      '1 tbsp chia seeds',
      '1 tsp spirulina (optional)',
      'Toppings: granola, berries, coconut flakes'
    ],
    instructions: [
      'Blend frozen banana, spinach, kale, almond milk, almond butter, and spirulina until smooth',
      'Pour into a bowl',
      'Top with granola, berries, and coconut flakes',
      'Add chia seeds on top'
    ],
    mealType: 'breakfast',
    dietaryLabels: ['Vegan', 'Gluten-Free', 'Nutrient-Dense']
  }
];

export const getRecipeById = (id: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.id === id);
};

export const getRecipesByMealType = (mealType: string): Recipe[] => {
  return recipes.filter(recipe => recipe.mealType === mealType);
};

export const getRecipesByTag = (tag: string): Recipe[] => {
  return recipes.filter(recipe => recipe.tags.includes(tag));
};

export const getTimeBasedRecommendations = (): Recipe[] => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return getRecipesByMealType('breakfast');
  } else if (hour >= 11 && hour < 16) {
    return getRecipesByMealType('lunch');
  } else {
    return getRecipesByMealType('dinner');
  }
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export const getMealSuggestion = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return 'breakfast';
  } else if (hour >= 11 && hour < 16) {
    return 'lunch';
  } else {
    return 'dinner';
  }
};