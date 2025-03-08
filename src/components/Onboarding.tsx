import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [healthGoals, setHealthGoals] = useState<string>('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [enableMealPlanning, setEnableMealPlanning] = useState(true);
  const [bodyWeight, setBodyWeight] = useState<number>(150);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const handleDietaryToggle = (preference: string) => {
    if (dietaryPreferences.includes(preference)) {
      setDietaryPreferences(dietaryPreferences.filter(p => p !== preference));
    } else {
      setDietaryPreferences([...dietaryPreferences, preference]);
    }
  };
  
  const handleAllergyToggle = (allergy: string) => {
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter(a => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };
  
  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const completeOnboarding = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Save preferences to profile
      await updateProfile({
        dietaryPreferences,
        healthGoals,
        allergies,
        enableMealPlanning,
        bodyWeight
      });
      
      // Navigate to home
      navigate('/home');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      setError('Failed to save your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Define dietary preferences options
  const dietaryPreferencesOptions = [
    'Vegetarian', 
    'Vegan', 
    'Gluten-Free', 
    'Dairy-Free', 
    'Low-Carb', 
    'High-Protein', 
    'Keto-Friendly', 
    'Low-Fat'
  ];
  
  // Define health goals options
  const healthGoalsOptions = [
    'Weight Loss', 
    'Muscle Gain', 
    'Maintenance', 
    'Improved Energy', 
    'Better Digestion'
  ];
  
  // Define allergies options
  const allergiesOptions = [
    'Nuts', 
    'Soy', 
    'Gluten', 
    'Dairy', 
    'Mushrooms', 
    'Eggplant'
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-gradient-to-br from-green-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-green-700">Gramavana</h1>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className={`h-2 w-8 rounded-full ${
                      i === step ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {step === 1 && (
              <div className="slide-in">
                <h2 className="text-xl font-semibold mb-6">Dietary Preferences</h2>
                <p className="text-gray-600 mb-6">Select all that apply to you:</p>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {dietaryPreferencesOptions.map((preference) => (
                    <button
                      key={preference}
                      onClick={() => handleDietaryToggle(preference)}
                      className={`p-3 rounded-lg border ${
                        dietaryPreferences.includes(preference)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } transition-colors flex items-center justify-between`}
                    >
                      <span>{preference}</span>
                      {dietaryPreferences.includes(preference) && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="slide-in">
                <h2 className="text-xl font-semibold mb-6">Health Goals</h2>
                <p className="text-gray-600 mb-6">What are you looking to achieve?</p>
                
                <div className="space-y-3 mb-8">
                  {healthGoalsOptions.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setHealthGoals(goal)}
                      className={`p-4 w-full rounded-lg border ${
                        healthGoals === goal
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } transition-colors flex items-center justify-between`}
                    >
                      <span>{goal}</span>
                      {healthGoals === goal && (
                        <Check size={18} className="text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="slide-in">
                <h2 className="text-xl font-semibold mb-6">Allergies & Dislikes</h2>
                <p className="text-gray-600 mb-6">Select ingredients you want to avoid:</p>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {allergiesOptions.map((allergy) => (
                    <button
                      key={allergy}
                      onClick={() => handleAllergyToggle(allergy)}
                      className={`p-3 rounded-lg border ${
                        allergies.includes(allergy)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } transition-colors flex items-center justify-between`}
                    >
                      <span>{allergy}</span>
                      {allergies.includes(allergy) && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div className="slide-in">
                <h2 className="text-xl font-semibold mb-6">Meal Planning</h2>
                <p className="text-gray-600 mb-6">Would you like Gramavana to suggest daily meal plans based on your preferences?</p>
                
                <div className="space-y-3 mb-4">
                  <button
                    onClick={() => setEnableMealPlanning(true)}
                    className={`p-4 w-full rounded-lg border ${
                      enableMealPlanning
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors flex items-center justify-between`}
                  >
                    <div>
                      <span className="font-medium">Yes, enable meal planning</span>
                      <p className="text-sm text-gray-500 mt-1">Get AI-powered meal suggestions daily</p>
                    </div>
                    {enableMealPlanning && (
                      <Check size={18} className="text-green-600" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setEnableMealPlanning(false)}
                    className={`p-4 w-full rounded-lg border ${
                      !enableMealPlanning
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors flex items-center justify-between`}
                  >
                    <div>
                      <span className="font-medium">No, I'll choose recipes myself</span>
                      <p className="text-sm text-gray-500 mt-1">Browse and select recipes manually</p>
                    </div>
                    {!enableMealPlanning && (
                      <Check size={18} className="text-green-600" />
                    )}
                  </button>
                </div>
                
                <div className="mt-4 mb-4">
                  <label htmlFor="bodyWeight" className="block text-sm font-medium text-gray-700 mb-1">
                    Body Weight (lbs) - For protein calculations
                  </label>
                  <input
                    type="number"
                    id="bodyWeight"
                    className="input-field"
                    value={bodyWeight}
                    onChange={(e) => setBodyWeight(parseInt(e.target.value) || 0)}
                    min="50"
                    max="400"
                  />
                  
                  <div className="mt-2 bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Your daily protein target:</strong> {bodyWeight}g
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                  disabled={isLoading}
                >
                  <ChevronLeft size={20} />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}
              
              <button
                onClick={nextStep}
                className="btn-primary flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                <span>{step === 4 ? 'Finish' : 'Next'}</span>
                {step < 4 && <ChevronRight size={20} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Onboarding;