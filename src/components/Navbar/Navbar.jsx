import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';
import navigationData from '../../json-data/navigationData.json';
import './Navbar.css';

const Navbar = ({ cartItems, onUpdateQuantity, onRemoveItem, products = [], onAddToCart, onSelectCategory }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCategoryClick = (e, catName) => {
    if (e) e.preventDefault();
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            onClick={() => setMobileMenuOpen(true)}
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
                    onMouseEnter={() => setCategoriesOpen(true)}
                    onMouseLeave={() => setCategoriesOpen(false)}
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
                      <div className="categories-dropdown-menu">
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
              onClick={() => setSearchModalOpen(true)}
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
        onClose={() => setSearchModalOpen(false)}
        products={products}
        onAddToCart={onAddToCart}
      />

      {/* Mobile Drawer Menu */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-top">
            <BrandLogo />
            <button 
              className="mobile-menu-close" 
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Mobile Search Button Trigger */}
          <button 
            className="mobile-search-btn-trigger"
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchModalOpen(true);
            }}
          >
            <Search size={18} className="mobile-search-icon" />
            <span>Search dry fruits & combos...</span>
          </button>

          {/* Mobile Main Navigation */}
          <div className="mobile-nav-list">
            <span className="mobile-section-title">Navigation</span>
            {navigationData.navLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.href} 
                className="mobile-nav-item"
                onClick={() => setMobileMenuOpen(false)}
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
      />
    </>
  );
};

export default Navbar;


