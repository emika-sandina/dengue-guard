import { useState, useEffect } from "react"; // to store changing data to update the UI
import { Navigate } from "react-router-dom"; // helps to create navigation links
import NavBar from "../../../components/common/Navbar/NavBar"; // imports the navbar component
import { supabase } from "../../../lib/supabaseClient"; // Supabase client to read current user session
import "./ManageDengueCases.css"; // imports the css file for styling

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

  // On mount: read the logged-in MOH officer's moh_area from Supabase,
  // then fetch only the cases that belong to that division.
  useEffect(() => {
    const initPage = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.error("Could not get current user:", error);
          return;
        }
        // moh_area is stored in user_metadata at signup
        const area = user.user_metadata?.moh_area || null;
        setMohDivision(area);
        fetchCases(area);
      } catch (err) {
        console.error("Error reading user session:", err);
      }
    };
    initPage();
  }, []);

  const fetchCases = async (mohArea) => {
    try {
      // Build the URL – pass the officer's MOH area as a query param so the
      // backend returns only that division's cases.
      const url = mohArea
        ? `http://localhost:5000/api/report-cases?mohArea=${encodeURIComponent(mohArea)}`
        : "http://localhost:5000/api/report-cases";
      console.log("Fetching cases from backend with URL:", url);
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json();
        console.error("Backend returned error:", errData);
        alert("Backend Error: " + (errData.error || "Failed to fetch"));
        return;
      }
      const data = await res.json();
      console.log("Data received from backend:", data);
      
      if (data.cases) {
        const formattedCases = data.cases.map((c) => ({
          id: c.id,
          address: c.location || "Unknown Location",
          time: c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Unknown Time",
          date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "Unknown Date",
          symptoms: Array.isArray(c.symptoms) ? c.symptoms : JSON.parse(c.symptoms || "[]"),
          status: c.status || "pending",
          assignee: c.assignee || null,
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
      await fetch(`http://localhost:5000/api/report-cases/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
      );
    } catch (error) {
      console.error("Error resolving case:", error);
    }
  };

  //function to handle the remove action
  const handleRemove = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to remove this case?")) return;
      await fetch(`http://localhost:5000/api/report-cases/${id}`, { method: "DELETE" });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error removing case:", error);
    }
  };

  //function to handle the verify action
  const handleVerify = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/report-cases/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "verified" }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "verified" } : r))
      );
    } catch (error) {
      console.error("Error verifying case:", error);
    }
  };

  //function to handle the assign action
  const handleAssignPHI = async (id) => {
    const name = prompt("Enter PHI Officer Name:");
    if (name) {
      try {
        await fetch(`http://localhost:5000/api/report-cases/${id}/assign`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignee: name }),
        });
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, assignee: name } : r))
        );
      } catch (error) {
        console.error("Error assigning PHI:", error);
      }
    }
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
                <div key={report.id} className={`mdc-card mdc-card--${report.status}`}>
                  {/* Status badge */}
                  {report.status === "resolved" && (
                    <span className="mdc-badge mdc-badge--resolved">Resolved</span>
                  )}
                  {report.status === "verified" && (
                    <span className="mdc-badge mdc-badge--verified">Verified</span>
                  )}

                  {/* Address */}
                  <div className="mdc-card-address">
                    <span className="mdc-pin">📍</span>
                    <span>{report.address}</span>
                  </div>

                  {/* Time & Date */}
                  <div className="mdc-card-meta">
                    <span>Reported {report.time}</span>
                    <span>{report.date}</span>
                  </div>

                  {/* Symptom Tags */}
                  <div className="mdc-tags">
                    {report.symptoms.map((sym) => (
                      <span key={sym} className="mdc-tag">
                        {sym}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mdc-card-actions">
                    {report.status === "resolved" ? (
                      <>
                        <button
                          className="mdc-btn mdc-btn--resolve"
                          onClick={() => handleResolve(report.id)}
                          disabled
                        >
                          Resolve
                        </button>
                        <button
                          className="mdc-btn mdc-btn--remove"
                          onClick={() => handleRemove(report.id)}
                        >
                          Remove
                        </button>
                        <button className="mdc-btn mdc-btn--assignee" disabled>
                          {report.assignee}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="mdc-btn mdc-btn--verify"
                          onClick={() => handleVerify(report.id)}
                        >
                          Verify
                        </button>
                        <button
                          className="mdc-btn mdc-btn--remove"
                          onClick={() => handleRemove(report.id)}
                        >
                          Remove
                        </button>
                        <button
                          className={`mdc-btn mdc-btn--assign ${report.assignee ? "assigned" : ""}`}
                          onClick={() => handleAssignPHI(report.id)}
                        >
                          {report.assignee ? report.assignee : "Assign PHI"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>  
      </div>
    </div>
  );
}

export default ManageDengueCases;
