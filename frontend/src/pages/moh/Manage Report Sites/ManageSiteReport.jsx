// front-end of the MOH side manage  report sites

import "./manageReportSites.css";
import NavBar from "../../../components/common/Navbar/NavBar";
import React, { useEffect, useState } from "react";

// displaying breeding side data
const ManageReport = () => {
    const [sites, setSites] = useState([]);

    useEffect(() => {
      const loadBreedingSites = async () => {
        try{
          // fetch data from the Express API
          const response = await fetch("http://localhost:5000/api/site-reports");

          // catch any network errors here
          if (!response.ok){
            throw new Error ("Failed to fetch data from server");
          }

          // converts raw data to JSON object
          const data = await response.json();

          setSites(data.reportSite || []);  // if there is no data it will send an empty array
        }catch (error){
          console.error("Fetch error message: " + error.message);
        }
      };
      loadBreedingSites();
    }, []);
    console.log(sites);


    return (
      <div className = "moh-layout">
        <NavBar role="MOH" />
        <main className = "main-content">
          <h1>Reported Breeding Sites</h1>
          <div>
            {sites.map((site, index)=>(
              <div className="card" key={index}>
                <h3>{site.issue_type}</h3>
                <p>Location: {site.location}</p>
                <p>Urgency: {site.urgency}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
}

export default ManageReport;