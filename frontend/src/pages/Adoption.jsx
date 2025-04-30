import React, { useState, useEffect } from "react";
import api from "../api";
import { Container, Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
import Layout from '../components/Layout';

const BASE_URL = import.meta.env.VITE_API_URL;
const THEME_COLOR = '#0fa8a8'; // Define the teal theme color

const Adoption = () => {
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        breed: "all",
        age: "all",
        size: "all",
        gender: "all"
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPet, setSelectedPet] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPets = async () => {
            setIsLoading(true);
            window.scrollTo(0, 0); // <-- Scroll to top when fetching starts
            try {
                const { data } = await api.get("/api/adoption/");
                setPets(data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.clear();
                    window.location.reload();
                }
                console.error("Error fetching pets:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPets();
    }, []);
    

    const filterPets = () => {
        return pets.filter(pet => {
            const matchesSearch = pet.pet_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (pet.pet_breed && pet.pet_breed.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesBreed = filters.breed === "all" || pet.pet_breed === filters.breed;
            const matchesAge = filters.age === "all" || categorizeAge(pet.pet_age) === filters.age;
            const matchesSize = filters.size === "all" || pet.pet_size === filters.size;
            const matchesGender = filters.gender === "all" || pet.pet_gender === filters.gender;

            return matchesSearch && matchesBreed && matchesAge && matchesSize && matchesGender;
        });
    };

    const categorizeAge = (age) => {
        if (age <= 1) return "puppy";
        if (age <= 5) return "young";
        if (age <= 10) return "adult";
        return "senior";
    };

    const handleShowDetails = (pet) => {
        setSelectedPet(pet);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPet(null);
    };

    const breeds = [...new Set(pets.map(pet => pet.pet_breed).filter(Boolean))];

    return (
        <Layout>
            <div className="min-h-screen bg-light">
                <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
                    <Container>
                        <h1 className="display-4 fw-bold white-paw-emoji">Don't Buy Just Adopt 🐾</h1>
                        <p className="lead">Find Your Perfect Companion</p>
                    </Container>
                </div>

                <Container className="py-4">
                    {/* Search and Filters */}
                    <Card className="mb-4 p-3 shadow-sm filter-card">
                        <Form>
                            <Row className="g-3 align-items-center">
                                <Col lg={3} md={12}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by name or breed..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        aria-label="Search pets"
                                        className="filter-focus"
                                    />
                                </Col>
                                <Col lg={3} md={3} sm={6}>
                                    <Form.Select
                                        value={filters.breed}
                                        onChange={(e) => setFilters({...filters, breed: e.target.value})}
                                        aria-label="Filter by breed"
                                        className="filter-focus"
                                    >
                                        <option value="all">All Breeds</option>
                                        {breeds.map(breed => (
                                            <option key={breed} value={breed}>{breed}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col lg={3} md={3} sm={6}>
                                    <Form.Select
                                        value={filters.age}
                                        onChange={(e) => setFilters({...filters, age: e.target.value})}
                                        aria-label="Filter by age"
                                        className="filter-focus"
                                    >
                                        <option value="all">All Ages</option>
                                        <option value="puppy">Puppy (0-1 yrs)</option>
                                        <option value="young">Young (2-5 yrs)</option>
                                        <option value="adult">Adult (6-10 yrs)</option>
                                        <option value="senior">Senior (10+ yrs)</option>
                                    </Form.Select>
                                </Col>
                                <Col lg={3} md={3} sm={6}>
                                    <Form.Select
                                        value={filters.gender}
                                        onChange={(e) => setFilters({...filters, gender: e.target.value})}
                                        aria-label="Filter by gender"
                                        className="filter-focus"
                                    >
                                        <option value="all">All Genders</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Form>
                    </Card>

                    {/* Pet Grid */}
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                            <Spinner animation="border" role="status" style={{ color: THEME_COLOR }}> {/* Teal spinner */}
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Row>
                            {filterPets().length > 0 ? (
                                filterPets().map((pet, index) => (
                                    <Col key={pet.id} sm={6} lg={4} xl={3} className="mb-4 d-flex align-items-stretch">
                                        <Card className="h-100 shadow-sm hover-shadow-lg transition-shadow duration-300 w-100">
                                            <Card.Img 
                                                variant="top" 
                                                src={`${BASE_URL}${pet.pet_image}`} 
                                                style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                                                alt={`Photo of ${pet.pet_name}`}
                                                onClick={() => handleShowDetails(pet)}
                                            />
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title className="h5 mb-2">Hey I am {pet.pet_name}</Card.Title>
                                                <div className="mb-3">
                                                    <span className="badge bg-info text-dark me-1">{pet.pet_breed}</span>
                                                    <span className="badge bg-secondary">{pet.pet_age} yrs</span>
                                                </div>
                                                <Card.Text className="text-muted small flex-grow-1">
                                                    {pet.description ? pet.description.substring(0, 80) + '...' : 'No description available.'} 
                                                </Card.Text>
                                                <Button 
                                                    variant="dark"
                                                    className="w-100 mt-auto btn-meet"
                                                    onClick={() => handleShowDetails(pet)}
                                                >
                                                    Meet {pet.pet_name}
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12}>
                                    <div className="text-center py-5">
                                        <p className="fs-4 mb-3">🐾</p>
                                        <h3>No pets match your filters</h3>
                                        <p className="text-muted">Try adjusting your search criteria.</p>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    )}

                </Container>

                {/* Pet Details Modal */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    {selectedPet && (
                        <>
                            <Modal.Header closeButton>
                                <Modal.Title>{selectedPet.pet_name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col md={6}>
                                        <img 
                                            src={`${BASE_URL}${selectedPet.pet_image}`} 
                                            alt={selectedPet.pet_name} 
                                            className="img-fluid rounded mb-3" 
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <h4>Details</h4>
                                        <p><strong>Breed:</strong> {selectedPet.pet_breed}</p>
                                        <p><strong>Age:</strong> {selectedPet.pet_age} years</p>
                                        <p><strong>Gender:</strong> {selectedPet.pet_gender}</p>
                                        <p><strong>Weight:</strong> {selectedPet.pet_weight}kg</p>
                                        <p><strong>Personality:</strong> {selectedPet.pet_personality}</p>
                                        <p><strong>Energy Level:</strong> {selectedPet.pet_energylevel}</p>
                                        <p><strong>Good with kids:</strong> {selectedPet.good_with_kids ? 'Yes' : 'Yes'}</p> 
                                        <p><strong>Good with other pets:</strong> {selectedPet.good_with_other_pets ? 'Yes' : 'Yes'}</p>
                                        <p><strong>Playfull:</strong> {selectedPet.needs_garden ? 'Yes' : 'Yes'}</p>

                                        <h5 className="mt-3">Description</h5>
                                        <p>{selectedPet.description || 'No description provided.'}</p>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                                <Button variant="dark btn-adopt">
                                    Adoption Process
                                </Button>
                            </Modal.Footer>
                        </>
                    )}
                </Modal>

                {/* Add custom CSS for the theme color (Teal hover) */}
                <style jsx global>{`
                    .hover-shadow-lg:hover {
                        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                    }
                    .transition-shadow {
                        transition: box-shadow 0.3s ease-in-out;
                    }
                    .btn-meet, .btn-adopt {
                        background-color: #343a40; /* Dark base */
                        border-color: #343a40;
                        color: #ffffff;
                        transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;
                    }
                    .btn-meet:hover, .btn-adopt:hover {
                        background-color: ${THEME_COLOR}; /* Teal hover background */
                        border-color: #0fa8a8; /* Slightly darker teal border */
                        color: #ffffff !important; /* White text on teal hover */
                    }
                    .filter-focus:focus {
                        border-color: #0fa8a8; /* Darker teal focus border */
                        box-shadow: 0 0 0 0.25rem rgba(17, 188, 188, 0.5); /* Teal glow */
                    }
                    .badge.bg-info { background-color: #0dcaf0 !important; }
                    .badge.bg-secondary { background-color: #6c757d !important; }
                `}</style>
            </div>
        </Layout>
    );
};

export default Adoption;
