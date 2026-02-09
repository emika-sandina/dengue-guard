import "./sendAnnouncements.css";
import NavBar from "../../../components/common/Navbar/NavBar";

import React, { useState } from "react";

const SendAnnouncements = () => {
  const [formData, setFormData] = useState({
    title: "",
    targetArea: "",
    type: "",
    description: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Send Announcemants</h2>
        <form className="announcementform">
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
        </form>
      </div>
    </div>
  );
};

export default SendAnnouncements;
