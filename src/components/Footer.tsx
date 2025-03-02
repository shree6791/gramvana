import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  
  // Check if we're on the landing page or login page
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';
  
  // If we're on an authenticated page with bottom navigation, use a simplified footer
  if (!isPublicPage) {
    return (
      <footer className="bg-gray-800 text-gray-300 text-center py-4 text-xs">
        <p>&copy; {new Date().getFullYear()} Gramavana. All rights reserved.</p>
      </footer>
    );
  }
  
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Gramavana</h3>
            <p className="mb-4">Your personal vegetarian recipe assistant for healthy, delicious meals.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/#about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-white transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Sign Up</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Nutrition Guide</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Recipe Index</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>Email: info@gramavana.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Green St, Veggie City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Gramavana. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;