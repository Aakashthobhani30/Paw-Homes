import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import useUser from "../../hooks/useUser";

const BASE_URL = import.meta.env.VITE_API_URL;

function HeroPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [allHero, setAllHero] = useState([]);
  const [isLoadingHero, setIsLoadingHero] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");

  // Search handler
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allHero) {
      const filtered = allHero.filter((item) =>
        `${item.title} ${item.subtitle} ${item.status}`.toLowerCase().includes(value)
      );
      setFilteredData(filtered);
    }
  };

  // Fetch hero from API
  const fetchHero = async () => {
    setIsLoadingHero(true);
    try {
      const heroRes = await api.get("/api/hero/");
      console.log("Fetched Hero:", heroRes.data); // Debugging line
      setAllHero(heroRes.data);
      setFilteredData(heroRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load hero");
    } finally {
      setIsLoadingHero(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-5"><h1>Loading...</h1></div>;
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} />
      <div className="main-content flex-grow-1 ms-2" style={{ marginLeft: "280px", padding: "20px" }}>
        <div className="container mt-4">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Hero Section</h2>
            <button className="btn btn-warning" onClick={() => navigate("/addhero")}>
              + Add Hero
            </button>
          </div>
          <div className="input-group mb-3 mt-3">
            <span className="input-group-text bg-light border-0">
              <i className="fa fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark text-light p-2"
              placeholder="Search..."
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <table className="table table-striped table-bordered table-dark table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingHero ? (
                <tr>
                  <td colSpan="5" className="text-center">Loading...</td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr 
                    key={item.id} 
                    style={{ cursor: "pointer" }} 
                    onClick={() => navigate(`/hero/${item.id}`)} // ✅ Navigate to HeroDetails
                  >
                    <td>{item.id}</td>
                    <td>
                      <img 
                        src={item.image ? `${BASE_URL}${item.image}` : "/default-image.jpg"} 
                        alt="Hero" 
                        height={50} 
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>{item.subtitle}</td>
                    <td>
                      <span className={`badge ${item.status ? "bg-success" : "bg-danger"}`}>
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HeroPage;
