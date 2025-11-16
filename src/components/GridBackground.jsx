import React from 'react';

const GridBackground = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Enhanced grid pattern with more visible lines */}
      <div
        className="absolute inset-0 [background-size:40px_40px] opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
          `,
          zIndex: 0
        }}
      />
      
      {/* Radial gradient for faded look */}
      <div 
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        style={{ zIndex: 1 }}
      />
      
      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default GridBackground;
