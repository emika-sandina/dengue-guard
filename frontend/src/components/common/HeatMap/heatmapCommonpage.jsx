import React from "react";
import RiskHeatMap from "./Riskheatmap";

function HeatmapCommonPage() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sri Lanka Dengue Risk Map</h1>
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
          <div className="card">
            <h2>Understanding the Map</h2>
            <p>
              The map uses color gradients to indicate the density and severity
              of reported dengue cases:
            </p>
            <ul className="legend">
              <li>
                <span className="color-box red"></span>{" "}
                <strong>High Risk (Red):</strong>{" "}
              </li>
              <li>
                <span className="color-box lime"></span>{" "}
                <strong>Moderate Risk (Lime):</strong>{" "}
              </li>
              <li>
                <span className="color-box blue"></span>{" "}
                <strong>Low Risk (Blue):</strong>{" "}
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default HeatmapCommonPage;
