import NavBar from "../../../components/common/Navbar/NavBar";
import React, { useEffect, useState } from "react";
import "./manageReportSites.css";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";

const SiteDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
// Accessing the data
const site = location.state?.siteData;  // current URL and any data that gets passed through 
const [status, setStatus] = useState(site?.status || "Pending");  // on page load inistialie status to with what is site.status currently

// To handle displaying different levels of urgency
const Priority = (urgency) =>{
  if(!urgency) return "";
  const level = urgency.toLowerCase();
  if (level === "high") return "priority-high";
  if (level === "medium") return "priority-medium";
  if (level === "low") return "priority-low";
};

// To handle deleting a breeding site
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
const handleResolve = async(e,siteId) =>{
    if (status !== "Verified"){
      alert("Site has to be Verified before it can be Resolved");
      return;
    }
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
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({status:"Resolved"})
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update from server");
        }
        // To update the report from the UI
        setStatus("Resolved");
    }catch (error){
      console.error("Fetch error message: " + error.message);
    }
  }

const viewLocation = async(e,siteLocation) =>{
  try{
    // convert the location to lat, long coordinates
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(siteLocation)}`; //search the location in textual description. format to json(output). q is free-form query
    // encodeURIComponent to ensure no spaces are there
    const response = await fetch(url);
    const data = await response.json();

    if (data.length === 0){
      alert("Location not found on map");
      return;
    }

    const {lat, lon} = data[0];

    window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=17`,"_blank");

  } catch (error){
    console.error("Error finding location: " +error.message);
    alert("Could not find location on map");
  }
    
  }

return (
    <div className="moh-layout">
      <NavBar role="MOH" />
      <main className="site-container">   
        <div className="detail-card">
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
            <button className="btn btn-view" onClick={(e) => viewLocation(e,site.location)}>View Location</button>
            <button className="btn btn-delete" onClick={(e) => handleDelete(e,site.id)}>Delete Report</button>
            <button className="btn btn-resolve" onClick={(e) => handleResolve(e,site.id)} disabled={status === "Resolved"}>{status === "Resolved" ? "Resolved" : "Resolve"}</button>
          </div>
        </div>
      </main>
    </div>)
}

export default SiteDetails;