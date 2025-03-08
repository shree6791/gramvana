import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, Calendar, User } from 'lucide-react';
import { cn } from '../utils/cn';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navigationItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/meal-planner', icon: Calendar, label: 'Meal Plan' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-md z-40">
      <div className="flex justify-around items-center h-full max-w-2xl mx-auto">
        {navigationItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              isActive(item.path) 
                ? "text-green-700" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;