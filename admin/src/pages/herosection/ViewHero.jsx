import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";

const BASE_URL = import.meta.env.VITE_API_URL;

const HeroDetails = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHeroDetails = async () => {
      try {
        console.log("Fetching Hero ID:", id);
        // Add detailed logging
        console.log("API URL:", `${BASE_URL}/api/hero/${id}/`);
        
        const response = await api.get(`/api/hero/${id}/`);
        console.log("Full API Response:", response);
        console.log("Hero Data:", response.data);
        
        if (response.data) {
          setHero(response.data);
          console.log(response.data)
        } else {
          setError("No data received from API");
        }
      } catch (err) {
        console.error("Error fetching hero:", err);
        console.error("Error details:", err.response ? err.response.data : "No response data");
        setError(`Failed to fetch hero details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHeroDetails();
    } else {
      setError("No hero ID provided");
      setLoading(false);
    }
  }, [id]);

  // Handle return to list
  const handleReturnToList = () => {
    navigate("/hero");
  };

  if (isUserLoading) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-warning">Loading User Data...</h4>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-warning">Loading Hero...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-danger">⚠️ Error: {error}</h4>
        <button 
          className="btn btn-outline-primary mt-2"
          onClick={handleReturnToList}
        >
          Return to Hero List
        </button>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-danger">⚠️ No Hero Found</h4>
        <button 
          className="btn btn-outline-primary mt-2"
          onClick={handleReturnToList}
        >
          Return to Hero List
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} />
      <div className="main-content flex-grow-1 ms-2" style={{ marginLeft: "280px", padding: "20px" }}>
        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="display-5 fw-bold">{hero.title || "No Title"}</h2>
              <p className="text-muted">
                {hero.created_at 
                  ? `Created on ${new Date(hero.created_at).toLocaleDateString("en-GB")}`
                  : "Creation date not available"}
              </p>
              <p className="badge bg-secondary mb-3">ID: {hero.id}</p>
              {hero.subtitle && <p className="lead">{hero.subtitle}</p>}
              <p>
                Status: 
                <span className={`badge ms-2 ${hero.status ? "bg-success" : "bg-danger"}`}>
                  {hero.status ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
            <div>
              <button
                className="btn btn-warning me-2"
                onClick={() => navigate(`/hero/edit/${hero.id}`)}
              >
                ✏️ Edit Hero
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleReturnToList}
              >
                Back to List
              </button>
            </div>
          </div>

          {hero.image ? (
            <div className="text-center mb-4">
              <img
                src={`${BASE_URL}${hero.image}`}
                alt="Hero"
                className="img-fluid mb-3 rounded shadow-sm"
                style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                onError={(e) => {
                  console.log("Image failed to load:", `${BASE_URL}${hero.image}`);
                  e.target.src = "/placeholder.png"; 
                  e.target.onerror = null;
                }}
              />
              <p className="text-muted small">Image Path: {hero.image}</p>
            </div>
          ) : (
            <div className="alert alert-info">No image available for this hero</div>
          )}

          <div className="card bg-dark text-light p-3 mb-4">
            <h4>Description</h4>
            {hero.description ? (
              <div 
                dangerouslySetInnerHTML={{ __html: hero.description }} 
                className="text-justify mt-2"
              ></div>
            ) : (
              <p className="text-muted">No description available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDetails;