import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

// Dummy data simulating high-risk dengue clusters in Sri Lanka
// Format: [lat, lng, intensity] - intensity is 0 to 1
const dengueRiskPoints = [
  // --- COLOMBO CLUSTER (High Density) ---
  [6.9271, 79.8612, 0.9],
  [6.9371, 79.8512, 0.8],
  [6.9171, 79.8712, 0.7],
  [6.8912, 79.8821, 0.9],
  [6.8521, 79.8642, 0.6],
  [6.95, 79.9, 0.5],

  // --- GAMPAHA CLUSTER ---
  [7.084, 80.0098, 0.8],
  [7.094, 80.0198, 0.7],
  [7.074, 79.9998, 0.6],

  // --- KANDY CLUSTER ---
  [7.2906, 80.6337, 0.8],
  [7.3006, 80.6437, 0.7],
  [7.2806, 80.6237, 0.5],

  // --- JAFFNA CLUSTER ---
  [9.6615, 80.0255, 0.7],
  [9.6715, 80.0355, 0.6],
  [9.6515, 80.0155, 0.5],

  // --- RATNAPURA/KALUTARA ---
  [6.6828, 80.3992, 0.6],
  [6.5854, 79.9607, 0.5],

  // Scattered moderate points across the island
  [7.4863, 80.3623, 0.3],
  [8.3114, 80.4037, 0.4],
  [6.0535, 80.221, 0.4],
];
// Breeding site locations (static for now)
const breedingSites = [
  [6.930, 79.860],
  [7.085, 80.010],
  [7.295, 80.640],
];

const HeatMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [patients, setPatients] = useState([]); // fetched patient locations

  useEffect(() => {
    // Fetch patient locations from backend
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/report-case");
        const data = await res.json();
        setPatients(data); // store patient reports
      } catch (err) {
        console.error("Failed to fetch patient locations:", err);
      }
    };

    fetchPatients();
  }, []);


  useEffect(() => {
    if (mapInstance.current) return;

    // Set view centered on Sri Lanka
    mapInstance.current = L.map(mapRef.current).setView([7.8731, 80.7718], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    // Add Heat Layer
    L.heatLayer(dengueRiskPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: { 0.4: "blue", 0.65: "lime", 1: "red" }, // Custom colors for risk
    }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    />
  );
};

export default HeatMap;
