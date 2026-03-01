// front-end of the MOH side manage  report sites

import "./manageReportSites.css";
import NavBar from "../../../components/common/Navbar/NavBar";
import { fetchReportSites } from "../../../../../backend/src/services/manageSites.service";
import React, { useEffect, useState } from "react";

// TODO
const ManageReport = () => {
    const [sites, setSites] = useState([]);

    useEffect(() => {
        fetchReportSites();
    }, []);

    console.log(sites);
    setSites(data); 
}

{/* <div className="moh-layout">
      <NavBar role="MOH" />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <main className="main-content">
        <p className="greeting">Hey Medical Officer of Health</p>
        <h1>Welcome to DengueGuard</h1>

        <div className="card-grid">
          {menu.map((menuOption, index) => (
            <div className="card">
              <div className="menu-icon">
                <img src={menuOption.icon} alt="" />
              </div>

              <h3>{menuOption.name}</h3>
              <p>{menuOption.description}</p>
            </div>
          ))}
        </div>
    </main>
</div> */}

export default ManageReport;