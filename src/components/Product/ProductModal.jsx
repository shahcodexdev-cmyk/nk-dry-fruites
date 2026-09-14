import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Plus, 
  Minus, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Zap 
} from 'lucide-react';
import productsData from '../../json-data/productsData.json';
import './ProductModal.css';

const ProductModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onBuyNow,
  allProducts = productsData.products,
  onSelectProduct 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const relatedContainerRef = useRef(null);
  const modalScrollContainerRef = useRef(null);

  // Reset state when active product changes
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setAddedSuccess(false);

      if (product.variants && product.variants.length > 0) {
        setSelectedWeight(product.variants[0].weight);
      } else {
        setSelectedWeight('500g');
      }

      if (modalScrollContainerRef.current) {
        modalScrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [product]);

  // Handle ESC key and Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Gallery calculation
  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [
        product.image,
        "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1543208541-00429edbdeab?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
      ];

  const mainImage = galleryImages[selectedImageIndex] || product.image;

  // Weight Variants & Dynamic Pricing
  const variants = product.variants && product.variants.length > 0 
    ? product.variants 
    : [
        { weight: "250g", price: Math.round(product.price * 0.6), originalPrice: Math.round(product.price * 0.75) },
        { weight: "500g", price: product.price, originalPrice: product.originalPrice || Math.round(product.price * 1.25) },
        { weight: "1kg", price: Math.round(product.price * 1.8), originalPrice: Math.round(product.price * 2.3) }
      ];

  const currentVariant = variants.find((v) => v.weight === selectedWeight) || variants[0];
  const basePrice = currentVariant.price;
  const originalPrice = currentVariant.originalPrice;

  // Related products
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        name: `${product.name} (${selectedWeight})`,
        price: basePrice,
        quantity: quantity,
        image: mainImage,
        selectedWeight: selectedWeight
      });
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2200);
    }
  };

  const handleDirectBuyClick = () => {
    if (onBuyNow) {
      onBuyNow({
        ...product,
        name: `${product.name} (${selectedWeight})`,
        price: basePrice,
        quantity: quantity,
        image: mainImage,
        selectedWeight: selectedWeight
      });
    } else if (onAddToCart) {
      onAddToCart({
        ...product,
        name: `${product.name} (${selectedWeight})`,
        price: basePrice,
        quantity: quantity,
        image: mainImage,
        selectedWeight: selectedWeight
      });
      onClose();
    }
  };

  const handleSelectRelatedProduct = (item) => {
    if (onSelectProduct) {
      onSelectProduct(item);
    }
  };

  const scrollRelated = (direction) => {
    if (relatedContainerRef.current) {
      const scrollAmount = direction === 'next' ? 280 : -280;
      relatedContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="pdp-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="pdp-modal-container" 
        onClick={(e) => e.stopPropagation()}
        ref={modalScrollContainerRef}
      >
        {/* Top Sticky Bar with Brand Logo & Controls */}
        <div className="pdp-modal-topbar">
          <button className="pdp-topbar-back-btn" onClick={onClose} aria-label="Go back">
            <ChevronLeft size={20} />
            <span>Back to Shop</span>
          </button>
          
          {/* Brand Logo */}
          <div className="pdp-topbar-brand">
            <img 
              src="/images/logo.jpeg" 
              alt="NK Dry Fruits" 
              className="pdp-brand-logo-img" 
            />
          </div>

          <button className="pdp-topbar-close-btn" onClick={onClose} aria-label="Close product detail page">
            <X size={20} />
          </button>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="pdp-breadcrumb-row">
          <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
            <button type="button" onClick={onClose} className="breadcrumb-link">Home</button>
            <span className="breadcrumb-separator">&gt;</span>
            <button type="button" onClick={onClose} className="breadcrumb-link">Shop</button>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">{product.name}</span>
          </nav>
        </div>

        {/* MAIN PDP PRODUCT SECTION */}
        <div className="pdp-main-section">
          {/* Left Column: Image Gallery */}
          <div className="pdp-gallery-col">
            <div className="pdp-main-image-frame">
              <img 
                src={mainImage} 
                alt={product.alt || product.name} 
                className="pdp-main-image" 
              />
            </div>

            {/* Gallery Thumbnail Row */}
            <div className="pdp-thumbnails-row" role="tablist" aria-label="Product Images">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`pdp-thumbnail-box ${selectedImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                  role="tab"
                  aria-selected={selectedImageIndex === idx}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Form */}
          <div className="pdp-info-col">
            {/* Header / Title Row */}
            <div className="pdp-header-row">
              <div className="pdp-title-area">
                <h1 className="pdp-product-title">{product.name}</h1>
                <div className="pdp-meta-row">
                  <span className="pdp-product-subtitle">{product.subtitle || product.category}</span>
                </div>
              </div>
            </div>

            {/* Price Block */}
            <div className="pdp-price-block">
              <div className="pdp-price-row">
                <span className="pdp-main-price">₹{basePrice}</span>
                {originalPrice > basePrice && (
                  <span className="pdp-original-price">₹{originalPrice}</span>
                )}
                {originalPrice > basePrice && (
                  <span className="pdp-discount-badge">
                    {Math.round(((originalPrice - basePrice) / originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Amount & Method Section */}
            <div className="pdp-amount-method-section">
              {/* Package Size / Weight Variants */}
              <div className="pdp-variant-group">
                <div className="pdp-variant-label-row">
                  <span className="pdp-variant-title">Select Weight:</span>
                  <span className="pdp-selected-weight-tag">{selectedWeight}</span>
                </div>
                <div className="pdp-weight-pills">
                  {variants.map((v) => (
                    <button
                      key={v.weight}
                      type="button"
                      className={`pdp-weight-btn ${selectedWeight === v.weight ? 'active' : ''}`}
                      onClick={() => setSelectedWeight(v.weight)}
                    >
                      <span className="pdp-weight-name">{v.weight}</span>
                      <span className="pdp-weight-price">₹{v.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="pdp-quantity-row">
                <span className="pdp-qty-label">Quantity:</span>
                <div className="pdp-quantity-stepper">
                  <button 
                    type="button" 
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="pdp-qty-number">{quantity}</span>
                  <button 
                    type="button" 
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons: Add to Cart (1st) and Buy Now (2nd) */}
            <div className="pdp-cta-group">
              <button 
                type="button" 
                className={`pdp-add-to-cart-btn ${addedSuccess ? 'success' : ''}`}
                onClick={handleAddToCartClick}
              >
                {addedSuccess ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button 
                type="button" 
                className="pdp-direct-buy-btn"
                onClick={handleDirectBuyClick}
              >
                <Zap size={18} />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Clean Direct Product Description & Highlights */}
            <div className="pdp-description-block">
              <h4 className="pdp-desc-heading">Description</h4>
              <p className="pdp-desc-body">
                {product.description || "Freshly harvested premium grade dry fruit, packed in aroma-locked foil to retain peak crispness and nutrient density. Rich in natural vitamins, antioxidants, and essential healthy fats for everyday wellness."}
              </p>

              {product.highlights && product.highlights.length > 0 && (
                <div className="pdp-highlights-block">
                  <h5 className="pdp-highlights-heading">Highlights</h5>
                  <ul className="pdp-highlights-list">
                    {product.highlights.map((point, idx) => (
                      <li key={idx} className="pdp-highlight-item">
                        <Check size={14} className="pdp-highlight-check" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* YOU MIGHT ALSO LIKE SECTION */}
        <section className="pdp-related-section" aria-label="Related Products">
          <div className="pdp-related-header">
            <h2 className="pdp-related-title">You might also like</h2>
            <div className="pdp-related-arrows">
              <button 
                type="button" 
                className="pdp-arrow-btn" 
                onClick={() => scrollRelated('prev')}
                aria-label="Previous related products"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                type="button" 
                className="pdp-arrow-btn" 
                onClick={() => scrollRelated('next')}
                aria-label="Next related products"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="pdp-related-grid" ref={relatedContainerRef}>
            {relatedProducts.map((item) => {
              const itemPrice = item.variants?.[0]?.price || item.price;
              const itemOrigPrice = item.variants?.[0]?.originalPrice || item.originalPrice;
              return (
                <div 
                  key={item.id} 
                  className="pdp-related-card"
                  onClick={() => handleSelectRelatedProduct(item)}
                >
                  <div className="pdp-related-img-box">
                    <img src={item.image} alt={item.alt || item.name} loading="lazy" />
                  </div>
                  <div className="pdp-related-info">
                    <h3 className="pdp-related-name">{item.name}</h3>
                    <div className="pdp-related-price-row">
                      {itemOrigPrice && (
                        <span className="pdp-related-orig-price">₹{itemOrigPrice}</span>
                      )}
                      <span className="pdp-related-curr-price">₹{itemPrice}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pdp-more-products-center">
            <button type="button" className="pdp-more-products-btn" onClick={onClose}>
              <span>More products</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductModal;
