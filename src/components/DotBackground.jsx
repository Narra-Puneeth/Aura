import React from 'react';
import { cn } from '../lib/utils';

const DotBackground = ({ children, className }) => {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DotBackground;
