import React, { useState, useEffect } from "react";
import api from "../api";
import { Spinner, Container, Button } from 'react-bootstrap';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// Import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const BASE_URL = import.meta.env.VITE_API_URL;
const THEME_COLOR = '#00bcd4'; // Bright Aqua
const THEME_COLOR_LIGHT = '#e0f7fa'; // Pale Aqua
const THEME_COLOR_LIGHTER = '#ffca28'; // Sunny Yellow
const BACKGROUND_COLOR = '#e0f7fa'; // Pale Aqua

// Text colors
const PRIMARY_TEXT = '#00bcd4'; // Bright Aqua
const SECONDARY_TEXT = '#008ba3'; // Darker Aqua
const LIGHT_TEXT = '#ffffff'; // White
const LINK_COLOR = '#ffca28'; // Sunny Yellow

const HeroSection = () => {
  const [heroItems, setHeroItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/api/hero/");
        if (data && data.length > 0) {
          setHeroItems(data);
        } else {
          console.warn("No hero data found from API.");
          setHeroItems([]);
        }
      } catch (error) {
        if (error.response?.status===401)
          (localStorage.clear(),
      window.location.reload)
        console.error("Error fetching hero data:", error);
        setHeroItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-light d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
        <Spinner animation="border" variant="secondary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!heroItems.length) {
    return (
      <div className="w-full d-flex align-items-center justify-content-center text-center" style={{height: '100vh', backgroundColor: '#e9ecef'}}>
        <div>
          <h2>Welcome to Paw & Homes</h2>
          <p className="text-muted">More information coming soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-section">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {heroItems.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="hero-slide-bg position-relative w-100 h-100"
              style={{
                backgroundImage: `url(${BASE_URL}${item.image})`,
                height: '100vh'
              }}
            >
              <div className="hero-slide-overlay position-absolute w-100 h-100"></div>

              <Container className="h-100 d-flex align-items-center position-relative">
                <div className="hero-content">
                  <h1 className="hero-title mb-3">
                    {item.title}
                  </h1>
                  <p className="hero-subtitle mb-4">
                    {item.subtitle}
                  </p>
                  {item.button && (
                    <Button href={item.buttonLink} className="hero-button btn btn-dark btn-hover-teal px-4 py-2 rounded-pill">
                      {item.button}
                    </Button>
                  )}
                </div>
              </Container>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-section {
          height: 100vh;
          overflow: hidden;
          position: relative;
          background-color: ${BACKGROUND_COLOR};
        }

        .swiper {
          width: 100%;
          height: 100%;
        }

        .swiper-slide {
          width: 100%;
          height: 100%;
        }

        .hero-slide-bg {
          background-size: cover !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          height: 100%;
          width: 100%;
        }

        .hero-slide-overlay {
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.5) 30%,
            rgba(0, 0, 0, 0.3) 60%,
            rgba(0, 0, 0, 0.1) 100%
          );
          top: 0;
          left: 0;
        }

        .hero-content {
          max-width: 500px;
          padding: 1.5rem;
          margin-left: 4rem;
          text-align: left;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: ${LIGHT_TEXT};
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: ${LIGHT_TEXT};
          line-height: 1.5;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
          margin-bottom: 1.5rem;
        }

        .hero-button {
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 0.6rem 1.8rem !important;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          background-color: ${PRIMARY_TEXT};
          border-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
        }

        .hero-button:hover {
          background-color: ${SECONDARY_TEXT};
          border-color: ${SECONDARY_TEXT};
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
        }

        .btn-hover-teal:hover {
          background-color: ${SECONDARY_TEXT} !important;
          border-color: ${SECONDARY_TEXT} !important;
          color: ${LIGHT_TEXT} !important;
        }

        /* Swiper custom styles */
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.7);
          opacity: 0.7;
        }

        .swiper-pagination-bullet-active {
          background: ${THEME_COLOR_LIGHTER};
          opacity: 1;
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: ${LIGHT_TEXT};
          background: rgba(0, 0, 0, 0.3);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 768px) {
          .hero-content {
            margin-left: 2rem;
            margin-right: 2rem;
            padding: 1rem;
            max-width: 100%;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }

          .hero-button {
            font-size: 0.9rem;
            padding: 0.5rem 1.3rem !important;
          }

          .swiper-button-next,
          .swiper-button-prev {
            width: 35px;
            height: 35px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;