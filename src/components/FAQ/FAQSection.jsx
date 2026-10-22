import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MapPin, Truck, ShieldCheck, Gift, Phone } from 'lucide-react';
import './FAQSection.css';

const faqsData = [
  {
    id: 'faq-store-location',
    icon: MapPin,
    question: "Where is NK Dry Fruits store located in Thane?",
    answer: "Our flagship retail store and packaging hub is conveniently located at Shop No. 09, Ground Floor, Ibrahim Mansion, Near 1st Rabodi Naka, Rabodi, Thane West, Maharashtra 400601. We welcome walk-in shoppers and provide same-day direct store pickup as well as fast home delivery across Thane and Mumbai."
  },
  {
    id: 'faq-delivery-thane',
    icon: Truck,
    question: "Do you deliver dry fruits across Thane, Mumbai, and India?",
    answer: "Yes! We provide same-day and next-day express delivery across Thane West, Thane East, Ghodbunder Road, Majiwada, Naupada, Mulund, and the wider Mumbai Metropolitan Region (MMR). We also ship express pan-India, with Free Shipping on all orders above ₹499."
  },
  {
    id: 'faq-freshness-quality',
    icon: ShieldCheck,
    question: "How do you guarantee the freshness and organic quality of your dry fruits?",
    answer: "We source 100% directly from certified orchards in California (almonds), Kashmir (walnuts), and Medina (dates). Each batch is hand-sorted to discard damaged kernels and packed in nitrogen aroma-lock foil pouches that seal in crispness, natural oils, and essential nutrients with zero preservatives or artificial polish."
  },
  {
    id: 'faq-dates-khajoor',
    icon: Sparkles,
    question: "What varieties of exotic dates (Khajoor) and superfood seeds do you offer?",
    answer: "Our date collection includes authentic Royal Medina Ajwa, soft Kalmi (Safawi), Medjool, Mabrum, Kimia, and Maryam dates. In superfoods, we carry premium raw chia seeds, roasted flax seeds, pumpkin seeds, watermelon seeds, and organic sunflower seeds."
  },
  {
    id: 'faq-corporate-wedding-gifting',
    icon: Gift,
    question: "Can I order customized dry fruit gift hampers for weddings or corporate events in Thane?",
    answer: "Yes! We specialize in artisanal luxury dry fruit gift boxes, festive hampers (Diwali, Eid, New Year), and wedding favor boxes with custom branding and wholesale pricing. Contact our Thane desk on WhatsApp at +91 99306 05893 to get custom catalog samples."
  },
  {
    id: 'faq-whatsapp-ordering',
    icon: Phone,
    question: "How can I place an order online or via WhatsApp?",
    answer: "Simply browse our collection on this website, add items to your cart, and click Checkout. You can complete your order instantly via our WhatsApp Quick Checkout or choose standard checkout with Cash on Delivery (COD) and instant UPI."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(prev => prev === index ? -1 : index);
  };

  return (
    <section id="faq" className="faq-section" aria-label="Frequently Asked Questions about Dry Fruits in Thane">
      <div className="container">
        {/* Section Header */}
        <div className="faq-header">
          <span className="faq-kicker">
            <Sparkles size={13} className="kicker-sparkle" />
            Got Questions? We Have Answers
          </span>
          <h2 className="faq-main-title">
            Frequently Asked Questions • Dry Fruits in Thane
          </h2>
          <p className="faq-subtitle">
            Everything you need to know about our organic harvest, Thane store pickup, express Mumbai delivery, and premium aroma-lock packaging.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="faq-accordion-wrap">
          {faqsData.map((faq, index) => {
            const isOpen = openIndex === index;
            const IconComponent = faq.icon;

            return (
              <div 
                key={faq.id}
                className={`faq-item-card ${isOpen ? 'active' : ''}`}
                itemScope 
                itemProp="mainEntity" 
                itemType="https://schema.org/Question"
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-btn-${faq.id}`}
                >
                  <div className="faq-q-left">
                    <span className="faq-icon-bubble">
                      <IconComponent size={17} />
                    </span>
                    <span className="faq-question-text" itemProp="name">
                      {faq.question}
                    </span>
                  </div>
                  <span className={`faq-arrow-icon ${isOpen ? 'rotated' : ''}`}>
                    <ChevronDown size={18} />
                  </span>
                </button>

                <div
                  id={`faq-answer-${faq.id}`}
                  className="faq-answer-collapse"
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  hidden={!isOpen}
                  itemScope 
                  itemProp="acceptedAnswer" 
                  itemType="https://schema.org/Answer"
                >
                  <div className="faq-answer-inner" itemProp="text">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
