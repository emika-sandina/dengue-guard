import React, { useEffect, useState } from 'react';
import { fetchAllAnnouncements } from '../../../services/announcementService';
import './viewAnnouncements.css';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllAnnouncements()
            .then(data => setAnnouncements(data.data || (Array.isArray(data) ? data : [])))
            .catch(err => alert(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="announcements-container">
            <h1>Public Health Alerts</h1>
            {loading ? <p>Loading alerts...</p> : (
                <div className="alerts-list">
                    {announcements.map(alert => (
                        <div key={alert.id} className={`alert-card ${alert.type?.toLowerCase() || ''}`}>
                            <div className="alert-header">
                                <h3>{alert.title}</h3>
                                <span className="area-tag">{alert.target_area}</span>
                            </div>
                            <p>{alert.description}</p>
                            <span className="alert-date">
                                {new Date(alert.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Announcements;