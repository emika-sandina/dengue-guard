import { useState } from "react";
import Dropdown from "./Dropdown";
import "./reportCases.css"
import NavBar from "../../../components/common/Navbar/NavBar";

function ReportCases() {

  //State Variables
  const [mohArea, setmohArea] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [doctorStatus, setdoctorStatus] = useState("");
  const [dengueDiagnosis, setdengueDiagnosis] = useState("");
  const [location, setLocation] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [popUpType, setPopUpType] = useState("");


  //Handles checkbox selection
  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSymptoms((prev) =>
      prev.includes(value)
    //Add symptoms if not selected removes if already selected
        ? prev.filter((s) => s !== value)
        : [...prev, value]
    );
  };

  //Get users current GPS Location from the browser
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        //Converts coordinates into readable address
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      }
    );
  };

  // Converts latitude & longitude into a readable address
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
  
  //Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportingFor = e.target[0].value;
    const symptomsStartDate = e.target[1].value;

    //Build data object to send to backend
    const data = {
      reportingFor,
      symptoms,
      doctorStatus,
      dengueDiagnosis,
      mohArea,
      location,
      symptomsStartDate,
    };
      //Validation
  if (
    !reportingFor ||
    symptoms.length === 0 ||
    !doctorStatus ||
    !dengueDiagnosis ||
    !mohArea ||
    !location ||
    !symptomsStartDate
  ) {
    setPopUpMessage("Please fill in all required fields before submitting.");
    setPopUpType("error");
    setShowPopUp(true);
    return;
  }



    try {
      //send a post request to backend api
      const response = await fetch("http://localhost:5000/api/report-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      //read raw response text
      const text = await response.text();
      let result = {};

      //parse only if response has a body
      if (text) {
        try {
          result = JSON.parse(text);
        } catch (err) {
          console.error("Failed to parse JSON response:", err);
          throw new Error("Invalid response from server");
        }
      }

      //sends an alert if backend results a error message
      if (!response.ok) {
        setPopUpMessage("Failed to submit the report.");
        setPopUpType("error");
        setShowPopUp(true);
        return;
      }

      //success case
      setPopUpMessage("Report submitted successfully");
      setPopUpType("success");
      setShowPopUp(true);
      console.log(result);

    // catch any errors
    } catch (error) {
      console.error("Submit error:", error);
      setPopUpMessage("Failed to submit the report:"+ error.message);
      setPopUpType("error");
      setShowPopUp(true);
    }
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
                    onChange={(e) => setdoctorStatus(e.target.value)}
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
                    name="dengueDiagnosis"
                    value={option}
                    onChange={(e) => setdengueDiagnosis(e.target.value)}
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

        <button type="submit">Report Case</button>
      </form>
    </div>
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
    </>
  );
}

export default ReportCases;