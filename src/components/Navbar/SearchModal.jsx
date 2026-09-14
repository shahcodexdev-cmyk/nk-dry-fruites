import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import './SearchModal.css';

const popularKeywords = [
  'California Almonds',
  'Kashmiri Walnuts',
  'Roasted Pistachios',
  'Trail Mix',
  'Cashews',
  'Combo Packs'
];

const SearchModal = ({ isOpen, onClose, products = [], onAddToCart }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? products
    : products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Header */}
        <div className="search-modal-header">
          <div className="search-input-box">
            <Search size={22} className="search-box-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search almonds, walnuts, pistachios, dates, gift combos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search NK Dry Fruits products"
            />
            {query && (
              <button 
                className="search-clear-query" 
                onClick={() => setQuery('')}
                aria-label="Clear query"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button className="search-modal-close" onClick={onClose} aria-label="Close search">
            <X size={22} />
          </button>
        </div>

        {/* Popular Trending Tags */}
        <div className="search-trending-row">
          <span className="trending-label">Trending:</span>
          <div className="trending-tags-list">
            {popularKeywords.map((kw, i) => (
              <button
                key={i}
                type="button"
                className="trending-tag-btn"
                onClick={() => setQuery(kw)}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results / Products Grid */}
        <div className="search-results-area">
          <div className="search-results-heading">
            <span>
              {query ? `Results for "${query}" (${filtered.length})` : 'Popular Farm Fresh Items'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="search-no-results">
              <Search size={40} className="no-res-icon" />
              <h4>No matching organic dry fruits found</h4>
              <p>Try searching for "Almonds", "Walnuts", or "Pistachios"</p>
            </div>
          ) : (
            <div className="search-products-grid">
              {filtered.map((prod) => (
                <div key={prod.id} className="search-product-card">
                  <img src={prod.image} alt={prod.name} className="search-prod-img" />
                  <div className="search-prod-details">
                    <span className="search-prod-cat">{prod.category}</span>
                    <h4 className="search-prod-title">{prod.name}</h4>
                    <div className="search-prod-rating">
                      <Star size={12} fill="#f59e0b" color="#f59e0b" />
                      <span>{prod.rating || 4.9}</span>
                    </div>
                    <div className="search-prod-footer">
                      <span className="search-prod-price">₹{prod.price}</span>
                      <button
                        type="button"
                        className="btn-search-add"
                        onClick={() => {
                          if (onAddToCart) onAddToCart(prod);
                        }}
                      >
                        <ShoppingBag size={14} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
