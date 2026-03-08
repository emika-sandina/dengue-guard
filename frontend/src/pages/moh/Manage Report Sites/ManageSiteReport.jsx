// front-end of the MOH side manage  report sites

import "./manageReportSites.css";
import NavBar from "../../../components/common/Navbar/NavBar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";

// To handle displaying different levels of urgency
const Priority = (urgency) =>{
  if(!urgency) return "";
  const level = urgency.toLowerCase();
  if (level === "high") return "priority-high";
  if (level === "medium") return "priority-medium";
  if (level === "low") return "priority-low";
};

// displaying breeding side data
const ManageReport = () => {
  const [sites, setSites] = useState([]);

  // navigating to the site details page
  const nav = useNavigate();

  const navigate = (site) =>{
    // navigate to the path
    nav(`/moh/site-reports/${site.id}`,{state: {siteData: site}});  
  }

  useEffect(() => {
    const loadBreedingSites = async () => {
      try {

        // Gets current users session information from supabase
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;  // Supabase JSON Web TOKEN (JWT)

        if (!token) {
          console.error("No session found");
          nav("/");
          return;
        }

        // fetch data from the Express API
        const response = await fetch("http://localhost:5000/api/site-reports", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // catch any network errors here
        if (!response.ok) {
          throw new Error("Failed to fetch data from server");
        }

        // converts raw data to JSON object
        const data = await response.json();

        setSites(data.filteredSites || []); // if there is no data it will send an empty array
      } catch (error) {
        console.error("Fetch error message: " + error.message);
      }
    };
    loadBreedingSites();}, []);
  
  const handleDelete = async (e, siteId) => {
    // to block the row click
    e.stopPropagation();

    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
        // Gets current users session information from supabase
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;  // Supabase JSON Web TOKEN (JWT)

        if (!token) {
          console.error("No session found");
          nav("/");
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
        // To remove the report from the UI
        setSites(sites.filter(site => site.id !== siteId));
    }catch (error){
      console.error("Fetch error message: " + error.message);
      }
  }

  const handleVerify = async (e, siteId) => {
    // to block the row click
    e.stopPropagation();

    try {
        // Gets current users session information from supabase
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;  // Supabase JSON Web TOKEN (JWT)

        if (!token) {
          console.error("No session found");
          nav("/");
          return;
        }
        const response = await fetch(`http://localhost:5000/api/site-reports/${siteId}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({status:"Verified"})
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update from server");
        }
        // To update the report from the UI
        setSites(sites.map(site => site.id === siteId? {...site, status:"Verfied"}:site));
    }catch (error){
      console.error("Fetch error message: " + error.message);
      }
  }

  return (
    <div className="moh-layout">
      <NavBar role="MOH" />
      <main className="main-content">
        <h1>Reported Breeding Sites</h1>

        <table className="manage-table">
          <thead>
            <tr>
              <th>Report Title</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
      
          <tbody>
            {sites.map((site, index) => (
              <tr key={index}onClick={() => navigate(site)}> {/*On click it will route to the details page*/}
                <td><h3>{site.issue_type}</h3></td> 

                <td className="location-column" title={site.location}>{site.location}</td>

                <td>
                  <span className={`priority-level ${Priority(site.urgency)}`}> {/*To constomize different levels of urgency*/}
                    {site.urgency}
                  </span>
                </td>
                
                <td>
                  {site.photo_url ? (
                      <img
                        src={site.photo_url}
                        alt="Breeding site image"
                        className="site-image"
                      />
                    ) : (
                      <span>No image provided</span>
                    )}
                  
                </td>  

                <td className="button">
                    <button className="btn-action btn-verify" onClick={(e) => handleVerify(e,site.id)} disabled={site.status === "Verified"}>{site.status === "Verified" ? "Verified" : "Verify"}</button>  {/*TODO add e.stopPropagation(); to block the row click*/} 
                    <button className="btn-action btn-delete" onClick={(e) => handleDelete(e,site.id)}>Delete</button>
                    <button className="btn-action btn-resolve">Resolve</button>
                    <button className="btn-action btn-status">{site.status || "Pending"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ManageReport;
