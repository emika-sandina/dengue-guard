import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const HeatMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const patientLayerRef = useRef(null);
  const breedingLayerRef = useRef(null);

  const [patients, setPatients] = useState([]);
  const [breedingSites, setBreedingSites] = useState([]);

  // Initialize map + layers
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    mapInstance.current = L.map(mapRef.current).setView(
      [7.8731, 80.7718],
      7
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    // Create layers AFTER map exists
    patientLayerRef.current = L.layerGroup().addTo(mapInstance.current);
    breedingLayerRef.current = L.layerGroup().addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/report-case/data"
        );
        const data = await res.json();

        const patientArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setPatients(patientArray);
      } catch (err) {
        console.error("Failed to fetch patient locations:", err);
        setPatients([]);
      }
    };

    fetchPatients();
    const interval = setInterval(fetchPatients, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch breeding sites
  useEffect(() => {
    const fetchBreedingSites = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/report-sites/data"
        );
        const data = await res.json();

        setBreedingSites(data);
      } catch (err) {
        console.error("Failed to fetch breeding sites:", err);
        setBreedingSites([]);
      }
    };

    fetchBreedingSites();
    const interval = setInterval(fetchBreedingSites, 5000);
    return () => clearInterval(interval);
  }, []);

  // Add patient markers
  useEffect(() => {
    if (!mapInstance.current || !patientLayerRef.current) return;

    patientLayerRef.current.clearLayers();

    patients.forEach(({ coordinates}) => {
      if (!coordinates) return;

      const { lat, lng } = coordinates;

      L.marker([lat, lng], {
        icon: L.divIcon({
          className: "",
          html: '<div style="font-size: 20px;">😷</div>',
          iconSize: [30, 30],
          popupAnchor: [0, -15],
        }),
      })
        .addTo(patientLayerRef.current)
        
    });
  }, [patients]);

  // Add breeding site markers
  useEffect(() => {
    if (!mapInstance.current || !breedingLayerRef.current) return;

    breedingLayerRef.current.clearLayers();

    breedingSites.forEach(({ latitude, longtitude, location }) => {
      if (latitude == null || longtitude == null) return;

      L.marker([latitude, longtitude], {
        icon: L.divIcon({
          className: "",
          html: '<div style="font-size: 20px;">🦟</div>',
          iconSize: [30, 30],
          popupAnchor: [0, -15],
        }),
      })
        .addTo(breedingLayerRef.current)
    });
  }, [breedingSites]);

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