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
  Zap,
  ZoomIn,
  ZoomOut,
  RotateCcw
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

  // Swipe / Drag state for Image Slider
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchCurrentX, setTouchCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Zoom Lightbox state
  const [zoomImage, setZoomImage] = useState(null);
  const [zoomScale, setZoomScale] = useState(2.2);
  const [zoomPan, setZoomPan] = useState({ x: 50, y: 50 });

  const modalOverlayRef = useRef(null);
  const modalScrollContainerRef = useRef(null);
  const zoomWrapperRef = useRef(null);

  // Reset state and scroll to top when active product changes
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setAddedSuccess(false);
      setDragOffset(0);
      setIsDragging(false);
      setZoomImage(null);
      setZoomScale(2.2);
      setZoomPan({ x: 50, y: 50 });

      if (product.variants && product.variants.length > 0) {
        setSelectedWeight(product.variants[0].weight);
      } else {
        setSelectedWeight('500g');
      }

      // Smooth scroll to top of modal
      if (modalOverlayRef.current) {
        modalOverlayRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (modalScrollContainerRef.current) {
        modalScrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Backup instant scroll reset
      setTimeout(() => {
        if (modalOverlayRef.current) {
          modalOverlayRef.current.scrollTop = 0;
        }
        if (modalScrollContainerRef.current) {
          modalScrollContainerRef.current.scrollTop = 0;
        }
      }, 30);
    }
  }, [product]);

  // Handle popstate for zoom lightbox
  useEffect(() => {
    const handlePopState = () => {
      if (zoomImage) {
        setZoomImage(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [zoomImage]);

  // Handle ESC key and Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          if (zoomImage) {
            handleCloseZoom();
          } else {
            onClose();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose, zoomImage]);

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

  const handleNavigateHome = () => {
    onClose();
    setTimeout(() => {
      const homeEl = document.getElementById('home');
      if (homeEl) {
        homeEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  const handleNavigateShop = () => {
    onClose();
    setTimeout(() => {
      const shopEl = document.getElementById('products');
      if (shopEl) {
        shopEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  // Touch Swipe Handlers (Thumb navigation)
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchCurrentX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setTouchCurrentX(currentX);
    setDragOffset(currentX - touchStartX);
  };

  const handleOpenZoom = (imgUrl, e) => {
    try {
      window.history.pushState({ modal: 'zoom' }, '');
    } catch (err) {}
    setZoomImage(imgUrl || galleryImages[selectedImageIndex] || product.image);
    setZoomScale(2.2);
    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (clientX && clientY) {
        const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
        setZoomPan({ x, y });
        return;
      }
    }
    setZoomPan({ x: 50, y: 50 });
  };

  const handleCloseZoom = () => {
    if (window.history.state?.modal === 'zoom') {
      window.history.back();
    } else {
      setZoomImage(null);
    }
  };

  const handleZoomMouseMove = (e) => {
    if (!zoomWrapperRef.current) return;
    const rect = zoomWrapperRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPan({ x, y });
  };

  const handleZoomTouchMove = (e) => {
    if (!zoomWrapperRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = zoomWrapperRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setZoomPan({ x, y });
  };

  const handleToggleZoom = (e) => {
    if (zoomScale > 1.2) {
      setZoomScale(1);
    } else {
      setZoomScale(2.2);
      if (zoomWrapperRef.current) {
        const rect = zoomWrapperRef.current.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        if (clientX && clientY) {
          const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
          const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
          setZoomPan({ x, y });
        }
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    const diff = touchCurrentX - touchStartX;
    const swipeThreshold = 35;

    if (diff < -swipeThreshold) {
      // Swiped left -> Next image
      setSelectedImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
    } else if (diff > swipeThreshold) {
      // Swiped right -> Prev image
      setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
    } else if (Math.abs(diff) < 6) {
      // Tap without dragging -> Open Zoom Modal
      handleOpenZoom(galleryImages[selectedImageIndex] || product.image, e);
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse Drag Handlers (Desktop navigation)
  const handleMouseDown = (e) => {
    setTouchStartX(e.clientX);
    setTouchCurrentX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    setTouchCurrentX(currentX);
    setDragOffset(currentX - touchStartX);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    const diff = touchCurrentX - touchStartX;
    const swipeThreshold = 35;

    if (diff < -swipeThreshold) {
      setSelectedImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
    } else if (diff > swipeThreshold) {
      setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
    } else if (Math.abs(diff) < 6) {
      // Click without dragging -> Open Zoom Modal
      handleOpenZoom(galleryImages[selectedImageIndex] || product.image, e);
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <div 
      className="pdp-modal-overlay" 
      ref={modalOverlayRef}
      onClick={onClose} 
      role="dialog" 
      aria-modal="true"
    >
      <div 
        className="pdp-modal-container" 
        onClick={(e) => e.stopPropagation()}
        ref={modalScrollContainerRef}
      >
        {/* Top Sticky Bar with Back & Close Controls */}
        <div className="pdp-modal-topbar">
          <button 
            type="button" 
            className="pdp-topbar-back-btn" 
            onClick={handleNavigateShop} 
            aria-label="Back to Shop"
          >
            <ChevronLeft size={18} className="pdp-back-icon" />
            <span>Back to Shop</span>
          </button>

          <button 
            type="button" 
            className="pdp-topbar-close-btn" 
            onClick={onClose} 
            aria-label="Close product detail page"
          >
            <X size={20} />
          </button>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="pdp-breadcrumb-row">
          <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
            <button 
              type="button" 
              onClick={handleNavigateHome} 
              className="breadcrumb-link"
              title="Go to Home"
            >
              Home
            </button>
            <span className="breadcrumb-separator">&gt;</span>
            <button 
              type="button" 
              onClick={handleNavigateShop} 
              className="breadcrumb-link"
              title="Go to Shop Products"
            >
              Shop
            </button>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">{product.name}</span>
          </nav>
        </div>

        {/* MAIN PDP PRODUCT SECTION */}
        <div className="pdp-main-section">
          {/* Left Column: Image Gallery with Interactive Slider & Zoom */}
          <div className="pdp-gallery-col">
            <div 
              className="pdp-main-image-frame"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                if (isDragging) {
                  setIsDragging(false);
                  setDragOffset(0);
                }
              }}
              title="Swipe left/right to change photo • Click to zoom"
            >
              {/* Zoom Trigger Button */}
              <button
                type="button"
                className="pdp-zoom-trigger-badge"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomImage(galleryImages[selectedImageIndex] || product.image);
                  setZoomScale(1.5);
                }}
                aria-label="Zoom image"
                title="Click to zoom image"
              >
                <ZoomIn size={15} />
                <span>Zoom</span>
              </button>

              {/* Slider Track with Smooth Transitions */}
              <div 
                className="pdp-slider-track"
                style={{
                  transform: isDragging 
                    ? `translateX(calc(-${selectedImageIndex * 100}% + ${dragOffset}px))`
                    : `translateX(-${selectedImageIndex * 100}%)`,
                  transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              >
                {galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="pdp-slider-slide">
                    <img 
                      src={imgUrl} 
                      alt={`${product.name} view ${idx + 1}`} 
                      className="pdp-main-image"
                      draggable={false}
                      onError={(e) => {
                        e.target.src = "/images/products/almonds.jpeg";
                      }}
                    />
                  </div>
                ))}
              </div>
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
          </div>

          <div className="pdp-related-grid">
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
            <button type="button" className="pdp-more-products-btn" onClick={handleNavigateShop}>
              <span>More products</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>

      {/* Interactive Zoom / Lightbox Fullscreen Modal */}
      {zoomImage && (
        <div 
          className="pdp-zoom-overlay" 
          onClick={() => setZoomImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed Product Photo"
        >
          <div className="pdp-zoom-container" onClick={(e) => e.stopPropagation()}>
            <div className="pdp-zoom-header">
              <div className="pdp-zoom-title-box">
                <span className="pdp-zoom-name">{product.name}</span>
                <span className="pdp-zoom-hint">
                  {zoomScale > 1 
                    ? "Hover / drag cursor to pan across image • Click to zoom out" 
                    : "Click or tap image to zoom in"
                  }
                </span>
              </div>
              
              <div className="pdp-zoom-controls">
                <span className="pdp-zoom-level-tag">{Math.round(zoomScale * 100)}%</span>
                
                <button
                  type="button"
                  className="pdp-zoom-ctrl-btn"
                  onClick={() => setZoomScale((s) => Math.min(s + 0.5, 3.5))}
                  aria-label="Zoom In"
                  title="Zoom In"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  type="button"
                  className="pdp-zoom-ctrl-btn"
                  onClick={() => setZoomScale((s) => Math.max(s - 0.5, 1))}
                  aria-label="Zoom Out"
                  title="Zoom Out"
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  type="button"
                  className="pdp-zoom-ctrl-btn"
                  onClick={() => {
                    setZoomScale(1);
                    setZoomPan({ x: 50, y: 50 });
                  }}
                  aria-label="Reset Zoom (1x)"
                  title="Reset (1x)"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  type="button"
                  className="pdp-zoom-close-btn"
                  onClick={handleCloseZoom}
                  aria-label="Close Zoom"
                  title="Close (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Interactive Pan Canvas */}
            <div 
              className={`pdp-zoom-image-wrapper ${zoomScale > 1 ? 'is-zoomed' : ''}`}
              ref={zoomWrapperRef}
              onMouseMove={zoomScale > 1 ? handleZoomMouseMove : undefined}
              onTouchMove={zoomScale > 1 ? handleZoomTouchMove : undefined}
              onClick={handleToggleZoom}
              title={zoomScale > 1 ? "Move around to inspect details • Click to zoom out" : "Click to zoom in"}
            >
              <img
                src={zoomImage}
                alt={`${product.name} zoomed view`}
                className="pdp-zoomed-img"
                style={{ 
                  transform: `scale(${zoomScale})`,
                  transformOrigin: `${zoomPan.x}% ${zoomPan.y}%`
                }}
                draggable={false}
              />
            </div>

            {/* Zoom Gallery Thumbnails Switcher */}
            <div className="pdp-zoom-thumbnails">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`pdp-zoom-thumb-btn ${zoomImage === imgUrl ? 'active' : ''}`}
                  onClick={() => {
                    setZoomImage(imgUrl);
                    setSelectedImageIndex(idx);
                    setZoomPan({ x: 50, y: 50 });
                  }}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img src={imgUrl} alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductModal;
