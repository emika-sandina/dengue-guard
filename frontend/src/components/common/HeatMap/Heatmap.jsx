import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";



const HeatMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [patients, setPatients] = useState([]); // fetched patient locations
  const [breedingSites, setBreedingSites] = useState([]);

  //Fetch patient location
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/report-case/data"); // backend endpoint
        const data = await res.json();
  
        // Ensure patients is always an array
        const patientArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
  
        setPatients(patientArray);
      } catch (err) {
        console.error("Failed to fetch patient locations:", err);
        setPatients([]); // fallback to empty array
      }
    };
  
    fetchPatients(); 
    const interval = setInterval(fetchPatients, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

    // Fetch breeding sites location
    useEffect(() => {
      const fetchBreedingSites = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/report-sites/data");// backend endpoint

          const data = await res.json();

          
          setBreedingSites(data);
        } catch (err) {
          console.error("Failed to fetch breeding sites:", err);
          setBreedingSites([]);
        }
      };
  
      fetchBreedingSites();
      const interval = setInterval(fetchBreedingSites, 5000); // refresh every 5 seconds
      return () => clearInterval(interval);
    }, []);

  useEffect(() => {
    if (mapInstance.current) return;
    if (!mapRef.current) return;

    // Set view centered on Sri Lanka
    mapInstance.current = L.map(mapRef.current).setView([7.8731, 80.7718], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);
  // Add patient markers 
    useEffect(() => {
      if (!mapInstance.current) return;
    
      patients.forEach(({ coordinates, name }) => {
        if (!coordinates) return;// skip if coordinates missing
        const { lat, lng } = coordinates;
    
        // Add a custom marker with an emoji
        L.marker([lat, lng], {
          icon: L.divIcon({
            className: "",
            html: `<div style="font-size: 20px;">😷</div>`,// Add a custom marker with an emoji
            iconSize: [30, 30],
            popupAnchor: [0, -15],
          }),
        })
          .addTo(mapInstance.current)
          .bindPopup(`Patient: ${name || "Unknown"}`);
      });
    }, [patients]);

    // Add breeding site markers
    useEffect(() => {
      if (!mapInstance.current) return;
  
      breedingSites.forEach(({ latitude, longtitude, location }) => {
        if (latitude == null || longtitude == null) return;
  
        L.marker([latitude, longtitude], {
          icon: L.divIcon({
            className: "",
            html:  `<div style="font-size: 20px;">🦟</div>`,// emoji representing mosquito breeding site
            iconSize: [30, 30],
            popupAnchor: [0, -15],
          }),
        })
          .addTo(mapInstance.current)
          .bindPopup(`Breeding Site: ${location || "Unknown"}`);
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