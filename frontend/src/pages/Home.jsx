import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import HeroSlider from "./HeroSection";
import api from "../api";
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from '../components/Footer';

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

function Home() {
    const [adoption, setAdoption] = useState([]);
    const [products, setProducts] = useState([]);
    const [events, setEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
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
                
                // Store all events
                setEvents(eventsRes.data);
                
                // Filter to get only upcoming events
                const currentDate = new Date();
                const filtered = eventsRes.data.filter(event => {
                    // Check if event has a date field and parse it
                    if (event.date || event.event_date) {
                        const eventDate = new Date(event.date || event.event_date);
                        return eventDate >= currentDate;
                    }
                    return false; // If no date field, don't include in upcoming events
                });
                
                setUpcomingEvents(filtered);
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
            data: upcomingEvents, // Using filtered upcoming events instead of all events
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
                    <Spinner animation="border" role="status" style={{ color: THEME_COLOR, width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Container className="py-5" style={{ backgroundColor: BACKGROUND_COLOR }}>
                    {/* Featured Section */}
                    <motion.section
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-5"
                    >
                        <Row className="g-4">
                            <Col lg={6}>
                                <motion.div
                                    initial={{ x: -50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="h-100 p-4 rounded-4 shadow-sm"
                                    style={{ 
                                        borderLeft: `4px solid ${THEME_COLOR}`,
                                        backgroundColor: '#ffffff'
                                    }}
                                >
                                    <h2 className="h1 fw-bold mb-3" style={{ color: PRIMARY_TEXT }}>Welcome to Paw & Homes</h2>
                                    <p className="lead mb-4" style={{ color: SECONDARY_TEXT }}>
                                        Your trusted partner in pet care and adoption. We're dedicated to creating happy tales, one paw at a time.
                                    </p>
                                    <Button
                                        as={Link}
                                        to="/about"
                                        variant="dark"
                                        className="btn-meet px-4 py-2 rounded-pill"
                                    >
                                        Learn More About Us
                                    </Button>
                                </motion.div>
                            </Col>
                            <Col lg={6}>
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="h-100 p-4 rounded-4 shadow-sm"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${THEME_COLOR} 0%, ${THEME_COLOR_LIGHT} 100%)`,
                                        color: LIGHT_TEXT
                                    }}
                                >
                                    <h3 className="h2 mb-3">Why Choose Us?</h3>
                                    <ul className="list-unstyled">
                                        <li className="mb-2">✓ Professional Pet Care Services</li>
                                        <li className="mb-2">✓ Quality Pet Products</li>
                                        <li className="mb-2">✓ Community Events & Activities</li>
                                        <li className="mb-2">✓ Expert Adoption Support</li>
                                    </ul>
                                </motion.div>
                            </Col>
                        </Row>
                    </motion.section>

                    {/* Main Sections */}
                    {sections.map((section, idx) => (
                        // Only render section if it has data
                        section.data.length > 0 ? (
                            <motion.section
                                key={idx}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className={`mb-5 p-4 rounded-4 shadow-sm ${section.bg}`}
                                style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : THEME_COLOR_LIGHT }}
                            >
                                <div className="text-center mb-4">
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        className="display-4 mb-3 d-inline-block"
                                    >
                                        {section.icon}
                                    </motion.span>
                                    <h2 className="h1 mb-2 fw-bold" style={{ color: PRIMARY_TEXT }}>{section.title}</h2>
                                    <p className="lead" style={{ color: SECONDARY_TEXT }}>{section.subtitle}</p>
                                </div>

                                <div className="d-flex flex-row flex-nowrap overflow-auto pb-3 custom-scrollbar-bootstrap">
                                    {section.data.slice(0, 5).map((item, index) => (
                                        <motion.div
                                            key={item.id || index}
                                            className="me-3"
                                            style={{ minWidth: '18rem', maxWidth: '18rem' }}
                                            whileHover={{ y: -5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Card className="h-100 shadow-sm hover-shadow-lg transition-shadow">
                                                <Card.Img
                                                    variant="top"
                                                    src={`${BASE_URL}${item.image || item.pet_image}`}
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                    alt={item.name || item.pet_name}
                                                    className="rounded-top"
                                                />
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title className="h5 mb-2" style={{ color: PRIMARY_TEXT }}>{item.name || item.pet_name}</Card.Title>
                                                    <Card.Text className="small flex-grow-1 mb-3" style={{ color: SECONDARY_TEXT }}>
                                                        {section.title === "Featured Dogs"
                                                            ? `${item.pet_breed} | ${item.pet_age} yrs`
                                                            : section.title === "Upcoming Events" && (item.date || item.event_date)
                                                              ? `Date: ${new Date(item.date || item.event_date).toLocaleDateString()} | ${item.description?.substring(0, 60) + (item.description?.length > 60 ? '...' : '') || 'Details coming soon.'}`
                                                              : item.description?.substring(0, 80) + (item.description?.length > 80 ? '...' : '') || 'Details coming soon.'
                                                        }
                                                    </Card.Text>
                                                    <Button
                                                        as={Link}
                                                        to={section.link}
                                                        variant={section.buttonVariant || 'dark'}
                                                        className={`w-100 mt-auto ${section.buttonHoverClass || ''} rounded-pill`}
                                                    >
                                                        {section.btnText}
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        ) : section.title === "Upcoming Events" ? (
                            // Special case for no upcoming events
                            <motion.section
                                key={idx}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className={`mb-5 p-4 rounded-4 shadow-sm ${section.bg}`}
                                style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : THEME_COLOR_LIGHT }}
                            >
                                <div className="text-center mb-4">
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        className="display-4 mb-3 d-inline-block"
                                    >
                                        {section.icon}
                                    </motion.span>
                                    <h2 className="h1 mb-2 fw-bold" style={{ color: PRIMARY_TEXT }}>{section.title}</h2>
                                    <p className="lead" style={{ color: SECONDARY_TEXT }}>{section.subtitle}</p>
                                </div>
                                
                                <div className="text-center p-4">
                                    <p className="mb-3" style={{ color: SECONDARY_TEXT }}>There are no upcoming events scheduled at the moment.</p>
                                    <Button
                                        as={Link}
                                        to="/events"
                                        variant="dark"
                                        className="btn-meet px-4 py-2 rounded-pill"
                                    >
                                        View All Events
                                    </Button>
                                </div>
                            </motion.section>
                        ) : null
                    ))}

                    {/* About Section */}
                    <motion.section
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="rounded-4 p-5 text-center shadow-sm"
                        style={{ backgroundColor: '#ffffff' }}
                    >
                        <motion.span
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            className="display-3 mb-4 d-inline-block"
                        >
                            🏠
                        </motion.span>
                        <h2 className="h1 fw-bold mb-3" style={{ color: PRIMARY_TEXT }}>About Paw & Homes</h2>
                        <p className="lead mx-auto" style={{ maxWidth: '800px', color: SECONDARY_TEXT }}>
                            We are dedicated to helping abandoned and rescued dogs find loving homes.
                            Join us in making a difference in the lives of these wonderful companions.
                        </p>
                        <Button
                            as={Link}
                            to="/about"
                            variant="dark"
                            className="btn-meet mt-4 px-4 py-2 rounded-pill"
                        >
                            Learn More About Us
                        </Button>
                    </motion.section>
                </Container>
            )}
            <style jsx global>{`
                body {
                    background-color: ${BACKGROUND_COLOR};
                    color: ${PRIMARY_TEXT};
                }
                .custom-scrollbar-bootstrap {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 188, 212, 0.3) transparent;
                }
                .custom-scrollbar-bootstrap::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar-bootstrap::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-bootstrap::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 188, 212, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar-bootstrap::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(0, 188, 212, 0.3);
                }
                .btn-meet {
                    background-color: ${THEME_COLOR};
                    border: none;
                    transition: all 0.3s ease;
                    color: ${LIGHT_TEXT};
                }
                .btn-meet:hover {
                    background-color: #008ba3;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
                    color: ${LIGHT_TEXT};
                }
                a {
                    color: ${LINK_COLOR};
                    text-decoration: none;
                }
                a:hover {
                    color: ${THEME_COLOR};
                }
                .hover-shadow-lg {
                    transition: all 0.3s ease;
                }
                .hover-shadow-lg:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 188, 212, 0.15) !important;
                    transform: translateY(-5px);
                }
                .transition-shadow {
                    transition: box-shadow 0.3s ease-in-out;
                }
                .rounded-4 {
                    border-radius: 1rem !important;
                }
                @media (max-width: 768px) {
                    .display-4 {
                        font-size: 2.5rem;
                    }
                    .h1 {
                        font-size: 2rem;
                    }
                    .lead {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </Layout>
    );
}

export default Home;