import NavBar from "../../../components/common/Navbar/NavBar";
import "./reportsites.css";
import { useState } from "react";
import { mohAreas } from "../../../services/mohAreas";

function ReportSites() {
  //array for certain issue types
  const issueTypes = [
    "Standing Water",
    "Water Containers",
    "Construction Site",
    "Tire Collection",
    "Blocked Drains",
    "Other",
  ];

  //state variables
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [issueType, setIssueType] = useState("");
  const [urgency, setUrgency] = useState("Low");
  const [mohArea, setMohArea] = useState("");

  //handling file uploads
  const handlePhotoUpload = (e) => {
    setPhoto(e.target.files[0]);
  };

  const getCurrentLocation = () => {
    //checks whether the current browser supports geolocation
    if (!navigator.geolocation) {
      //if not supported, it displays an error to the user
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      //if the user allows access to his/her current location this block of code runs
      (position) => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude);
      },
      //this code block runs if the user denies permission
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      },
    );
  };
  //converts co-ordinates into a human readable address
  const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

    try {
      //sends an http req to openstreetmap and the response is converted to a JS Object from JSON
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      const address = data.display_name;
      setLocation(address);
      //if the api/network is down
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };
  //handling submit events
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Basic Validation from the frontend
    if (!location || !issueType || !mohArea) {
      alert("Please fill in the required fields!");
      return;
    }

    //Prepare the data for the backend
    const formData = { 
      location, 
      description, 
      issueType, 
      urgency, 
      mohArea,
      photoUrl: "" 
    };

    try {
      //POST request to the express server
      const response = await fetch("http://localhost:5000/api/report-sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Success: " + result.message);
        //Reset form on success
        setLocation("");
        setDescription("");
        setPhoto(null);
        setIssueType(issueTypes[0]);
        setUrgency("Low");
        setMohArea(mohAreas[0]);
      } 
      
      else {
        alert("Error: " + result.error);
      }
    }

    catch (error) {
      alert("Could not connect to the backend server!, Check if your backend is running or not!");
    }

  };

  return (
    <div className="sitereport-layout">
      <NavBar role="Citizen" />

      <main className="main-content">
        <h2 className="page-title">Report Dengue Breeding Sites</h2>

        <div className="report-card">
          {/* LEFT SIDE */}
          <div className="sitereport-left">
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter address or use GPS"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <span className="location-link" onClick={getCurrentLocation}>
              Get Current Location
            </span>

            <label>Description</label>
            <textarea
              placeholder="Describe what you saw..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <label>Upload Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          </div>

          {/* RIGHT SIDE */}
          <div className="sitereport-right">
            <label>Issue Type</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              {issueTypes.map((issue, index) => (
                <option key={index}>{issue}</option>
              ))}
            </select>

            <label>Select MOH Area</label>
            <select
              value={mohArea}
              onChange={(e) => setMohArea(e.target.value)}
            >
              {mohAreas.map((mohArea, index) => (
                <option>{mohArea}</option>
              ))}
            </select>

            <label>Urgency Level</label>
            <div className="urgency-buttons">
              {["Low", "Medium", "High"].map((level) => (
                <button
                  key={level}
                  className={`urgency-btn ${urgency === level ? level.toLowerCase() : ""}`}
                  onClick={() => setUrgency(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Report
        </button>
      </main>
    </div>
  );
}

export default ReportSites;
