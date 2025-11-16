import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`glass rounded-2xl p-6 ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
