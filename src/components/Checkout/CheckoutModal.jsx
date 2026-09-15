import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  ArrowLeft, 
  MessageCircle, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import navigationData from '../../json-data/navigationData.json';
import './CheckoutModal.css';

const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onClearCart, 
  onShowToast 
}) => {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    paymentMethod: 'cod', // 'cod' | 'upi'
    orderNotes: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [orderCompleted, setOrderCompleted] = useState(null); // null | { orderId, date, total, itemsCount }
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);

  if (!isOpen) return null;

  // Indian States List for dropdown
  const indianStates = [
    "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi NCR",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
    "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 50;
  const grandTotal = subtotal + deliveryFee;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Store WhatsApp Number
  const storeWhatsAppNumber = (navigationData.contactInfo?.whatsapp || "+919876543210").replace(/[^0-9]/g, '');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your full name';
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit WhatsApp number';
    }
    if (!formData.address.trim()) {
      errors.address = 'Please enter your flat / house & street address';
    }
    if (!formData.city.trim()) {
      errors.city = 'Please enter your city / town';
    }
    const cleanPincode = formData.pincode.replace(/[^0-9]/g, '');
    if (!cleanPincode || cleanPincode.length < 6) {
      errors.pincode = 'Please enter a valid 6-digit PIN code';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceWhatsAppOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      if (onShowToast) {
        onShowToast('Please fill all required shipping fields ⚠️');
      }
      return;
    }

    if (cartItems.length === 0) {
      if (onShowToast) onShowToast('Your basket is empty!');
      return;
    }

    // Generate Order Reference ID
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `NK-${randomNum}`;
    const orderDate = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Build Formatted Item List
    const itemsText = cartItems
      .map((item, idx) => {
        return `${idx + 1}. *${item.name}*\n   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}`;
      })
      .join('\n');

    // Build Complete WhatsApp Message
    const whatsappMessage = 
