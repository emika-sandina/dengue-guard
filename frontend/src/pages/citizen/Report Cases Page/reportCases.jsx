import { useState } from "react";
import Dropdown from "./Dropdown";
import "./reportCases.css"
import NavBar from "../../../components/common/Navbar/NavBar";

function ReportCases() {
  const [mohArea, setmohArea] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [doctorStatus, setDoctorStatus] = useState("");
  const [location, setLocation] = useState("");


  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSymptoms((prev) =>
      prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value]
    );
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      }
    );
  };

  const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      const address = data.display_name;
      setLocation(address);
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      district,
      symptoms,
      doctorStatus
    };

    console.log("Form Data:", data);
  };

  return (
    <>
    <NavBar></NavBar>
    <div className="report-container">
    <br/>
    <br/>
    <br/>

      <h1>Reporting Dengue Cases</h1>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-left">
            <div className="form-group">
            <label>Reporting For</label><br />
            <input type="text" placeholder="Myself, Family, Friend" />
            </div>


            <div className="form-group">
            <label>When did symptoms start:</label><br />
            <input type="date" />
            </div>

            <label>Symptoms (Check all that apply)</label><br />

            <div className="form-group checkbox-group">

            {[
                "High Fever",
                "Headache",
                "Muscle/Joint Pain",
                "Nausea/Vomiting",
                "Skin Rash",
                "Pain Behind Eyes"
            ].map((symptom) => (
                <label key={symptom}>
                <input
                    type="checkbox"
                    value={symptom}
                    onChange={handleCheckboxChange}
                />
                {symptom}
                <br />
                </label>
            ))}
            </div>
        </div>

        <div className="form-right">
            <div className="form-group">
            <label>Location / Address of the Patient</label><br />
            <input
                type="text"
                placeholder="Enter current location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />

                <span className="location-link" onClick={getCurrentLocation}>
                Get Current Location
                </span>
            </div>
            <label>Have you / patient seen a doctor?</label><br />

            <div className="form-group radio-group">

            {["Yes", "No", "Planning"].map((option) => (
                <label key={option}>
                <input
                    type="radio"
                    name="doctorStatus"
                    value={option}
                    onChange={(e) => setDoctorStatus(e.target.value)}
                />
                {option}
                <br />
                </label>
            ))}
            </div>

            <label>If yes, is the patient diagnosed with Dengue?</label><br />

            <div className="form-group radio-group">

            {["Yes", "No"].map((option) => (
                <label key={option}>
                <input
                    type="radio"
                    name="doctorStatus"
                    value={option}
                    onChange={(e) => setDoctorStatus(e.target.value)}
                />
                {option}
                <br />
                </label>
            ))}
            </div>

            <div className="form-group dropdown">
            <label>Select MOH Area</label><br />
            <Dropdown value={mohArea} onChange={setmohArea} />
            </div>
        </div>


      </form>
      
        <button type="submit">Report Case</button>
    </div>
    </>
  );
}

export default ReportCases;