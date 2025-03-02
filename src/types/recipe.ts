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