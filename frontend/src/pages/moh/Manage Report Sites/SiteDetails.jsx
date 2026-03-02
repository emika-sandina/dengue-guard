import NavBar from "../../../components/common/Navbar/NavBar";
import React, { useEffect, useState } from "react";
import "./manageReportSites.css";
import { useLocation, useNavigate } from "react-router-dom";

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

return (
    <div className="moh-layout">
      <NavBar role="MOH" />
      <main className="site-content">   {/*TODO*/}
        <h1>{site.issue_type}</h1>
        <div title={site.location}>{site.location}</div>
        <div className="desciption-container">{site.description}</div>
        <div className={`priority-level ${Priority(site.urgency)}`}>{site.urgency}</div>    {/*To constomize different levels of urgency*/}
        <div>
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
        <div>{site.moh_area}</div>
      </main>
    </div>)
}

export default SiteDetails;