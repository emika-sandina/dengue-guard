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

  useEffect(() => {
    let isMounted = true;
    if (mapInstance.current) return;

    const initMap = async () => {
      try {
        // Fetch both data files in parallel
        const [predictionsRes, coordsRes] = await Promise.all([
          fetch("/data/predictions.json"),
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
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "550px" }}>
      {loading && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f1f5f9",
            borderRadius: "16px",
            zIndex: 10,
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
            Loading risk data…
          </p>
        </div>
      )}
      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fef2f2",
            borderRadius: "16px",
            zIndex: 10,
          }}
        >
          <p style={{ color: "#ef4444", margin: 0 }}>{error}</p>
        </div>
      )}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "16px",
          boxShadow:
            "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
          zIndex: 0,
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default RiskHeatMap;
