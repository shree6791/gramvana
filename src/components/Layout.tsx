import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 pb-16">
        <Outlet />
      </div>
      <Navigation />
      <Footer />
    </div>
  );
};

export default Layout;