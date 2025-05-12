import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import useUser from "../../hooks/useUser";

function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [orderData, setOrderData] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [error, setError] = useState("");

  const statusMap = {
    1: { text: "Placed", color: "bg-warning" },
    2: { text: "Processing", color: "bg-info" },
    3: { text: "Shipped", color: "bg-info" },
    4: { text: "Out for Delivery", color: "bg-info" },
    5: { text: "Delivered", color: "bg-success" },
    6: { text: "Cancelled", color: "bg-danger" }
  };

  const fetchOrderDetails = async () => {
    setIsLoadingOrder(true);
    setError("");
    try {
      const response = await api.get("/api/orders/orders/");
      const specificOrder = response.data.find(item => {
        const id = item.order?.id || item.id;
        return id && id.toString() === orderId.toString();
      });
      if (specificOrder) {
        setOrderData(specificOrder);
      } else {
        setError(`Order #${orderId} not found`);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError(`Error fetching order data: ${error.message}`);
    } finally {
      setIsLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/api/orders/orders/${orderId}/update-status/`, {
        order_status: newStatus
      });
      fetchOrderDetails(); // Refresh after update
    } catch (error) {
      console.error("Failed to update order status:", error);
      setError("Failed to update order status. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5"><h1>Loading...</h1></div>;
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} />
      <div className="main-content flex-grow-1" style={{ marginLeft: "280px", padding: "20px" }}>
        <div className="container mt-4">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Order Details</h2>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/orders')}>
              Back to Orders
            </button>
          </div>

          {isLoadingOrder ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : orderData ? (
            <div className="row">
              {/* Order Summary Card */}
              <div className="col-md-6 mb-4">
                <div className="card bg-dark text-light border-secondary">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      Order #{orderData.order?.id || orderData.id}
                    </h5>
                    <span className={`badge ${statusMap[orderData.order?.order_status || orderData.order_status]?.color || "bg-secondary"}`}>
                      {statusMap[orderData.order?.order_status || orderData.order_status]?.text || "Unknown"}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <h6 className="text-muted">Date Placed</h6>
                      <p>{new Date(orderData.order?.created_at || orderData.created_at).toLocaleString()}</p>
                    </div>
                    <div className="mb-3">
                      <h6 className="text-muted">Total Amount</h6>
                      <p className="fs-4">₹{orderData.order?.total || orderData.total}</p>
                    </div>
                    {(orderData.order?.payment_method || orderData.payment_method) && (
                      <div className="mb-3">
                        <h6 className="text-muted">Payment Method</h6>
                        <p>{orderData.order?.payment_method || orderData.payment_method}</p>
                      </div>
                    )}
                  </div>
                  <div className="card-footer">
                    <h6 className="mb-3">Update Status</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {Object.entries(statusMap).map(([status, { text, color }]) => {
                        const currentStatus = orderData.order?.order_status || orderData.order_status;
                        return (
                          <button
                            key={status}
                            className={`btn btn-sm ${parseInt(status) === currentStatus ? color : "btn-outline-secondary"}`}
                            onClick={() => handleStatusChange(parseInt(status))}
                            disabled={parseInt(status) === currentStatus}
                          >
                            {text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="col-md-6 mb-4">
                <div className="card bg-dark text-light border-secondary">
                  <div className="card-header">
                    <h5 className="mb-0">Customer Information</h5>
                  </div>
                  <div className="card-body">
                    {(() => {
                      const customer = orderData.order?.user || orderData.user;
                      if (!customer) {
                        return <p className="text-muted">Customer information not available</p>;
                      }
                      return (
                        <>
                          <div className="mb-3">
                            <h6 className="text-muted">Customer Name</h6>
                            <p>{customer.first_name} {customer.last_name}</p>
                          </div>
                          <div className="mb-3">
                            <h6 className="text-muted">Username</h6>
                            <p>{customer.username}</p>
                          </div>
                          {customer.email && (
                            <div className="mb-3">
                              <h6 className="text-muted">Email</h6>
                              <p>{customer.email}</p>
                            </div>
                          )}
                          {customer.date_joined && (
                            <div className="mb-3">
                              <h6 className="text-muted">Member Since</h6>
                              <p>{new Date(customer.date_joined).toLocaleDateString()}</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="col-12">
                <div className="card bg-dark text-light border-secondary">
                  <div className="card-header">
                    <h5 className="mb-0">Order Items</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-dark table-hover table-borderless mb-0">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th className="text-end">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const items = orderData.order_items || [];
                            if (items.length === 0) {
                              return (
                                <tr>
                                  <td colSpan="4" className="text-center py-3">No items found</td>
                                </tr>
                              );
                            }
                            return items.map((item, index) => (
                              <tr key={item.id || index}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {item.product?.image_url && (
                                      <img 
                                        src={item.product.image_url} 
                                        alt={item.product.name}
                                        className="me-3"
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                      />
                                    )}
                                    <div>
                                      <p className="mb-0 fw-bold">{item.product?.name}</p>
                                      {item.variant && (
                                        <small className="text-muted">
                                          Variant: {item.variant.name}
                                        </small>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td>₹{item.price}</td>
                                <td>{item.quantity}</td>
                                <td className="text-end">₹{(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                        <tfoot className="border-top">
                          <tr className="fs-5">
                            <td colSpan="3" className="text-end fw-bold">Total:</td>
                            <td className="text-end fw-bold">₹{orderData.order?.total || orderData.total}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              Order not found or has been deleted.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
