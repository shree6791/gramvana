import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  // Check if we're on the landing page or login page
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  const handleLogoClick = () => {
    // If user is authenticated, go to home, otherwise go to landing page
    navigate(user ? '/home' : '/');
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={handleLogoClick}
            className="flex items-center"
          >
            <span className="text-2xl font-bold text-green-700">Gramavana</span>
          </button>
          
          {/* Desktop Navigation - Public Pages */}
          {isPublicPage && !user && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/#about" className="text-gray-700 hover:text-green-700 transition-colors">
                About
              </Link>
              <Link to="/#features" className="text-gray-700 hover:text-green-700 transition-colors">
                Features
              </Link>
              <Link to="/login" className="btn-primary">
                Log In
              </Link>
            </nav>
          )}
          
          {/* Desktop Navigation - Authenticated User */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          {isPublicPage && !user && (
            <button 
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
        
        {/* Mobile Navigation */}
        {isPublicPage && !user && isMenuOpen && (
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
                className="btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;