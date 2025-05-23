import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import SearchBar from "../layout/SearchBar";
import planet_earth from "../assets/images/planet-earth.png";
import help_img from "../assets/images/help-support.png";
import blog_img from "../assets/images/blog.png";
import event_img from "../assets/images/event.png";
import adoption_img from "../assets/images/dog.png";
import product_img from "../assets/images/product.png";
import user_img from "../assets/images/user.png";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [adoptionCount, setAdoptionCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [location, setLocation] = useState({ country: "", city: "" });
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const updateTime = () => setCurrentTime(new Date().toLocaleTimeString());

  const fetchLocation = async () => {
    try {
      const response = await fetch(
        "https://ipinfo.io/json?token=f48a68ebe13b9a"
      );
      const data = await response.json();
      setLocation({ country: data.country, city: data.city });
    } catch (error) {
      console.error("Failed to fetch location:", error);
      setLocation({ country: "Unknown", city: "Unknown" });
    }
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setLoading(false);
      return;
    }

    try {
      const [userRes, usersRes, blogsRes, eventsRes, adoptionRes, servicesRes, productRes] = await Promise.all([
        api.get("/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/user/all-user/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/blog/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/events/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/adoption/", {
          headers: { Authorization: `Bearer ${token}`},
        }),
        api.get("/api/services/", {
          headers: { Authorization: `Bearer ${token}`},
        }),
        api.get("/api/product/", {
          headers: { Authorization: `Bearer ${token}`},
        }),
      ]);

      setUser(userRes.data);
      setUserCount(usersRes.data.length);
      setBlogsCount(blogsRes.data.length);
      setEventsCount(eventsRes.data.length);
      setAdoptionCount(adoptionRes.data.length);
      setServicesCount(servicesRes.data.length);
      setProductCount(productRes.data.length);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        await handleTokenRefresh();
      } else {
        console.error("Failed to fetch dashboard data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      console.error("No refresh token found, redirecting...");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      console.log("Token refreshed successfully");
      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to refresh token:", error);
      window.location.href = "/login";
    }
  };

  const handleRowClick = (name) => {
    navigate(`/${name}`);
  };


  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    fetchLocation();
    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} />
      <div
        className="main-content flex-grow-1 ms-2"
        style={{ marginLeft: "280px", padding: "20px" }}
      >
        <div className="d-flex justify-content-between align-items-center mt-5">
          <h1 className="fw-semibold">Hello, {user?.first_name}</h1>
          <div className="text-end">
            {/* <img
              src={planet_earth}
              alt="Planet Earth"
              height={25}
              className="me-2"
            /> */}
            {currentTime} - {location.country}, {location.city},  
          </div>
        </div>
        <p className="text-secondary">
        Unleash the Future of Content Management.
        </p>
        <hr className="mt-4 mb-3" />

        <div className="row justify-content-between">
          <DashboardCard title="Blogs" count={blogsCount} image={blog_img} onClick={handleRowClick} />
          <DashboardCard title="Adoption" count={adoptionCount} image={adoption_img} onClick={handleRowClick} />
          <DashboardCard title="Product" count={productCount} image={product_img}onClick={handleRowClick} />
          <DashboardCard title="Services" count={servicesCount} image={help_img} onClick={handleRowClick} />
          <DashboardCard title="Events" count={eventsCount} image={event_img} onClick={handleRowClick} />
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({ title, count, image, onClick }) => (
  <div className="col-3">
    <div className="card bg-dark" style={{ maxWidth: "250px", margin: "10px", cursor: "pointer" }} onClick={() => onClick(title)}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="card-title text-secondary fs-6 fw-light">{title}</h6>
          <h6 className="card-text fw-semibold text-light fs-2">{count}</h6>
        </div>
        <img
          src={image}
          alt={title}
          className="rounded-circle"
          style={{ width: "50px", height: "50px" }}
        />
      </div>
    </div>
  </div>
);

export default Dashboard;
