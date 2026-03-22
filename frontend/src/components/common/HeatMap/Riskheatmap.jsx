import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Map ML risk score (0-5) to leaflet.heat intensity (0.0 - 1.0)
function scoreToIntensity(score) {
  if (score >= 5) return 1.0;
  if (score >= 3) return 0.6;
  if (score >= 1) return 0.3;
  return null; // score 0 → don't plot
}

const RiskHeatMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      // Trigger backend ML predictions and Supabase upset
      const res = await fetch(`${API_BASE_URL}/api/ml/predict`);
      if (!res.ok) throw new Error("Failed to fetch new predictions.");
      // force re-render and re-fetch of data on map
      setLoading(true);
      setTimestamp(Date.now());
    } catch (err) {
      console.error(err);
      setError("Failed to refresh predictions.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (mapInstance.current) return;

    const initMap = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        // Fetch both data files in parallel - fetching predictions from the backend Supabase endpoint
        const [predictionsRes, coordsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/ml/predictions`),
          fetch("/data/valid_moh_coords.json"),
        ]);
        const predictions = await predictionsRes.json();
        const coords = await coordsRes.json();

        if (!isMounted || !mapRef.current || mapInstance.current) return;

        // Build heatmap points: [lat, lng, intensity]
        const heatPoints = [];
        for (const [moh, score] of Object.entries(predictions)) {
          const intensity = scoreToIntensity(score);
          if (intensity === null) continue; // skip score 0
          const coord = coords[moh];
          if (!coord) continue; // no coordinates for this MOH
          const lat = parseFloat(coord[0]);
          const lng = parseFloat(coord[1]);
          if (isNaN(lat) || isNaN(lng)) continue;
          heatPoints.push([lat, lng, intensity]);
        }

        // Set window.L for leaflet-heat plugin then dynamically import it
        window.L = L;
        await import("leaflet.heat");

        if (!isMounted || !mapRef.current || mapInstance.current) return;

        mapInstance.current = L.map(mapRef.current).setView(
          [7.8731, 80.7718],
          7,
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(mapInstance.current);

        mapInstance.current.whenReady(() => {
          if (!isMounted || !mapInstance.current) return;
          mapInstance.current.invalidateSize();

          L.heatLayer(heatPoints, {
            radius: 35,
            blur: 25,
            maxZoom: 12,
            max: 1.0,
            minOpacity: 0.45,
            gradient: {
              0.0: "#3b82f6",
              0.4: "#22c55e",
              0.65: "#facc15",
              0.85: "#f97316",
              1.0: "#ef4444",
            },
          }).addTo(mapInstance.current);
        });

        if (isMounted) setLoading(false);
      } catch (err) {
        console.error("Failed to load heatmap data:", err);
        if (isMounted) setError("Failed to load risk data. Please try again.");
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [timestamp]);

  return (
    <div className="heatmap-container">
      <div className="heatmap-header-controls">
        <button 
          className="btn-refresh"
          onClick={handleRefresh} 
          disabled={isRefreshing}
        >
          {isRefreshing ? (
             <>
               <span className="spinner-small"></span>
               Predicting...
             </>
          ) : (
            "Refresh Weather & Predict"
          )}
        </button>
      </div>
      <div className="map-wrapper-relative">
        {loading && !error && (
        <div className="overlay-container loading-overlay">
          <div className="spinner-large" />
          <p className="loading-text">Loading risk data…</p>
        </div>
      )}
      {error && (
        <div className="overlay-container error-overlay">
          <p className="error-text">{error}</p>
        </div>
      )}
      <div
        ref={mapRef}
        className="leaflet-map-container"
      />
      </div>
    </div>
  );
};

export default RiskHeatMap;
