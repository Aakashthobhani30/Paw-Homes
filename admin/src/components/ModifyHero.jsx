import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import LoadingIndicator from "./LoadingIndicator";
import useUser from "../hooks/useUser";
import "../styles/Styles.css";

const ModifyHero = ({ method }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [Status, setStatus] = useState(0);

  useEffect(() => {
    if (method === "edit" && id) {
      fetchHeroDetails();
    }
  }, [id, method]);

  const fetchHeroDetails = async () => {
    try {
      const res = await api.get(`/api/hero/${id}/`);
      const data = res.data;
      setHeroTitle(data.title);
      setHeroSubtitle(data.subtitle);
      setButtonText(data.button_text);
      setButtonLink(data.button_link);
      setPreviewImage(data.image ? `${import.meta.env.VITE_API_URL}${data.image}` : "");
      setStatus(data.status);
    } catch (err) {
      console.error("Failed to fetch hero details:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setHeroImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", heroTitle);
    formData.append("subtitle", heroSubtitle);
    formData.append("button_text", buttonText);
    formData.append("button_link", buttonLink);
    formData.append("status", Status);
    if (heroImage) {
      formData.append("image", heroImage);
    }

    try {
      if (method === "edit") {
        await api.patch(`/api/hero/edit/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Hero section updated successfully!");
      } else {
        await api.post(`/api/hero/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Hero section added successfully!");
      }
      navigate("/hero");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit hero section. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <div className="sidebar">
        <Sidebar user={user} />
      </div>
      <div className="main-content flex-grow-1 ms-2" style={{ marginLeft: "280px", padding: "20px" }}>
        <h1>{method === "edit" ? "Edit " : "Add "} Hero Section</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Title</label>
            <input className="form-control" type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Subtitle</label>
            <input className="form-control" type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} required />
          </div>
          <div className="row">
            <div className="col-6 mb-4">
              <label className="form-label">Button Text</label>
              <input className="form-control" type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
            </div>
            <div className="col-6 mb-4">
              <label className="form-label">Button Link</label>
              <input className="form-control" type="text" value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="status">Status</label>
            <select
              id="status"
              className="form-select"
              value={Status}
              onChange={(e) => setStatus(Number(e.target.value))}
              required
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="form-label">Hero Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
            {previewImage && <img src={previewImage} alt="Preview" className="mt-2" height={200} />}
          </div>
          <div className="d-flex justify-content-center my-3">{loading && <LoadingIndicator />}</div>
          <button type="submit" className="btn btn-warning w-100">Save Hero Section</button>
        </form>
      </div>
    </div>
  );
};

export default ModifyHero;
