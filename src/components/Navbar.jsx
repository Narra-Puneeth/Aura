import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TherapyModeSelector from './TherapyModeSelector';
import headsetIcon from '../assets/headset.png';

const Navbar = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGuidedTherapyClick = () => {
    // Just show the popup directly
    setIsSelectorOpen(true);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${transparent ? 'bg-black/60 backdrop-blur-md' : 'bg-aura-gray'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {/* VR Headset Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-aura-purple to-aura-pink rounded-xl flex items-center justify-center p-1.5">
              <img src={headsetIcon} alt="VR Headset" className="w-full h-full object-contain" />
            </div>
            <div className="text-2xl font-bold gradient-text">Aura</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-white hover:text-aura-green transition-colors duration-200">
              Dashboard
            </Link>
            <Link to="/health-assessment" className="text-white hover:text-aura-green transition-colors duration-200">
              Health Assessment
            </Link>
            <Link to="/nutrition" className="text-white hover:text-aura-green transition-colors duration-200">
              Nutrition
            </Link>
            <button 
              onClick={handleGuidedTherapyClick}
              className="text-white hover:text-aura-green transition-colors duration-200"
            >
              Therapy Session
            </button>
            {/* <Link to="/products" className="text-white hover:text-aura-green transition-colors duration-200">
              Products
            </Link>
            <Link to="/blogs" className="text-white hover:text-aura-green transition-colors duration-200">
              Blogs
            </Link> */}
            <Link to="/support" className="text-white hover:text-aura-green transition-colors duration-200">
              Support
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-aura-green transition-colors duration-200">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-aura-green transition-colors duration-200">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-4">
            <Link to="/dashboard" className="block text-white hover:text-aura-green transition-colors duration-200">
              Dashboard
            </Link>
            <Link to="/health-assessment" className="block text-white hover:text-aura-green transition-colors duration-200">
              Health Assessment
            </Link>
            <Link to="/nutrition" className="block text-white hover:text-aura-green transition-colors duration-200">
              Nutrition
            </Link>
            <button 
              onClick={() => {
                handleGuidedTherapyClick();
                setIsMenuOpen(false);
              }}
              className="block text-white hover:text-aura-green transition-colors duration-200 text-left"
            >
              Therapy Session
            </button>
            <Link to="/products" className="block text-white hover:text-aura-green transition-colors duration-200">
              Products
            </Link>
            <Link to="/blogs" className="block text-white hover:text-aura-green transition-colors duration-200">
              Blogs
            </Link>
            <Link to="/support" className="block text-white hover:text-aura-green transition-colors duration-200">
              Support
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block text-white hover:text-aura-green transition-colors duration-200">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full btn-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-white hover:text-aura-green transition-colors duration-200">
                  Log In
                </Link>
                <Link to="/signup" className="block w-full text-center btn-primary">
                  Join Now
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Therapy Mode Selector Modal */}
      <TherapyModeSelector 
        isOpen={isSelectorOpen} 
        onClose={() => setIsSelectorOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
