// front-end of the MOH side manage  report sites
import "./manageReportSites.css";
import NavBar from "../../../components/common/Navbar/NavBar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SORT_OPTIONS = [
  { value: "datetime", label: "Date & Time (Default)" },
  { value: "priority", label: "Priority" },
  { value: "resolved", label: "Resolved" },
];

// To handle displaying different levels of urgency
const Priority = (urgency) => {
  if (!urgency) return "";
  const level = urgency.toLowerCase();
  if (level === "high") return "priority-high";
  if (level === "medium") return "priority-medium";
  if (level === "low") return "priority-low";
};

// displaying breeding side data
const ManageReport = () => {
  const [sites, setSites] = useState([]); // inistialies an empty array (useState([])) to ensure that program doesn't crash till useEffect fills it with data from the API

  const [showSiteDetailsModal, setSiteDetailsModal] = useState(false);
  const [selectedSite, setSeletectedSite] = useState(null);
  const [expand, setExpand] = useState(false);
  const [showPopup, setShowPopUp] = useState(false);
  const [popupMessage, setPopUpMessage] = useState("");
  const [popUpType, setPopUpType] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState("");
  const [caseId, setCaseId] = useState(null);
  const [assginPhi, setAssignPhi] = useState("");
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("datetime");
  const [sortOption, setSortOption] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBreedingSites = async () => {
      try {
        // token that is saved in the localStorage
        const token = localStorage.getItem("dgToken");

        if (!token) {
          console.error("No token found in local storage");
          navigate("/");
          return;
        }

        // fetch data from the Express API
        const response = await fetch("http://localhost:5000/api/site-reports", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // catch any network errors here
        if (!response.ok) {
          throw new Error("Failed to fetch data from server");
        }

        // converts raw data to JSON object
        const data = await response.json();

        const formattedSites = (data.filteredSites || []).map((site) => ({
          ...site, // to only make changes to time and date
          time: new Date(site.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(site.created_at).toLocaleDateString(),
        }));

        setSites(formattedSites); // if there is no data it will send an empty array
      } catch (error) {
        console.error("Fetch error message: " + error.message);
      }
    };
    loadBreedingSites();
  }, []);

  // function to remove a site report
  const handleRemove = async (e, siteId) => {
    // to block the row click
    e.stopPropagation();
    setPendingDeleteId(siteId);
    setSiteDetailsModal(false); // close the modal
    setShowConfirmPopup(true);
  };

  const deleteSite = async (siteId) => {
    setShowConfirmPopup(false);

    try {
      // token that is saved in the localStorage
      const token = localStorage.getItem("dgToken");

      if (!token) {
        console.error("No token found in local storage");
        navigate("/");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/site-reports/${siteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete from server");
      }

      setPopUpMessage("Report deleted successfully!");
      setPopUpType("success");
      setShowPopUp(true);

      // To remove the report from the UI
      setSites(sites.filter((site) => site.id !== siteId));
      setSiteDetailsModal(false); // close the modal
    } catch (error) {
      console.error("Fetch error message: " + error.message);
    }
  };

  // function to indicate verification
  const handleVerify = async (e, siteId) => {
    // to block the row click
    e.stopPropagation();

    try {
      // token that is saved in the localStorage
      const token = localStorage.getItem("dgToken");

      if (!token) {
        console.error("No token found in local storage");
        navigate("/");
        return;
      }

      // HTTP protocol PATCH to modify to an exisiting resource
      const response = await fetch(
        `http://localhost:5000/api/site-reports/${siteId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Verified" }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update from server");
      }
      // To update the report from the UI
      setSites(
        sites.map((site) =>
          site.id === siteId ? { ...site, status: "Verified" } : site,
        ),
      ); // ...site copies the site details data and only changes the status to "Verified"
    } catch (error) {
      console.error("Fetch error message: " + error.message);
    }
  };

  // function to indicate resolve
  const handleResolve = async (e, siteId, siteStatus) => {
    // to block the row click
    e.stopPropagation();

    if (siteStatus !== "Verified") {
      setPopUpMessage("Site has to be Verified before it can be Resolved");
      setPopUpType("error");
      setShowPopUp(true);
      return;
    }
    try {
      // token that is saved in the localStorage
      const token = localStorage.getItem("dgToken");

      if (!token) {
        console.error("No token found in local storage");
        navigate("/");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/site-reports/${siteId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Resolved" }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update from server");
      }
      // To update the report from the UI
      setSites(
        sites.map((site) =>
          site.id === siteId ? { ...site, status: "Resolved" } : site,
        ),
      ); // ...site copies the site details data and only changes the status to "Resolved"
    } catch (error) {
      console.error("Fetch error message: " + error.message);
    }
  };

  // function to view the location
  const viewLocation = async (e, siteLocation) => {
    try {
      // convert the location to lat, long coordinates
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(siteLocation)}`; //search the location in textual description. format to json(output). q is free-form query
      // encodeURIComponent to ensure no spaces are there
      const response = await fetch(url);
      const data = await response.json();

      if (data.length === 0) {
        setPopUpMessage("Location not found on map");
        setPopUpType("error");
        setShowPopUp(true);
        return;
      }

      const { lat, lon } = data[0];

      window.open(
        `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=17`,
        "_blank",
      );
    } catch (error) {
      console.error("Error finding location: " + error.message);
      setPopUpMessage("Could not find location on map");
      setPopUpType("error");
      setShowPopUp(true);
    }
  };

  // function to show site details
  const openSiteDetails = async (siteDetails) => {
    setExpand(false);
    setSiteDetailsModal(true);
    setSeletectedSite(siteDetails);
  };

  // function to assign a PHI
  const handleAssignPhi = async (e, siteId, assigned) => {
    // to block the row click
    e.stopPropagation();

    // check if there is a phi assigned to the case already
    const site = sites.find((s) => s.id === siteId);

    if (site?.phi_assign) {
      setPopUpMessage(
        `This site has already been assigned to PHI officer,${site.phi_assign} `,
      );
      setPopUpType("error");
      setShowPopUp(true);
      return;
    }

    setCaseId(siteId);
    setAssignPhi("");
    setOpenAssignModal(true);
  };

  const confirmPhiAssign = async () => {
    if (!assginPhi.trim()) {
      setPopUpMessage("Please enter the name of the PHI officer: ");
      setPopUpType(error);
      setShowPopUp(true);
      return;
    }

    try {
      // token that is saved in the localStorage
      const token = localStorage.getItem("dgToken");

      if (!token) {
        console.error("No token found in local storage");
        navigate("/");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/site-reports/${caseId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phi_assign: assginPhi }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update from server");
      }
      // To update the report from the UI
      setSites(
        sites.map((site) =>
          site.id === caseId ? { ...site, phi_assign: assginPhi } : site,
        ),
      ); // ...site copies the site details data and only changes the status to PHI name

      setOpenAssignModal(false);
      setCaseId(null);
      setAssignPhi("");
      setPopUpMessage("PHI assgined to case successfully");
      setPopUpType("success");
      setShowPopUp(true);
    } catch (error) {
      console.error("Fetch error message: " + error.message);
      setPopUpMessage("Could not assign a PHI officer to breeding site.");
      setPopUpType("error");
      setShowPopUp(true);
    }
  };

  const filterSite = sites
    .filter((site) =>
      site.issue_type.toLowerCase().includes(search.toLocaleLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "datetime") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === "priority") {
        const order = { high: 0, medium: 1, low: 2 };
        return (
          (order[a.urgency?.toLowerCase()] ?? 3) -
          (order[b.urgency?.toLowerCase()] ?? 3)
        ); // 3 fallback vlaue incase null or underfined value
      }
      if (sortBy === "resolved") {
        return (b.status === "Resolved") - (a.status === "Resolved");
      }
      return 0;
    });

  return (
    <div className="moh-layout">
      <NavBar role="MOH" />
      <main className="main-content">
        <h1>Reported Breeding Sites</h1>

        {/* Search & Sort row */}
        {/* search the type of issue */}
        <div className="mrs-searchSort">
          {/* users keyword to filter */}
          <input
            className="mrs-search"
            type="text"
            placeholder="Search by KeyWord"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="mrs-sort-wrapper">
            {/* sorts by the currently selected sort label */}
            <button
              className="mrs-sort-btn"
              onClick={() => setSortOption((option) => !option)}
            >
              Sort By:{" "}
              {SORT_OPTIONS.find((option) => option.value === sortBy)?.label}
              <span className="mrs-sort-arrow">{sortOption ? "▴" : "▾"}</span>
            </button>

            {sortOption && (
              <ul className="mrs-sort-dropdown">
                {SORT_OPTIONS.map((opt) => (
                  <li
                    key={opt.value}
                    className={sortBy === opt.value ? "selected" : ""}
                    onClick={() => {
                      setSortBy(opt.value); // apply the selected sort
                      setSortOption(false); // close the dropdown list
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mrs-cards-container">
          <div className="mrs-cards-grid">
            {filterSite.length === 0 && (
              <p className="mrs-empty">No reports found</p>
            )}

            {/*Individual cards*/}
            {filterSite.map((site, index) => (
              <div key={site.id} className="mrs-card" onClick={() => openSiteDetails(site)}>
                {/*On click it will route to the details page*/}
                {/*card header*/}
                <div className="mrs-card-header">
                  <span className="mrs-card-title">{site.issue_type}</span>

                  {/*priority level*/}
                  <div className="mrs-card-priority">
                    <span className={`priority-level ${Priority(site.urgency)}`}>
                      {/*To constomize different levels of urgency*/}
                      {site.urgency}
                    </span>
                  </div>
                </div>
                {/*card content*/}
                <div className="mrs-card-content">
                  {/*time and date*/}
                  <div className="mrs-card-info">
                    <span>Reported {site.time}</span>
                    <span>{site.date}</span>
                  </div>

                  {/* Adding location to card */}
                  <span className="location-column" title={site.location}>
                    {site.location}
                  </span>

                  <div className="mrs-card-footer">
                    {/* Assign moh officer to breeding site */}
                    <div className="phi_div">
                      <button
                        className="btn-assign-phi"
                        onClick={(e) => handleAssignPhi(e, site.id)}
                      >
                        {site.phi_assign
                          ? `Assgined PHI : ${site.phi_assign}`
                          : "Assgin PHI"}
                      </button>
                    </div>

                    <div className="button">
                      <button
                        className="btn-action btn-verify"
                        onClick={(e) => handleVerify(e, site.id)}
                        disabled={
                          site.status === "Verified" ||
                          site.status === "Resolved"
                        }
                      >
                        {site.status === "Verified" ||
                        site.status === "Resolved"
                          ? "Verified"
                          : "Verify"}
                      </button>
                      <button
                        className="btn-action btn-remove"
                        onClick={(e) => handleRemove(e, site.id)}
                      >
                        Remove
                      </button>
                      <button
                        className="btn-action btn-resolve"
                        onClick={(e) => handleResolve(e, site.id, site.status)}
                        disabled={site.status === "Resolved"}
                      >
                        {site.status === "Resolved" ? "Resolved" : "Resolve"}
                      </button>
                      <button
                        className="btn-action btn-status"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {site.status || "Pending"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="popup-overlay">
          <div className={`popup-box ${popUpType}`}>
            <h1>{popUpType === "success" ? "✅" : "❌"}</h1>
            <h3>{popUpType === "success" ? "Success" : "Error"}</h3>
            <p>{popupMessage}</p>

            <button
              onClick={() => setShowPopUp(false)}
              className="popup-close-btn"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Get confirmation to delete a site */}
      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className={`popup-box ${popUpType}`}>
            <h1>🗑️</h1>
            <h3>Delete Report</h3>
            <p>Are you sure you want to delete this report?</p>
            <div className="button">
              <button className="btn-action btn-remove" onClick={() => deleteSite(pendingDeleteId)}>Yes, Delete</button>
              <button className="btn-action" onClick={() => setShowConfirmPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign PHI button */}
      {openAssignModal && (
        <div className="popup-overlay">
          <div className={`popup-box ${popUpType}`}>
            <h1>👤</h1>
            <h3>Assign PHI Officer</h3>
            <p>Please enter then name of the PHI officer for this site</p>
            <input type="text" value={assginPhi} onChange={(e) => setAssignPhi(e.target.value)} placeholder="PHI name: " />
            <div className="button">
              <button className="btn-action btn-resolve" onClick = {confirmPhiAssign}>Confirm</button>
              <button className="btn-action" onClick={() => setOpenAssignModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal with the site details*/}
      {showSiteDetailsModal && selectedSite && (
      <div className="mrs-modal-overlay" onClick={() => setSiteDetailsModal(false)}>
        <div className="mrs-modal-content" onClick={(e) => e.stopPropagation()}>

          {/* Header modal */}
          <div className="mrs-modal-title">
            {/* modal title has type of problem and priority level */}
            <p className="mrs-modal-issue">{selectedSite.issue_type}</p>

            {/*priority level*/}
            <div className="mrs-card-priority">
              <span className={`priority-level ${Priority(selectedSite.urgency)}`}> {/*To constomize different levels of urgency*/}
                {selectedSite.urgency}
              </span>
            </div>
          </div>

            {/* modal body */}
            <div className="mrs-modal-body">
              {/* Image comes to the left */}
              <div className="mrs-card-image-container">
                {selectedSite.photo_url ? (
                  <img
                    src={selectedSite.photo_url}
                    alt="Breeding site image"
                    className="mrs-card-image"
                    style={{ minHeight: "200px" }}
                  />
                ) : (
                  <div className="mrs-no-img">
                    <span>📷</span>
                    <p>No image provided</p>
                  </div>
                )}
              </div>

              {/* right column with locaiton and description */}
              <div className="mrs-modal-right">
                <div>
                  <p className="mrs-modal-label">Location Details: </p>
                  <div
                    className="mrs-modal-location"
                    title={selectedSite.location}
                  >
                    {selectedSite.location}
                  </div>
                </div>

                <div className="mrs-scroll">
                  {/* If the description is long change appearance */}
                  <p className="mrs-modal-label">Description: </p>
                  <div className="mrs-modal-description">
                    {expand
                      ? selectedSite.description
                      : `${selectedSite.description?.slice(0, 100)}...`}
                    {selectedSite.description?.length > 100 && (
                      <span
                        className="mrs-read-more"
                        onClick={() => setExpand(!expand)}
                      >
                        {expand ? "Read less" : "Read more"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mrs-modal-footer">
              <button
                className="btn-action btn-view"
                onClick={(e) => viewLocation(e, selectedSite.location)}
              >
                View Location
              </button>
              <button
                className="btn-action btn-remove"
                onClick={(e) => handleRemove(e, selectedSite.id)}
              >
                Remove Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReport;
