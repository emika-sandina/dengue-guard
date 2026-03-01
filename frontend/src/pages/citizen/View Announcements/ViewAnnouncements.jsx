import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import NavBar from '../../../components/common/Navbar/NavBar';
import './viewAnnouncements.css';

const CitizenAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Identify the logged in citizen
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Find out which MOH Area they belong to
          const { data: profile } = await supabase
            .from('profiles')
            .select('moh_area')
            .eq('id', user.id)
            .single();

          const userArea = profile?.moh_area;

          // Fetch announcements meant for their area OR global ('All')
          const { data: announcements, error } = await supabase
            .from('announcements')
            .select('*')
            .or(`target_area.eq.${userArea},target_area.eq.All`)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setAlerts(announcements || []);
        }
      } catch (error) {
        console.error("Failed to load alerts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <>
      <NavBar role="Citizen" />
      
      <div className="alerts-container">
        <div className="alerts-header">
          <h2 className="alerts-title">Official Health Alerts</h2>
          <p className="alerts-subtitle">Updates from your local Medical Officer of Health</p>
        </div>

        {loading ? (
          <div className="loading-text">Securely fetching your local alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="empty-state">No new alerts for your area. Stay safe!</div>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`alert-card ${alert.type === 'Emergency' ? 'high-priority' : ''}`}
              >
                <div className="alert-top-row">
                  <h3>{alert.title}</h3>
                  <span className="alert-type-badge">{alert.type}</span>
                </div>
                <span className="alert-date">
                  {new Date(alert.created_at).toLocaleDateString()}
                </span>
                <p className="alert-description">{alert.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewAnnouncements;