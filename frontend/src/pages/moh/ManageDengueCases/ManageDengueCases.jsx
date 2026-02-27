import { useState } from "react";//to store changing data to update the UI
import {Navigate} from "react-router-dom";// helps to create navigation links
import NavBar from "../../../components/common/Navbar/NavBar";// imports the navbar component
import "./ManageDengueCases.css";// imports the css file for styling

//initial reports(fake database) for starting data
const initialReports = [
  {
    id: 1,
    address: "42/22, Walawwa Road, Homagama",
    time: "08:25 AM",
    date: "20/10/2025",
    symptoms: ["High Fever"],
    status: "resolved",
    assignee: "Mr.Rohan Perera",
  },
  {
    id: 2,
    address: "No.51, Horana Road, Kottawa",
    time: "09:35 AM",
    date: "18/10/2025",
    symptoms: ["High Pain"],
    status: "pending",
    assignee: null,
  },
  {
    id: 3,
    address: "No.65, Padukka Road, Meegoda",
    time: "10:45 AM",
    date: "16/10/2025",
    symptoms: ["Headache", "Body Ache"],
    status: "pending",
    assignee: null,
  },
  {
    id: 4,
    address: "No.12, Galle Road, Moratuwa",
    time: "11:00 AM",
    date: "15/10/2025",
    symptoms: ["High Fever", "Rash"],
    status: "pending",
    assignee: null,
  },
];

//sort option, a list of sorting options for the dropdown
const SORT_OPTIONS = [
  { value: "datetime", label: "Date & Time (Default)" },
  { value: "address", label: "Address (A-Z)" },
  { value: "symptoms", label: "Symptom Count" },
];

//The main function
function ManageDengueCases() {

  // state of all the reports
  const [reports, setReports] = useState(initialReports);
  // state of the search bar
  const [search, setSearch] = useState("");
  // state of the sort option
  const [sortBy, setSortBy] = useState("datetime");
  // state of the sort dropdown
  const [sortOpen, setSortOpen] = useState(false);

  //function to handle the resolve action
  const handleResolve = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
    );
  };

  //function to handle the remove action
  const handleRemove = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  //function to handle the verify action
  const handleVerify = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "verified" } : r))
    );
  };

  //function to handle the assign action
  const handleAssignPHI = (id) => {
    const name = prompt("Enter PHI Officer Name:");
    if (name) {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, assignee: name } : r))
      );
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
          <h1 className="mdc-title">Reports on Symptoms</h1>
          
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
