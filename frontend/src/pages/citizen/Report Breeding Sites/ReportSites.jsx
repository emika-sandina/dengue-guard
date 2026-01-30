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

  //handling submit events
  const handleSubmit = (e) => {
    const formData = {location, description,issueType, urgency, mohArea};
    console.log(formData) //for testing purposes only!
  }

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

            <label>Description</label>
            <textarea
              placeholder="Describe what you saw..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <label>Upload Photo</label>
            <input type="file" value={photo} onChange={handlePhotoUpload} />
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

        <button className="submit-btn" onClick={handleSubmit}>Submit Report</button>
      </main>
    </div>
  );
}

export default ReportSites;
