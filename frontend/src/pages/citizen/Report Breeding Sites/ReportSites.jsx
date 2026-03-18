import NavBar from "../../../components/common/Navbar/NavBar";
import "./reportsites.css";
import { useState } from "react";
import Dropdown from "../../../components/common/Dropdown/Dropdown";

function ReportSites() {
  //array for certain issue types
  const issueTypes = [
    "Select the type of the issue",
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
  const [mohArea, setMohArea] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [popUpType, setPopUpType] = useState("");

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

    // Basic validation
    if (!location || !issueType || !mohArea || issueType === issueTypes[0]) {
      setPopUpMessage("Please fill in all required fields before submitting.");
      setPopUpType("error");
      setShowPopUp(true);
      return;
    }

    //Create FormData object (important for file uploads)
    const formData = new FormData();

    //Append text fields
    formData.append("location", location);
    formData.append("description", description);
    formData.append("issueType", issueType);
    formData.append("urgency", urgency);
    formData.append("mohArea", mohArea.value || mohArea.label);

    // Append image file (if selected)
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch("http://localhost:5000/api/report-sites", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        //Show the popup with the successfull report submission msg
        setPopUpMessage(result.message || "Report Submitted Successfully!");
        setPopUpType("success");
        setShowPopUp(true);
        // Reset form upon succesful upload
        setLocation("");
        setDescription("");
        setPhoto(null);
        setIssueType(issueTypes[0]);
        setUrgency("Low");
        setMohArea(null);
      } else {
        setPopUpMessage(result.error || "Failed to submit the report!");
        setPopUpType("error");
        setShowPopUp(true);
      }
    } catch (error) {
      alert("Could not connect to Network!");
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
              required
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
              required
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
              required
            >
              {issueTypes.map((issue, index) => (
                <option key={index}>{issue}</option>
              ))}
            </select>

            <label>Select MOH Area</label>
            <Dropdown value={mohArea} onChange={setMohArea} />

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

      {showPopUp && (
        <div className="popup-overlay">
          <div className={`popup-box ${popUpType}`}>
            <h1>{popUpType === "success" ? "✅" : "❌"}</h1>
            <h3>{popUpType === "success" ? "Success" : "Error"}</h3>
            <p>{popUpMessage}</p>

            <button
              onClick={() => setShowPopUp(false)}
              className="popup-close-btn"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportSites;