`🛒 *NEW ORDER - NK DRY FRUITS*
━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* #${orderId}
📅 *Date:* ${orderDate}

👤 *CUSTOMER DETAILS:*
• *Name:* ${formData.fullName.trim()}
• *Phone:* +91 ${formData.phone.trim()}
${formData.email.trim() ? `• *Email:* ${formData.email.trim()}\n` : ''}
📍 *DELIVERY ADDRESS:*
${formData.address.trim()}${formData.apartment.trim() ? `, ${formData.apartment.trim()}` : ''}
${formData.city.trim()}, ${formData.state} - ${formData.pincode.trim()}

📦 *ITEMS ORDERED (${totalItemsCount} items):*
${itemsText}

💰 *PAYMENT BREAKDOWN:*
• Items Subtotal: ₹${subtotal}
• Eco Packaging: FREE (₹0)
• Delivery Charge: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
━━━━━━━━━━━━━━━━━━━━
⭐ *TOTAL PAYABLE: ₹${grandTotal}*
💳 *Payment Mode:* ${formData.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI / Online Payment'}
${formData.orderNotes.trim() ? `\n📝 *Special Instructions:* ${formData.orderNotes.trim()}` : ''}
━━━━━━━━━━━━━━━━━━━━
🚀 _Order placed via NK Dry Fruits Online Store_
Please confirm my order and share delivery schedule. Thank you!`;

    // Encode WhatsApp URL
    const whatsappUrl = `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp in new tab/app
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Save completed order details for confirmation screen
    setOrderCompleted({
      orderId,
      date: orderDate,
      total: grandTotal,
      itemsCount: totalItemsCount,
      customerName: formData.fullName.trim(),
      phone: formData.phone.trim()
    });

    // Clear cart stored products
    if (onClearCart) {
      onClearCart();
    }

    if (onShowToast) {
      onShowToast(`Order #${orderId} submitted to WhatsApp! 🎉`);
    }
  };

  const handleFinish = () => {
    setOrderCompleted(null);
    onClose();
  };

  return (
    <div className="shopify-checkout-fullscreen" role="dialog" aria-modal="true">
      
      {/* =========================================================================
          ORDER SUCCESS CONFIRMATION SCREEN
          ========================================================================= */}
      {orderCompleted ? (
        <div className="shopify-success-fullscreen">
          <div className="shopify-success-inner">
            <div className="success-icon-badge">
              <CheckCircle2 size={56} className="success-check-icon" />
            </div>

            <span className="success-pill">Order Dispatched to WhatsApp</span>
            <h2 className="success-title">Thank You, {orderCompleted.customerName}!</h2>
            <p className="success-subtitle">
              Your order receipt has been forwarded directly to our WhatsApp care team. We will review and confirm your fresh harvest dispatch shortly.
            </p>

            <div className="success-order-card">
              <div className="success-card-header">
                <div className="success-id-group">
                  <span className="success-id-label">Order Reference</span>
                  <span className="success-id-value">#{orderCompleted.orderId}</span>
                </div>
                <div className="success-status-tag">
                  <Clock size={14} />
                  <span>Processing</span>
                </div>
              </div>

              <div className="success-card-details">
                <div className="success-detail-row">
                  <span>Order Date:</span>
                  <strong>{orderCompleted.date}</strong>
                </div>
                <div className="success-detail-row">
                  <span>Customer Phone:</span>
                  <strong>+91 {orderCompleted.phone}</strong>
                </div>
                <div className="success-detail-row">
                  <span>Total Items:</span>
                  <strong>{orderCompleted.itemsCount} Organic Packs</strong>
                </div>
                <div className="success-detail-row total-highlight">
                  <span>Total Payable:</span>
                  <strong className="success-total-price">₹{orderCompleted.total}</strong>
                </div>
              </div>

              <div className="success-whatsapp-note">
                <MessageCircle size={18} className="wa-icon" />
                <span>
                  Didn't WhatsApp open automatically? 
                  <a 
                    href={`https://wa.me/${storeWhatsAppNumber}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="wa-reopen-link"
                  >
                    Click here to message support
                  </a>
                </span>
              </div>
            </div>

            <button type="button" className="success-continue-btn" onClick={handleFinish}>
              <span>Continue Exploring Harvest</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* =========================================================================
           FULLSCREEN SHOPIFY CHECKOUT EXPERIENCE
           ========================================================================= */
        <div className="shopify-checkout-container">
          
          {/* TOP HEADER */}
          <header className="shopify-checkout-header">
            <div className="header-inner">
              <div className="header-left">
                <button type="button" className="checkout-back-btn" onClick={onClose} aria-label="Return to cart">
                  <ArrowLeft size={16} />
                  <span>Return to Cart</span>
                </button>
              </div>

              <div className="header-center">
                <img src="/images/logo.jpeg" alt="NK Dry Fruits" className="header-logo-img" />
                <span className="header-brand-title">NK Dry Fruits</span>
              </div>

              <div className="header-right">
                <div className="header-secure-pill">
                  <ShieldCheck size={15} />
                  <span>WhatsApp Verified</span>
                </div>
                <button type="button" className="checkout-close-circle" onClick={onClose} aria-label="Close checkout">
                  <X size={18} />
                </button>
              </div>
            </div>
          </header>

          {/* MOBILE COLLAPSIBLE SUMMARY ACCORDION */}
          <div className="mobile-summary-bar">
            <button 
              type="button" 
              className="mobile-summary-accordion-btn"
              onClick={() => setShowSummaryMobile((prev) => !prev)}
            >
              <div className="summary-btn-left">
                <ShoppingBag size={18} className="summary-btn-icon" />
                <span>{showSummaryMobile ? 'Hide order summary' : 'Show order summary'}</span>
                {showSummaryMobile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <div className="summary-btn-right">
                <span className="summary-btn-total">₹{grandTotal}</span>
              </div>
            </button>

            {showSummaryMobile && (
              <div className="mobile-summary-dropdown">
                <div className="summary-items-scroll">
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-item-row">
                      <div className="summary-thumb-wrapper">
                        <img src={item.image} alt={item.name} className="summary-thumb-img" />
                        <span className="summary-thumb-count">{item.quantity}</span>
                      </div>
                      <div className="summary-item-meta">
                        <h4 className="summary-item-name">{item.name}</h4>
                        <span className="summary-item-unit">₹{item.price} each</span>
                      </div>
                      <div className="summary-item-price">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-pricing-table">
                  <div className="pricing-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="pricing-row">
                    <span>Eco Packaging</span>
                    <span className="free-tag">FREE</span>
                  </div>
                  <div className="pricing-row">
                    <span>Express Delivery</span>
                    <span>{deliveryFee === 0 ? <span className="free-tag">FREE</span> : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="pricing-row total-row">
                    <span className="total-title">Total</span>
                    <span className="total-val">₹{grandTotal}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MAIN 2-COLUMN CHECKOUT LAYOUT */}
          <div className="shopify-checkout-content">
            
            {/* LEFT COLUMN: INFORMATION & SHIPPING FORM */}
            <main className="shopify-main-pane">
              <div className="main-pane-inner">
                
                {/* Breadcrumbs */}
                <nav className="shopify-stepper" aria-label="Checkout Progress">
                  <span className="step-item done">Cart</span>
                  <span className="step-separator">&gt;</span>
                  <span className="step-item active">Shipping</span>
                  <span className="step-separator">&gt;</span>
                  <span className="step-item">Payment</span>
                </nav>

                <form onSubmit={handlePlaceWhatsAppOrder} className="shopify-order-form" noValidate>
                  
                  {/* STEP 1: CONTACT INFORMATION */}
                  <section className="form-card-section">
                    <div className="card-section-header">
                      <span className="section-badge">1</span>
                      <h3 className="section-title">Contact Information</h3>
                    </div>

                    <div className="fields-grid">
                      <div className="field-box span-full">
                        <label htmlFor="fullName">Full Name <span className="req">*</span></label>
                        <input 
                          id="fullName"
                          type="text"
                          name="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={formErrors.fullName ? 'field-error' : ''}
                        />
                        {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
                      </div>

                      <div className="field-box span-full">
                        <label htmlFor="phone">WhatsApp Mobile Number <span className="req">*</span></label>
                        <div className="phone-input-group">
                          <span className="country-prefix">🇮🇳 +91</span>
                          <input 
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="10-digit WhatsApp number"
                            maxLength={10}
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={formErrors.phone ? 'field-error' : ''}
                          />
                        </div>
                        <span className="help-text">Order receipt and delivery updates will be sent directly on WhatsApp</span>
                        {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                      </div>

                      <div className="field-box span-full">
                        <label htmlFor="email">Email Address <span className="opt">(Optional for invoice)</span></label>
                        <input 
                          id="email"
                          type="email"
                          name="email"
                          placeholder="e.g. name@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </section>

                  {/* STEP 2: SHIPPING / DELIVERY ADDRESS */}
                  <section className="form-card-section">
                    <div className="card-section-header">
                      <span className="section-badge">2</span>
                      <h3 className="section-title">Delivery Address</h3>
                    </div>

                    <div className="fields-grid">
                      <div className="field-box span-full">
                        <label htmlFor="address">Flat, House No., Building & Street <span className="req">*</span></label>
                        <input 
                          id="address"
                          type="text"
                          name="address"
                          placeholder="e.g. Flat 402, Lotus Orchid, 5th Main Road"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={formErrors.address ? 'field-error' : ''}
                        />
                        {formErrors.address && <span className="error-text">{formErrors.address}</span>}
                      </div>

                      <div className="field-box span-full">
                        <label htmlFor="apartment">Apartment, Suite, Landmark <span className="opt">(Optional)</span></label>
                        <input 
                          id="apartment"
                          type="text"
                          name="apartment"
                          placeholder="e.g. Near City Mall / Opposite Metro Station"
                          value={formData.apartment}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="field-box">
                        <label htmlFor="city">City / Town <span className="req">*</span></label>
                        <input 
                          id="city"
                          type="text"
                          name="city"
                          placeholder="e.g. Bangalore"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={formErrors.city ? 'field-error' : ''}
                        />
                        {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                      </div>

                      <div className="field-box">
                        <label htmlFor="state">State</label>
                        <select 
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        >
                          {indianStates.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div className="field-box span-full">
                        <label htmlFor="pincode">Postal / PIN Code <span className="req">*</span></label>
                        <input 
                          id="pincode"
                          type="text"
                          name="pincode"
                          maxLength={6}
                          placeholder="6-digit PIN code (e.g. 560001)"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className={formErrors.pincode ? 'field-error' : ''}
                        />
                        {formErrors.pincode && <span className="error-text">{formErrors.pincode}</span>}
                      </div>
                    </div>
                  </section>

                  {/* STEP 3: PAYMENT METHOD */}
                  <section className="form-card-section">
                    <div className="card-section-header">
                      <span className="section-badge">3</span>
                      <h3 className="section-title">Payment Method</h3>
                    </div>

                    <div className="payment-radio-group">
                      <label className={`payment-card ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                        <input 
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                        />
                        <div className="payment-card-body">
                          <div className="payment-card-top">
                            <div className="payment-label-wrap">
                              <Banknote size={19} className="pay-icon" />
                              <span className="pay-title">Cash on Delivery (COD)</span>
                            </div>
                            <span className="pay-tag popular">Most Popular</span>
                          </div>
                          <p className="pay-subtitle">Pay securely via Cash or UPI at your doorstep upon delivery.</p>
                        </div>
                      </label>

                      <label className={`payment-card ${formData.paymentMethod === 'upi' ? 'active' : ''}`}>
                        <input 
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={handleInputChange}
                        />
                        <div className="payment-card-body">
                          <div className="payment-card-top">
                            <div className="payment-label-wrap">
                              <CreditCard size={19} className="pay-icon" />
                              <span className="pay-title">UPI / Direct Online Transfer</span>
                            </div>
                            <span className="pay-tag instant">Instant Dispatch</span>
                          </div>
                          <p className="pay-subtitle">Store owner will share official UPI QR / GPay link on WhatsApp.</p>
                        </div>
                      </label>
                    </div>
                  </section>

                  {/* STEP 4: ORDER INSTRUCTIONS */}
                  <section className="form-card-section">
                    <div className="field-box span-full">
                      <label htmlFor="orderNotes">Special Delivery Instructions <span className="opt">(Optional)</span></label>
                      <textarea 
                        id="orderNotes"
                        name="orderNotes"
                        rows={2}
                        placeholder="e.g. Ring bell twice, leave with security guard, gift note..."
                        value={formData.orderNotes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </section>

                  {/* SUBMIT BUTTON */}
                  <div className="checkout-action-box">
                    <button type="submit" className="whatsapp-submit-btn">
                      <MessageCircle size={22} className="submit-wa-icon" />
                      <span className="submit-main-text">Complete Order on WhatsApp</span>
                      <span className="submit-price-pill">₹{grandTotal}</span>
                    </button>
                    <p className="checkout-guarantee-note">
                      🔒 100% Verified WhatsApp Checkout • Safe & Direct Order Booking
                    </p>
                  </div>

                </form>
              </div>
            </main>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY (DESKTOP) */}
            <aside className="shopify-sidebar-pane">
              <div className="sidebar-pane-inner">
                
                <div className="summary-card-header">
                  <h3 className="sidebar-heading">Order Summary</h3>
                  <span className="sidebar-count-badge">{totalItemsCount} items</span>
                </div>

                {/* Items List */}
                <div className="sidebar-items-scroll">
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-item-row">
                      <div className="summary-thumb-wrapper">
                        <img src={item.image} alt={item.name} className="summary-thumb-img" />
                        <span className="summary-thumb-count">{item.quantity}</span>
                      </div>
                      <div className="summary-item-meta">
                        <h4 className="summary-item-name">{item.name}</h4>
                        <span className="summary-item-unit">₹{item.price} each</span>
                      </div>
                      <div className="summary-item-price">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Table */}
                <div className="sidebar-price-breakdown">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="price-row">
                    <span>Eco Packaging</span>
                    <span className="free-tag">FREE</span>
                  </div>

                  <div className="price-row">
                    <span>Express Delivery</span>
                    <span>{deliveryFee === 0 ? <span className="free-tag">FREE</span> : `₹${deliveryFee}`}</span>
                  </div>

                  <div className="price-row total-highlight">
                    <div className="total-label-group">
                      <span className="total-head">Total</span>
                      <span className="total-tax-note">Including all organic taxes</span>
                    </div>
                    <div className="total-price-group">
                      <span className="curr">INR</span>
                      <span className="grand-amount">₹{grandTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Trust & Guarantee Badges */}
                <div className="sidebar-trust-box">
                  <div className="trust-row">
                    <Truck size={17} className="trust-ic" />
                    <span>Free Express Dispatch Across India</span>
                  </div>
                  <div className="trust-row">
                    <ShieldCheck size={17} className="trust-ic" />
                    <span>100% Quality & Freshness Guarantee</span>
                  </div>
                  <div className="trust-row">
                    <Sparkles size={17} className="trust-ic" />
                    <span>Nitrogen Aroma-Lock Fresh Pouches</span>
                  </div>
                </div>

              </div>
            </aside>

          </div>

        </div>
      )}

    </div>
  );
};

export default CheckoutModal;
