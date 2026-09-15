import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';
import navigationData from '../../json-data/navigationData.json';
import './Navbar.css';

const Navbar = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  products = [], 
  onAddToCart, 
  onSelectCategory,
  onOpenProduct,
  cartDrawerOpen: controlledCartDrawerOpen,
  setCartDrawerOpen: setControlledCartDrawerOpen,
  onProceedToCheckout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localCartDrawerOpen, setLocalCartDrawerOpen] = useState(false);
  
  const cartDrawerOpen = controlledCartDrawerOpen !== undefined ? controlledCartDrawerOpen : localCartDrawerOpen;
  const setCartDrawerOpen = setControlledCartDrawerOpen || setLocalCartDrawerOpen;

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // History integration for Mobile Menu
  const handleOpenMobileMenu = () => {
    try {
      window.history.pushState({ modal: 'mobileMenu' }, '');
    } catch (e) {}
    setMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    if (window.history.state?.modal === 'mobileMenu') {
      window.history.back();
    } else {
      setMobileMenuOpen(false);
    }
  };

  // History integration for Search Modal
  const handleOpenSearchModal = () => {
    try {
      window.history.pushState({ modal: 'search' }, '');
    } catch (e) {}
    setSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    if (window.history.state?.modal === 'search') {
      window.history.back();
    } else {
      setSearchModalOpen(false);
    }
  };

  // Popstate listener for mobile navigation back button
  useEffect(() => {
    const handlePopState = () => {
      if (searchModalOpen) {
        setSearchModalOpen(false);
      }
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [mobileMenuOpen, searchModalOpen]);

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setCategoriesOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setCategoriesOpen(false);
    }, 200);
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCategoryClick = (e, catName) => {
    if (e) e.preventDefault();
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setCategoriesOpen(false);
    handleCloseMobileMenu();
    if (onSelectCategory) {
      onSelectCategory(catName);
    }
    const target = document.getElementById('products');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sticky header scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Lock body scroll when drawer or modal is open
  useEffect(() => {
    if (mobileMenuOpen || cartDrawerOpen || searchModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen, cartDrawerOpen, searchModalOpen]);

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (Smooth Infinite Animated Marquee) */}
      <div className="top-announcement-bar" role="region" aria-label="Announcements">
        <div className="announcement-marquee-track">
          <div className="announcement-marquee-content">
            {navigationData.announcements.map((msg, index) => (
              <span key={`msg-1-${index}`} className="announcement-item">
                <span className="announcement-text">{msg}</span>
                <span className="announcement-bullet">✦</span>
              </span>
            ))}
          </div>
          {/* Duplicate set for 100% seamless infinite loop */}
          <div className="announcement-marquee-content" aria-hidden="true">
            {navigationData.announcements.map((msg, index) => (
              <span key={`msg-2-${index}`} className="announcement-item">
                <span className="announcement-text">{msg}</span>
                <span className="announcement-bullet">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-single-line">
          {/* MOBILE MENU BUTTON (Visible on Mobile Left) */}
          <button 
            className="mobile-menu-btn"
            onClick={handleOpenMobileMenu}
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>

          {/* BRAND LOGO (Left on Desktop, Center on Mobile) */}
          <div className="header-logo-area">
            <a href="#home" className="logo-link" aria-label="NK Dry Fruits Home">
              <BrandLogo />
            </a>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="header-nav-menu" aria-label="Primary Site Navigation">
            {navigationData.navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div 
                    key={link.id} 
                    className="nav-item-dropdown"
                    ref={dropdownRef}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <a 
                      href={link.href} 
                      className={`nav-link dropdown-trigger ${categoriesOpen ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setCategoriesOpen(!categoriesOpen);
                      }}
                    >
                      <span>{link.label}</span>
                      <ChevronDown size={14} className={`dropdown-chevron ${categoriesOpen ? 'rotated' : ''}`} />
                    </a>

                    {/* Dropdown Menu for Categories */}
                    {categoriesOpen && link.subCategories && (
                      <div 
                        className="categories-dropdown-menu"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        <div className="dropdown-grid">
                          {link.subCategories.map((sub, idx) => (
                            <a 
                              key={idx} 
                              href={sub.href || "#products"} 
                              className="dropdown-sub-item"
                              onClick={(e) => handleCategoryClick(e, sub.category || sub.name)}
                            >
                              <span className="sub-item-title">{sub.name}</span>
                              <span className="sub-item-desc">{sub.desc}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a 
                  key={link.id} 
                  href={link.href} 
                  className="nav-link"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="nav-offer-badge">{link.badge}</span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* RIGHT: Search Icon + Cart Icon */}
          <div className="header-right-actions">
            {/* Search Icon Button */}
            <button 
              className="simple-action-btn search-trigger-btn"
              onClick={handleOpenSearchModal}
              aria-label="Search products"
              title="Search Dry Fruits"
            >
              <Search size={20} className="action-icon" strokeWidth={2} />
            </button>

            {/* Simple Cart Button with Product Count */}
            <button 
              className="simple-action-btn cart-trigger-btn"
              onClick={() => setCartDrawerOpen(true)}
              aria-label={`View Cart with ${cartItemCount} items`}
              title="View Cart"
            >
              <ShoppingBag size={20} className="action-icon" strokeWidth={2} />
              {cartItemCount > 0 && (
                <span className="cart-count-badge" key={cartItemCount}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={handleCloseSearchModal}
        products={products}
        onAddToCart={onAddToCart}
        onOpenProduct={onOpenProduct}
      />

      {/* Mobile Drawer Menu */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={handleCloseMobileMenu}
      >
        <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-top">
            <BrandLogo />
            <button 
              className="mobile-menu-close" 
              onClick={handleCloseMobileMenu}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Mobile Search Button Trigger */}
          <button 
            className="mobile-search-btn-trigger"
            onClick={() => {
              handleCloseMobileMenu();
              handleOpenSearchModal();
            }}
          >
            <Search size={18} className="mobile-search-icon" />
            <span>Search dry fruits...</span>
          </button>

          {/* Mobile Main Navigation */}
          <div className="mobile-nav-list">
            <span className="mobile-section-title">Navigation</span>
            {navigationData.navLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.href} 
                className="mobile-nav-item"
                onClick={handleCloseMobileMenu}
              >
                <div className="mobile-nav-item-left">
                  <span>{link.label}</span>
                  {link.badge && <span className="nav-offer-badge">{link.badge}</span>}
                </div>
                <ArrowRight size={16} className="mobile-nav-arrow" />
              </a>
            ))}
          </div>

          {/* Categories Quick Links */}
          <div className="mobile-categories-section">
            <span className="mobile-section-title">Popular Categories</span>
            <div className="mobile-category-tags">
              {navigationData.categories.map((cat, i) => (
                <a 
                  key={i} 
                  href={cat.href || "#products"} 
                  className="mobile-cat-chip"
                  onClick={(e) => handleCategoryClick(e, cat.category || cat.title)}
                >
                  <span>{cat.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mobile-drawer-footer">
            <a 
              href={navigationData.contactInfo.whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mobile-whatsapp-btn"
            >
              <MessageCircle size={18} />
              <span>Chat on WhatsApp</span>
            </a>
            <div className="mobile-phone-info">
              <Phone size={15} />
              <span>{navigationData.contactInfo.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onProceedToCheckout={onProceedToCheckout}
      />
    </>
  );
};

export default Navbar;


