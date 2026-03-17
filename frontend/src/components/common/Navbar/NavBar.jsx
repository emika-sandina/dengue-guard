import { NavLink } from "react-router-dom";
import "./navbar.css";

function NavBar({ role = "Citizen" }) {
  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <h2 className="logo">DengueGuard</h2>
        </div>

        <nav className="navbar-links">
          {role === "Citizen" ? (
            <>
              <NavLink to="/citizen/home">Home</NavLink>
              <NavLink to="/citizen/report-sites">Report Site</NavLink>
              <NavLink to="/citizen/report-cases">Report Symptoms</NavLink>
              <NavLink to="/citizen/risk-map">Risk Heat Map</NavLink>
              <NavLink to="/citizen/alerts">Alerts</NavLink>
              <NavLink to="/citizen/profile">Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/moh/dashboard">Dashboard</NavLink>
              <NavLink to="/moh/site-reports">Site Reports</NavLink>
              <NavLink to="/moh/case-reports">Dengue Case Reports</NavLink>
              <NavLink to="/moh/risk-map">Risk Heat Map</NavLink>
              <NavLink to="/moh/send-announcements">Send Announcements</NavLink>
            </>
          )}
        </nav>
      </header>
    </>
  );
}

export default NavBar;
