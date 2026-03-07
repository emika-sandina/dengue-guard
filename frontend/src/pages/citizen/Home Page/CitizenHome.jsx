import "./citizenhome.css";
import NavBar from "../../../components/common/Navbar/NavBar";
import Chatbot from "../../../components/citizen/Chatbot/Chatbot";
import siteReportIcon from "../../../assets/sitereport.svg";
import symptomIcon from "../../../assets/symptomreport.svg";
import heatmapIcon from "../../../assets/heatmap.svg";
import educationIcon from "../../../assets/education.svg";
import { useNavigate } from "react-router-dom";
import announcementPlaceholder from "../../../assets/announcements.svg";
import heroImg2 from "../../../../src/heroimg2.jpg";
import { useState } from "react";
import HeatMap from "./Heatmap.jsx";

function CitizenHome() {
  const navigate = useNavigate();
  const menu = [
    {
      icon: siteReportIcon,
      name: "Report Breeding Sites",
      description:
        "Identify and report breeding sites to help prevent mosquito breeding in your area.",
      route: "/citizen/report-sites",
    },
    {
      icon: symptomIcon,
      name: "Report Dengue Cases",
      description:
        "Notify health authorities about potential dengue symptoms for immediate action.",
      route: "/citizen/report-cases",
    },
    {
      icon: announcementPlaceholder,
      name: "MOH Announcements",
      description: "View special announcements sent out by MOH",
      route: "/citizen/announcement",
    },
    {
      icon: heatmapIcon,
      name: "Risk Heat Map",
      description:
        "Assess the risk level of specific areas through the risk heat map.",
      route: "/citizen/risk-map",
    },
  ];

  return (
    <>
      <Chatbot></Chatbot>
      <div className="citizen-layout">
        <NavBar role="Citizen" />
        <br></br>
        <br></br>
        <br></br>
        <main className="main-content">
          <div className="header-section">
            <div>
              <h1>Welcome back</h1>
              <p className="sub-header-text">
                Identify and report vulnerable sites to prevent mosquito <br />
                breeding in your area. Report suspected breeding sites now.
              </p>
            </div>
            <img
              className="heroimg"
              src={heroImg2}
              alt="Community members working together to identify and prevent mosquito breeding sites in residential areas, promoting public health awareness"
            />
          </div>

          <div className="card-gridcm">
            {menu.map((menuOption, index) => (
              <div
                className="cardcm"
                key={index}
                onClick={() => navigate(menuOption.route)}
              >
                <div className="menu-iconcm">
                  <img src={menuOption.icon} alt="" />
                </div>

                <h3>{menuOption.name}</h3>
                <p>{menuOption.description}</p>
              </div>
            ))}
          </div>

          <div className="risk-boxcm">
            <h1>⚠️</h1>
            <div>
              <h3>Risk Level</h3>
              <h2>Current MOH Location</h2>
              <small>Based on reports and weather data</small>
            </div>
          </div>

          <section
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "16px",
              border: "1px solid #eee",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "14px",
              }}
            >
              <span>
                <strong>Risk Level:</strong>
              </span>
              <span>
                <span style={{ color: "blue" }}>●</span> Low &nbsp;
                <span style={{ color: "lime" }}>●</span> Moderate &nbsp;
                <span style={{ color: "red" }}>●</span> High Risk
              </span>
            </div>

            <HeatMap />
          </section>

          <footer
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              fontSize: "12px",
              color: "#888",
            }}
          >
            Data simulated based on Epidemiological Unit reports.
          </footer>
          <div className="statscm">
            <div className="stat-cardcm">
              <h2>Community Report Count</h2>
              <p>Community Reports</p>
            </div>

            <div className="stat-cardcm">
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
