import React, { useState, useEffect } from "react";
import api from "../api";
import { Container, Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from "../components/Layout";

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

const Product = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: "all",
        priceRange: "all"
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on page load
    
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get("/api/product/");
                setProducts(data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.clear();
                    window.location.reload();
                }
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        const fetchCategory = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get("/api/product/category/");
                setCategory(data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.clear();
                    window.location.reload();
                }
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchCategory();
        fetchProducts();
    }, []);
    

    const filterProducts = () => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = filters.category === "all" || product.category.name === filters.category;
            
            // Price range filter
            let matchesPrice = true;
            if (filters.priceRange !== "all") {
                const price = parseFloat(product.price);
                switch (filters.priceRange) {
                    case "under25":
                        matchesPrice = price < 500;
                        break;
                    case "25to50":
                        matchesPrice = price >= 500 && price <= 1000;
                        break;
                    case "50to100":
                        matchesPrice = price > 1000 && price <= 1500;
                        break;
                    case "over100":
                        matchesPrice = price > 1500;
                        break;
                }
            }

            return matchesSearch && matchesCategory && matchesPrice;
        });
    };

    const handleShowDetails = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleAddToCart = () => {
        // Implement cart functionality here
        alert(`Added ${quantity} ${selectedProduct.name} to cart!`);
        handleCloseModal();
    };

    const categories = [...new Set(products.map(product => product.category.id).filter(Boolean))];

    return (
        <Layout >
        <div className="min-h-screen bg-light">
            
            
            {/* Hero Section */}
            <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
                <Container>
                    <h1 className="display-4 fw-bold white-paw-emoji">Pet Products & Supplies 🐾</h1>
                    <p className="lead">Everything your furry friend needs - from food to toys to accessories</p>
                </Container>
            </div>

            <Container className="py-4">
                {/* Search and Filters */}
                <Card className="mb-4 p-3 shadow-sm filter-card">
                    <Form>
                        <Row className="g-3 align-items-center">
                            <Col lg={5} md={12}>
                                <Form.Control
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search products"
                                    className="filter-focus"
                                />
                            </Col>
                            <Col lg={3} md={6} sm={6}>
                                <Form.Select
                                    value={filters.category}
                                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                                    aria-label="Filter by category"
                                    className="filter-focus"
                                >
                                    <option value="all">All Categories</option>
                                    {category.map(category => (
                                        <option key={category.id} value={category.name}>{category.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col lg={4} md={6} sm={6}>
                                <Form.Select
                                    value={filters.priceRange}
                                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                                    aria-label="Filter by price"
                                    className="filter-focus"
                                >
                                    <option value="all">All Prices</option>
                                    <option value="under25">Under ₹500</option>
                                    <option value="25to50">₹500 - ₹1000</option>
                                    <option value="50to100">₹1000 - ₹1500</option>
                                    <option value="over100">Over ₹1500</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                        <Spinner animation="border" role="status" style={{ color: THEME_COLOR }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <>
                    {filterProducts().length > 0 ? (
                        <Row>
                            {filterProducts().map((product) => (
                                <Col key={product.id} sm={6} lg={4} xl={3} className="mb-4 d-flex align-items-stretch">
                                    <Card className="h-100 shadow-sm hover-shadow-lg transition-shadow duration-300 w-100 product-card">
                                        <div className="product-image-container">
                                            <Card.Img 
                                                variant="top" 
                                                src={`${BASE_URL}${product.image}`} 
                                                className="product-image"
                                                alt={product.name}
                                                onClick={() => handleShowDetails(product)}
                                            />
                                        </div>
                                        <Card.Body className="d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <Card.Title className="h5 mb-0">{product.name}</Card.Title>
                                                <span className="product-price">₹{parseFloat(product.price).toFixed(2)}</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="badge bg-info text-dark">{product.category.name}</span>
                                            </div>
                                            <Card.Text className="text-muted small flex-grow-1">
                                                {product.description ? product.description.substring(0, 80) + '...' : 'No description available.'} 
                                            </Card.Text>
                                            <Button 
                                                as={Link} 
                                                to={`/product/${product.id}`} 
                                                variant="dark" 
                                                className="w-100 btn-hover-teal"
                                            >
                                                View Details
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-5">
                            <p className="fs-4 mb-3">🐾</p>
                            <h3>No products match your filters</h3>
                            <p className="text-muted">Try adjusting your search criteria.</p>
                        </div>
                    )}
                    </>
                )}
            </Container>

            {/* Product Detail Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                {selectedProduct && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedProduct.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <img 
                                        src={`${BASE_URL}${selectedProduct.image}`} 
                                        alt={selectedProduct.name} 
                                        className="img-fluid rounded mb-3"
                                    />
                                </Col>
                                <Col md={6}>
                                    <h4 className="mb-3">₹{parseFloat(selectedProduct.price).toFixed(2)}</h4>
                                    <p className="mb-3">{selectedProduct.description}</p>
                                    <div className="mb-3">
                                        <span className="badge bg-info text-dark me-2">{selectedProduct.category.id}</span>
                                    </div>
                                    
                                    <div className="d-flex align-items-center mb-3">
                                        <label htmlFor="quantity" className="me-3">Quantity:</label>
                                        <Form.Control
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                            style={{ width: '80px' }}
                                        />
                                    </div>
                                    <Button 
                                        variant="dark" 
                                        className="w-100 mt-3 btn-hover-teal"
                                        onClick={handleAddToCart}
                                    >
                                        Add to Cart
                                    </Button>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </>
                )}
            </Modal>

            <style jsx global>{`
                .hover-shadow-lg:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 188, 212, 0.15) !important;
                    transform: translateY(-5px);
                }

                .transition-shadow {
                    transition: box-shadow 0.3s ease-in-out;
                }

                .btn-meet, .btn-add-to-cart {
                    background-color: ${PRIMARY_TEXT};
                    border-color: ${PRIMARY_TEXT};
                    color: ${LIGHT_TEXT};
                    transition: all 0.3s ease;
                }

                .btn-meet:hover, .btn-add-to-cart:hover {
                    background-color: ${SECONDARY_TEXT};
                    border-color: ${SECONDARY_TEXT};
                    color: ${LIGHT_TEXT} !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
                }

                .filter-focus:focus {
                    border-color: ${PRIMARY_TEXT};
                    box-shadow: 0 0 0 0.25rem rgba(0, 188, 212, 0.25);
                }

                .badge.bg-info { 
                    background-color: ${PRIMARY_TEXT} !important;
                    color: ${LIGHT_TEXT};
                }

                .badge.bg-secondary { 
                    background-color: ${THEME_COLOR_LIGHTER} !important;
                    color: ${LIGHT_TEXT};
                }

                .product-card {
                    border: 1px solid ${THEME_COLOR_LIGHT};
                    transition: all 0.3s ease;
                }

                .product-card:hover {
                    border-color: ${PRIMARY_TEXT};
                    box-shadow: 0 0.5rem 1rem rgba(0, 188, 212, 0.15);
                }

                .product-name {
                    color: ${PRIMARY_TEXT};
                    font-weight: 600;
                }

                .product-category {
                    color: ${SECONDARY_TEXT};
                }

                .product-price {
                    color: ${THEME_COLOR_LIGHTER};
                    font-weight: 600;
                }

                .product-description {
                    color: ${PRIMARY_TEXT};
                }

                .modal-header {
                    background-color: ${THEME_COLOR_LIGHT};
                    color: ${PRIMARY_TEXT};
                }

                .modal-title {
                    color: ${PRIMARY_TEXT};
                    font-weight: 600;
                }

                .modal-body {
                    background-color: ${LIGHT_TEXT};
                }

                .product-detail-label {
                    color: ${PRIMARY_TEXT};
                    font-weight: 500;
                }

                .product-detail-value {
                    color: ${SECONDARY_TEXT};
                }

                .add-to-cart-btn {
                    background-color: ${PRIMARY_TEXT};
                    border-color: ${PRIMARY_TEXT};
                    color: ${LIGHT_TEXT};
                    transition: all 0.3s ease;
                }

                .add-to-cart-btn:hover {
                    background-color: ${SECONDARY_TEXT};
                    border-color: ${SECONDARY_TEXT};
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
                }

                .filter-card {
                    background-color: ${LIGHT_TEXT};
                    border: 1px solid ${THEME_COLOR_LIGHT};
                }

                .filter-title {
                    color: ${PRIMARY_TEXT};
                    font-weight: 600;
                }

                .filter-label {
                    color: ${SECONDARY_TEXT};
                }

                .form-check-input:checked {
                    background-color: ${PRIMARY_TEXT};
                    border-color: ${PRIMARY_TEXT};
                }

                .form-check-input:focus {
                    border-color: ${PRIMARY_TEXT};
                    box-shadow: 0 0 0 0.25rem rgba(0, 188, 212, 0.25);
                }

                .no-products-message {
                    color: ${PRIMARY_TEXT};
                    text-align: center;
                    padding: 2rem;
                }

                .loading-spinner {
                    color: ${PRIMARY_TEXT};
                }

                .error-message {
                    color: ${PRIMARY_TEXT};
                    text-align: center;
                    padding: 2rem;
                }

                .product-image-container {
                    position: relative;
                    overflow: hidden;
                    border-radius: 8px 8px 0 0;
                }

                .product-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .product-card:hover .product-image {
                    transform: scale(1.05);
                }

                .product-meta {
                    padding: 1rem;
                }

                .product-category-badge {
                    background-color: ${THEME_COLOR_LIGHT};
                    color: ${PRIMARY_TEXT};
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                    display: inline-block;
                }

                .product-stock {
                    color: ${SECONDARY_TEXT};
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }

                .product-actions {
                    padding: 1rem;
                    border-top: 1px solid ${THEME_COLOR_LIGHT};
                }

                .quantity-control {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .quantity-btn {
                    background-color: ${THEME_COLOR_LIGHT};
                    color: ${PRIMARY_TEXT};
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .quantity-btn:hover {
                    background-color: ${PRIMARY_TEXT};
                    color: ${LIGHT_TEXT};
                }

                .quantity-input {
                    width: 50px;
                    text-align: center;
                    border: 1px solid ${THEME_COLOR_LIGHT};
                    border-radius: 4px;
                    padding: 0.25rem;
                }
            `}</style>
        </div>
        </Layout>
    );
};

export default Product;
