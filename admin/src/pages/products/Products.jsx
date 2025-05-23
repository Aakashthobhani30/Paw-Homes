import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import SearchBar from "../../layout/SearchBar";

import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;
function ViewProducts() {
  const navigate = useNavigate();

  const { user, isLoading } = useUser();
  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allProducts) {
      const filtered = allProducts.filter((item) =>
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

  const fetchServices = async () => {
    setIsLoadingProducts(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      // Fetch user details independently
      const servicesRes = api.get("/api/product/");

      // Wait for both requests to complete independently
      const [services] = await Promise.all([servicesRes]);

      // Update state
      setAllProducts(services.data);
      setFilteredData(services.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoadingProducts(false);
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

    fetchServices();
    const interval = setInterval(() => {
      fetchServices();
    }, 60000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [message]);

  const handleDeactivate = async (product_id) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      const response = await api.patch(
        `api/product/product/${product_id}/deactivate/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT Token
          },
        }
      );
      setMessage(response.data.message);
      //   alert("User activated successfully!");
      fetchServices();
    } catch (error) {
      setError(error.response.data.message || "Error deactivating product");
    }
  };

  const handleActivate = async (product_id) => {
    try {
      const response = await api.patch(
        `api/product/product/${product_id}/activate/`
      );
      setMessage(response.data.message);
      fetchServices();
    } catch (error) {
      setError(error.response.data.message || "Error activating product");
      console.log(error);
    }
  };

  const handleRowClick = (product_id) => {
    navigate(`/products/${product_id}`);
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
                    <strong className="me-auto">InfoFlow</strong>
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
            <h2>Products</h2>
            <button
              className="btn btn-warning"
              onClick={() => navigate("/product/add")}
            >
              + Add Product
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
                <th>Status</th>
                <th>Created At</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isLoadingProducts ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Loading Events
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
                        src={`${BASE_URL}${item.image}`}
                        alt="Event Image"
                        height={100}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      {item.status ? (
                        <span className="badge text-bg-success">Active</span>
                      ) : (
                        <span className="badge text-bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString(
                            undefined,
                            date_format
                          )
                        : "N/A"}
                    </td>
                    <td>
                      {item.created_by.first_name} {item.created_by.last_name}
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

export default ViewProducts;
