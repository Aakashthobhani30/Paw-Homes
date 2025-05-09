import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import useUser from "../../hooks/useUser";

const BASE_URL = import.meta.env.VITE_API_URL;

function OrdersPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [allOrders, setAllOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");

  // Search handler
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allOrders) {
      const filtered = allOrders.filter((item) =>
        `${item.order.id} ${item.order.order_status} ${item.order.created_at}`.toLowerCase().includes(value)
      );
      setFilteredData(filtered);
    }
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const ordersRes = await api.get("/api/orders/orders/");
      console.log("Fetched Orders:", ordersRes.data); // Debugging line
      setAllOrders(ordersRes.data);
      setFilteredData(ordersRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.clear();
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        setError("You don't have permission to view orders. Please contact an administrator.");
      } else {
        setError("Failed to load orders. Please try again later.");
      }
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
            <h2>Orders Section</h2>
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
                <th>Order ID</th>
                <th>Customer Details</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingOrders ? (
                <tr>
                  <td colSpan="6" className="text-center">Loading...</td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr 
                    key={item.order.id} 
                    style={{ cursor: "pointer" }} 
                    onClick={() => navigate(`/orders/${item.order.id}`)}
                  >
                    <td>#{item.order.id}</td>
                    <td>
                      <div>
                        <strong>{item.order.user?.first_name} {item.order.user?.last_name}</strong>
                        <br />
                        <small className="text-muted">
                          Username: {item.order.user?.username}
                          <br />
                          Member since: {new Date(item.order.user?.date_joined).toLocaleDateString()}
                        </small>
                      </div>
                    </td>
                    <td>{new Date(item.order.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        item.order.order_status === 5 ? "bg-success" : 
                        item.order.order_status === 1 ? "bg-warning" :
                        item.order.order_status === 6 ? "bg-danger" : "bg-info"
                      }`}>
                        {item.order.order_status === 1 ? "Placed" :
                         item.order.order_status === 2 ? "Processing" :
                         item.order.order_status === 3 ? "Shipped" :
                         item.order.order_status === 4 ? "Out for Delivery" :
                         item.order.order_status === 5 ? "Delivered" :
                         item.order.order_status === 6 ? "Cancelled" : "Unknown"}
                      </span>
                    </td>
                    <td>₹{item.order.total}</td>
                    <td>{item.order_items.length} items</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;