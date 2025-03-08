import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Info, Star } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  // Check if we're on the landing page or login page
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  const handleLogoClick = () => {
    // Navigate to landing page if on authenticated pages, otherwise stay on landing
    if (!isPublicPage) {
      navigate('/');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    // If not on landing page, navigate to landing page first
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // If already on landing page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const publicMenuItems = [
    { icon: Info, label: 'About', sectionId: 'about' },
    { icon: Star, label: 'Features', sectionId: 'features' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={handleLogoClick}
            className="flex items-center"
          >
            <span className="text-2xl font-bold text-green-700">Gramavana</span>
          </button>
          
          {/* Desktop Public Navigation or User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {isPublicPage ? (
              <>
                {publicMenuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSectionClick(item.sectionId)}
                    className="text-gray-700 hover:text-green-700 transition-colors flex items-center gap-2"
                  >
                    {item.label}
                  </button>
                ))}
                <button 
                  onClick={handleLoginClick}
                  className="btn-primary flex items-center gap-2"
                >
                  <User size={18} />
                  Log In
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              {isPublicPage ? (
                <>
                  {publicMenuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleSectionClick(item.sectionId)}
                      className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors py-2"
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  ))}
                  <button 
                    onClick={handleLoginClick}
                    className="btn-primary flex items-center gap-2 justify-center"
                  >
                    <User size={20} />
                    Log In
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors py-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;