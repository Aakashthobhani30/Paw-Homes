import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useLocation } from "react-router-dom";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import SearchBar from "../layout/SearchBar";
import "../styles/Styles.css";
import LoadingIndicator from "./LoadingIndicator";

import useUser from "../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";

const ModifyAdoption = ({ method }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [description, setDescription] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petGender, setPetGender] = useState("");
  const [petColor, setPetColor] = useState("");
  const [petPersonality, setPetPersonality] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petEnergylevel, setPetEnergylevel] = useState("");
  const [petDisease, setPetDisease] = useState("");
  const [petVaccinatedStatus, setPetVaccinatedStatus] = useState("");
  const [petImage, setPetImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const today = new Date().toISOString().split("T")[0]; // Get today's date
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const config = {
    readonly: false,
    height: 400,
    placeholder: "Write your blog here...",
    toolbarButtonSize: "large",
    theme: "dark",
    buttons:
      "bold,italic,underline,strikethrough,fontsize,font,brush,paragraph,|,ul,ol,|,link,hr,table,|,align,undo,redo,preview,fullscreen,lineHeight",
    showXPathInStatusbar: false,
  };

  useEffect(() => {
    if (method === "edit" && id) {
      fetchAdoptionDetails();
    }
  }, []);

  const fetchAdoptionDetails = async () => {
    try {
      const res = await api.get(`/api/adoption/${id}/`);
      const data = res.data;
      console.log(data)
      setPetName(data.pet_name);
      setPetBreed(data.pet_breed);
      setPetVaccinatedStatus(data.pet_vaccinatedstatus);
      setDescription(data.description);
      setPetAge(data.pet_age);
      setPetGender(data.pet_gender);
      setPetColor(data.pet_color);
      setPetPersonality(data.pet_personality);
      setPetWeight(data.pet_weight);
      setPetEnergylevel(data.pet_energylevel);
      setPetDisease(data.pet_disease);
      setPetVaccinatedStatus(data.pet_vaccinatedstatus);
      setPreviewImage(
        data.pet_image ? `${import.meta.env.VITE_API_URL}${data.pet_image}` : ""
      );
    } catch (err) {
      console.error("Failed to fetch webinar details:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setPetImage(file); // Store the file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("pet_name", petName);
    formData.append("pet_breed", petBreed);
    formData.append("description", description);
    formData.append("pet_age", petAge);
    formData.append("pet_gender", petGender);
    formData.append("pet_color", petColor);
    formData.append("pet_personality", petPersonality);
    formData.append("pet_weight", petWeight);
    formData.append("pet_energylevel", petEnergylevel);
    formData.append("pet_disease", petDisease);
    formData.append("pet_vaccinatedstatus", petVaccinatedStatus);
    if (petImage) {
      formData.append("pet_image", petImage);
    }

    try {
      if (method === "edit") {
        await api.patch(`/api/adoption/adoption/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Pet Updated Successfully!");
      } else {
        await api.post(`/api/adoption/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Pet Added Successfully!");
      }
      navigate("/adoption");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit pet. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="row align-items-center mb-7">
            <div className="col">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item">
                    <p
                      className="text-body-secondary"
                      onClick={() => navigate("/adoption")}
                      style={{ cursor: "pointer" }}
                    >
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    {method === "edit" ? "Edit " : "Add "}
                    Adopction
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">
                {method === "edit" ? "Edit " : "Add "}Adoption
              </h1>
            </div>

            {error && (
              <div className="col-12 col-sm-auto mt-4 mt-sm-0">
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  <strong>Error</strong> {error}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            )}
          </div>
          <div className="row mt-5">
            <div className="col">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="status">
                      Breed
                    </label>
                    <div className="mb-4">
                      <select
                        id="status"
                        className="form-select"
                        value={petBreed}
                        onChange={(e) => setPetBreed(e.target.value)}
                        required
                      >
                        <option>-- Select Category --</option>
                        <option value={"Labrador Retriever"}>Labrador Retriever</option>
                        <option value={"German Shepherd"}>German Shepherd</option>
                        <option value={"Golden Retriever"}>Golden Retriever</option>
                        <option value={"Pug"}>Pug</option>
                        <option value={"Rottweiler"}>Rottweiler</option>
                        <option value={"Boxer"}>Boxer</option>
                        <option value={"Dachshund"}>Dachshund</option>
                        <option value={"Shih Tzu"}>Shih Tzu</option>
                        <option value={"Siberian Husky"}>Siberian Husky</option>
                        <option value={"Indian Street"}>Indian Street</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="name">
                      Age (In Years)
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={petAge}
                      onChange={(e) => setPetAge(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="status">
                      Gender
                    </label>
                    <div className="mb-4">
                      <select
                        id="status"
                        className="form-select"
                        value={petGender}
                        onChange={(e) => setPetGender(e.target.value)}
                        required
                      >
                        <option>-- Select Category --</option>
                        <option value={"Male"}>Male</option>
                        <option value={"Female"}>Female</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                  
                
                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="contact_name">
                      Color
                    </label>
                    <input
                      className="form-control"
                      id="contact_name"
                      type="text"
                      value={petColor}
                      onChange={(e) => setPetColor(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="contact_number">
                      Personality
                    </label>
                    <input
                      className="form-control"
                      id="contact_number"
                      type="text"
                      value={petPersonality}
                      onChange={(e) => setPetPersonality(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="contact_number">
                      Weight (In Kgs)
                    </label>
                    <input
                      className="form-control"
                      id="contact_number"
                      type="number"
                      value={petWeight}
                      onChange={(e) => setPetWeight(e.target.value)}
                      required
                    />
                  </div>



                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="status">
                      Energy Level
                    </label>
                    <div className="mb-4">
                      <select
                        id="status"
                        className="form-select"
                        value={petEnergylevel}
                        onChange={(e) => setPetEnergylevel(e.target.value)}
                        required
                      >
                        <option>-- Select Category --</option>
                        <option value={"Low"}>Low</option>
                        <option value={"Medium"}>Medium</option>
                        <option value={"High"}>High</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="contact_number">
                      Diesease (If any/ Na if none)
                    </label>
                    <input
                      className="form-control"
                      id="contact_number"
                      type="text"
                      value={petDisease}
                      onChange={(e) => setPetDisease(e.target.value)}
                      required
                    />
                  </div>



                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="status">
                      Vaccinated Status
                    </label>
                    <div className="mb-4">
                      <select
                        id="status"
                        className="form-select"
                        value={petVaccinatedStatus}
                        onChange={(e) => setPetVaccinatedStatus(e.target.value)}
                        required
                      >
                        <option>-- Select Category --</option>
                        <option value={"Not Vaccinated"}>Not Vaccinated</option>
                        <option value={"Partially Vaccinated"}>Partially Vaccinated</option>
                        <option value={"Fully Vaccinated"}>Fully Vaccinated</option>
                      </select>
                    </div>
                  </div>
                </div>


                <div className="row">
                    <label className="form-label" htmlFor="contact_number">
                      What are they looking for
                    </label>
                    <input
                      className="form-control"
                      id="contact_number"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                </div>

                <div className="mb-4">
                  <div className="image-uploader">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="preview-image mt-2"
                        height={200}
                      />
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center my-3">
                  {loading && <LoadingIndicator />}
                </div>
                <button type="submit" className="btn btn-warning w-100">
                  Save Category
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyAdoption;
