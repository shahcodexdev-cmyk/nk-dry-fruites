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
    if (!formData.name.trim() || !formData.message.trim()) {
      if (onShowToast) onShowToast("Please enter your name and message.");
      return;
    }

    setIsSubmitting(true);

    const rawPhone = navigationData.contactInfo?.whatsapp 
      ? navigationData.contactInfo.whatsapp.replace(/[^0-9]/g, '') 
      : '919930605893';

    const text = 
      `*🌿 New Inquiry - NK Dry Fruits Website*\n\n` +
      `*👤 Name:* ${formData.name.trim()}\n` +
      (formData.email.trim() ? `*📧 Email:* ${formData.email.trim()}\n` : '') +
      (formData.phone.trim() ? `*📞 Phone:* ${formData.phone.trim()}\n` : '') +
      `*💬 Message:*\n${formData.message.trim()}\n\n` +
      `_Sent directly via nkdryfruits.in contact form_`;

    const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(text)}`;

    // Open WhatsApp directly
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setSubmitted(true);
    if (onShowToast) {
      onShowToast("Opening WhatsApp to send your message directly! 💬");
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });

    setIsSubmitting(false);
    setTimeout(() => setSubmitted(false), 5000);
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
              <a href="tel:+919930605893" className="compact-contact-row">
                <div className="compact-icon-wrap">
                  <Phone size={17} />
                </div>
                <div className="compact-contact-text">
                  <span className="compact-label">Call Us</span>
                  <span className="compact-value">+91 99306 05893</span>
                </div>
              </a>

              <a href="mailto:contact.nkdryfruits@gmail.com" className="compact-contact-row">
                <div className="compact-icon-wrap">
                  <Mail size={17} />
                </div>
                <div className="compact-contact-text">
                  <span className="compact-label">Email Support</span>
                  <span className="compact-value">contact.nkdryfruits@gmail.com</span>
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

            {/* Single Official Store Location with Local SEO Microdata */}
            <div className="compact-location-card" itemScope itemType="https://schema.org/Store">
              <meta itemProp="name" content="NK Dry Fruits" />
              <meta itemProp="telephone" content="+919930605893" />
              <meta itemProp="email" content="contact.nkdryfruits@gmail.com" />
              
              <div className="compact-loc-header">
                <Store size={18} className="loc-title-icon" />
                <h3 className="compact-loc-heading">Our Store & Packaging Hub (Thane West)</h3>
              </div>

              <address className="compact-loc-body" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <MapPin size={16} className="compact-map-pin" />
                <div className="compact-address-text">
                  <span itemProp="streetAddress">Shop No. 09, Ground Floor, Ibrahim Mansion, Near 1st Rabodi Naka, Rabodi</span>,{' '}
                  <span itemProp="addressLocality">Thane West</span>,{' '}
                  <span itemProp="addressRegion">Maharashtra</span>{' '}
                  <span itemProp="postalCode">400601</span>,{' '}
                  <span itemProp="addressCountry">India</span>
                </div>
              </address>

              <div className="compact-loc-meta">
                <div className="loc-meta-item">
                  <span className="loc-meta-dot"></span>
                  <span>Open Daily: 9:00 AM – 10:00 PM</span>
                </div>
                <div className="loc-delivery-pill">
                  <span>Local Delivery: Thane, Mulund & Mumbai MMR</span>
                </div>
              </div>

              <a 
                href="https://www.google.com/maps/search/?api=1&query=Shop+No+09+Ground+Floor+Ibrahim+Mansion+Near+1st+Rabodi+Naka+Rabodi+Thane+West+Maharashtra+400601" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="compact-maps-btn"
                aria-label="Get directions to NK Dry Fruits on Google Maps"
              >
                <span>Get Directions on Google Maps</span>
                <span className="maps-arrow">↗</span>
              </a>
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
                <h3 className="compact-form-title">Send Message via WhatsApp</h3>
              </div>

              {submitted && (
                <div className="compact-success-msg" role="alert">
                  <CheckCircle2 size={18} />
                  <span>Opening WhatsApp chat with your inquiry! 💬</span>
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
                    <label htmlFor="contact-email" className="compact-field-label">Email (Optional)</label>
                    <input 
                      type="email" 
                      id="contact-email"
                      name="email" 
                      placeholder="Your email"
                      value={formData.email} 
                      onChange={handleChange} 
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
                  className="compact-submit-btn contact-whatsapp-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Opening WhatsApp...</span>
                  ) : (
                    <>
                      <MessageSquare size={16} />
                      <span>Send on WhatsApp</span>
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
