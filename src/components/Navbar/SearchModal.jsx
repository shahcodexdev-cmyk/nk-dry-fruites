import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingBag, Star, Layers } from 'lucide-react';
import productsData from '../../json-data/productsData.json';
import './SearchModal.css';

const SearchModal = ({ 
  isOpen, 
  onClose, 
  products = [], 
  onAddToCart,
  onOpenProduct 
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const inputRef = useRef(null);

  const categories = productsData.categories || [
    'All',
    'Almonds',
    'Cashews',
    'Pistachios',
    'Walnuts',
    'Peanuts',
    'Exotic Nuts'
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setSelectedCategory('All');
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

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' 
      ? true 
      : (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    
    const matchesQuery = query.trim() === ''
      ? true
      : (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(query.toLowerCase())) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(query.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  const handleProductClick = (prod) => {
    if (onOpenProduct) {
      onOpenProduct(prod);
    }
    onClose();
  };

  return (
    <div className="search-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Header */}
        <div className="search-modal-header">
          <div className="search-input-box">
            <Search size={20} className="search-box-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search almonds, walnuts, cashews..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search NK Dry Fruits products"
            />
            {query && (
              <button 
                className="search-clear-query" 
                onClick={() => setQuery('')}
                aria-label="Clear query"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button className="search-modal-close" onClick={onClose} aria-label="Close search" type="button">
            <X size={20} />
          </button>
        </div>

        {/* Categories Filter Strip */}
        <div className="search-categories-row">
          <div className="categories-label-box">
            <Layers size={14} className="categories-icon" />
            <span className="categories-label">Categories:</span>
          </div>
          <div className="categories-tags-list" role="tablist" aria-label="Search Categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-tag-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results / Products Grid */}
        <div className="search-results-area">
          <div className="search-results-heading">
            <span>
              {query 
                ? `Results for "${query}" (${filtered.length})` 
                : selectedCategory !== 'All' 
                  ? `${selectedCategory} (${filtered.length})`
                  : `All Products (${filtered.length})`
              }
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="search-no-results">
              <Search size={38} className="no-res-icon" />
              <h4>No matching organic dry fruits found</h4>
              <p>Try switching category or searching for another keyword</p>
            </div>
          ) : (
            <div className="search-products-grid">
              {filtered.map((prod) => {
                const defaultVariant = prod.variants?.[0];
                const price = defaultVariant?.price || prod.price || 289;
                const originalPrice = defaultVariant?.originalPrice || prod.originalPrice;

                return (
                  <div 
                    key={prod.id} 
                    className="search-product-card"
                    onClick={() => handleProductClick(prod)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleProductClick(prod);
                      }
                    }}
                    aria-label={`View ${prod.name} details`}
                  >
                    <div className="search-prod-img-wrap">
                      <img 
                        src={prod.image} 
                        alt={prod.alt || prod.name} 
                        className="search-prod-img" 
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/images/products/almonds.jpeg";
                        }}
                      />
                    </div>
                    <div className="search-prod-details">
                      <div className="search-prod-header">
                        <span className="search-prod-cat">{prod.category}</span>
                        <h4 className="search-prod-title">{prod.name}</h4>
                        <div className="search-prod-rating">
                          <Star size={12} fill="#f59e0b" color="#f59e0b" />
                          <span>{prod.rating || 4.9}</span>
                        </div>
                      </div>
                      <div className="search-prod-footer">
                        <div className="search-price-box">
                          <span className="search-prod-price">₹{price}</span>
                          {originalPrice && originalPrice > price && (
                            <span className="search-prod-orig-price">₹{originalPrice}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn-search-add"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onAddToCart) {
                              onAddToCart({
                                ...prod,
                                name: defaultVariant ? `${prod.name} (${defaultVariant.weight})` : prod.name,
                                price: price,
                                selectedWeight: defaultVariant?.weight || '250g'
                              });
                            }
                          }}
                          aria-label={`Add ${prod.name} to cart`}
                          title="Add to cart"
                        >
                          <ShoppingBag size={13} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
