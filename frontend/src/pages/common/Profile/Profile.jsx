import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/common/Navbar/NavBar';
import Dropdown from '../../../components/common/Dropdown/Dropdown';
import { fetchDashboardSummary } from '../../../services/citizenApi';
import './profile.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [mohArea, setMohArea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    const role = localStorage.getItem('dgUserRole');
    const token = localStorage.getItem('dgToken');
    const rawDgUser = localStorage.getItem('dgUser');
    const parsedUser = rawDgUser ? JSON.parse(rawDgUser) : null;
    const userId = parsedUser?.id;

    useEffect(() => {
        fetchProfile();
        if (role === 'citizen' && userId) {
            loadCitizenStats(userId);
        }
    }, [role, userId]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setUser(data);
            setFullName(data.full_name || '');
            if (data.moh_area) setMohArea({ value: data.moh_area, label: data.moh_area });
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    const loadCitizenStats = async (id) => {
        try {
            const data = await fetchDashboardSummary(id);
            setStats(data);
        } catch (err) {
            console.error("Failed to load dashboard stats", err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setUpdateStatus(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ fullName, mohArea: mohArea?.value })
            });
            if (response.ok) {
                setUpdateStatus({ type: 'success', message: 'Profile updated successfully!' });

                // Update local storage so that other parts of the app show the new data
                if (parsedUser) {
                    const updatedUser = { ...parsedUser, full_name: fullName, mohArea: mohArea?.value };
                    localStorage.setItem('dgUser', JSON.stringify(updatedUser));
                }

                // Re-fetch to confirm update
                fetchProfile();

                // Clear success message after 3 seconds
                setTimeout(() => setUpdateStatus(null), 3000);
            } else {
                setUpdateStatus({ type: 'error', message: 'Failed to update profile. Please try again.' });
            }
        } catch (err) {
            setUpdateStatus({ type: 'error', message: 'An error occurred while updating profile.' });
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) return (
        <div className="profile-loading">
            <div className="spinner"></div>
            <p>Loading your profile...</p>
        </div>
    );

    return (
        <div className="profile-layout">
            <NavBar role={role === 'moh' ? 'MOH' : 'Citizen'} />

            <main className="profile-main-content">
                <header className="profile-header">
                    <h1>Welcome, {fullName.split(' ')[0] || user?.full_name?.split(' ')[0] || (role === 'moh' ? 'Official' : 'Citizen')}</h1>
                    <p className="subtitle">Manage your personal information and view your activity.</p>
                </header>

                <div className="profile-grid">
                    {/* General Settings Section (Shared) */}
                    <section className="profile-section settings-card glass-panel">
                        <h2>Personal Details</h2>
                        <form onSubmit={handleUpdate} className="profile-form">
                            <div className="input-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Account Role</label>
                                <input type="text" value={role === 'moh' ? 'MOH Official' : 'Citizen'} disabled className="disabled-input" />
                            </div>

                            <div className="input-group">
                                <label>{role === 'moh' ? 'Assigned MOH Area' : 'Primary MOH Area'}</label>
                                <Dropdown value={mohArea} onChange={setMohArea} />
                            </div>

                            <div className="profile-actions">
                                {updateStatus && (
                                    <div className={`status-message ${updateStatus.type}`}>
                                        {updateStatus.message}
                                    </div>
                                )}
                                <div className="btn-group">
                                    <button type="submit" className="btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button type="button" onClick={handleLogout} className="btn-logout">Logout</button>
                                </div>
                            </div>
                        </form>
                    </section>

                    {/* Role-Specific Right Section */}
                    {role === 'citizen' ? (
                        <div className="profile-sidebar">
                            <section className="profile-section stats-card glass-panel highlight-border">
                                <h2>Your Impact</h2>
                                <p className="stats-desc">Thank you for keeping our community safe.</p>
                                <div className="stats-grid">
                                    <div className="stat-box">
                                        <span className="stat-number">{stats?.totalReports || 0}</span>
                                        <span className="stat-label">Total Reports</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-number alert-text">{stats?.pendingCases || 0}</span>
                                        <span className="stat-label">Pending</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-number success-text">{stats?.resolvedCases || 0}</span>
                                        <span className="stat-label">Resolved</span>
                                    </div>
                                </div>
                            </section>

                            <section className="profile-section reports-card glass-panel">
                                <h2>My Submitted Reports</h2>
                                <div className="reports-list">
                                    {(!stats?.totalReports || stats.totalReports === 0) ? (
                                        <div className="empty-reports">
                                            <p>You haven't submitted any reports yet.</p>
                                            <button className="btn-secondary outline" onClick={() => navigate('/citizen/report-cases')}>Report a Case</button>
                                            <br></br>
                                            <br></br>
                                            <button className="btn-secondary outline" onClick={() => navigate('/citizen/report-sites')}>Report a Breeding Site</button>
                                        </div>
                                    ) : (
                                        <div className="reports-placeholder">
                                            <p>Your recent reports will appear here.</p>
                                            <button className="btn-secondary outline btn-sm" onClick={() => navigate('/citizen/home')}>View Dashboard</button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="profile-sidebar">
                            <section className="profile-section moh-card glass-panel highlight-border-moh">
                                <h2>Official Privileges</h2>
                                <p className="moh-notice">As an MOH official, any changes to your assigned area should be confirmed by the administrative board.</p>
                                <ul className="moh-links">
                                    <li><button onClick={() => navigate('/moh/send-announcements')} className="moh-link-btn">Broadcast an Announcement</button></li>
                                    <li><button onClick={() => navigate('/moh/home')} className="moh-link-btn">Review Pending Reports</button></li>
                                </ul>
                            </section>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Profile;