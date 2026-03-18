import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

function NavBar({ role = "Citizen" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="navbar-container">
        <header className="navbar">
          <div className="navbar-left">
            <h2 className="logo">DengueGuard</h2>
          </div>

          <button
            type="button"
            className={`navbar-menu-button ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
            {role === "Citizen" ? (
              <>
                <NavLink to="/citizen/home" onClick={closeMenu}>
                  Home
                </NavLink>
                <NavLink to="/citizen/report-sites" onClick={closeMenu}>
                  Report Site
                </NavLink>
                <NavLink to="/citizen/report-cases" onClick={closeMenu}>
                  Report Symptoms
                </NavLink>
                <NavLink to="/citizen/risk-map" onClick={closeMenu}>
                  Risk Heat Map
                </NavLink>
                <NavLink to="/citizen/alerts" onClick={closeMenu}>
                  Alerts
                </NavLink>
                <NavLink to="/citizen/profile" onClick={closeMenu}>
                  Profile
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/moh/dashboard" onClick={closeMenu}>
                  Dashboard
                </NavLink>
                <NavLink to="/moh/site-reports" onClick={closeMenu}>
                  Site Reports
                </NavLink>
                <NavLink to="/moh/case-reports" onClick={closeMenu}>
                  Dengue Case Reports
                </NavLink>
                <NavLink to="/moh/risk-map" onClick={closeMenu}>
                  Risk Heat Map
                </NavLink>
                <NavLink to="/moh/send-announcements" onClick={closeMenu}>
                  Send Announcements
                </NavLink>
              </>
            )}
          </nav>
        </header>
      </div>
    </>
  );
}

export default NavBar;
