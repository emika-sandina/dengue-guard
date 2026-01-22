import "./citizenhome.css";
import NavBar from "../../common/Navbar/NavBar";
import siteReportIcon from "../../../assets/sitereport.svg";
import symptomIcon from "../../../assets/symptomreport.svg";
import heatmapIcon from "../../../assets/heatmap.svg";
import educationIcon from "../../../assets/education.svg";
import chatbotIcon from "../../../assets/chatbot.svg";
import announcementPlaceholder from "../../../assets/announcements.svg";
import { useState } from "react";

function CitizenHome() {
  const menu = [
    {
      icon: siteReportIcon,
      name: "Report Breeding Sites",
      description:
        "Identify and report breeding sites to help prevent mosquito breeding in your area.",
    },
    {
      icon: symptomIcon,
      name: "Report Dengue Cases",
      description:
        "Notify health authorities about potential dengue symptoms for immediate action.",
    },
    {
      icon: announcementPlaceholder,
      name: "MOH Announcements",
      description: "View special announcements sent out by MOH",
    },
    {
      icon: heatmapIcon,
      name: "Risk Heat Map",
      description:
        "Assess the risk level of specific areas through the risk heat map.",
    },
  ];

  return (
    <>
    <div className="citizen-layout">
      <NavBar role="Citizen" />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <main className="main-content">
        <p className="greeting">Hey Citizen</p>
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
          
        <div className="risk-box">
          <h1>⚠️</h1>
          <div>
            <h3>Risk Level</h3>
            <p>
              <h2>Current MOH Location</h2>
            </p>
            <small>Based on reports and weather data</small>
          </div>
        </div>
          
        <div className="stats">
          <div className="stat-card">
            <h2>Community Report Count</h2>
            <p>Community Reports</p>
          </div>

          <div className="stat-card">
            <h2>Site Count</h2>
            <p>Sites Cleaned</p>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}

export default CitizenHome;
