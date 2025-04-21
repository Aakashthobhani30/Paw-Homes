import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import SearchBar from "../../layout/SearchBar";

import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;
function ViewAdoption() {
  const navigate = useNavigate();

  const { user, isLoading } = useUser();
  const [allAdoption, setAllAdoption] = useState([]);
  const [isLoadingAdoption, setIsLoadingAdoption] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allAdoption) {
      const filtered = allAdoption.filter((item) =>
        `${item.name} ${item.status} ${item.created_by}`
          .toLowerCase()
          .includes(value)
      );
      setFilteredData(filtered);
    }
  };

  const date_format = {
    year: "numeric",
    month: "long", // "short" for abbreviated months
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const fetchAdoption = async () => {
    setIsLoadingAdoption(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      // Fetch user details independently
      const adoptionRes = api.get("/api/adoption/");

      // Wait for both requests to complete independently
      const [adoption] = await Promise.all([adoptionRes]);

      // Update state
      setAllAdoption(adoption.data);
      setFilteredData(adoption.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoadingAdoption(false);
    }
  };

  useEffect(() => {
    if (message) {
      const toastElement = document.getElementById("liveToast");
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    }

    fetchAdoption();
    const interval = setInterval(() => {
      fetchAdoption();
    }, 60000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [message]);

  const handleDeactivate = async (adoption_id) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      const response = await api.patch(
        `api/adoption/adoption/${adoption_id}/deactivate/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT Token
          },
        }
      );
      setMessage(response.data.message);
      //   alert("User activated successfully!");
      fetchAdoption();
    } catch (error) {
      setError(error.response.data.message || "Error deactivating Adoption");
    }
  };

  const handleActivate = async (adoption_id) => {
    try {
      const response = await api.patch(
        `api/adoption/adoption/${adoption_id}/activate/`
      );
      setMessage("Adoption Activated Successfully");
      fetchAdoption();
    } catch (error) {
      setError(error.response.statusText || "Error activating Adoption");
      console.log(error);
    }
  };

  const handleRowClick = (adoption_id) => {
    navigate(`/adoption/${adoption_id}`);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <div className="sidebar">
        <Sidebar user={user} />
      </div>
      <div
        className="main-content flex-grow-1 ms-2"
        style={{ marginLeft: "280px", padding: "20px" }}
      >
        <div className="container mt-4">
          {error && (
            <div className="col-12 col-sm-auto mt-4 mt-sm-0">
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {error}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </div>
          )}
          {message && (
            <div className="col-12 col-sm-auto mt-4 mt-sm-0">
              <div
                className="position-fixed bottom-0 end-0 p-3"
                style={{ zIndex: 11 }} // React style syntax
              >
                <div
                  id="liveToast"
                  className="toast hide"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  <div className="toast-header">
                    <strong className="me-auto">Paw & Homes</strong>
                    <small>Just Now</small>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="toast"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="toast-body">{message}</div>
                </div>
              </div>
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Adopction</h2>
            <button
              className="btn btn-warning"
              onClick={() => navigate("/adoption/add")}
            >
              + Add Adopction
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
                <th>Pet Name</th>
                <th>Pet Breed</th>
                <th>Pet Personality</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isLoadingAdoption ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Loading Apopction
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.id}</td>
                    <td>
                      <img
                        src={`${BASE_URL}${item.pet_image}`}
                        alt="Pet Image"
                        height={100}
                      />
                    </td>
                    <td>{item.pet_name}</td>

                    <td>{item.pet_breed}</td>

                    <td>{item.pet_personality}</td>
                    
                    <td>
                      {item.status ? (
                        <span className="badge text-bg-success">Active</span>
                      ) : (
                        <span className="badge text-bg-danger">Inactive</span>
                      )}
                    </td>
                    

                    <td onClick={(e) => e.stopPropagation()}>
                      {item.status ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeactivate(item.id)}
                          title="Delete User"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleActivate(item.id)}
                          title="Delete User"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewAdoption;
