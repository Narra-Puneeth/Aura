import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

export const ResizableNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <motion.div
        initial={{ width: '80px' }}
        animate={{ width: open ? '280px' : '80px' }}
        className="fixed top-0 left-0 h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 z-50"
      >
        <div className="flex flex-col h-full">
          {/* Logo/Toggle */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <motion.div
              animate={{ opacity: open ? 1 : 0 }}
              className="flex items-center space-x-2"
            >
              <IconBrandTabler className="text-aura-green" stroke={2} />
              {open && (
                <span className="text-white font-bold text-xl">Aura</span>
              )}
            </motion.div>
            <button
              onClick={() => setOpen(!open)}
              className="text-white hover:text-aura-green transition-colors"
            >
              <motion.div
                animate={{ rotate: open ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <IconArrowLeft stroke={2} />
              </motion.div>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6">
            <NavItem
              icon={<IconUserBolt stroke={2} />}
              label="Dashboard"
              onClick={() => navigate('/dashboard')}
              open={open}
            />
            <NavItem
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Therapy"
              onClick={() => navigate('/therapy')}
              open={open}
            />
            <NavItem
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
              label="Products"
              onClick={() => navigate('/products')}
              open={open}
            />
            <NavItem
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              label="Blogs"
              onClick={() => navigate('/blogs')}
              open={open}
            />
            <NavItem
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              label="Support"
              onClick={() => navigate('/support')}
              open={open}
            />
            <NavItem
              icon={<IconSettings stroke={2} />}
              label="Settings"
              onClick={() => {}}
              open={open}
            />
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <motion.div
              animate={{ opacity: open ? 1 : 0 }}
              className="text-xs text-gray-400 text-center"
            >
              {open && '© 2025 Aura - Team Mathians'}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Backdrop for mobile */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

const NavItem = ({ icon, label, onClick, open }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-3 px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all"
    >
      <div className="text-aura-purple">{icon}</div>
      <motion.span
        animate={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none' }}
        className="font-medium"
      >
        {label}
      </motion.span>
    </button>
  );
};

export default ResizableNavbar;
