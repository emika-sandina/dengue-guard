import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get the current session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        setAuthenticated(true);

        // If a specific role is required, fetch it from the database
        if (allowedRole) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError || !profile) {
            console.error("Profile fetch error:", profileError);
            setUserRole(null);
          } else {
            setUserRole(profile.role);
          }
        }
      } catch (err) {
        console.error("Auth security check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [allowedRole]);

  // While checking the database, show a loading screen or spinner
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}>
        <h3>Verifying access...</h3>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is required but doesn't match, redirect to login
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // If all checks pass, render the protected page
  return children;
};

export default ProtectedRoute;