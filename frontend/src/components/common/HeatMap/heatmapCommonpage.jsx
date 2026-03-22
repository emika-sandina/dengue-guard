import React from "react";
import RiskHeatMap from "./Riskheatmap";
import NavBar from "../Navbar/NavBar";
import "./riskmapcss.css";

function HeatmapCommonPage({ role }) {
  return (
    <div className="heatmap-page-wrapper">
      <NavBar role={role} />
      <div className="app-container">
        <header className="app-header">
          <h1>Dengue Risk Map</h1>
          <p>
            A real-time heatmap visualization of high-risk dengue clusters across
            Sri Lanka. Use Dengue Guard to identify safe and high-risk zones.
          </p>
        </header>
        <main className="app-main">
          <div className="map-section">
            <RiskHeatMap />
          </div>

          <aside className="info-section">
            <div className="info-card">
              <h2>Understanding the Map</h2>
              <p>
                The map uses color gradients to indicate the density and severity
                of reported dengue cases:
              </p>
              <ul className="legend">
                <li>
                  <span className="color-box red"></span>{" "}
                  <div>
                    <strong>Critical Risk</strong>
                    <p>Highly concentrated outbreaks and very severe areas.</p>
                  </div>
                </li>
                <li>
                  <span className="color-box orange"></span>{" "}
                  <div>
                    <strong>High Risk</strong>
                    <p>Elevated density and frequent dengue outbreaks.</p>
                  </div>
                </li>
                <li>
                  <span className="color-box yellow"></span>{" "}
                  <div>
                    <strong>Moderate Risk</strong>
                    <p>Potential breeding activity and suspected cases.</p>
                  </div>
                </li>
                <li>
                  <span className="color-box green"></span>{" "}
                  <div>
                    <strong>Low Risk</strong>
                    <p>Stable conditions with minimal reports.</p>
                  </div>
                </li>
                <li>
                  <span className="color-box blue"></span>{" "}
                  <div>
                    <strong>Minimal Risk</strong>
                    <p>Safe zones with almost zero reported cases.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="info-card">
              <h2>Pro Tips</h2>
              <p>
                Stay safe by checking the risk map before traveling. Ensure your surroundings are clear of stagnant water to prevent dengue vector breeding. Use insect repellents when in moderate or high-risk zones.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}


export default HeatmapCommonPage;
