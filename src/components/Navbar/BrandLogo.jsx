import React from 'react';

const BrandLogo = ({ className = '', onClick }) => {
  return (
    <div 
      className={`brand-logo-wrapper ${className}`}
      onClick={onClick}
      role="banner"
      aria-label="NK Dry Fruits - Premium Dry Fruits"
    >
      <img 
        src="/images/logo.jpeg" 
        alt="NK Dry Fruits" 
        className="brand-logo-img" 
      />
    </div>
  );
};

export default BrandLogo;
