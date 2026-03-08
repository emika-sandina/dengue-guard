import NavBar from "../../../components/common/Navbar/NavBar";
import React, { useEffect, useState } from "react";
import "./manageReportSites.css";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";

const SiteDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

// Accessing the data
const site = location.state?.siteData;

// To handle displaying different levels of urgency
const Priority = (urgency) =>{
  if(!urgency) return "";
  const level = urgency.toLowerCase();
  if (level === "high") return "priority-high";
  if (level === "medium") return "priority-medium";
  if (level === "low") return "priority-low";
};

const handleDelete = async (e, siteId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
        // Gets current users session information from supabase
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;  // Supabase JSON Web TOKEN (JWT)

        if (!token) {
          console.error("No session found");
          navigate("/");
          return;
        }
        const response = await fetch(`http://localhost:5000/api/site-reports/${siteId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete from server");
        }
        alert("Report deleted successfully!");
        navigate(-1); // go to previous page
    }catch (error){
      console.error("Fetch error message: " + error.message);
      }
  }

return (
    <div className="moh-layout">
      <NavBar role="MOH" />
      <main className="site-container">   
        <div className="card">
          <div className="left-card">
            <h2 title={site.location}>{site.issue_type} - {site.location}</h2>
            <div>{site.moh_area}</div>
            <div className="desciption-container">{site.description}</div>
            <div className="image-style">
                {site.photo_url ? (
                          <img
                            src={site.photo_url}
                            alt="Breeding site image"
                            className="site-image"
                          />
                        ) : (
                          <span>No image provided</span>
                )}
            </div>
          </div>

          <div className="right-card">
            <div className={`priority-level ${Priority(site.urgency)}`}>{site.urgency}</div>    {/*To constomize different levels of urgency*/}
            <button className="btn btn-view">View Location</button>
            <button className="btn btn-delete" onClick={(e) => handleDelete(e,site.id)}>Delete Report</button>
            <button className="btn btn-resolve">Resolve</button>
          </div>
        </div>
      </main>
    </div>)
}

export default SiteDetails;