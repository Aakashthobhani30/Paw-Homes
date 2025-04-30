import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import HeroSlider from "./HeroSection";
import api from "../api";
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from '../components/Footer';

const BASE_URL = import.meta.env.VITE_API_URL;
const THEME_COLOR = '#0fa8a8';
const THEME_COLOR_LIGHT = '#0d9a9a';
const THEME_COLOR_LIGHTER = '#f0fafa';

function Home() {
    const [adoption, setAdoption] = useState([]);
    const [products, setProducts] = useState([]);
    const [events, setEvents] = useState([]);
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [adoptionRes, productsRes, eventsRes, servicesRes] = await Promise.all([
                    api.get("/api/adoption/"),
                    api.get("/api/product/"),
                    api.get("/api/events/"),
                    api.get("/api/services/")
                ]);
                setAdoption(adoptionRes.data);
                setProducts(productsRes.data);
                setEvents(eventsRes.data);
                setServices(servicesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                if (error.response?.status===401)
                    (localStorage.clear(),
                window.location.reload)
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const sections = [
        {
            title: "Featured Dogs",
            subtitle: "Find Your Perfect Companion",
            data: adoption,
            bg: "bg-light",
            btnText: "Adopt Now",
            icon: "🐾",
            buttonVariant: "dark",
            buttonHoverClass: "btn-meet",
            link: "/adoption"
        },
        {
            title: "Our Products",
            subtitle: "Quality Pet Essentials",
            data: products,
            bg: "bg-white",
            btnText: "Shop Now",
            icon: "🛍️",
            buttonVariant: "dark",
            buttonHoverClass: "btn-meet",
            link: "/product"
        },
        {
            title: "Upcoming Events",
            subtitle: "Join Our Pet Community",
            data: events,
            bg: "bg-light",
            btnText: "Learn More",
            icon: "📅",
            buttonVariant: "dark",
            buttonHoverClass: "btn-meet",
            link: "/events"
        },
        {
            title: "Our Services",
            subtitle: "Professional Pet Care",
            data: services,
            bg: "bg-white",
            btnText: "Book Now",
            icon: "✨",
            buttonVariant: "dark",
            buttonHoverClass: "btn-meet",
            link: "/services"
        }
    ];

    return (
        <Layout>
            <HeroSlider />
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <Spinner animation="border" role="status" style={{ color: '#b3b300', width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Container className="py-5">
                    {sections.map((section, idx) => (
                        <motion.section
                            key={idx}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`mb-5 p-4 rounded shadow-sm ${section.bg}`}
                        >
                            <div className="text-center mb-4">
                                <motion.span
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    className="display-4 mb-3 d-inline-block"
                                >
                                    {section.icon}
                                </motion.span>
                                <h2 className="h1 mb-2 fw-bold">{section.title}</h2>
                                <p className="lead text-muted">{section.subtitle}</p>
                            </div>

                            <div className="d-flex flex-row flex-nowrap overflow-auto pb-3 custom-scrollbar-bootstrap">
                        {section.data.slice(0, 5).map((item, index) => (
                                    <div key={item.id || index} className="me-3" style={{ minWidth: '18rem', maxWidth: '18rem' }}>
                                        <Card className="h-100 shadow-sm hover-shadow-lg transition-shadow duration-300 w-100">
                                            <Card.Img
                                                variant="top"
                                                src={`${BASE_URL}${item.image || item.pet_image}`}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                                alt={item.name || item.pet_name}
                                            />
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title className="h5 mb-2">{item.name || item.pet_name}</Card.Title>
                                                <Card.Text className="text-muted small flex-grow-1 mb-3">
                                                    {section.title === "Featured Dogs"
                                                        ? `${item.pet_breed} | ${item.pet_age} yrs`
                                                        : item.description?.substring(0, 80) + (item.description?.length > 80 ? '...' : '') || 'Details coming soon.'
                                                    }
                                                </Card.Text>
                                                <Button
                                                    as={Link}
                                                    to={section.link}
                                                    variant={section.buttonVariant || 'dark'}
                                                    className={`w-100 mt-auto ${section.buttonHoverClass || ''}`}
                                                >
                                                    {section.btnText}
                                                </Button>
                                            </Card.Body>
                                        </Card>
                            </div>
                        ))}
                    </div>
                        </motion.section>
                    ))}

                    <motion.section
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded p-5 text-center shadow-sm"
                    >
                        <motion.span
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            className="display-3 mb-4 d-inline-block"
                        >
                            🏠
                        </motion.span>
                        <h2 className="h1 fw-bold mb-3">About Paw & Homes</h2>
                        <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
                            We are dedicated to helping abandoned and rescued dogs find loving homes.
                            Join us in making a difference in the lives of these wonderful companions.
                        </p>
                        <Button
                            as={Link}
                            to="/about"
                            variant="dark"
                            className="btn-meet mt-4 px-4 py-2"
                        >
                            Learn More About Us
                        </Button>
                    </motion.section>
                </Container>
            )}
            <style jsx global>{`
                .custom-scrollbar-bootstrap {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0,0,0,0.3) transparent;
                }
                .custom-scrollbar-bootstrap::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar-bootstrap::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-bootstrap::-webkit-scrollbar-thumb {
                    background-color: rgba(0,0,0,0.2);
                    border-radius: 4px;
                }
                 .custom-scrollbar-bootstrap::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(0,0,0,0.3);
                }
                 .btn-meet:hover {
                    background-color: ${THEME_COLOR};
                    border-color: #0fa8a8;
                    color: #000000 !important;
                 }
                 .hover-shadow-lg:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                 }
                 .transition-shadow {
                    transition: box-shadow 0.3s ease-in-out;
                 }
                 /* NEW Button Hover Style */
                 .btn-hover-teal {
                    /* Keep dark base style if using variant="dark" */
                    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;
                 }
                 .btn-hover-teal:hover {
                    background-color: #0fa8a8; /* Dark teal background on hover */
                    border-color: #0d9a9a; /* Slightly darker border */
                    color: #ffffff !important; /* White text on hover */
                 }
            `}</style>
        </Layout>
    );
}

export default Home;
