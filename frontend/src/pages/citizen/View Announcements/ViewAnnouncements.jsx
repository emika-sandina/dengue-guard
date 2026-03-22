import React, { useState, useEffect } from 'react';
import './viewAnnouncements.css';
import NavBar from "../../../components/common/Navbar/NavBar";
import { fetchAllAnnouncements } from "../../../services/announcementService";

const ViewAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedAlerts, setExpandedAlerts] = useState(new Set());
    const [dismissedAlerts, setDismissedAlerts] = useState(() => {
        const saved = localStorage.getItem('dismissedAlerts');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    useEffect(() => {
        const loadAnnouncements = async () => {
            try {
                const data = await fetchAllAnnouncements();
                // The API returns { data: [...] }
                setAnnouncements(data.data || []);
            } catch (err) {
                setError('Failed to load announcements');
            } finally {
                setLoading(false);
            }
        };

        loadAnnouncements();
    }, []);

    const handleDismiss = (id) => {
        setDismissedAlerts(prev => {
            const next = new Set(prev).add(id);
            localStorage.setItem('dismissedAlerts', JSON.stringify([...next]));
            return next;
        });
    };

    const toggleExpand = (id) => {
        setExpandedAlerts(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const visibleAlerts = announcements.filter(alert => !dismissedAlerts.has(alert.id));

    return (
        <div className="citizen-layout">
            <NavBar role="Citizen" />
            <div className="announcements-container">
                <header className="view-header">
                    <h1>Public Health Alerts</h1>
                    <p className="sub-header-text">Stay informed about dengue prevention and regional updates.</p>
                </header>

                {loading ? (
                    <div className="empty-state">
                        <p>Loading announcements...</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                ) : visibleAlerts.length > 0 ? (
                    <div className="announcements-grid">
                        {visibleAlerts.map((alert) => {
                            const isExpanded = expandedAlerts.has(alert.id);
                            const text = alert.description || '';
                            const isLongText = text.length > 150;
                            const displayText = isExpanded ? text : (isLongText ? text.slice(0, 150) + '...' : text);

                            return (
                                <article key={alert.id} className={`alert-card type-${alert.type?.toLowerCase() || 'info'}`}>
                                    <div className="alert-badge" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{alert.type || 'Update'}</span>
                                        <button
                                            onClick={() => handleDismiss(alert.id)}
                                            aria-label="Dismiss alert"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '0', fontSize: '1rem', lineHeight: '1' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="alert-content">
                                        <h2 className="alert-title">{alert.title}</h2>
                                        <div className="alert-meta">
                                            <span className="location-tag">📍 {alert.target_area}</span>
                                            <span className="date-tag">📅 {new Date(alert.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="alert-description-text">{displayText}</p>
                                        {isLongText && (
                                            <button 
                                                className="read-more-btn"
                                                onClick={() => toggleExpand(alert.id)}
                                            >
                                                {isExpanded ? 'Read Less' : 'Read More'}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No active announcements at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAnnouncements;