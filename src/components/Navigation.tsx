import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, Calendar, User, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-md z-40">
      <div className="flex justify-around items-center">
        <Link 
          to="/home" 
          className={cn(
            "flex flex-col items-center p-2 rounded-lg",
            isActive('/home') ? "text-green-700" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/saved" 
          className={cn(
            "flex flex-col items-center p-2 rounded-lg",
            isActive('/saved') ? "text-green-700" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Bookmark size={24} />
          <span className="text-xs mt-1">Saved</span>
        </Link>
        
        <Link 
          to="/meal-planner" 
          className={cn(
            "flex flex-col items-center p-2 rounded-lg",
            isActive('/meal-planner') ? "text-green-700" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Calendar size={24} />
          <span className="text-xs mt-1">Meal Plan</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={cn(
            "flex flex-col items-center p-2 rounded-lg",
            isActive('/profile') ? "text-green-700" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Navigation;