import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Award, 
  RotateCcw, 
  Sparkles, 
  Sprout, 
  HeartHandshake, 
  Headphones, 
  Leaf, 
  CheckCircle2 
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import defaultFeatures from '../../json-data/featuresData.json';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';
import './QuickFeatures.css';

const ICON_MAP = {
  Truck,
  ShieldCheck,
  Award,
  RotateCcw,
  Sparkles,
  Sprout,
  HeartHandshake,
  Headphones,
  Leaf,
  CheckCircle2
};

const QuickFeatures = ({ items = defaultFeatures, autoPlay = true }) => {
  return (
    <section className="quick-features-section" aria-label="Brand Guarantees & Features">
      <div className="container">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1.15}
          loop={true}
          speed={600}
          autoplay={autoPlay ? {
            delay: 3200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          pagination={{
            clickable: true,
            type: 'progressbar',
            el: '.quick-features-progressbar',
          }}
          breakpoints={{
            480: {
              slidesPerView: 1.35,
              spaceBetween: 14,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
              loop: items.length > 4, // on desktop loop only if > 4
            },
          }}
          className="quick-features-swiper"
        >
          {items.map((item, index) => {
            const IconComponent = typeof item.icon === 'string' 
              ? (ICON_MAP[item.icon] || Sparkles) 
              : (item.icon || Sparkles);

            return (
              <SwiperSlide key={item.id || index} className="quick-features-slide">
                <div className="feature-box">
                  <div className="feature-icon-wrapper">
                    <IconComponent size={22} className="feature-box-icon" />
                  </div>
                  <div className="feature-text-content">
                    <h4 className="feature-title">{item.title}</h4>
                    <p className="feature-desc">{item.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Light/Theme Swiper Progress Bar */}
        <div className="quick-features-progressbar-wrap">
          <div className="quick-features-progressbar swiper-pagination-progressbar" />
        </div>
      </div>
    </section>
  );
};

export default QuickFeatures;
