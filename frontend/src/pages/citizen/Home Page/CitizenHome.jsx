import "./citizenhome.css";
import NavBar from "../../../components/common/Navbar/NavBar";
import Chatbot from "../../../components/citizen/ChatBot/Chatbot";
import siteReportIcon from "../../../assets/sitereport.svg";
import symptomIcon from "../../../assets/symptomreport.svg";
import heatmapIcon from "../../../assets/heatmap.svg";
import educationIcon from "../../../assets/education.svg";
import blueheroimg from "../../../assets/blueheroimg.png";
import { useNavigate } from "react-router-dom";
import announcementPlaceholder from "../../../assets/announcements.svg";
import { useEffect, useState } from "react";

import HeatMap from "../../../components/common/HeatMap/Heatmap.jsx";
import { supabase } from "../../../lib/supabaseClient";
import { fetchDashboardSummary } from "../../../services/citizenApi";
// need to update heatmap

function CitizenHome() {
  const navigate = useNavigate();
  const [mohArea, setMohArea] = useState("Loading...");
  const [caseCount, setCaseCount] = useState(0);
  const [siteCount, setSiteCount] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user?.id) {
          throw new Error("User is not logged in");
        }

        const summary = await fetchDashboardSummary(user.id);

        setMohArea(summary.mohArea || "Not set");
        setCaseCount(summary.caseCount ?? 0);
        setSiteCount(summary.siteCount ?? 0);
      } catch (error) {
        console.error("Failed to load citizen dashboard data:", error.message);
        setMohArea("Unavailable");
        setCaseCount(0);
        setSiteCount(0);
      }
    };

    loadDashboardData();
  }, []);

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
              src={blueheroimg}
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
              <h3>Your MOH Location</h3>
              <h2>{mohArea}</h2>
              <small>Based on reports and weather data</small>
            </div>
          </div>

          <section className="heatmap-sectioncm">
            <div className="risk-legendcm">
              <span className="risk-legend-labelcm">
                <strong>Risk Level:</strong>
              </span>
              <span className="risk-legend-itemscm">
                <span className="legend-dot legend-low">●</span> Low &nbsp;
                <span className="legend-dot legend-moderate">●</span> Moderate
                &nbsp;
                <span className="legend-dot legend-high">●</span> High Risk
              </span>
            </div>

            <HeatMap />
          </section>

          <footer className="data-footercm">
            Data simulated based on Epidemiological Unit reports.
          </footer>
          <div className="statscm">
            <div className="stat-cardcm">
              <h2>{caseCount}</h2>
              <p>Dengue Cases Reported</p>
            </div>

            <div className="stat-cardcm">
              <h2>{siteCount}</h2>
              <p>Breeding Sites Reported</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default CitizenHome;
