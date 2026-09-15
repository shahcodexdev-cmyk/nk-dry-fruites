import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import './CartDrawer.css';

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onProceedToCheckout 
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <ShoppingBag className="cart-drawer-icon" size={22} />
            <h3 className="cart-drawer-title">Your Organic Basket</h3>
            <span className="cart-drawer-count">{totalItemsCount} items</span>
          </div>
          <button className="cart-drawer-close" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="cart-free-shipping">
          <p className="free-shipping-text">
            {subtotal >= 499 ? (
              <span className="shipping-unlocked">🎉 You unlocked <strong>FREE Express Delivery</strong>!</span>
            ) : (
              <span>Add <strong>₹{499 - subtotal}</strong> more for <strong>FREE Delivery</strong></span>
            )}
          </p>
          <div className="shipping-bar-track">
            <div 
              className="shipping-bar-fill" 
              style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Items List */}
        <div className="cart-drawer-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={48} className="cart-empty-icon" />
              <p className="cart-empty-text">Your basket is empty</p>
              <span className="cart-empty-sub">Explore our handpicked organic harvest</span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">₹{item.price}</span>
                    <span className="cart-item-total">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-qty-control">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)} 
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)} 
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      className="cart-item-remove" 
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">₹{subtotal}</span>
            </div>
            <div className="cart-summary-row discount-row">
              <span className="summary-label">Eco Packaging</span>
              <span className="summary-value free-tag">FREE</span>
            </div>
            <div className="cart-summary-row total-row">
              <span className="total-label">Total Amount</span>
              <span className="total-value">₹{subtotal}</span>
            </div>
            <button 
              className="cart-checkout-btn"
              onClick={() => {
                onClose();
                if (onProceedToCheckout) {
                  onProceedToCheckout();
                }
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
