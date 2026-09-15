import React from 'react';

const SlideCard = ({ slide, isActive, isPrev, isNext }) => {
  const linkHref = slide.ctaLink || slide.link || '#products';

  const handleClick = (e) => {
    if (linkHref.startsWith('#')) {
      const targetElement = document.querySelector(linkHref);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div 
      className={`hero-slide ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}`}
      aria-hidden={!isActive}
    >
      {/* Clickable Slide Link */}
      <a
        href={linkHref}
        className="slide-link-wrapper"
        onClick={handleClick}
        aria-label={slide.title || slide.alt || "Shop collection"}
        tabIndex={isActive ? 0 : -1}
      >
        {/* Pure Image Container with Responsive Picture Element */}
        <div className="slide-media-container">
          <picture className="slide-picture">
            {/* Mobile Viewport Visual */}
            <source 
              media="(max-width: 768px)" 
              srcSet={slide.mobileImage} 
            />
            {/* Desktop Panoramic Visual */}
            <source 
              media="(min-width: 769px)" 
              srcSet={slide.desktopImage} 
            />
            {/* Fallback Image */}
            <img 
              src={slide.desktopImage} 
              alt={slide.alt || slide.title || "NK Dry Fruits Premium Organic Dry Fruits"} 
              className="slide-bg-image" 
              loading={isActive ? 'eager' : 'lazy'}
            />
          </picture>
        </div>
      </a>
    </div>
  );
};

export default SlideCard;
