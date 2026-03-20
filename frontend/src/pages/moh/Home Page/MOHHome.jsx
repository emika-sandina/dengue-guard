import "./mohHome.css";
import NavBar from "../../../components/common/Navbar/NavBar";
import siteReportIcon from "../../../assets/sitereport.svg";
import symptomIcon from "../../../assets/symptomreport.svg";
import heatmapIcon from "../../../assets/heatmap.svg";
import announcementPlaceholder from "../../../assets/announcements.svg";
import blueheroimg from "../../../assets/blueheroimg.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HeatMap from "../../../components/common/HeatMap/Heatmap";
import { supabase } from "../../../lib/supabaseClient";
import { fetchDashboardSummary } from "../../../services/mohApi";

function MOHHome() {
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
        console.error("Failed to load MOH dashboard data:", error.message);
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
      name: "Site Reports",
      description:
        "View and manage reported mosquito breeding sites submitted by citizens in your area.",
      route: "/moh/site-reports",
    },
    {
      icon: symptomIcon,
      name: "Symptom Reports",
      description:
        "Review dengue symptom reports from citizens and coordinate appropriate responses.",
      route: "/moh/case-reports",
    },
    {
      icon: announcementPlaceholder,
      name: "Communication",
      description:
        "Send alerts, advisories, and announcements to citizens and health teams.",
      route: "/moh/send-announcements",
    },
    {
      icon: heatmapIcon,
      name: "Risk Areas",
      description:
        "Monitor the dengue risk heat map to identify and prioritize high-risk zones.",
      route: "/moh/risk-map",
    },
  ];

  return (
    <>
      <div className="moh-layout">
        <NavBar role="MOH" />
        <br />
        <br />
        <br />
        <main className="main-content">
          <div className="header-section">
            <div>
              <h1 className="header-text">Welcome back</h1>
              <p className="sub-header-text">
                Monitor, manage, and respond to dengue threats in your area.{" "}
                <br />
                Review reports and coordinate action now.
              </p>
            </div>
            <img
              className="heroimg"
              src={blueheroimg}
              alt="Medical officer reviewing dengue reports and coordinating public health response efforts"
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

export default MOHHome;