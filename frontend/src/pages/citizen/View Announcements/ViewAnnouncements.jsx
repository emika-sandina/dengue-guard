import React, { useState, useEffect } from 'react';
import './viewAnnouncements.css';
import NavBar from "../../../components/common/Navbar/NavBar";
import { fetchAllAnnouncements } from "../../../services/announcementService";

const ViewAnnouncements = () => {
    // initialize state variables array for mapped data
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // allocate javascript Set configurations avoiding duplicating memory IDs logically
    const [expandedAlerts, setExpandedAlerts] = useState(new Set());
    
    // initialize state tracking locally reading dismiss logic directly off cache
    const [dismissedAlerts, setDismissedAlerts] = useState(() => {
        const saved = localStorage.getItem('dismissedAlerts');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    // retrieve announcements payload from assigned service API immediately handling components
    useEffect(() => {
        const loadAnnouncements = async () => {
            try {
                // invoke endpoint and decode wrapper outputs
                const data = await fetchAllAnnouncements();
                setAnnouncements(data.data || []);
            } catch (err) {
                // toggle explicit error message failure string natively
                setError('Failed to load announcements');
            } finally {
                // cancel visual loader components permanently 
                setLoading(false);
            }
        };

        loadAnnouncements();
    }, []);

    // handle logic appending closed alerts into active Set
    const handleDismiss = (id) => {
        setDismissedAlerts(prev => {
            const next = new Set(prev).add(id);
            // write changes forcefully preserving config during browser crashes 
            localStorage.setItem('dismissedAlerts', JSON.stringify([...next]));
            return next;
        });
    };

    // manage toggle mapping adding and removing expanded string IDs 
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

    // run filter configuration dropping invisible cards entirely 
    const visibleAlerts = announcements.filter(alert => !dismissedAlerts.has(alert.id));

    return (
        <div className="citizen-layout">
            {/* inject top navigation mechanism mapping props natively */}
            <NavBar role="Citizen" />
            
            <div className="announcements-container">
                <header className="view-header">
                    <h1>Public Health Alerts</h1>
                    <p className="sub-header-text">Stay informed about dengue prevention and regional updates.</p>
                </header>

                {/* check explicit loading flags handling early components */}
                {loading ? (
                    <div className="empty-state">
                        <p>Loading announcements...</p>
                    </div>
                ) : error ? (
                    {/* conditionally display error layout strings safely */}
                    <div className="empty-state">
                        <p>{error}</p>
                    </div>
                ) : visibleAlerts.length > 0 ? (
                    <div className="announcements-grid">
                        {/* iterate mappings generating discrete components cleanly */}
                        {visibleAlerts.map((alert) => {
                            // define internal loop metrics extracting variables 
                            const isExpanded = expandedAlerts.has(alert.id);
                            const text = alert.description || '';
                            const isLongText = text.length > 150;
                            // truncate specific string instances dropping text after index marks
                            const displayText = isExpanded ? text : (isLongText ? text.slice(0, 150) + '...' : text);

                            return (
                                /* dynamic class formatting rendering colored boundaries based off object types */
                                <article key={alert.id} className={`alert-card type-${alert.type?.toLowerCase() || 'info'}`}>
                                    <div className="alert-badge" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {/* handle conditional tag mappings seamlessly */}
                                        <span>{alert.type || 'Update'}</span>
                                        {/* render explicit dismiss triggers passing closure bounds locally */}
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
                                            {/* generate native JS formatting strings for localization outputs */}
                                            <span className="date-tag">📅 {new Date(alert.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="alert-description-text">{displayText}</p>
                                        
                                        {/* logic displaying rendering control handling truncated states specifically */}
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
                    {/* display final edge case output formatting handling clean data queries */}
                    <div className="empty-state">
                        <p>No active announcements at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAnnouncements;