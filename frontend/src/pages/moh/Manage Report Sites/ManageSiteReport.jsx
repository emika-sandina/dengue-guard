// front-end of the MOH side manage  report sites

import "./manageReportSites.css";
import NavBar from "../../../components/common/Navbar/NavBar";
import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    const loadBreedingSites = async () => {
      try {
        // fetch data from the Express API
        const response = await fetch("http://localhost:5000/api/site-reports");

        // catch any network errors here
        if (!response.ok) {
          throw new Error("Failed to fetch data from server");
        }

        // converts raw data to JSON object
        const data = await response.json();

        setSites(data.reportSite || []); // if there is no data it will send an empty array
      } catch (error) {
        console.error("Fetch error message: " + error.message);
      }
    };
    loadBreedingSites();
  }, []);
  console.log(sites);
  sites.forEach(site => console.log("photo_url:", site.photo_url)); // TODO remove after done checking
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
              <tr key={index}>

                <td><h3>{site.issue_type}</h3></td> 

                <td className="location-column">{site.location}</td>

                <td>
                  <span className={`priority-level ${Priority(site.urgency)}`}>
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
                    <button className="btn-action">Verify</button>
                    <button className="btn-action btn-delete">Delete</button>
                    <button className="btn-action btn-resolve">Resolve</button>
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
