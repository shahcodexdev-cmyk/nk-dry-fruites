import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import HeroSlider from './components/HeroSlider/HeroSlider';
import QuickFeatures from './components/QuickFeatures/QuickFeatures';
import ProductModal from './components/Product/ProductModal';
import CheckoutModal from './components/Checkout/CheckoutModal';
import ContactSection from './components/Contact/ContactSection';
import sliderData from './json-data/sliderData.json';
import navigationData from './json-data/navigationData.json';
import productsData from './json-data/productsData.json';
import { matchesSmartSearch } from './utils/searchUtils';
import { ShoppingCart, ShoppingBag, Sparkles, Heart, ArrowRight, Phone, Mail, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('nk_cart_items');
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse cart items from localStorage:", e);
    }
    return navigationData.cart?.items || [];
  });
  const [toastMessage, setToastMessage] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isInstantCart, setIsInstantCart] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(productsData.categories[0] || "All");
  const [searchFilter, setSearchFilter] = useState("");
  const [activeProductModal, setActiveProductModal] = useState(null);

  // Sync cartItems changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nk_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart items to localStorage:", e);
    }
  }, [cartItems]);

  // Open / Close PDP Modal with mobile/browser back history integration
  const handleOpenProduct = (product) => {
    try {
      window.history.pushState({ modal: 'pdp', productId: product.id }, '');
    } catch (e) {}
    setActiveProductModal(product);
  };

  const handleCloseProduct = () => {
    setActiveProductModal(null);
    if (window.history.state?.modal === 'pdp') {
      try {
        window.history.back();
      } catch (e) {}
    }
  };

  // Open / Close Cart Drawer with mobile/browser back history integration
  const handleSetCartDrawerOpen = (openVal) => {
    const nextState = typeof openVal === 'function' ? openVal(cartDrawerOpen) : openVal;
    if (nextState) {
      if (!cartDrawerOpen) {
        try {
          window.history.pushState({ modal: 'cart' }, '');
        } catch (e) {}
      }
      setCartDrawerOpen(true);
    } else {
      setCartDrawerOpen(false);
      setIsInstantCart(false);
      if (window.history.state?.modal === 'cart') {
        try {
          window.history.back();
        } catch (e) {}
      }
    }
  };

  // Open / Close Checkout Modal with mobile/browser back history integration
  const handleOpenCheckout = () => {
    try {
      window.history.pushState({ modal: 'checkout' }, '');
    } catch (e) {}
    setCheckoutOpen(true);
  };

  const handleProceedFromCartToCheckout = () => {
    try {
      window.history.pushState({ modal: 'checkout' }, '');
    } catch (e) {}
    setCartDrawerOpen(false);
    setCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
    if (window.history.state?.modal === 'checkout') {
      try {
        window.history.back();
      } catch (e) {}
    }
  };

  const handleNavigateHomeFromCheckout = () => {
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {}
    setCheckoutOpen(false);
    setCartDrawerOpen(false);
    setActiveProductModal(null);
    setIsInstantCart(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const homeEl = document.getElementById('home');
    if (homeEl) {
      homeEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCartFromCheckout = () => {
    setIsInstantCart(true);
    if (window.history.state?.modal === 'checkout') {
      try {
        window.history.back();
      } catch (e) {}
    } else {
      setCheckoutOpen(false);
      setCartDrawerOpen(true);
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Listen to popstate event (mobile device native back button / swipe back gesture)
  useEffect(() => {
    const handlePopState = (e) => {
      const modalState = e.state?.modal;

      if (!modalState) {
        // Returned to Home state
        setCheckoutOpen(false);
        setCartDrawerOpen(false);
        setActiveProductModal(null);
        setIsInstantCart(false);
        return;
      }

      if (modalState === 'cart') {
        setCheckoutOpen(false);
        setActiveProductModal(null);
        setIsInstantCart(true);
        setCartDrawerOpen(true);
        return;
      }

      if (modalState === 'checkout') {
        setCartDrawerOpen(false);
        setActiveProductModal(null);
        setCheckoutOpen(true);
        return;
      }

      if (modalState === 'pdp') {
        setCheckoutOpen(false);
        setCartDrawerOpen(false);
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleUpdateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removed from basket");
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const cartItemId = product.selectedWeight 
        ? `${product.id}-${product.selectedWeight}` 
        : product.id;
        
      const existing = prev.find(
        (item) => item.id === cartItemId || (item.productId === product.id && item.selectedWeight === product.selectedWeight)
      );

      if (existing) {
        return prev.map((item) =>
          (item.id === cartItemId || (item.productId === product.id && item.selectedWeight === product.selectedWeight))
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
            image: product.image,
            selectedWeight: product.selectedWeight
          }
        ];
      }
    });
    showToast(`Added "${product.name}" to cart! 🛒`);
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    setActiveProductModal(null);
    setTimeout(() => {
      handleOpenCheckout();
    }, 120);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Filter products by JSON category and smart multilingual search filter
  const allProducts = productsData.products;
  const filteredProducts = allProducts.filter((product) => {
    const isSearching = searchFilter.trim() !== "";
    const matchesCat = (selectedCategory === "All" || isSearching)
      ? true
      : product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = matchesSmartSearch(product, searchFilter);
    return matchesCat && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="app-root" id="home">
      {/* Toast Notification - Entire notification is clickable to open cart */}
      {toastMessage && (
        <div 
          className="toast-notification" 
          role="status"
          onClick={() => {
            handleSetCartDrawerOpen(true);
            setToastMessage(null);
          }}
          title="Click to open cart"
        >
          <Sparkles size={16} className="toast-icon" />
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        products={allProducts}
        onAddToCart={handleAddToCart}
        onOpenProduct={(prod) => handleOpenProduct(prod)}
        cartDrawerOpen={cartDrawerOpen}
        setCartDrawerOpen={handleSetCartDrawerOpen}
        onProceedToCheckout={handleProceedFromCartToCheckout}
        isInstantCart={isInstantCart}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchFilter("");
          setCurrentPage(1);
        }}
      />

      <main>
        {/* Pure Image Hero Slider Banner */}
        <HeroSlider slides={sliderData} autoPlay={true} />

        {/* Quick Features */}
        <QuickFeatures />

        {/* BEST SELLER / T SECTION (DATA-DRIVEN FROM productsData.json) */}
        <section id="products" className="bestseller-showcase-section">
          <div className="container">
            {/* Section Title from JSON */}
            <h2 className="bestseller-main-title">{productsData.sectionTitle || "t"}</h2>

            {/* Filter Tabs & Search Bar Row from JSON */}
            <div className="bestseller-toolbar">
              <div className="bestseller-tabs-group" role="tablist">
                {productsData.categories.map((cat) => (
                  <button
                    key={cat}
                    className={`bestseller-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    role="tab"
                    aria-selected={selectedCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* In-section Search Product Input */}
              <div className="bestseller-search-box">
                <input
                  type="text"
                  placeholder={productsData.searchPlaceholder || "Search product"}
                  value={searchFilter}
                  onChange={(e) => {
                    setSearchFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Search product"
                />
              </div>
            </div>

            {/* Uniform Product Grid (8 per page) */}
            <div className="bestseller-products-grid">
              {paginatedProducts.map((prod) => {
                const isInCart = cartItems.some((item) => item.id === prod.id || item.productId === prod.id);
                const defaultVariant = prod.variants?.[0];
                const price = defaultVariant?.price || prod.price || 289;
                const originalPrice = defaultVariant?.originalPrice || prod.originalPrice || Math.round(price * 1.3);
                const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

                return (
                  <div
                    key={prod.id}
                    className="bestseller-card"
                    onClick={() => handleOpenProduct(prod)}
                  >
                    <div className="card-image-wrap">
                      {discountPercent > 0 && (
                        <span className="card-discount-tag">{discountPercent}% OFF</span>
                      )}
                      <img 
                        src={prod.image} 
                        alt={prod.alt || prod.name} 
                        className="card-nut-img" 
                        loading="lazy" 
                        onError={(e) => {
                          e.target.src = "/images/products/almonds.jpeg";
                        }}
                      />
                    </div>
                    <div className="card-info-wrap">
                      <span className="card-unit-price">{prod.subtitle || prod.unitPrice || '100% Organic'}</span>
                      <h3 className="card-product-name">{prod.name}</h3>
                      <div className="card-price-row">
                        <div className="card-prices-box">
                          <span className="card-price-tag">₹{price}</span>
                          {originalPrice > price && (
                            <span className="card-orig-price-tag">₹{originalPrice}</span>
                          )}
                        </div>
                        <button
                          className={`card-cart-btn ${isInCart ? 'in-cart' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart({
                              ...prod,
                              name: defaultVariant ? `${prod.name} (${defaultVariant.weight})` : prod.name,
                              price: price,
                              selectedWeight: defaultVariant?.weight || '250g'
                            });
                          }}
                          aria-label={`Add ${prod.name} to cart`}
                          title="Add to cart"
                        >
                          <ShoppingCart size={17} strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls (Only when totalPages > 1) */}
            {totalPages > 1 && (
              <div className="bestseller-pagination" aria-label="Product Pagination">
                <button
                  className="pagination-btn prev-btn"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                  <span className="btn-text">Prev</span>
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="pagination-btn next-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  aria-label="Next page"
                >
                  <span className="btn-text">Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* About NK Dry Fruits Section */}
        <section id="about" className="story-section">
          <div className="container story-inner">
            <div className="story-text">
              <span className="section-kicker">About NK Dry Fruits</span>
              <h2 className="story-title">Purity From Earth, Directly to Your Table</h2>
              <p className="story-desc">
                At <strong>NK Dry Fruits</strong>, we partner directly with independent organic farms in California, Kashmir, and the Mediterranean. Every batch is selected by master harvesters, sun-dried naturally, and nitrogen-sealed in aroma-lock packs to preserve crunch and essential nutrients.
              </p>
              <div className="story-stats">
                <div className="stat-card">
                  <span className="stat-num">100%</span>
                  <span className="stat-label">Organic Certified</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">48 Hrs</span>
                  <span className="stat-label">Farm-to-Pack</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">50k+</span>
                  <span className="stat-label">Happy Families</span>
                </div>
              </div>
            </div>
            <div className="story-visual">
              <img
                src="/images/heart-shap-dry-fruites.jpg"
                alt="NK Dry Fruits organic dry fruits bowl"
                className="story-img"
              />
            </div>
          </div>
        </section>

        {/* Contact Us, Locations & Socials Section */}
        <ContactSection onShowToast={showToast} />
      </main>

      {/* Interactive Product Details Page Modal */}
      <ProductModal
        product={activeProductModal}
        isOpen={!!activeProductModal}
        onClose={handleCloseProduct}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        allProducts={allProducts}
        onSelectProduct={(prod) => handleOpenProduct(prod)}
      />

      {/* Shopify-Style WhatsApp Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={handleCloseCheckout}
        cartItems={cartItems}
        onClearCart={handleClearCart}
        onShowToast={showToast}
        onNavigateHome={handleNavigateHomeFromCheckout}
        onOpenCart={handleOpenCartFromCheckout}
      />

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand-col">
            <div className="footer-brand-logo">
              <img src="/images/logo.jpeg" alt="NK Dry Fruits" className="footer-brand-img" />
            </div>
            <p className="footer-tagline">
              Handpicked healthy organic dry fruits & artisanal superfoods for everyday wellness.
            </p>
            <div className="footer-contact-details">
              <div className="contact-item">
                <Phone size={16} className="contact-icon" />
                <span>+91 800 327 6539 (Toll Free)</span>
              </div>
              <div className="contact-item">
                <Mail size={16} className="contact-icon" />
                <span>support@nkdryfruits.com</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} className="contact-icon" />
                <span>Bangalore & Delhi, India</span>
              </div>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#products">Shop All Products</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact & WhatsApp</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-list">
              <li><a href="#products">Almonds & Cashews</a></li>
              <li><a href="#products">Kashmiri Walnuts</a></li>
              <li><a href="#products">Pistachios & Raisins</a></li>
              <li><a href="#products">Dates & Seeds</a></li>
            </ul>
          </div>

          <div className="footer-newsletter-col">
            <h4 className="footer-heading">Stay In The Harvest Loop</h4>
            <p className="newsletter-desc">Subscribe for organic harvest updates and healthy recipe guides.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="button">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <p>© {new Date().getFullYear()} NK Dry Fruits. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#home">Privacy Policy</a>
              <span>•</span>
              <a href="#home">Terms of Service</a>
              <span>•</span>
              <a href="#contact">WhatsApp Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;