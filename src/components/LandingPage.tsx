import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Leaf, Heart, Zap, Award } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Discover Delicious <span className="text-green-700">Vegetarian</span> Recipes
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Your personal assistant for healthy, plant-based meals tailored to your preferences and nutritional needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="btn-primary text-center">
                  Get Started
                </Link>
                <a href="#features" className="btn-outline text-center">
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1540914124281-342587941389?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80" 
                alt="Vegetarian food bowl" 
                className="rounded-xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* About Us Section */}
      <section className="py-16 bg-white" id="about">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Gramavana</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Gramavana means "forest of nourishment" in Sanskrit. We're on a mission to make vegetarian and plant-based eating delicious, nutritious, and accessible to everyone.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Story</h3>
              <p className="text-gray-600 mb-4">
                Founded in 2023, Gramavana was born from a simple idea: healthy eating shouldn't be complicated or boring. Our team of nutritionists, chefs, and tech enthusiasts came together to create a platform that makes vegetarian cooking enjoyable and personalized.
              </p>
              <p className="text-gray-600">
                We believe that plant-based meals can be protein-rich, satisfying, and incredibly tasty. Our AI-powered recipe recommendations are designed to match your dietary preferences, health goals, and taste preferences.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Team cooking together" 
                className="rounded-xl shadow-md w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50" id="features">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Discover how Gramavana helps you enjoy delicious vegetarian meals tailored to your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Leaf className="text-green-700" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Recipes</h3>
              <p className="text-gray-600">
                Get recipe recommendations based on your dietary preferences, allergies, and health goals.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Heart className="text-green-700" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Nutritional Insights</h3>
              <p className="text-gray-600">
                Track protein, calories, and other nutrients to ensure balanced vegetarian meals.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Zap className="text-green-700" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Meal Planning</h3>
              <p className="text-gray-600">
                Automatically generate weekly meal plans based on your preferences and nutritional needs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear from people who have transformed their vegetarian cooking experience with Gramavana.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/32.jpg" 
                  alt="User" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Sarah J.</h4>
                  <p className="text-gray-500 text-sm">Fitness Coach</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a fitness coach, I'm always looking for high-protein vegetarian recipes. Gramavana has been a game-changer for me and my clients!"
              </p>
              <div className="flex text-yellow-400 mt-3">
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/men/45.jpg" 
                  alt="User" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Michael T.</h4>
                  <p className="text-gray-500 text-sm">Software Developer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The meal planning feature saves me so much time. I no longer stress about what to cook each day while maintaining a balanced vegetarian diet."
              </p>
              <div className="flex text-yellow-400 mt-3">
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/68.jpg" 
                  alt="User" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Priya K.</h4>
                  <p className="text-gray-500 text-sm">Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I recently went vegetarian and was worried about getting enough nutrients. Gramavana made the transition so easy with its nutritional insights."
              </p>
              <div className="flex text-yellow-400 mt-3">
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} />
                <Award size={16} className="text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Vegetarian Cooking?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of users who have discovered the joy of personalized vegetarian recipes.
          </p>
          <Link to="/login" className="inline-flex items-center bg-white text-green-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Get Started Now
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;