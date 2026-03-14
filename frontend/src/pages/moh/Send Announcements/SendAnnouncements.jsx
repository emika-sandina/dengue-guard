import "./sendAnnouncements.css";
import NavBar from "../../../components/common/Navbar/NavBar";

import React, { useState } from "react";

const SendAnnouncements = () => {
  // Store the form input values
  const [formData, setFormData] = useState({
    title: "",
    targetArea: "",
    type: "",
    description: "",
  });

  // Track submission status to show feedback to the user
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // Prevent page from refreshing on form submit
    e.preventDefault();

    try {
      // Send the form data to the backend
      const response = await fetch(
        "http://localhost:5000/api/send-announcement",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      // Show error message if request failed
      if (!response.ok) throw new Error(result.message);

      // Show success message and clear the form
      setMessage("Announcement sent successfully!");
      setFormData({ title: "", targetArea: "", type: "", description: "" });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    
    <div className="container">
      <NavBar role="MOH" />
      <div className="card">
        <h2 className="title">Send Announcements To Citizens</h2>

        {/* Show success or error message after submission */}
        {message && <p>{message}</p>}

        {/* onSubmit triggers handleSubmit when the button is clicked */}
        <form className="announcementform" onSubmit={handleSubmit}>
          <div className="group">
            <label>Announcement Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter message title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <div className="group">
              <label> Target Area</label>
              <input
                type="text"
                name="targetArea"
                placeholder="Enter target Area"
                value={formData.targetArea}
                onChange={handleChange}
              />
            </div>
            <div className="group">
              <label>Announcement Type</label>
              <input
                type="text"
                name="type"
                placeholder="Enter message type"
                value={formData.type}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="group">
            <label>Announcement Description</label>
            <textarea
              name="description"
              placeholder="Compose announcement "
              rows="12"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* type="submit" triggers the form's onSubmit when clicked */}
          <button type="submit" className="submitBtn">
            Send Announcement
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendAnnouncements;
