import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're on the landing page or login page
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          <Link to={isPublicPage ? "/" : "/home"} className="flex items-center">
            <span className="text-2xl font-bold text-green-700">Gramavana</span>
          </Link>
          
          {/* Desktop Navigation - Public Pages */}
          {isPublicPage && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/#about" className="text-gray-700 hover:text-green-700 transition-colors">
                About
              </Link>
              <Link to="/#features" className="text-gray-700 hover:text-green-700 transition-colors">
                Features
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-green-700 transition-colors">
                Log In
              </Link>
              <Link to="/login" className="btn-primary">
                Sign Up
              </Link>
            </nav>
          )}
          
          {/* Desktop Navigation - Authenticated Pages */}
          {!isPublicPage && (
            <div className="hidden md:flex items-center">
              <span className="text-gray-700">Welcome to Gramavana</span>
            </div>
          )}
          
          {/* Mobile Menu Button - Only for public pages */}
          {isPublicPage && (
            <button 
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
        
        {/* Mobile Navigation - Public Pages */}
        {isPublicPage && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/#about" 
                className="text-gray-700 hover:text-green-700 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/#features" 
                className="text-gray-700 hover:text-green-700 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-green-700 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link 
                to="/login" 
                className="btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;