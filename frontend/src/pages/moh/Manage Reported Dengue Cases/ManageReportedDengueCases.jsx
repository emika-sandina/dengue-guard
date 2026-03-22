import { useState, useEffect } from "react"; // to store changing data to update the UI
import { Navigate } from "react-router-dom"; // helps to create navigation links
import NavBar from "../../../components/common/Navbar/NavBar"; // imports the navbar component
import { supabase } from "../../../lib/supabaseClient"; // Supabase client to read current user session
import "./ManageDengueCases.css"; // imports the css file for styling

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";



//sort option, a list of sorting options for the dropdown
const SORT_OPTIONS = [
  { value: "datetime", label: "Date & Time (Default)" },
  { value: "address", label: "Address (A-Z)" },
  { value: "symptoms", label: "Symptom Count" },
];

//The main function
function ManageDengueCases() {

  // state of all the reports
  const [reports, setReports] = useState([]);
  // state of the search bar
  const [search, setSearch] = useState("");
  // state of the sort option
  const [sortBy, setSortBy] = useState("datetime");
  // state of the sort dropdown
  const [sortOpen, setSortOpen] = useState(false);
  // MOH division of the currently logged-in officer
  const [mohDivision, setMohDivision] = useState(null);
  
  // Modal states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningCaseId, setAssigningCaseId] = useState(null);
  const [phiName, setPhiName] = useState("");

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removingCaseId, setRemovingCaseId] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  

  // On mount: read the logged-in MOH officer's moh_area from Supabase,
  // then fetch only the cases that belong to that division.
  // On mount: read the logged-in MOH officer's data from localStorage (set during professional login),
  // then fetch cases. The backend will automatically filter by the token's MOH area.
  useEffect(() => {
    const initPage = async () => {
      try {
        const userStr = localStorage.getItem('dgUser');
        if (!userStr) {
          console.error("No user data found in localStorage. Redirecting to login...");
          // In a real app, you'd navigate to /login here
          return;
        }

        const user = JSON.parse(userStr);
        const area = user.mohArea || null;
        setMohDivision(area);
        fetchCases(); // Area filtering is now handled by the backend using the JWT
      } catch (err) {
        console.error("Error initializing page:", err);
      }
    };
    initPage();
  }, []);

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('dgToken');
      const url =`${API_BASE_URL}/api/report-cases`;
      
      console.log("Fetching cases from backend with Professional JWT...");
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Backend returned error:", errData);
        if (res.status === 401) alert("Session expired. Please login again.");
        else alert("Backend Error: " + (errData.error || "Failed to fetch"));
        return;
      }
      const data = await res.json();
      console.log("Data received from backend:", data);
      
      if (data.cases) {
// ... (rest of the formatting logic remains same)
        const formattedCases = data.cases.map((c) => ({
          id: c.id,
          address: c.location || "Unknown Location",
          time: c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Unknown Time",
          date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "Unknown Date",
          symptoms: Array.isArray(c.symptoms) ? c.symptoms : JSON.parse(c.symptoms || "[]"),
          status: c.status || "pending",
          assignee: c.assignee || null,
          // Additional fields for details view
          reportingFor: c.reporting_for,
          doctorStatus: c.doctor_status,
          dengueDiagnosis: c.dengue_diagnosis,
          symptomsStartDate: c.symptoms_start_date ? new Date(c.symptoms_start_date).toLocaleDateString() : "Unknown",
        }));
        console.log("Formatted cases for UI:", formattedCases);
        setReports(formattedCases);
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
      alert("Network Error: Could not connect to backend at http://localhost:5000. Please ensure the backend is running.");
    }
  };

  //function to handle the resolve action
  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem('dgToken');
      await fetch(`${API_BASE_URL}/api/report-cases/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "resolved" }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
      );
    } catch (error) {
      console.error("Error resolving case:", error);
    }
  };

  // function to trigger remove confirmation
  const handleRemove = (id) => {
    setRemovingCaseId(id);
    setShowRemoveModal(true);
  };

  // actual remove action
  const confirmRemoval = async () => {
    try {
      const token = localStorage.getItem('dgToken');
      await fetch(`${API_BASE_URL}/api/report-cases/${removingCaseId}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setReports((prev) => prev.filter((r) => r.id !== removingCaseId));
      setShowRemoveModal(false);
      setRemovingCaseId(null);
    } catch (error) {
      console.error("Error removing case:", error);
    }
  };


  //function to handle the assign action - now opens custom modal
  const handleAssignPHI = (id) => {
    setAssigningCaseId(id);
    const report = reports.find(r => r.id === id);
    setPhiName(report?.assignee || "");
    setShowAssignModal(true);
  };

  const confirmAssignment = async () => {
    if (!phiName.trim()) {
      alert("Please enter a PHI name");
      return;
    }

    try {
      const token = localStorage.getItem('dgToken');
      await fetch(`${API_BASE_URL}/api/report-cases/${assigningCaseId}/assign`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ assignee: phiName }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === assigningCaseId ? { ...r, assignee: phiName } : r))
      );
      setShowAssignModal(false);
      setAssigningCaseId(null);
      setPhiName("");
    } catch (error) {
      console.error("Error assigning PHI:", error);
    }
  };

  const handleOpenDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  //function to filter the reports based on the search bar
  const filtered = reports
    .filter(
      (r) =>
        r.address.toLowerCase().includes(search.toLowerCase()) ||
        r.symptoms.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    )

    //function to sort the reports based on the sort option
    .sort((a, b) => {
      if (sortBy === "address") return a.address.localeCompare(b.address);
      if (sortBy === "symptoms") return b.symptoms.length - a.symptoms.length;
      // Default: newest date first (already newest-first in data)
      return 0;
    });
  return (
    <div className="manage-dengue-cases-page">
      <NavBar role="MOH"/>

      <div className="manage-dengue-cases-body">
        {/* ── Main Content ── */}
        <main className="mdc-main">
          <h1 className="mdc-title">
            Reports on Symptoms
            {mohDivision && (
              <span className="mdc-division-badge"> — {mohDivision} Division</span>
            )}
          </h1>
          
          {/* Search & Sort row */}
          <div className="mdc-controls">
            <input
              className="mdc-search"
              type="text"
              placeholder="Search by KeyWord"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="mdc-sort-wrapper">
              <button
                className="mdc-sort-btn"
                onClick={() => setSortOpen((o) => !o)}
              >
                Sort By:{" "}
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                <span className="mdc-sort-arrow">▾</span>
              </button>
              {sortOpen && (
                <ul className="mdc-sort-dropdown">
                  {SORT_OPTIONS.map((opt) => (
                    <li
                      key={opt.value}
                      className={sortBy === opt.value ? "selected" : ""}
                      onClick={() => {
                        setSortBy(opt.value);
                        setSortOpen(false);
                      }}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Report Cards Grid */}
          <div className="mdc-cards-container">
            <div className="mdc-cards-grid">
              {filtered.length === 0 && (
                <p className="mdc-empty">No reports found.</p>
              )}
              {filtered.map((report) => (
                <div key={report.id} className={`mdc-card mdc-card--${report.status}`} onClick={() => handleOpenDetails(report)}>
                  {/* Status badge */}
                  {report.status === "resolved" && (
                    <span className="mdc-badge mdc-badge--resolved">Resolved</span>
                  )}

                  {/* Header: Address */}
                  <div className="mdc-card-header">
                    <span className="mdc-pin">📍</span>
                    <span className="mdc-card-address-text">{report.address}</span>
                  </div>

                  <div className="mdc-card-content">
                    {/* Time & Date */}
                    <div className="mdc-card-info">
                      <span>Reported {report.time}</span>
                      <span>{report.date}</span>
                    </div>

                    {/* Dengue Diagnosis Row */}
                    <div className={`mdc-card-diagnosis ${report.dengueDiagnosis === 'Yes' ? 'mdc-card-diagnosis--yes' : 'mdc-card-diagnosis--no'}`}>
                       The patient diagnosed with Dengue : 
                       <span className={`mdc-diagnosis-status ${report.dengueDiagnosis === 'Yes' ? 'yes' : 'no'}`}>
                          {report.dengueDiagnosis === 'Yes' ? ' yes' : ' no'}
                       </span>
                    </div>

                    {/* Assignee Pill */}
                    <div className="mdc-assignee-row">
                      <button 
                         className={`mdc-assignee-pill ${report.assignee ? "assigned" : ""}`}
                         onClick={(e) => {
                           e.stopPropagation();
                           if (report.status === 'resolved') return;
                           handleAssignPHI(report.id);
                         }}
                         disabled={report.status === 'resolved'}
                      >
                        {report.assignee ? `Assigned PHI : ${report.assignee}` : "Assign PHI Agent"}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="mdc-card-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="mdc-btn mdc-btn--resolve"
                        onClick={() => handleResolve(report.id)}
                        disabled={report.status === "resolved"}
                      >
                        Resolve
                      </button>
                      <button
                        className="mdc-btn mdc-btn--remove"
                        onClick={() => handleRemove(report.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>  
      </div>
      {/* ── Assign PHI Modal ── */}
      {showAssignModal && (
        <div className="mdc-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="mdc-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="mdc-modal-title">Assign PHI Officer</h2>
            <p className="mdc-modal-subtitle">Enter the name of the PHI officer to assign to this case.</p>
            <input 
              type="text" 
              className="mdc-modal-input" 
              placeholder="PHI Officer Name"
              value={phiName}
              onChange={(e) => setPhiName(e.target.value)}
              autoFocus
            />
            <div className="mdc-modal-actions">
              <button className="mdc-modal-btn mdc-modal-btn--cancel" onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
              <button className="mdc-modal-btn mdc-modal-btn--confirm" onClick={confirmAssignment}>
                Assign Officer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Remove Report Modal ── */}
      {showRemoveModal && (
        <div className="mdc-modal-overlay" onClick={() => setShowRemoveModal(false)}>
          <div className="mdc-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="mdc-modal-title">Remove Report?</h2>
            <p className="mdc-modal-subtitle">Are you sure you want to remove this dengue case report? This action cannot be undone.</p>
            <div className="mdc-modal-actions">
              <button className="mdc-modal-btn mdc-modal-btn--cancel" onClick={() => setShowRemoveModal(false)}>
                Cancel
              </button>
              <button className="mdc-modal-btn mdc-modal-btn--confirm mdc-modal-btn--danger" onClick={confirmRemoval}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Details Modal ── */}
      {showDetailsModal && selectedReport && (
        <div className="mdc-modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="mdc-modal-content mdc-modal-content--large" onClick={(e) => e.stopPropagation()}>
            <h2 className="mdc-modal-title">Patient Case Details</h2>
            <div className="mdc-details-grid">
               <div className="mdc-detail-item">
                  <label>Reporting For:</label>
                  <span>{selectedReport.reportingFor}</span>
               </div>
               <div className="mdc-detail-item">
                  <label>Symptoms Start Date:</label>
                  <span>{selectedReport.symptomsStartDate}</span>
               </div>
               <div className="mdc-detail-item">
                  <label>Consulted a Doctor:</label>
                  <span>{selectedReport.doctorStatus}</span>
               </div>
               <div className="mdc-detail-item">
                  <label>Dengue Diagnosis:</label>
                  <span>{selectedReport.dengueDiagnosis}</span>
               </div>
               <div className="mdc-detail-item mdc-detail-item--full">
                  <label>Location:</label>
                  <span>{selectedReport.address}</span>
               </div>
               <div className="mdc-detail-item mdc-detail-item--full">
                  <label>Reported Symptoms:</label>
                  <div className="mdc-details-tags">
                    {selectedReport.symptoms.map(s => <span key={s} className="mdc-details-tag">{s}</span>)}
                  </div>
               </div>
            </div>
            <div className="mdc-modal-actions">
              <button className="mdc-modal-btn mdc-modal-btn--confirm" onClick={() => setShowDetailsModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDengueCases;
