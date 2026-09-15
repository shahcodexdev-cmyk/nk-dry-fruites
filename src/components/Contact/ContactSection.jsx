import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles,
  Store
} from 'lucide-react';
import navigationData from '../../json-data/navigationData.json';
import './ContactSection.css';

// Clean SVG Brand Icons (Instagram & Facebook Only)
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const ContactSection = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      if (onShowToast) onShowToast("Please fill in name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onShowToast) {
        onShowToast("Thank you! Your message has been sent successfully. 🌿");
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 4000);
    }, 700);
  };

  return (
    <section id="contact" className="contact-showcase-section" aria-label="Contact Us & Store Location">
      <div className="container">
        {/* Compact Header */}
        <div className="contact-header-compact">
          <span className="contact-kicker">
            <Sparkles size={13} className="kicker-icon" />
            Get In Touch
          </span>
          <h2 className="contact-main-title">Contact & Store Location</h2>
        </div>

        <div className="contact-layout-grid">
          {/* LEFT: Compact Contacts, Single Store Location & Socials */}
          <div className="contact-info-panel">
            {/* Quick Contacts Box (Short & Sleek) */}
            <div className="compact-contact-box">
              <a href="tel:+918003276539" className="compact-contact-row">
                <div className="compact-icon-wrap">
                  <Phone size={17} />
                </div>
                <div className="compact-contact-text">
                  <span className="compact-label">Call Us (Toll Free)</span>
                  <span className="compact-value">+91 800 327 6539</span>
                </div>
              </a>

              <a href="mailto:support@nkdryfruits.com" className="compact-contact-row">
                <div className="compact-icon-wrap">
                  <Mail size={17} />
                </div>
                <div className="compact-contact-text">
                  <span className="compact-label">Email Support</span>
                  <span className="compact-value">support@nkdryfruits.com</span>
                </div>
              </a>

              <a 
                href={navigationData.contactInfo.whatsappLink || `https://wa.me/${navigationData.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="compact-contact-row"
              >
                <div className="compact-icon-wrap whatsapp-wrap">
                  <MessageSquare size={17} />
                </div>
                <div className="compact-contact-text">
                  <span className="compact-label">WhatsApp Chat</span>
                  <span className="compact-value">{navigationData.contactInfo.whatsapp}</span>
                </div>
              </a>
            </div>

            {/* Single Official Store Location */}
            <div className="compact-location-card">
              <div className="compact-loc-header">
                <Store size={18} className="loc-title-icon" />
                <h3 className="compact-loc-heading">Our Store & Packaging Hub</h3>
              </div>
              <div className="compact-loc-body">
                <MapPin size={16} className="compact-map-pin" />
                <p className="compact-address-text">
                  NK Dry Fruits, Sector 18, Udyog Vihar, Gurugram, Delhi NCR – 122008, India
                </p>
              </div>
            </div>

            {/* Socials: Instagram & Facebook Only */}
            <div className="compact-socials-row">
              <span className="compact-social-label">Follow Us:</span>
              <div className="compact-social-btns">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-pill-btn instagram"
                  aria-label="Follow us on Instagram"
                >
                  <InstagramIcon />
                  <span>Instagram</span>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-pill-btn facebook"
                  aria-label="Follow us on Facebook"
                >
                  <FacebookIcon />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Short & Compact Contact Form */}
          <div className="contact-form-panel">
            <div className="compact-form-card">
              <div className="compact-form-header">
                <h3 className="compact-form-title">Send a Quick Message</h3>
              </div>

              {submitted && (
                <div className="compact-success-msg" role="alert">
                  <CheckCircle2 size={18} />
                  <span>Message sent successfully! We'll reply soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="compact-form">
                <div className="form-two-col">
                  <div className="form-group-compact">
                    <label htmlFor="contact-name" className="compact-field-label">Name *</label>
                    <input 
                      type="text" 
                      id="contact-name"
                      name="name" 
                      placeholder="Your name"
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      className="compact-input"
                    />
                  </div>

                  <div className="form-group-compact">
                    <label htmlFor="contact-email" className="compact-field-label">Email *</label>
                    <input 
                      type="email" 
                      id="contact-email"
                      name="email" 
                      placeholder="Your email"
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className="compact-input"
                    />
                  </div>
                </div>

                <div className="form-group-compact">
                  <label htmlFor="contact-phone" className="compact-field-label">Phone (Optional)</label>
                  <input 
                    type="tel" 
                    id="contact-phone"
                    name="phone" 
                    placeholder="+91 98765 43210"
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="compact-input"
                  />
                </div>

                <div className="form-group-compact">
                  <label htmlFor="contact-message" className="compact-field-label">Message *</label>
                  <textarea 
                    id="contact-message"
                    name="message" 
                    rows={3} 
                    placeholder="How can we help you?"
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    className="compact-textarea"
                  />
                </div>

                <button 
                  type="submit" 
                  className="compact-submit-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
