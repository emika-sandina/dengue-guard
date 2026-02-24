import { useNavigate } from "react-router-dom";
import "./mohHome.css";
import NavBar from "../../../components/common/Navbar/NavBar";
import siteReportIcon from "../../../assets/sitereport.svg";
import symptomIcon from "../../../assets/symptomreport.svg";
import heatmapIcon from "../../../assets/heatmap.svg";
import announcementPlaceholder from "../../../assets/announcements.svg";

function MOHHome() {
  const navigate = useNavigate();

  const menu = [
    {
      icon: siteReportIcon,
      name: "Site Reports",
      description: "View Reports on Breeding Sites",
      route: "/moh/site-reports",
    },
    {
      icon: symptomIcon,
      name: "Symptom Reports",
      description: "View Reports on Dengue Symptoms",
      route: "/moh/manage-cases",
    },
    {
      icon: announcementPlaceholder,
      name: "Communication",
      description: "Send Alerts and Messages",
      route: "/moh/send-announcements",
    },
    {
      icon: heatmapIcon,
      name: "Risk Areas",
      description: "View Heatmap",
      route: "/moh/statistics",
    },
  ];

  return (
    <>
    <div className="moh-layout">
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
            <div
              className="card"
              key={index}
              onClick={() => navigate(menuOption.route)}
            >
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

export default MOHHome;
