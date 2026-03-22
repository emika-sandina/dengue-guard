const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const fetchAllAnnouncements = async () => {
    const token = localStorage.getItem('dgToken');
    const response = await fetch(`${API_BASE_URL}/api/announcements`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to load alerts');
    return response.json();
};